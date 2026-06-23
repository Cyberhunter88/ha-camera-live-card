import { Go2RtcProvider } from "./go2rtc-provider";
import { HaEntityProvider } from "./ha-entity-provider";
import { UrlProvider } from "./url-provider";
import type { CameraSource, StreamProvider } from "../types";

export function createProvider(source: CameraSource): StreamProvider {
  if (source.type === "go2rtc") {
    return new Go2RtcProvider(source);
  }

  if (source.type === "entity") {
    return new HaEntityProvider(source);
  }

  return new UrlProvider(source);
}
