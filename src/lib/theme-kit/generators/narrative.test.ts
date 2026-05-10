import { describe, it, expect } from "vitest";
import type { Narrative } from "@/config/theme-narratives";
import { pickNarrative } from "./narrative";

const fakeFeel = (id: string) => ({
  id,
  name: id,
  description: "",
  lightnessRange: [0, 1],
  chromaRange: [0, 0.3],
  preferredHues: [0],
  preferredHueRanges: [[0, 360]] as [number, number][],
});

const fakeNarrative = (overrides: Partial<Narrative>): Narrative => ({
  id: "fake",
  name: "Fake",
  description: "",
  primary: { chroma: [0, 0.1], lightness: [0.4, 0.6] },
  secondary: { chroma: [0, 0.1], lightness: [0.4, 0.6], mode: "neutral" },
  accent: { chroma: [0, 0.1], lightness: [0.4, 0.6], mode: "echo-primary" },
  background: { chroma: [0, 0.1], lightness: [0.4, 0.6], saturated: false },
  accentHueOffset: [0, 0],
  secondaryHueOffset: [0, 0],
  ...overrides,
});

describe("pickNarrative", () => {
  it("excludes narratives that list the feel in avoidedFeels", () => {
    const narratives = [
      fakeNarrative({ id: "a", avoidedFeels: ["vibrant"] }),
      fakeNarrative({ id: "b" }),
    ];
    // Run many times — picked narrative must never be 'a' when feel is vibrant
    for (let i = 0; i < 50; i++) {
      const picked = pickNarrative(fakeFeel("vibrant"), narratives);
      expect(picked.id).toBe("b");
    }
  });

  it("weights preferredFeels 3x relative to baseline", () => {
    // With 1 preferred and 1 unpreferred, expected distribution is roughly 75/25.
    // Run a large sample and check the preferred narrative is picked > 50% of the time.
    const narratives = [
      fakeNarrative({ id: "preferred", preferredFeels: ["noir"] }),
      fakeNarrative({ id: "neutral" }),
    ];
    let preferredCount = 0;
    const trials = 1000;
    for (let i = 0; i < trials; i++) {
      if (pickNarrative(fakeFeel("noir"), narratives).id === "preferred") preferredCount++;
    }
    // Tolerance: expected 750, accept anywhere in [600, 850]
    expect(preferredCount).toBeGreaterThan(600);
    expect(preferredCount).toBeLessThan(850);
  });

  it("falls back to first narrative if every narrative excludes the feel", () => {
    const narratives = [
      fakeNarrative({ id: "a", avoidedFeels: ["weird"] }),
      fakeNarrative({ id: "b", avoidedFeels: ["weird"] }),
    ];
    expect(pickNarrative(fakeFeel("weird"), narratives).id).toBe("a");
  });

  it("returns one of the catalog entries when called with no narratives override", () => {
    const result = pickNarrative(fakeFeel("noir"));
    // Just verify the result has the expected Narrative shape
    expect(typeof result.id).toBe("string");
    expect(typeof result.name).toBe("string");
    expect(result.primary).toBeDefined();
  });
});
