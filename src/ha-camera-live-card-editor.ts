import { LitElement, css, html, nothing } from "lit";
import type { TemplateResult } from "lit";
import type {
  CameraEntry,
  CameraLiveCardConfig,
  CameraSource,
  ControlsMode,
  Go2RtcSource,
  HomeAssistant,
  SourceType,
} from "./types";

const SOURCE_TYPES: SourceType[] = ["entity", "go2rtc", "url"];
const CONTROL_MODES: ControlsMode[] = ["minimal", "native", "none"];
const GO2RTC_MODES: Array<NonNullable<Go2RtcSource["mode"]>> = ["auto", "webrtc", "mse", "hls"];

type EditableConfig = Omit<CameraLiveCardConfig, "source" | "fallbacks"> & {
  cameras: CameraEntry[];
};

export class CameraLiveCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };

  hass?: HomeAssistant;
  private _config: EditableConfig = createDefaultConfig();

  setConfig(config: CameraLiveCardConfig): void {
    this._config = toEditableConfig(config);
  }

  protected render(): TemplateResult {
    const config = this._config;

    return html`
      <div class="editor">
        <section class="section">
          <label>
            <span>Title</span>
            <input
              .value=${config.title ?? ""}
              placeholder="Optional card title"
              @input=${(event: InputEvent) => this.updateRoot("title", inputValue(event) || undefined)}
            />
          </label>

          <div class="grid">
            <label>
              <span>Aspect ratio</span>
              <input
                .value=${config.aspect_ratio ?? "16:9"}
                placeholder="16:9"
                @input=${(event: InputEvent) => this.updateRoot("aspect_ratio", inputValue(event) || "16:9")}
              />
            </label>

            <label>
              <span>Controls</span>
              <select
                .value=${config.controls ?? "minimal"}
                @change=${(event: Event) => this.updateRoot("controls", selectValue(event) as ControlsMode)}
              >
                ${CONTROL_MODES.map((mode) => html`<option value=${mode}>${mode}</option>`)}
              </select>
            </label>
          </div>

          <div class="toggles">
            <label>
              <input
                type="checkbox"
                .checked=${config.muted ?? true}
                @change=${(event: Event) => this.updateRoot("muted", checkedValue(event))}
              />
              <span>Muted</span>
            </label>
            <label>
              <input
                type="checkbox"
                .checked=${config.autoplay ?? true}
                @change=${(event: Event) => this.updateRoot("autoplay", checkedValue(event))}
              />
              <span>Autoplay</span>
            </label>
            <label>
              <input
                type="checkbox"
                .checked=${config.pause_when_hidden ?? true}
                @change=${(event: Event) => this.updateRoot("pause_when_hidden", checkedValue(event))}
              />
              <span>Pause when hidden</span>
            </label>
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h3>Cameras</h3>
            <button type="button" @click=${this.addCamera}>
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>Add</span>
            </button>
          </div>

          <div class="camera-list">
            ${config.cameras.map((camera, index) => this.renderCamera(camera, index))}
          </div>
        </section>
      </div>
    `;
  }

  private renderCamera(camera: CameraEntry, index: number): TemplateResult {
    return html`
      <article class="camera">
        <div class="camera-header">
          <h4>${camera.title || `Camera ${index + 1}`}</h4>
          <div class="button-row">
            <button type="button" title="Move up" ?disabled=${index === 0} @click=${() => this.moveCamera(index, -1)}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>
            <button
              type="button"
              title="Move down"
              ?disabled=${index === this._config.cameras.length - 1}
              @click=${() => this.moveCamera(index, 1)}
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>
            <button
              type="button"
              title="Remove camera"
              ?disabled=${this._config.cameras.length < 2}
              @click=${() => this.removeCamera(index)}
            >
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>
        </div>

        <label>
          <span>Camera title</span>
          <input
            .value=${camera.title ?? ""}
            placeholder=${`Camera ${index + 1}`}
            @input=${(event: InputEvent) => this.updateCamera(index, { title: inputValue(event) || undefined })}
          />
        </label>

        ${this.renderSourceEditor(camera.source, (source) => this.updateCamera(index, { source }))}

        <div class="fallbacks">
          <div class="sub-header">
            <h5>Fallbacks</h5>
            <button type="button" @click=${() => this.addFallback(index)}>
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>Add fallback</span>
            </button>
          </div>

          ${(camera.fallbacks ?? []).length
            ? (camera.fallbacks ?? []).map((source, fallbackIndex) =>
                this.renderFallback(camera, index, source, fallbackIndex),
              )
            : html`<p class="empty-note">No fallbacks configured.</p>`}
        </div>
      </article>
    `;
  }

  private renderFallback(
    camera: CameraEntry,
    cameraIndex: number,
    source: CameraSource,
    fallbackIndex: number,
  ): TemplateResult {
    return html`
      <div class="fallback">
        <div class="fallback-header">
          <span>Fallback ${fallbackIndex + 1}</span>
          <button type="button" title="Remove fallback" @click=${() => this.removeFallback(cameraIndex, fallbackIndex)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${this.renderSourceEditor(source, (nextSource) => {
          const fallbacks = [...(camera.fallbacks ?? [])];
          fallbacks[fallbackIndex] = nextSource;
          this.updateCamera(cameraIndex, { fallbacks });
        })}
      </div>
    `;
  }

  private renderSourceEditor(source: CameraSource, onChange: (source: CameraSource) => void): TemplateResult {
    return html`
      <div class="source-editor">
        <label>
          <span>Source type</span>
          <select
            .value=${source.type}
            @change=${(event: Event) => onChange(defaultSource(selectValue(event) as SourceType))}
          >
            ${SOURCE_TYPES.map((type) => html`<option value=${type}>${type}</option>`)}
          </select>
        </label>

        ${source.type === "entity" ? this.renderEntitySource(source, onChange) : nothing}
        ${source.type === "go2rtc" ? this.renderGo2RtcSource(source, onChange) : nothing}
        ${source.type === "url" ? this.renderUrlSource(source, onChange) : nothing}
      </div>
    `;
  }

  private renderEntitySource(source: Extract<CameraSource, { type: "entity" }>, onChange: (source: CameraSource) => void) {
    return html`
      <label>
        <span>Camera entity</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${source.entity}
          .includeDomains=${["camera"]}
          @value-changed=${(event: CustomEvent<{ value?: string }>) =>
            onChange({ ...source, entity: event.detail.value ?? "" })}
        ></ha-entity-picker>
      </label>
    `;
  }

  private renderGo2RtcSource(source: Go2RtcSource, onChange: (source: CameraSource) => void): TemplateResult {
    return html`
      <div class="grid">
        <label>
          <span>Stream</span>
          <input
            .value=${source.stream}
            placeholder="front_door"
            @input=${(event: InputEvent) => onChange({ ...source, stream: inputValue(event) })}
          />
        </label>
        <label>
          <span>Mode</span>
          <select
            .value=${source.mode ?? "auto"}
            @change=${(event: Event) =>
              onChange({ ...source, mode: selectValue(event) as NonNullable<Go2RtcSource["mode"]> })}
          >
            ${GO2RTC_MODES.map((mode) => html`<option value=${mode}>${mode}</option>`)}
          </select>
        </label>
      </div>
      <label>
        <span>go2rtc URL</span>
        <input
          .value=${source.url ?? "/api/go2rtc"}
          placeholder="/api/go2rtc"
          @input=${(event: InputEvent) => onChange({ ...source, url: inputValue(event) || "/api/go2rtc" })}
        />
      </label>
    `;
  }

  private renderUrlSource(source: Extract<CameraSource, { type: "url" }>, onChange: (source: CameraSource) => void) {
    return html`
      <label>
        <span>Stream URL</span>
        <input
          .value=${source.url}
          placeholder="https://example.local/stream.m3u8"
          @input=${(event: InputEvent) => onChange({ ...source, url: inputValue(event) })}
        />
      </label>
    `;
  }

  private updateRoot<K extends keyof EditableConfig>(key: K, value: EditableConfig[K]): void {
    this.commit({ ...this._config, [key]: value });
  }

  private updateCamera(index: number, patch: Partial<CameraEntry>): void {
    const cameras = [...this._config.cameras];
    cameras[index] = cleanCamera({ ...cameras[index], ...patch });
    this.commit({ ...this._config, cameras });
  }

  private readonly addCamera = (): void => {
    this.commit({
      ...this._config,
      cameras: [
        ...this._config.cameras,
        {
          title: `Camera ${this._config.cameras.length + 1}`,
          source: defaultSource("entity"),
        },
      ],
    });
  };

  private removeCamera(index: number): void {
    if (this._config.cameras.length < 2) {
      return;
    }

    this.commit({
      ...this._config,
      cameras: this._config.cameras.filter((_, cameraIndex) => cameraIndex !== index),
    });
  }

  private moveCamera(index: number, offset: number): void {
    const nextIndex = index + offset;
    if (nextIndex < 0 || nextIndex >= this._config.cameras.length) {
      return;
    }

    const cameras = [...this._config.cameras];
    const [camera] = cameras.splice(index, 1);
    cameras.splice(nextIndex, 0, camera);
    this.commit({ ...this._config, cameras });
  }

  private addFallback(cameraIndex: number): void {
    const camera = this._config.cameras[cameraIndex];
    this.updateCamera(cameraIndex, {
      fallbacks: [...(camera.fallbacks ?? []), defaultSource("entity")],
    });
  }

  private removeFallback(cameraIndex: number, fallbackIndex: number): void {
    const camera = this._config.cameras[cameraIndex];
    this.updateCamera(cameraIndex, {
      fallbacks: (camera.fallbacks ?? []).filter((_, index) => index !== fallbackIndex),
    });
  }

  private commit(config: EditableConfig): void {
    this._config = cleanConfig(config);
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: true,
        composed: true,
        detail: { config: this._config },
      }),
    );
  }

  static styles = css`
    :host {
      display: block;
    }

    .editor {
      display: grid;
      gap: 16px;
    }

    .section,
    .camera,
    .fallback {
      display: grid;
      gap: 12px;
    }

    .section {
      padding: 4px 0;
    }

    .camera,
    .fallback {
      padding: 12px;
      border: 1px solid var(--divider-color, #d8d8d8);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
    }

    .fallback {
      background: var(--secondary-background-color, #f6f6f6);
    }

    .section-header,
    .camera-header,
    .sub-header,
    .fallback-header,
    .button-row,
    .toggles {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-header,
    .camera-header,
    .sub-header,
    .fallback-header {
      justify-content: space-between;
    }

    .camera-list,
    .fallbacks,
    .source-editor {
      display: grid;
      gap: 10px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 10px;
    }

    label {
      display: grid;
      gap: 6px;
      color: var(--primary-text-color, #1f1f1f);
      font-size: 13px;
      font-weight: 500;
    }

    .toggles label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    input,
    select,
    ha-entity-picker {
      width: 100%;
      box-sizing: border-box;
    }

    input,
    select {
      min-height: 36px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #d8d8d8);
      border-radius: 6px;
      color: var(--primary-text-color, #1f1f1f);
      background: var(--card-background-color, #fff);
      font: inherit;
    }

    button {
      min-height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 10px;
      border: 0;
      border-radius: 6px;
      color: var(--primary-text-color, #1f1f1f);
      background: var(--secondary-background-color, #f1f3f5);
      cursor: pointer;
      font: inherit;
    }

    .button-row button,
    .fallback-header button {
      width: 32px;
      padding: 0;
    }

    button:disabled {
      cursor: default;
      opacity: 0.45;
    }

    h3,
    h4,
    h5,
    p {
      margin: 0;
    }

    h3 {
      font-size: 16px;
    }

    h4 {
      min-width: 0;
      overflow: hidden;
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    h5,
    .fallback-header span,
    .empty-note {
      color: var(--secondary-text-color, #666);
      font-size: 13px;
    }

    ha-icon {
      --mdc-icon-size: 18px;
    }
  `;
}

