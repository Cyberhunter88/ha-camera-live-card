# AGENTS.md

## Project

This repository contains `ha-camera-live-card`, a HACS-ready Home Assistant
dashboard custom card for smooth live camera playback.

The card is written in TypeScript with Lit and builds to:

```text
dist/ha-camera-live-card.js
```

Keep this built file committed because HACS dashboard repositories need the
distributed JavaScript artifact.

## Common Commands

Use `npm.cmd` on Windows PowerShell if `npm.ps1` is blocked by execution policy.

```bash
npm install
npm.cmd run typecheck
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

Before handing off changes, run:

```bash
npm.cmd run typecheck
npm.cmd test
npm.cmd run lint
npm.cmd run build
```

## Architecture

- `src/ha-camera-live-card.ts` defines the Lit custom element
  `ha-camera-live-card`.
- `src/config.ts` validates and normalizes Lovelace YAML config.
- `src/providers/` contains stream source implementations:
  - `go2rtc-provider.ts` for go2rtc WebRTC/HLS/MSE.
  - `ha-entity-provider.ts` for Home Assistant `camera/stream`.
  - `url-provider.ts` for direct stream URLs.
- `test/` contains Vitest coverage for config parsing and component behavior.

## Important Behavior

- `source.type` supports `go2rtc`, `entity`, and `url`.
- `fallbacks` are tried in order.
- `pause_when_hidden` defaults to `true`; keep this behavior because it prevents
  multiple dashboard cards from decoding 2K/4K streams while offscreen.
- Stream starts are intentionally staggered to avoid overloading go2rtc or Home
  Assistant when a dashboard has many camera cards.
- The card uses Home Assistant `ha-icon`/MDI icons instead of bundled image
  assets so the UI follows the active HA theme.

## Coding Guidelines

- Keep video playback on the native `<video>` element. Do not move the live
  stream through canvas unless there is a specific, tested reason.
- Avoid render loops during playback. Lit should update only for config, state,
  visibility, or control changes.
- Disconnect providers in `disconnectedCallback()` and whenever hidden-card
  pausing requires the stream to stop.
- Prefer adding focused provider tests or component tests when changing stream
  lifecycle behavior.
- Do not remove `dist/ha-camera-live-card.js` from version control.

## Release Notes

For HACS releases, rebuild first:

```bash
npm.cmd run build
```

Then commit source changes and the updated `dist/` artifact together.
