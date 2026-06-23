import { BaseProvider } from "./base-provider";
import type { Go2RtcSource, StreamContext } from "../types";

const H264_TRANSCEIVER: RTCRtpTransceiverInit = {
  direction: "recvonly",
};

export class Go2RtcProvider extends BaseProvider {
  private peer?: RTCPeerConnection;

  constructor(public override readonly source: Go2RtcSource) {
    super(source);
  }

  async connect(video: HTMLVideoElement, context: StreamContext): Promise<void> {
    if (this.source.mode === "auto") {
      await this.connectAuto(video, context);
      return;
    }

    if (this.source.mode === "hls") {
      await this.connectHls(video, context);
      return;
    }

    if (this.source.mode === "mse") {
      await this.connectMse(video, context);
      return;
    }

    await this.connectWebRtc(video, context);
  }

  disconnect(): void {
    if (this.peer) {
      this.peer.getSenders().forEach((sender) => sender.track?.stop());
      this.peer.getReceivers().forEach((receiver) => receiver.track?.stop());
      this.peer.close();
      this.peer = undefined;
    }

    this.mark("idle");
  }

  private async connectAuto(video: HTMLVideoElement, context: StreamContext): Promise<void> {
    const errors: string[] = [];

    for (const connect of [this.connectWebRtc, this.connectMse, this.connectHls]) {
      try {
        await connect.call(this, video, context);
        return;
      } catch (error) {
        errors.push(error instanceof Error ? error.message : String(error));
        this.disconnect();
      }
    }

    throw new Error(`go2rtc auto mode failed: ${errors.join(" | ")}`);
  }

  private async connectWebRtc(video: HTMLVideoElement, context: StreamContext): Promise<void> {
    if (!("RTCPeerConnection" in window)) {
      throw new Error("WebRTC is not available in this browser.");
    }

    this.disconnect();
    this.mark("connecting");

    const stream = new MediaStream();
    const peer = new RTCPeerConnection({
      iceServers: [],
    });
    this.peer = peer;

    peer.addTransceiver("video", H264_TRANSCEIVER);
    peer.addTransceiver("audio", H264_TRANSCEIVER);
    peer.ontrack = (event) => {
      stream.addTrack(event.track);
      video.srcObject = stream;
    };

    video.muted = context.muted;
    video.autoplay = context.autoplay;
    video.playsInline = true;

    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);

    const answer = await this.exchangeOffer(offer.sdp ?? "");
    await peer.setRemoteDescription({
      type: "answer",
      sdp: answer,
    });

    if (context.autoplay) {
      await video.play();
    }

    this.mark("live");
  }

  private async connectHls(video: HTMLVideoElement, context: StreamContext): Promise<void> {
    this.mark("connecting");
    video.muted = context.muted;
    video.autoplay = context.autoplay;
    video.playsInline = true;
    video.srcObject = null;
    video.src = `${this.source.url}/api/stream.m3u8?src=${encodeURIComponent(this.source.stream)}`;

    if (context.autoplay) {
      await video.play();
    }

    this.mark("live");
  }

  private async connectMse(video: HTMLVideoElement, context: StreamContext): Promise<void> {
    this.mark("connecting");
    video.muted = context.muted;
    video.autoplay = context.autoplay;
    video.playsInline = true;
    video.srcObject = null;
    video.src = `${this.source.url}/api/stream.mp4?src=${encodeURIComponent(this.source.stream)}`;

    if (context.autoplay) {
      await video.play();
    }

    this.mark("live");
  }

  private async exchangeOffer(sdp: string): Promise<string> {
    const response = await fetch(
      `${this.source.url}/api/webrtc?src=${encodeURIComponent(this.source.stream)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/sdp",
        },
        body: sdp,
      },
    );

    if (!response.ok) {
      const details = await response.text();
      const message = details.trim()
        ? `go2rtc WebRTC failed with HTTP ${response.status}: ${details.trim()}`
        : `go2rtc WebRTC failed with HTTP ${response.status}.`;

      throw new Error(message);
    }

    return response.text();
  }
}
