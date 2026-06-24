import { LitElement, css, html, nothing } from "lit";
import type { TemplateResult } from "lit";
import { describeSource, normalizeConfig } from "./config";
import "./ha-camera-live-card-editor";
import { createProvider } from "./providers/create-provider";
import type {
  CameraLiveCardConfig,
  CameraSource,
  HomeAssistant,
  NormalizedConfig,
  StreamProvider,
  StreamStatus,
} from "./types";

const CARD_VERSION = "0.1.1";
let nextConnectAt = 0;

function reserveConnectSlot(): Promise<void> {
  const now = Date.now();
  const wait = Math.max(0, nextConnectAt - now);
  nextConnectAt = Math.max(now, nextConnectAt) + 180;

  if (wait === 0) {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.setTimeout(resolve, wait);
  });
}

export class CameraLiveCard extends LitElement {
  static properties = {
    _config: { state: true },
    _status: { state: true },
    _error: { state: true },
    _activeSource: { state: true },
    _cameraIndex: { state: true },
    _sourceIndex: { state: true },
    _muted: { state: true },
    _visible: { state: true },
  };

  private _config?: NormalizedConfig;
  private _hass?: HomeAssistant;
  private _provider?: StreamProvider;
  private _connectToken = 0;
  private _status: StreamStatus = "idle";
  private _error = "";
  private _activeSource = "";
  private _cameraIndex = 0;
  private _sourceIndex = 0;
  private _muted = true;
  private _visible = true;
  private _manualPaused = false;
  private _intersectionObserver?: IntersectionObserver;

  set hass(hass: HomeAssistant) {
    this._hass = hass;
  }

  setConfig(config: CameraLiveCardConfig): void {
    this._config = normalizeConfig(config);
    this._muted = this._config.muted;
    this._status = "idle";
    this._error = "";
    this._activeSource = "";
    this._cameraIndex = Math.min(this._cameraIndex, this._config.cameras.length - 1);
    this._sourceIndex = 0;
    this._manualPaused = false;
    this.disconnectProvider();
    this.requestUpdate();
    void this.updateComplete.then(() => this.connectFirstAvailable());
  }

  getCardSize(): number {
    return 4;
  }

  getGridOptions(): Record<string, unknown> {
    return {
      rows: 4,
      columns: 6,
      min_rows: 3,
      min_columns: 3,
    };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("ha-camera-live-card-editor");
  }

  static getStubConfig(): Omit<CameraLiveCardConfig, "type"> {
    return {
      cameras: [
        {
          title: "Camera",
          source: {
            type: "entity",
            entity: "camera.example",
          },
        },
      ],
      controls: "minimal",
      pause_when_hidden: true,
    };
  }

  connectedCallback(): void {
    super.connectedCallback();
    document.addEventListener("visibilitychange", this.handleVisibilityChange);
    this.startVisibilityObserver();
    void this.updateComplete.then(() => this.connectFirstAvailable());
  }

