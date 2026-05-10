import { describe, it, expect } from "vitest";
import { generateLayoutTemplate } from "./template";
import type { LayoutArchetype } from "@/config/layout-archetypes";
import type { AxisSelection } from "@/config/theme-axes";
import type { Narrative } from "@/config/theme-narratives";

const fakeAxes: AxisSelection = {
  shadow: "soft",
  border: "standard",
  surface: "flat",
  component: "solid",
};

const fakeNarrative: Narrative = {
  id: "monochrome-accent",
  name: "Monochrome + Accent",
  description: "",
  primary: { chroma: [0.1, 0.2], lightness: [0.5, 0.6] },
  secondary: { chroma: [0, 0.02], lightness: [0.85, 0.95], mode: "neutral" },
  accent: { chroma: [0, 0.03], lightness: [0.8, 0.92], mode: "echo-primary" },
  background: { chroma: [0, 0.01], lightness: [0.96, 0.99], saturated: false },
  accentHueOffset: [0, 0],
  secondaryHueOffset: [0, 360],
};

const fakeArchetype: LayoutArchetype = {
  id: "test-archetype",
  name: "Test",
  slots: [
    { id: "header", required: true, variants: ["header-minimal", "header-bold"] },
    { id: "hero", required: true, variants: ["hero-centered"] },
    { id: "logo-cloud", required: false, variants: ["logo-cloud-grid"] },
    { id: "footer", required: true, variants: ["footer-minimal"] },
  ],
};

describe("generateLayoutTemplate", () => {
  it("returns a LayoutSpec with engine='template' and the right archetype id", () => {
    const spec = generateLayoutTemplate({ archetype: fakeArchetype, axes: fakeAxes, narrative: fakeNarrative });
    expect(spec.engine).toBe("template");
    expect(spec.archetype).toBe("test-archetype");
  });

  it("includes every required slot in the output", () => {
    const spec = generateLayoutTemplate({ archetype: fakeArchetype, axes: fakeAxes, narrative: fakeNarrative });
    const slotIds = spec.slots.map((s) => s.slotId);
    expect(slotIds).toContain("header");
    expect(slotIds).toContain("hero");
    expect(slotIds).toContain("footer");
  });

  it("only picks variants from each slot's eligible list", () => {
    for (let i = 0; i < 50; i++) {
      const spec = generateLayoutTemplate({ archetype: fakeArchetype, axes: fakeAxes, narrative: fakeNarrative });
      for (const slot of spec.slots) {
        const slotDef = fakeArchetype.slots.find((s) => s.id === slot.slotId);
        expect(slotDef).toBeDefined();
        expect(slotDef!.variants).toContain(slot.variant);
      }
    }
  });

  it("optional slots appear sometimes but not always", () => {
    let withOptional = 0;
    let withoutOptional = 0;
    for (let i = 0; i < 100; i++) {
      const spec = generateLayoutTemplate({ archetype: fakeArchetype, axes: fakeAxes, narrative: fakeNarrative });
      const hasLogoCloud = spec.slots.some((s) => s.slotId === "logo-cloud");
      if (hasLogoCloud) withOptional++;
      else withoutOptional++;
    }
    // 0.7 probability — expect both appearances and absences
    expect(withOptional).toBeGreaterThan(20);
    expect(withoutOptional).toBeGreaterThan(5);
  });
});
