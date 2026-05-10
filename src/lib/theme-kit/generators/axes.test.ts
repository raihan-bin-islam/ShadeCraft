import { describe, it, expect } from "vitest";
import { sampleAxes, getAxisCssVars } from "./axes";
import type { AxisPreferences, AxisSelection } from "@/config/theme-axes";

describe("sampleAxes", () => {
  it("returns one variant per axis with valid IDs", () => {
    const selection = sampleAxes();
    expect(["flat", "soft", "elevated", "glassy", "glow"]).toContain(selection.shadow);
    expect(["hairline", "standard", "heavy", "accented"]).toContain(selection.border);
    expect(["flat", "gradient", "noise", "pattern", "mesh"]).toContain(selection.surface);
    expect(["solid", "outline", "pill", "sharp", "embossed"]).toContain(selection.component);
  });

  it("respects strong tone preference (weight 5 vs default 1)", () => {
    const tonePreferences: AxisPreferences = {
      shadow: { glow: 5, flat: 1, soft: 1, elevated: 1, glassy: 1 },
    };
    let glowCount = 0;
    const trials = 500;
    for (let i = 0; i < trials; i++) {
      if (sampleAxes({ tonePreferences }).shadow === "glow") glowCount++;
    }
    expect(glowCount).toBeGreaterThan(200);
    expect(glowCount).toBeLessThan(360);
  });

  it("multiplies feel and tone weights", () => {
    const feelPreferences: AxisPreferences = { component: { sharp: 3 } };
    const tonePreferences: AxisPreferences = { component: { sharp: 3 } };
    let sharpCount = 0;
    const trials = 500;
    for (let i = 0; i < trials; i++) {
      if (sampleAxes({ feelPreferences, tonePreferences }).component === "sharp") sharpCount++;
    }
    expect(sharpCount).toBeGreaterThan(280);
    expect(sharpCount).toBeLessThan(420);
  });

  it("excludes a variant when weight is 0", () => {
    const tonePreferences: AxisPreferences = {
      border: { hairline: 0, standard: 1, heavy: 0, accented: 0 },
    };
    for (let i = 0; i < 100; i++) {
      expect(sampleAxes({ tonePreferences }).border).toBe("standard");
    }
  });
});

describe("getAxisCssVars", () => {
  it("returns merged CSS vars from all four chosen variants", () => {
    const selection: AxisSelection = {
      shadow: "soft",
      border: "standard",
      surface: "flat",
      component: "solid",
    };
    const vars = getAxisCssVars(selection);
    expect(vars["shadow-md"]).toBeDefined();
    expect(vars["axis-border-width"]).toBeDefined();
    expect(vars["axis-surface-image"]).toBeDefined();
    expect(vars["radius-button"]).toBeDefined();
  });

  it("'glow' shadow emits primary-color box-shadow values", () => {
    const selection: AxisSelection = {
      shadow: "glow",
      border: "standard",
      surface: "flat",
      component: "solid",
    };
    const vars = getAxisCssVars(selection);
    expect(vars["shadow-md"]).toContain("var(--primary)");
  });

  it("'pill' personality emits 9999px button radius", () => {
    const selection: AxisSelection = {
      shadow: "soft",
      border: "standard",
      surface: "flat",
      component: "pill",
    };
    const vars = getAxisCssVars(selection);
    expect(vars["radius-button"]).toBe("9999px");
  });

  it("'sharp' personality emits zero radius for buttons, cards, and inputs", () => {
    const selection: AxisSelection = {
      shadow: "soft",
      border: "standard",
      surface: "flat",
      component: "sharp",
    };
    const vars = getAxisCssVars(selection);
    expect(vars["radius-button"]).toBe("0");
    expect(vars["radius-card"]).toBe("0");
    expect(vars["radius-input"]).toBe("0");
  });
});