function toEditableConfig(config: CameraLiveCardConfig): EditableConfig {
  if (config.cameras?.length) {
    return cleanConfig({
      ...config,
      cameras: config.cameras.map(cleanCamera),
    });
  }

  return cleanConfig({
    type: config.type,
    title: config.title,
    aspect_ratio: config.aspect_ratio,
    muted: config.muted,
    autoplay: config.autoplay,
    controls: config.controls,
    pause_when_hidden: config.pause_when_hidden,
    cameras: [
      cleanCamera({
        title: config.title,
        source: config.source ?? defaultSource("entity"),
        fallbacks: config.fallbacks,
      }),
    ],
  });
}

function createDefaultConfig(): EditableConfig {
  return {
    type: "custom:ha-camera-live-card",
    controls: "minimal",
    pause_when_hidden: true,
    cameras: [
      {
        title: "Camera",
        source: defaultSource("entity"),
      },
    ],
  };
}

function cleanConfig(config: EditableConfig): EditableConfig {
  return removeUndefined({
    type: config.type ?? "custom:ha-camera-live-card",
    title: config.title,
    aspect_ratio: config.aspect_ratio,
    muted: config.muted,
    autoplay: config.autoplay,
    controls: config.controls,
    pause_when_hidden: config.pause_when_hidden,
    cameras: config.cameras.length ? config.cameras.map(cleanCamera) : createDefaultConfig().cameras,
  });
}

