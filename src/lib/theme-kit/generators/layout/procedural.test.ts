import { describe, it, expect } from "vitest";
import { generateProceduralLayout } from "./procedural";
import type { DesignSystemDNA } from "@/config/design-system-dnas";
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

const fakeDNA: DesignSystemDNA = {
  id: "test-dna",
  name: "Test DNA",
  description: "",
  slotVariants: {
    header: ["header-minimal", "header-bold"],
    hero: ["hero-centered"],
    features: ["features-3col", "features-bento"],
    cta: ["cta-card"],
    footer: ["footer-minimal", "footer-rich"],
  },
  slotCountRange: [3, 4],
  mustHave: ["header", "footer"],
  positionOverrides: { header: "top", footer: "bottom" },
  firstSlot: "header",
  lastSlot: "footer",
};

describe("generateProceduralLayout", () => {
  it("returns a LayoutSpec with engine='procedural' and the right archetype id", () => {
    const spec = generateProceduralLayout({ dna: fakeDNA, axes: fakeAxes, narrative: fakeNarrative });
    expect(spec.engine).toBe("procedural");
    expect(spec.archetype).toBe("test-dna");
  });

  it("slot count falls within the DNA's slotCountRange", () => {
    for (let i = 0; i < 50; i++) {
      const spec = generateProceduralLayout({ dna: fakeDNA, axes: fakeAxes, narrative: fakeNarrative });
      expect(spec.slots.length).toBeGreaterThanOrEqual(3);
      expect(spec.slots.length).toBeLessThanOrEqual(4);
    }
  });

  it("includes every must-have slot in every output", () => {
    for (let i = 0; i < 50; i++) {
      const spec = generateProceduralLayout({ dna: fakeDNA, axes: fakeAxes, narrative: fakeNarrative });
      const slotIds = spec.slots.map((s) => s.slotId);
      expect(slotIds).toContain("header");
      expect(slotIds).toContain("footer");
    }
  });

  it("excludes slots in mustNotHave", () => {
    const dnaWithExclusion: DesignSystemDNA = {
      ...fakeDNA,
      mustNotHave: ["features"],
    };
    for (let i = 0; i < 50; i++) {
      const spec = generateProceduralLayout({ dna: dnaWithExclusion, axes: fakeAxes, narrative: fakeNarrative });
      expect(spec.slots.find((s) => s.slotId === "features")).toBeUndefined();
    }
  });

  it("places firstSlot at index 0 and lastSlot at the final index", () => {
    for (let i = 0; i < 50; i++) {
      const spec = generateProceduralLayout({ dna: fakeDNA, axes: fakeAxes, narrative: fakeNarrative });
      expect(spec.slots[0].slotId).toBe("header");
      expect(spec.slots[spec.slots.length - 1].slotId).toBe("footer");
    }
  });

  it("applies position overrides to the right slots", () => {
    const spec = generateProceduralLayout({ dna: fakeDNA, axes: fakeAxes, narrative: fakeNarrative });
    const header = spec.slots.find((s) => s.slotId === "header");
    const footer = spec.slots.find((s) => s.slotId === "footer");
    expect(header?.position).toBe("top");
    expect(footer?.position).toBe("bottom");
  });

  it("only picks variants from the DNA's slotVariants pool for each slot", () => {
    for (let i = 0; i < 50; i++) {
      const spec = generateProceduralLayout({ dna: fakeDNA, axes: fakeAxes, narrative: fakeNarrative });
      for (const slot of spec.slots) {
        const eligibleVariants = fakeDNA.slotVariants[slot.slotId];
        expect(eligibleVariants).toBeDefined();
        expect(eligibleVariants).toContain(slot.variant);
      }
    }
  });
});
