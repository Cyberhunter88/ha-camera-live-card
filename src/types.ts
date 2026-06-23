export type SourceType = "go2rtc" | "entity" | "url";
export type ControlsMode = "minimal" | "native" | "none";
export type StreamStatus = "idle" | "connecting" | "live" | "fallback" | "error" | "paused";

export interface Go2RtcSource {
  type: "go2rtc";
  stream: string;
  url?: string;
  mode?: "auto" | "webrtc" | "mse" | "hls";
}

export interface EntitySource {
  type: "entity";
  entity: string;
  format?: "hls";
}

export interface UrlSource {
  type: "url";
  url: string;
}

export type CameraSource = Go2RtcSource | EntitySource | UrlSource;

export interface CameraLiveCardConfig {
  type: string;
  source: CameraSource;
  fallbacks?: CameraSource[];
  title?: string;
  aspect_ratio?: string;
  muted?: boolean;
  autoplay?: boolean;
  controls?: ControlsMode;
  pause_when_hidden?: boolean;
}

export interface NormalizedConfig {
  type: string;
  source: CameraSource;
  fallbacks: CameraSource[];
  title?: string;
  aspectRatio: string;
  muted: boolean;
  autoplay: boolean;
  controls: ControlsMode;
  pauseWhenHidden: boolean;
}

export interface HomeAssistant {
  states: Record<string, HassEntity | undefined>;
  callWS<T = unknown>(message: Record<string, unknown>): Promise<T>;
  hassUrl?(path?: string): string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown>;
}

export interface CameraStreamResponse {
  url?: string;
}

export interface StreamProvider {
  readonly source: CameraSource;
  readonly status: StreamStatus;
  readonly error?: string;
  connect(video: HTMLVideoElement, context: StreamContext): Promise<void>;
  disconnect(): void;
}

export interface StreamContext {
  hass?: HomeAssistant;
  muted: boolean;
  autoplay: boolean;
}
