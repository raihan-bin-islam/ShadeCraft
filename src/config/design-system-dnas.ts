import type { SlotPosition } from "@/types/theme-kit/layout";

/**
 * A design-system DNA describes the structural rules of a procedural layout.
 * Engine B reads this to compose a LayoutSpec by sampling slots within the
 * DNA's constraints. Each DNA represents the structural fingerprint of a real
 * design tradition (Swiss, Bauhaus, Brutalist, Editorial, Magazine Bento).
 */
export interface DesignSystemDNA {
  id: string;
  name: string;
  description: string;

  /**
   * Per-slot variant pool. Keys are slot folder names (header, hero, features,
   * etc., matching `src/lib/theme-kit/slots/<folder>/`); values are the variant
   * IDs eligible under this DNA. A slot type with no entry here is excluded.
   */
  slotVariants: Record<string, string[]>;

  /** Inclusive range for how many slots this DNA emits per layout. */
  slotCountRange: [number, number];

  /** Slot types that MUST appear in every layout (will be added even if random sampling skips them). */
  mustHave: string[];

  /** Slot types that may NOT appear under this DNA (excluded from sampling even if in slotVariants). */
  mustNotHave?: string[];

  /** Force a specific position for these slot types when they appear. */
  positionOverrides?: Record<string, SlotPosition>;

  /** If present, this slot type is forced to index 0 (regardless of sample order). */
  firstSlot?: string;

  /** If present, this slot type is forced to the last index. */
  lastSlot?: string;

  /** Soft bias for engine selection in `auto` mode (Phase 5+ may use). */
  preferredFeels?: string[];
  preferredTones?: string[];
  preferredNarratives?: string[];
}

export const DESIGN_SYSTEM_DNAS: DesignSystemDNA[] = [
  {
    id: "swiss-grid",
    name: "Swiss Grid",
    description: "Modular grid, generous whitespace, strict alignment, sans-serif emphasis.",
    slotVariants: {
      header: ["header-minimal", "header-bold"],
      hero: ["hero-centered", "hero-split"],
      "logo-cloud": ["logo-cloud-grid"],
      features: ["features-3col", "features-alternating"],
      pricing: ["pricing-3col", "pricing-comparison"],
      cta: ["cta-card"],
      footer: ["footer-minimal", "footer-rich"],
    },
    slotCountRange: [4, 7],
    mustHave: ["header", "hero", "footer"],
    positionOverrides: { header: "top", footer: "bottom" },
    firstSlot: "header",
    lastSlot: "footer",
    preferredFeels: ["minimalist", "serene", "monochrome"],
    preferredTones: ["minimalist", "elegant", "serene"],
  },
  {
    id: "bauhaus",
    name: "Bauhaus",
    description: "Asymmetric balance, primary-color blocks as structural elements, 3-4 sections max.",
    slotVariants: {
      header: ["header-bold"],
      hero: ["hero-bento", "hero-fullbleed"],
      features: ["features-bento"],
      bento: ["bento-grid"],
      cta: ["cta-banner"],
      footer: ["footer-minimal"],
    },
    slotCountRange: [3, 4],
    mustHave: ["header", "hero"],
    positionOverrides: { header: "top", footer: "bottom" },
    firstSlot: "header",
    lastSlot: "footer",
    preferredFeels: ["vibrant", "playful", "warm", "jewel"],
    preferredNarratives: ["dual-accent", "vibrant-clash", "colored-canvas"],
  },
  {
    id: "brutalist",
    name: "Brutalist",
    description: "Exposed structure, monospace accents, raw block layouts, often single-column.",
    slotVariants: {
      header: ["header-bold", "header-minimal"],
      hero: ["hero-fullbleed", "hero-centered"],
      features: ["features-alternating", "features-3col"],
      "content-block": ["content-block"],
      footer: ["footer-minimal"],
    },
    slotCountRange: [3, 5],
    mustHave: ["header"],
    positionOverrides: { header: "top", footer: "bottom" },
    firstSlot: "header",
    lastSlot: "footer",
    preferredFeels: ["industrial", "noir", "monochrome"],
    preferredTones: ["brutalist", "industrial"],
    preferredNarratives: ["dark-signature", "monochrome-accent"],
  },
  {
    id: "editorial",
    name: "Editorial",
    description: "Wide reading column with meta sidebar, typography-led hierarchy, image-text rhythm.",
    slotVariants: {
      header: ["header-minimal", "header-bold"],
      hero: ["hero-centered", "hero-fullbleed"],
      "content-block": ["content-block"],
      "meta-sidebar": ["meta-sidebar"],
      footer: ["footer-minimal", "footer-rich"],
    },
    slotCountRange: [3, 5],
    mustHave: ["header", "content-block", "meta-sidebar", "footer"],
    positionOverrides: { header: "top", "meta-sidebar": "right", footer: "bottom" },
    firstSlot: "header",
    lastSlot: "footer",
    preferredFeels: ["elegant", "vintage", "warm", "serene"],
    preferredTones: ["elegant", "vintage", "luxury"],
    preferredNarratives: ["muted-harmony", "tone-on-tone"],
  },
  {
    id: "magazine-bento",
    name: "Magazine Bento",
    description: "Variable-size cards, asymmetric masonry, hero feature card, dense info packing.",
    slotVariants: {
      header: ["header-minimal", "header-bold"],
      hero: ["hero-bento"],
      features: ["features-bento"],
      bento: ["bento-grid"],
      testimonials: ["testimonials-grid"],
      cta: ["cta-card"],
      footer: ["footer-minimal"],
    },
    slotCountRange: [4, 6],
    mustHave: ["header", "bento", "footer"],
    positionOverrides: { header: "top", footer: "bottom" },
    firstSlot: "header",
    lastSlot: "footer",
    preferredFeels: ["playful", "vibrant", "aurora", "jewel"],
    preferredNarratives: ["vibrant-clash", "dual-accent"],
  },
];
