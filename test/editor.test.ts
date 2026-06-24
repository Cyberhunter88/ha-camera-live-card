import { afterEach, describe, expect, it } from "vitest";
import "../src/ha-camera-live-card-editor";
import type { CameraLiveCardConfig } from "../src/types";

interface EditorElement extends HTMLElement {
  updateComplete: Promise<boolean>;
  setConfig(config: CameraLiveCardConfig): void;
}

describe("ha-camera-live-card-editor", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("renders existing camera config", async () => {
    const editor = createEditor();

    editor.setConfig({
      type: "custom:ha-camera-live-card",
      title: "Overview",
      cameras: [
        {
          title: "Front",
          source: {
            type: "entity",
            entity: "camera.front",
          },
        },
      ],
    });

    document.body.append(editor);
    await editor.updateComplete;

    expect(editor.shadowRoot?.textContent).toContain("Front");
    expect(inputValues(editor)).toContain("Overview");
    expect(entityPickerValues(editor)).toContain("camera.front");
  });

  it("adds, reorders, and removes cameras through config events", async () => {
    const editor = createEditor();
    const changes: CameraLiveCardConfig[] = [];
    editor.addEventListener("config-changed", (event) => {
      changes.push((event as CustomEvent<{ config: CameraLiveCardConfig }>).detail.config);
    });

    editor.setConfig({
      type: "custom:ha-camera-live-card",
      cameras: [
        {
          title: "Front",
          source: {
            type: "url",
            url: "https://example.local/front.m3u8",
          },
        },
      ],
    });

    document.body.append(editor);
    await editor.updateComplete;

    clickTextButton(editor, "Add");
    await editor.updateComplete;
    expect(last(changes).cameras?.map((camera) => camera.title)).toEqual(["Front", "Camera 2"]);

    clickTitleButton(editor, "Move up");
    await editor.updateComplete;
    expect(last(changes).cameras?.map((camera) => camera.title)).toEqual(["Camera 2", "Front"]);

    clickTitleButton(editor, "Remove camera");
    await editor.updateComplete;
    expect(last(changes).cameras?.map((camera) => camera.title)).toEqual(["Front"]);
  });

  it("resets source fields when the source type changes", async () => {
    const editor = createEditor();
    let config: CameraLiveCardConfig | undefined;
    editor.addEventListener("config-changed", (event) => {
      config = (event as CustomEvent<{ config: CameraLiveCardConfig }>).detail.config;
    });

    editor.setConfig({
      type: "custom:ha-camera-live-card",
      cameras: [
        {
          title: "Front",
          source: {
            type: "entity",
            entity: "camera.front",
          },
        },
      ],
    });

    document.body.append(editor);
    await editor.updateComplete;

    const sourceType = [...(editor.shadowRoot?.querySelectorAll("select") ?? [])].find(
      (select) => (select as HTMLSelectElement).value === "entity",
    ) as HTMLSelectElement;
    sourceType.value = "url";
    sourceType.dispatchEvent(new Event("change"));
    await editor.updateComplete;

    expect(config?.cameras?.[0].source).toEqual({
      type: "url",
      url: "",
    });
  });
});

function createEditor(): EditorElement {
  return document.createElement("ha-camera-live-card-editor") as EditorElement;
}

function inputValues(editor: EditorElement): string[] {
  return [...(editor.shadowRoot?.querySelectorAll("input") ?? [])].map((input) => input.value);
}

function entityPickerValues(editor: EditorElement): string[] {
  return [...(editor.shadowRoot?.querySelectorAll("ha-entity-picker") ?? [])].map(
    (picker) => (picker as HTMLElement & { value?: string }).value ?? "",
  );
}

function clickTextButton(editor: EditorElement, text: string): void {
  const button = [...(editor.shadowRoot?.querySelectorAll("button") ?? [])].find(
    (candidate) => candidate.textContent?.trim() === text,
  ) as HTMLButtonElement | undefined;
  expect(button).toBeDefined();
  button?.click();
}

function clickTitleButton(editor: EditorElement, title: string): void {
  const button = editor.shadowRoot?.querySelector(`button[title="${title}"]:not([disabled])`) as HTMLButtonElement | null;
  expect(button).not.toBeNull();
  button?.click();
}

function last<T>(values: T[]): T {
  return values[values.length - 1];
}
