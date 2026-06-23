import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import "../src/ha-camera-live-card";
import type { CameraLiveCard } from "../src/ha-camera-live-card";
import type { HomeAssistant } from "../src/types";

describe("ha-camera-live-card", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
  });

  afterEach(() => {
    document.body.innerHTML = "";
    vi.restoreAllMocks();
  });

  it("renders the loading state for a direct URL source", async () => {
    const card = createCard();

    card.setConfig({
      type: "custom:ha-camera-live-card",
      title: "Front",
      source: {
        type: "url",
        url: "https://example.local/front.m3u8",
      },
    });

    document.body.append(card);
    await card.updateComplete;

    const video = card.shadowRoot?.querySelector("video");
    await waitForSrc(video, "https://example.local/front.m3u8");
    expect(video?.getAttribute("src")).toBe("https://example.local/front.m3u8");
    expect(card.shadowRoot?.textContent).toContain("Front");
  });

  it("falls back from go2rtc to a Home Assistant entity", async () => {
    const card = createCard();
    const hass: HomeAssistant = {
      states: {
        "camera.front": {
          entity_id: "camera.front",
          state: "streaming",
          attributes: {},
        },
      },
      callWS: vi.fn().mockResolvedValue({ url: "/api/camera_proxy_stream/camera.front" }),
      hassUrl: (path = "") => `https://ha.local${path}`,
    };

    card.hass = hass;
    card.setConfig({
      type: "custom:ha-camera-live-card",
      title: "Front",
      source: {
        type: "go2rtc",
        stream: "front",
        mode: "webrtc",
      },
      fallbacks: [
        {
          type: "entity",
          entity: "camera.front",
        },
      ],
    });

    document.body.append(card);
    await card.updateComplete;
    await waitFor(() => expect(hass.callWS).toHaveBeenCalled());

    expect(hass.callWS).toHaveBeenCalledWith({
      type: "camera/stream",
      entity_id: "camera.front",
      format: "hls",
    });

    const video = card.shadowRoot?.querySelector("video");
    await waitForSrc(video, "https://ha.local/api/camera_proxy_stream/camera.front");
    expect(video?.getAttribute("src")).toBe("https://ha.local/api/camera_proxy_stream/camera.front");
    expect(card.shadowRoot?.textContent).toContain("Fallback camera.front");
  });

  it("cleans up video state when disconnected", async () => {
    const card = createCard();

    card.setConfig({
      type: "custom:ha-camera-live-card",
      source: {
        type: "url",
        url: "https://example.local/front.m3u8",
      },
    });

    document.body.append(card);
    await card.updateComplete;

    const video = card.shadowRoot?.querySelector("video");
    await waitForSrc(video, "https://example.local/front.m3u8");
    expect(video?.getAttribute("src")).toBe("https://example.local/front.m3u8");

    card.remove();

    expect(video?.getAttribute("src")).toBeNull();
    expect(video?.srcObject).toBeNull();
  });

  it("supports disabling hidden-card stream pausing", async () => {
    const card = createCard();

    card.setConfig({
      type: "custom:ha-camera-live-card",
      source: {
        type: "url",
        url: "https://example.local/front.m3u8",
      },
      pause_when_hidden: false,
    });

    document.body.append(card);
    await card.updateComplete;

    const video = card.shadowRoot?.querySelector("video");
    await waitForSrc(video, "https://example.local/front.m3u8");
    expect(video?.getAttribute("src")).toBe("https://example.local/front.m3u8");
  });
});

function createCard(): CameraLiveCard {
  return document.createElement("ha-camera-live-card") as CameraLiveCard;
}

async function waitForSrc(video: HTMLVideoElement | null | undefined, src: string): Promise<void> {
  await waitFor(() => expect(video?.getAttribute("src")).toBe(src));
}

async function waitFor(assertion: () => void): Promise<void> {
  const startedAt = Date.now();
  let lastError: unknown;

  while (Date.now() - startedAt < 1500) {
    try {
      assertion();
      return;
    } catch (error) {
      lastError = error;
      await new Promise((resolve) => {
        setTimeout(resolve, 25);
      });
    }
  }

  throw lastError;
}
