import { BaseProvider } from "./base-provider";
import type { CameraStreamResponse, EntitySource, StreamContext } from "../types";

export class HaEntityProvider extends BaseProvider {
  constructor(public override readonly source: EntitySource) {
    super(source);
  }

  async connect(video: HTMLVideoElement, context: StreamContext): Promise<void> {
    if (!context.hass) {
      throw new Error("Home Assistant context is required for entity sources.");
    }

    this.mark("connecting");

    const response = await context.hass.callWS<CameraStreamResponse>({
      type: "camera/stream",
      entity_id: this.source.entity,
      format: this.source.format ?? "hls",
    });

    if (!response.url) {
      throw new Error(`No stream URL returned for ${this.source.entity}.`);
    }

    const url = context.hass.hassUrl ? context.hass.hassUrl(response.url) : response.url;
    video.muted = context.muted;
    video.autoplay = context.autoplay;
    video.playsInline = true;
    video.srcObject = null;
    video.src = url;

    if (context.autoplay) {
      await video.play();
    }

    this.mark("live");
  }

  disconnect(): void {
    this.mark("idle");
  }
}