function cleanCamera(camera: CameraEntry): CameraEntry {
  return removeUndefined({
    title: camera.title,
    source: camera.source,
    fallbacks: camera.fallbacks?.length ? camera.fallbacks : undefined,
  });
}

function defaultSource(type: SourceType): CameraSource {
  if (type === "go2rtc") {
    return {
      type: "go2rtc",
      stream: "",
      url: "/api/go2rtc",
      mode: "auto",
    };
  }

  if (type === "url") {
    return {
      type: "url",
      url: "",
    };
  }

  return {
    type: "entity",
    entity: "",
    format: "hls",
  };
}

function inputValue(event: Event): string {
  return (event.currentTarget as HTMLInputElement).value;
}

function selectValue(event: Event): string {
  return (event.currentTarget as HTMLSelectElement).value;
}

function checkedValue(event: Event): boolean {
  return (event.currentTarget as HTMLInputElement).checked;
}

function removeUndefined<T extends Record<string, unknown>>(value: T): T {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== undefined)) as T;
}

declare global {
  interface HTMLElementTagNameMap {
    "ha-camera-live-card-editor": CameraLiveCardEditor;
  }
}

if (!customElements.get("ha-camera-live-card-editor")) {
  customElements.define("ha-camera-live-card-editor", CameraLiveCardEditor);
}
