import type {
  CameraLiveCardConfig,
  CameraEntry,
  CameraSource,
  ControlsMode,
  NormalizedCameraEntry,
  NormalizedConfig,
  SourceType,
} from "./types";

const SOURCE_TYPES: SourceType[] = ["go2rtc", "entity", "url"];
const CONTROLS: ControlsMode[] = ["minimal", "native", "none"];

export function normalizeConfig(config: CameraLiveCardConfig): NormalizedConfig {
  if (!config || typeof config !== "object") {
    throw new Error("Card config is required.");
  }

  const controls = config.controls ?? "minimal";

  if (!CONTROLS.includes(controls)) {
    throw new Error("controls must be one of: minimal, native, none.");
  }

  return {
    type: config.type,
    cameras: normalizeCameras(config),
    title: config.title,
    aspectRatio: normalizeAspectRatio(config.aspect_ratio ?? "16:9"),
    muted: config.muted ?? true,
    autoplay: config.autoplay ?? true,
    controls,
    pauseWhenHidden: config.pause_when_hidden ?? true,
  };
}

export function normalizeCamera(camera: CameraEntry): NormalizedCameraEntry {
  if (!camera || typeof camera !== "object") {
    throw new Error("Camera entry must be an object.");
  }

  if (!camera.source) {
    throw new Error("Camera source is required.");
  }

  return {
    title: camera.title,
    source: normalizeSource(camera.source),
    fallbacks: (camera.fallbacks ?? []).map(normalizeSource),
  };
}

export function normalizeSource(source: CameraSource): CameraSource {
  if (!source || typeof source !== "object") {
    throw new Error("Camera source must be an object.");
  }

  if (!SOURCE_TYPES.includes(source.type)) {
    throw new Error("source.type must be one of: go2rtc, entity, url.");
  }

  if (source.type === "go2rtc") {
    if (!source.stream || typeof source.stream !== "string") {
      throw new Error("go2rtc source requires a stream name.");
    }

    return {
      type: "go2rtc",
      stream: source.stream,
      url: trimTrailingSlash(source.url ?? "/api/go2rtc"),
      mode: source.mode ?? "auto",
    };
  }

  if (source.type === "entity") {
    if (!source.entity || typeof source.entity !== "string") {
      throw new Error("entity source requires a camera entity.");
    }

    return {
      type: "entity",
      entity: source.entity,
      format: source.format ?? "hls",
    };
  }

  if (!source.url || typeof source.url !== "string") {
    throw new Error("url source requires a stream URL.");
  }

  return {
    type: "url",
    url: source.url,
  };
}

export function describeSource(source: CameraSource): string {
  if (source.type === "go2rtc") {
    return `go2rtc:${source.stream}`;
  }

  if (source.type === "entity") {
    return source.entity;
  }

  return source.url;
}

function normalizeCameras(config: CameraLiveCardConfig): NormalizedCameraEntry[] {
  if (config.cameras !== undefined) {
    if (!Array.isArray(config.cameras) || config.cameras.length === 0) {
      throw new Error("cameras must contain at least one camera.");
    }

    return config.cameras.map(normalizeCamera);
  }

  if (!config.source) {
    throw new Error("Camera source is required.");
  }

  return [
    {
      title: config.title,
      source: normalizeSource(config.source),
      fallbacks: (config.fallbacks ?? []).map(normalizeSource),
    },
  ];
}

function normalizeAspectRatio(value: string): string {
  const trimmed = value.trim();

  if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (match) {
    return `${match[1]} / ${match[2]}`;
  }

  throw new Error("aspect_ratio must use a format like 16:9 or 16 / 9.");
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}
