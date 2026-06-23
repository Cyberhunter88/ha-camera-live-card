import { BaseProvider } from "./base-provider";
import type { StreamContext, UrlSource } from "../types";

export class UrlProvider extends BaseProvider {
  constructor(public override readonly source: UrlSource) {
    super(source);
  }

  async connect(video: HTMLVideoElement, context: StreamContext): Promise<void> {
    this.mark("connecting");
    video.muted = context.muted;
    video.autoplay = context.autoplay;
    video.playsInline = true;
    video.srcObject = null;
    video.src = this.source.url;

    if (context.autoplay) {
      await video.play();
    }

    this.mark("live");
  }

  disconnect(): void {
    this.mark("idle");
  }
}
