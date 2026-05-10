import { describe, it, expect } from "vitest";
import { buildIdentity } from "./identity";
import type { Narrative } from "@/config/theme-narratives";
import type { LayoutSpec } from "@/types/theme-kit/layout";

const fakeFeel = {
  id: "noir",
  name: "Noir",
  description: "Dark, moody, and cinematic with low-light ambiance.",
  lightnessRange: [0.1, 0.4],
  chromaRange: [0.02, 0.08],
  preferredHues: [260, 280],
  preferredHueRanges: [[260, 280]] as [number, number][],
};

const fakeTone = {
  id: "minimalist",
  name: "Minimalist",
  fonts: [],
  radius: "0.4rem",
};

const fakeNarrative: Narrative = {
  id: "dark-signature",
  name: "Dark Signature",
  description: "",
  primary: { chroma: [0.16, 0.24], lightness: [0.55, 0.7] },
  secondary: { chroma: [0, 0.02], lightness: [0.4, 0.55], mode: "neutral" },
  accent: { chroma: [0, 0.03], lightness: [0.65, 0.8], mode: "echo-primary" },
  background: { chroma: [0.01, 0.04], lightness: [0.1, 0.2], saturated: false },
  accentHueOffset: [0, 0],
  secondaryHueOffset: [0, 360],
};

const fakeLayout: LayoutSpec = {
  engine: "template",
  archetype: "app-dashboard",
  slots: [],
};

describe("buildIdentity", () => {
  it("returns the provided name verbatim", () => {
    const id = buildIdentity({ name: "Crimson Dream", feel: fakeFeel, tone: fakeTone as never, narrative: fakeNarrative, layout: fakeLayout });
    expect(id.name).toBe("Crimson Dream");
  });

  it("templates the tagline from feel descriptor + narrative story", () => {
    const id = buildIdentity({ name: "X", feel: fakeFeel, tone: fakeTone as never, narrative: fakeNarrative, layout: fakeLayout });
    expect(id.tagline).toContain("dark, moody, and cinematic");
    expect(id.tagline).toContain("a single signature color in the dark");
  });

  it("uses the (narrative, archetype) lookup for designedFor when available", () => {
    const id = buildIdentity({ name: "X", feel: fakeFeel, tone: fakeTone as never, narrative: fakeNarrative, layout: fakeLayout });
    expect(id.designedFor).toBe("developer tools that feel like home in a dark IDE");
  });

  it("falls back to feel-only use-case when (narrative, archetype) not matched", () => {
    const layoutWithUnknownArchetype: LayoutSpec = { ...fakeLayout, archetype: "fictional-archetype" };
    const id = buildIdentity({ name: "X", feel: fakeFeel, tone: fakeTone as never, narrative: fakeNarrative, layout: layoutWithUnknownArchetype });
    expect(id.designedFor).toBe("products with cinematic restraint");
  });

  it("falls back to generic use-case when neither lookup matches", () => {
    const unknownFeel = { ...fakeFeel, id: "fictional-feel" };
    const layoutWithUnknownArchetype: LayoutSpec = { ...fakeLayout, archetype: "fictional-archetype" };
    const id = buildIdentity({
      name: "X",
      feel: unknownFeel,
      tone: fakeTone as never,
      narrative: fakeNarrative,
      layout: layoutWithUnknownArchetype,
    });
    expect(id.designedFor).toBe("any product with a clear point of view");
  });
});
