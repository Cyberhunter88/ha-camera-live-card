import type { CameraSource, StreamContext, StreamProvider, StreamStatus } from "../types";

export abstract class BaseProvider implements StreamProvider {
  protected currentStatus: StreamStatus = "idle";
  protected currentError?: string;

  protected constructor(public readonly source: CameraSource) {}

  get status(): StreamStatus {
    return this.currentStatus;
  }

  get error(): string | undefined {
    return this.currentError;
  }

  abstract connect(video: HTMLVideoElement, context: StreamContext): Promise<void>;
  abstract disconnect(): void;

  protected mark(status: StreamStatus, error?: string): void {
    this.currentStatus = status;
    this.currentError = error;
  }

  protected resetVideo(video?: HTMLVideoElement): void {
    if (!video) {
      return;
    }

    video.pause();
    video.removeAttribute("src");
    video.srcObject = null;
    video.load();
  }
}
