import { describe, expect, it } from "vitest";
import { normalizeConfig } from "../src/config";

describe("normalizeConfig", () => {
  it("applies defaults", () => {
    const config = normalizeConfig({
      type: "custom:ha-camera-live-card",
      source: {
        type: "go2rtc",
        stream: "driveway",
      },
    });

    expect(config.aspectRatio).toBe("16 / 9");
    expect(config.muted).toBe(true);
    expect(config.autoplay).toBe(true);
    expect(config.controls).toBe("minimal");
    expect(config.pauseWhenHidden).toBe(true);
    expect(config.fallbacks).toEqual([]);
    expect(config.source).toEqual({
      type: "go2rtc",
      stream: "driveway",
      url: "/api/go2rtc",
      mode: "auto",
    });
  });

  it("keeps fallback order", () => {
    const config = normalizeConfig({
      type: "custom:ha-camera-live-card",
      source: {
        type: "go2rtc",
        stream: "front",
      },
      fallbacks: [
        {
          type: "entity",
          entity: "camera.front",
        },
        {
          type: "url",
          url: "https://example.local/front.m3u8",
        },
      ],
    });

    expect(config.fallbacks.map((source) => source.type)).toEqual(["entity", "url"]);
  });

  it("rejects missing sources", () => {
    expect(() =>
      normalizeConfig({
        type: "custom:ha-camera-live-card",
      } as never),
    ).toThrow("Camera source is required.");
  });

  it("rejects unsupported source types", () => {
    expect(() =>
      normalizeConfig({
        type: "custom:ha-camera-live-card",
        source: {
          type: "rtsp",
          url: "rtsp://example.local/front",
        },
      } as never),
    ).toThrow("source.type must be one of");
  });

  it("rejects invalid aspect ratios", () => {
    expect(() =>
      normalizeConfig({
        type: "custom:ha-camera-live-card",
        source: {
          type: "url",
          url: "https://example.local/front.m3u8",
        },
        aspect_ratio: "wide",
      }),
    ).toThrow("aspect_ratio");
  });
});