  disconnectedCallback(): void {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange);
    this._intersectionObserver?.disconnect();
    this._intersectionObserver = undefined;
    this.disconnectProvider();
    super.disconnectedCallback();
  }

  protected render(): TemplateResult {
    if (!this._config) {
      return html`
        <ha-card>
          <div class="empty">
            <ha-icon icon="mdi:video-off-outline"></ha-icon>
            <span>Camera config missing</span>
          </div>
        </ha-card>
      `;
    }

    return html`
      <ha-card>
        <section
          class="frame"
          style=${`aspect-ratio: ${this._config.aspectRatio}`}
          aria-label=${this._config.title ?? "Live camera"}
        >
          <video
            playsinline
            preload="metadata"
            ?muted=${this._muted}
            ?autoplay=${this._config.autoplay}
            ?controls=${this._config.controls === "native"}
            @playing=${this.handlePlaying}
            @pause=${this.handleVideoPause}
            @error=${this.handleVideoError}
          ></video>

          ${this.renderHeader()} ${this.renderNavigation()} ${this.renderStatus()} ${this.renderControls()}
        </section>
      </ha-card>
    `;
  }

  private renderHeader(): TemplateResult | typeof nothing {
    if (!this._config) {
      return nothing;
    }

    const displayTitle = this._config.title ?? this.currentCamera?.title;
    const entityState = this.getActiveEntityState();
    const showCameraPill = this._config.cameras.length > 1;

    if (!displayTitle && !showCameraPill && !entityState) {
      return nothing;
    }

    return html`
      <div class="header">
        ${displayTitle
          ? html`
              <span class="title">
                <ha-icon icon="mdi:cctv"></ha-icon>
                <span>${displayTitle}</span>
              </span>
            `
          : html`<span class="title spacer"></span>`}
        ${showCameraPill
          ? html`
              <span class="camera-pill" title=${this.currentCamera?.title ?? this.cameraPositionLabel}>
                <ha-icon icon="mdi:camera-switch"></ha-icon>
                <span>${this.cameraPositionLabel}</span>
              </span>
            `
          : nothing}
        <span class="source-pill">
          <ha-icon icon=${this.sourceIcon(this.currentSource)}></ha-icon>
          <span>${this.sourceLabel(this.currentSource)}</span>
        </span>
        ${entityState
          ? html`
              <span class="entity-state">
                <ha-icon icon="mdi:signal"></ha-icon>
                <span>${entityState}</span>
              </span>
            `
          : nothing}
      </div>
    `;
  }

  private renderNavigation(): TemplateResult | typeof nothing {
    if (!this._config || this._config.cameras.length < 2) {
      return nothing;
    }

    return html`
      <div class="navigation" aria-label="Camera navigation">
        <button type="button" class="nav-button previous" title="Previous camera" @click=${this.showPreviousCamera}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <button type="button" class="nav-button next" title="Next camera" @click=${this.showNextCamera}>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `;
  }

  private renderStatus(): TemplateResult | typeof nothing {
    if (this._status === "live" && !this._error && this._visible) {
      return nothing;
    }

    const label = this.statusLabel();

    return html`
      <div class="status ${this._status}">
        <ha-icon icon=${this.statusIcon()}></ha-icon>
        <span>${label}</span>
      </div>
    `;
  }

  private renderControls(): TemplateResult | typeof nothing {
    if (!this._config || this._config.controls !== "minimal") {
      return nothing;
    }

    const isPaused = this._status === "paused";

    return html`
      <div class="controls">
        <button type="button" title=${isPaused ? "Play" : "Pause"} @click=${this.togglePlayback}>
          <ha-icon icon=${isPaused ? "mdi:play-circle" : "mdi:pause-circle"}></ha-icon>
        </button>
        <button type="button" title=${this._muted ? "Unmute" : "Mute"} @click=${this.toggleMute}>
          <ha-icon icon=${this._muted ? "mdi:volume-variant-off" : "mdi:volume-high"}></ha-icon>
        </button>
        <button type="button" title="Fullscreen" @click=${this.enterFullscreen}>
          <ha-icon icon="mdi:fullscreen"></ha-icon>
        </button>
      </div>
    `;
  }

  private async connectFirstAvailable(): Promise<void> {
    if (!this.isConnected || !this._config || this._manualPaused) {
      return;
    }

    if (this._config.pauseWhenHidden && (!this._visible || document.hidden)) {
      return;
    }

    const video = this.videoElement;
    if (!video) {
      return;
    }

    const token = ++this._connectToken;
    const sources = this.currentSources;
    this.disconnectProvider(false);
    await reserveConnectSlot();

    if (token !== this._connectToken || !this.isConnected) {
      return;
    }

    for (const [index, source] of sources.entries()) {
      if (token !== this._connectToken) {
        return;
      }

      const provider = createProvider(source);
      this._provider = provider;
      this._sourceIndex = index;
      this._activeSource = describeSource(source);
      this._status = index > 0 ? "fallback" : "connecting";
      this._error = "";

      try {
        await provider.connect(video, {
          hass: this._hass,
          muted: this._muted,
          autoplay: this._config.autoplay,
        });

        if (token === this._connectToken) {
          this._status = index > 0 ? "fallback" : "live";
          this._error = "";
        }

        return;
      } catch (error) {
        provider.disconnect();
        this.resetVideo();
        this._error = error instanceof Error ? error.message : String(error);
        this._status = "error";
      }
    }
  }

  private disconnectProvider(incrementToken = true): void {
    if (incrementToken) {
      this._connectToken++;
    }

    this._provider?.disconnect();
    this._provider = undefined;
    this.resetVideo();
  }

  private resetVideo(): void {
    const video = this.videoElement;
    if (!video) {
      return;
    }

    video.pause();
    video.removeAttribute("src");
    video.srcObject = null;
    video.load();
  }

  private getActiveEntityState(): string {
    const source = this.currentSource;

    if (source?.type !== "entity" || !this._hass) {
      return "";
    }

    return this._hass.states[source.entity]?.state ?? "";
  }

  private get currentCamera() {
    return this._config?.cameras[this._cameraIndex];
  }

  private get currentSource(): CameraSource | undefined {
    return this.currentSources[this._sourceIndex];
  }

  private get currentSources(): CameraSource[] {
    const camera = this.currentCamera;
    return camera ? [camera.source, ...camera.fallbacks] : [];
  }

  private get cameraPositionLabel(): string {
    if (!this._config) {
      return "";
    }

    return `${this._cameraIndex + 1} / ${this._config.cameras.length}`;
  }

  private get videoElement(): HTMLVideoElement | null {
    return this.renderRoot?.querySelector("video") ?? null;
  }

  private statusLabel(): string {
    if (!this._visible && this._config?.pauseWhenHidden) {
      return "Offscreen";
    }

    if (this._status === "connecting") {
      return `Connecting ${this._activeSource}`;
    }

    if (this._status === "fallback") {
      return `Fallback ${this._activeSource}`;
    }

    if (this._status === "paused") {
      return "Paused";
    }

    if (this._status === "error") {
      return this._error || "Stream unavailable";
    }

    return this._status;
  }

  private statusIcon(): string {
    if (!this._visible && this._config?.pauseWhenHidden) {
      return "mdi:eye-off-outline";
    }

    if (this._status === "connecting") {
      return "mdi:connection";
    }

    if (this._status === "fallback") {
      return "mdi:source-branch";
    }

    if (this._status === "paused") {
      return "mdi:pause-circle";
    }

    if (this._status === "error") {
      return "mdi:alert-circle";
    }

    return "mdi:video";
  }

  private sourceIcon(source?: CameraSource): string {
    if (source?.type === "go2rtc") {
      return "mdi:webrtc";
    }

    if (source?.type === "entity") {
      return "mdi:home-assistant";
    }

    return "mdi:link-variant";
  }

  private sourceLabel(source?: CameraSource): string {
    if (source?.type === "go2rtc") {
      return "go2rtc";
    }

    if (source?.type === "entity") {
      return "HA";
    }

    return "URL";
  }

  private switchCamera(offset: number): void {
    if (!this._config || this._config.cameras.length < 2) {
      return;
    }

    this._cameraIndex =
      (this._cameraIndex + offset + this._config.cameras.length) % this._config.cameras.length;
    this._sourceIndex = 0;
    this._status = "idle";
    this._error = "";
    this._activeSource = "";
    this._manualPaused = false;
    this.disconnectProvider();
    this.requestUpdate();
    void this.updateComplete.then(() => this.connectFirstAvailable());
  }

  private startVisibilityObserver(): void {
    if (!("IntersectionObserver" in window)) {
      this._visible = true;
      return;
    }

    this._intersectionObserver?.disconnect();
    this._intersectionObserver = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        this._visible = entry.isIntersecting;

        if (!this._config?.pauseWhenHidden) {
          return;
        }

        if (!entry.isIntersecting) {
          this.disconnectProvider();
          this._status = "paused";
          return;
        }

        void this.connectFirstAvailable();
      },
      {
        root: null,
        rootMargin: "160px",
        threshold: 0.01,
      },
    );
    this._intersectionObserver.observe(this);
  }

  private readonly handleVisibilityChange = (): void => {
    const video = this.videoElement;
    if (!video || !this._config) {
      return;
    }

    if (document.hidden && this._config.pauseWhenHidden) {
      this.disconnectProvider();
      this._status = "paused";
      return;
    }

    if (this._config.autoplay && !this._manualPaused) {
      void this.connectFirstAvailable();
    }
  };

  private readonly handlePlaying = (): void => {
    this._status = this._sourceIndex > 0 ? "fallback" : "live";
    this._error = "";
  };

  private readonly handleVideoPause = (): void => {
    if (!document.hidden && this._status !== "idle") {
      this._status = "paused";
    }
  };

  private readonly handleVideoError = (): void => {
    this._error = "Video playback failed.";
    void this.connectFirstAvailable();
  };

  private readonly togglePlayback = (): void => {
    const video = this.videoElement;

    if (!video) {
      return;
    }

    if (video.paused) {
      this._manualPaused = false;
      void video.play().catch(() => this.connectFirstAvailable());
      return;
    }

    this._manualPaused = true;
    video.pause();
  };

  private readonly toggleMute = (): void => {
    const video = this.videoElement;
    this._muted = !this._muted;

    if (video) {
      video.muted = this._muted;
    }
  };

  private readonly showPreviousCamera = (): void => {
    this.switchCamera(-1);
  };

  private readonly showNextCamera = (): void => {
    this.switchCamera(1);
  };

  private readonly enterFullscreen = (): void => {
    const target = this.renderRoot?.querySelector(".frame") as HTMLElement | null;
    void target?.requestFullscreen?.();
  };

  static styles = css`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #111));
      border-radius: var(--ha-card-border-radius, 8px);
    }

    .frame {
      position: relative;
      width: 100%;
      min-height: 180px;
      overflow: hidden;
      background: #050607;
    }

    video {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      background: #050607;
    }

    .header,
    .status,
    .controls,
    .navigation {
      position: absolute;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      text-shadow: 0 1px 2px rgb(0 0 0 / 80%);
    }

    .header {
      top: 0;
      right: 0;
      left: 0;
      min-width: 0;
      gap: 8px;
      padding: 10px 12px 18px;
      background: linear-gradient(to bottom, rgb(0 0 0 / 65%), transparent);
      pointer-events: none;
    }

    .title {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      overflow: hidden;
      font-size: 15px;
      font-weight: 600;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .title span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .title.spacer {
      flex: 1 1 auto;
    }

    .camera-pill,
    .source-pill,
    .entity-state {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      min-height: 24px;
      padding: 0 8px;
      border-radius: 6px;
      background: rgb(0 0 0 / 38%);
      font-size: 12px;
      line-height: 16px;
      opacity: 0.82;
      text-transform: uppercase;
    }

    .camera-pill ha-icon,
    .source-pill ha-icon,
    .entity-state ha-icon {
      --mdc-icon-size: 15px;
    }

    .status {
      right: 12px;
      bottom: 12px;
      max-width: calc(100% - 24px);
      min-height: 28px;
      padding: 0 10px;
      overflow: hidden;
      border-radius: 6px;
      background: rgb(0 0 0 / 64%);
      font-size: 12px;
      line-height: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status.error {
      background: rgb(128 28 28 / 82%);
    }

    .status.connecting ha-icon {
      color: #f5c542;
    }

    .status.fallback ha-icon,
    .status.live ha-icon {
      color: #55d187;
    }

    .status.paused ha-icon {
      color: #d3d8e0;
    }

    .status.error ha-icon {
      color: #ff8a8a;
    }

    .controls {
      bottom: 12px;
      left: 12px;
      padding: 4px;
      border-radius: 8px;
      background: rgb(0 0 0 / 54%);
    }

    .navigation {
      inset: 50% 10px auto;
      justify-content: space-between;
      transform: translateY(-50%);
      pointer-events: none;
    }

    .nav-button {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      background: rgb(0 0 0 / 42%);
      pointer-events: auto;
    }

    .nav-button ha-icon {
      --mdc-icon-size: 28px;
    }

    button {
      width: 34px;
      height: 34px;
      display: inline-grid;
      place-items: center;
      padding: 0;
      border: 0;
      border-radius: 6px;
      color: #fff;
      background: transparent;
      cursor: pointer;
    }

    button:hover,
    button:focus-visible {
      background: rgb(255 255 255 / 14%);
      outline: none;
    }

    ha-icon {
      --mdc-icon-size: 22px;
    }

    .empty {
      display: grid;
      gap: 8px;
      min-height: 120px;
      place-items: center;
      padding: 16px;
      color: var(--secondary-text-color);
    }

    .empty ha-icon {
      --mdc-icon-size: 30px;
    }
  `;
}

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }

  interface HTMLElementTagNameMap {
    "ha-camera-live-card": CameraLiveCard;
  }
}

if (!customElements.get("ha-camera-live-card")) {
  customElements.define("ha-camera-live-card", CameraLiveCard);
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ha-camera-live-card",
  name: "HA Camera Live Card",
  description: "Low-latency live camera card with go2rtc, Home Assistant entity, and URL fallbacks.",
  preview: true,
});

console.info(
  `%c HA Camera Live Card %c ${CARD_VERSION} `,
  "color: white; background: #1f6feb; font-weight: 700;",
  "color: white; background: #31343f; font-weight: 700;",
);
