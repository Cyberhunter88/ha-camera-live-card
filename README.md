# HA Camera Live Card

A HACS-ready Home Assistant dashboard card for smooth live camera playback. The
card prefers go2rtc/WebRTC for low latency and supports Home Assistant camera
entities and direct stream URLs. A single card can show multiple cameras with
carousel arrows while keeping only the active stream connected.

## Installation

### HACS custom repository

1. Build or release this repository with `dist/ha-camera-live-card.js`.
2. Add the repository to HACS as a Dashboard repository.
3. Add the card resource if HACS does not do it automatically:

```yaml
url: /hacsfiles/ha-camera-live-card/ha-camera-live-card.js
type: module
```

### Manual

Copy `dist/ha-camera-live-card.js` to `<config>/www/ha-camera-live-card.js` and
add:

```yaml
url: /local/ha-camera-live-card.js
type: module
```

## Visual editor

Add the card from the Home Assistant dashboard UI and configure cameras in the
visual editor. The editor supports multiple cameras, go2rtc streams, Home
Assistant camera entities, direct URLs, per-camera fallbacks, playback controls,
and hidden-card pausing.

## Multiple cameras

```yaml
type: custom:ha-camera-live-card
title: Cameras
cameras:
  - title: Einfahrt
    source:
      type: go2rtc
      stream: driveway
      url: /api/go2rtc
      mode: auto
    fallbacks:
      - type: entity
        entity: camera.driveway
  - title: Garten
    source:
      type: entity
      entity: camera.garden
  - title: Garage
    source:
      type: url
      url: https://example.local/garage/index.m3u8
aspect_ratio: "16:9"
muted: true
autoplay: true
controls: minimal
pause_when_hidden: true
```

## Legacy single-camera config

```yaml
type: custom:ha-camera-live-card
title: Einfahrt
source:
  type: go2rtc
  stream: driveway
  url: /api/go2rtc
  mode: auto
fallbacks:
  - type: entity
    entity: camera.driveway
  - type: url
    url: https://example.local/stream.m3u8
aspect_ratio: "16:9"
muted: true
autoplay: true
controls: minimal
pause_when_hidden: true
```

## Home Assistant camera entity

```yaml
type: custom:ha-camera-live-card
title: Garten
source:
  type: entity
  entity: camera.garden
```

## Direct URL

```yaml
type: custom:ha-camera-live-card
title: Garage
source:
  type: url
  url: https://example.local/garage/index.m3u8
controls: native
```

## Options

| Option | Default | Description |
| --- | --- | --- |
| `cameras` | derived from `source` | List of camera entries shown with carousel arrows. |
| `cameras[].source` | required | Primary camera source. Supports `go2rtc`, `entity`, and `url`. |
| `cameras[].fallbacks` | `[]` | Ordered fallback sources for that camera. |
| `source` | legacy | Single-camera primary source, still supported for existing YAML. |
| `fallbacks` | `[]` | Legacy single-camera fallback sources. |
| `title` | none | Optional title overlay. |
| `aspect_ratio` | `"16:9"` | Video frame ratio. |
| `muted` | `true` | Keeps browser autoplay reliable. |
| `autoplay` | `true` | Starts playback when the card connects. |
| `controls` | `"minimal"` | `minimal`, `native`, or `none`. |
| `pause_when_hidden` | `true` | Disconnects streams while the card is offscreen or the tab is hidden. |

## 2K and 4K tips

- Prefer go2rtc/WebRTC for the lowest latency and smoothest live view.
- Leave go2rtc `mode` on `auto` unless you need to force `webrtc`, `mse`, or `hls`.
- Use camera substreams or profiles for wall tablets and slower clients.
- Keep `pause_when_hidden: true` when you place many camera cards on one dashboard.
- Keep `muted: true` if you want autoplay.
- Avoid browser extensions that disable hardware video acceleration.
- Use wired network or strong Wi-Fi for 4K streams.

## Development

```bash
npm install
npm run typecheck
npm test
npm run build
```

The build output is `dist/ha-camera-live-card.js`, matching HACS dashboard
plugin requirements.
