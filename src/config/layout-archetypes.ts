import type { SlotPosition } from "@/types/theme-kit/layout";

/**
 * One slot in an archetype's composition. The archetype declares which slot
 * variants are eligible; Engine A picks one via weighted choice.
 */
export interface SlotDef {
  id: string;
  required: boolean;
  variants: string[]; // e.g. ['header-minimal', 'header-glass', 'header-bold']
  position?: SlotPosition;
}

export interface LayoutArchetype {
  id: string;
  name: string;
  /** Ordered slot definitions. Renderer respects array order. */
  slots: SlotDef[];
  /** Soft bias: prefer this archetype when one of these feels is active. */
  preferredFeels?: string[];
  /** Soft bias: prefer this archetype when one of these tones is active. */
  preferredTones?: string[];
  /** Soft bias: prefer this archetype when one of these narratives is active. */
  preferredNarratives?: string[];
}

export const LAYOUT_ARCHETYPES: LayoutArchetype[] = [
  {
    id: "marketing-landing",
    name: "Marketing Landing",
    slots: [
      { id: "header", required: true, variants: ["header-minimal", "header-glass", "header-bold"], position: "top" },
      { id: "hero", required: true, variants: ["hero-centered", "hero-split", "hero-bento", "hero-fullbleed"], position: "flow" },
      { id: "logo-cloud", required: false, variants: ["logo-cloud-grid", "logo-cloud-marquee"], position: "flow" },
      { id: "features", required: true, variants: ["features-3col", "features-bento", "features-alternating"], position: "flow" },
      { id: "testimonials", required: false, variants: ["testimonials-grid", "testimonials-quote"], position: "flow" },
      { id: "pricing", required: false, variants: ["pricing-3col", "pricing-comparison"], position: "flow" },
      { id: "cta", required: true, variants: ["cta-banner", "cta-card"], position: "flow" },
      { id: "footer", required: true, variants: ["footer-minimal", "footer-rich"], position: "bottom" },
    ],
    preferredFeels: ["vibrant", "playful", "warm", "elegant"],
    preferredNarratives: ["dual-accent", "vibrant-clash", "colored-canvas"],
  },
  {
    id: "app-dashboard",
    name: "App Dashboard",
    slots: [
      { id: "sidebar", required: true, variants: ["sidebar-icon", "sidebar-rich", "sidebar-floating"], position: "left" },
      { id: "header", required: true, variants: ["header-minimal", "header-glass", "header-bold"], position: "top" },
      { id: "stat-cards", required: true, variants: ["stat-cards"], position: "flow" },
      { id: "chart-area", required: true, variants: ["chart-area"], position: "flow" },
      { id: "data-table", required: true, variants: ["data-table"], position: "flow" },
    ],
    preferredFeels: ["cool", "industrial", "cyber", "monochrome"],
    preferredNarratives: ["monochrome-accent", "dark-signature", "muted-harmony"],
  },
  {
    id: "app-workspace",
    name: "App Workspace (3-pane)",
    slots: [
      { id: "sidebar", required: true, variants: ["sidebar-icon", "sidebar-rich"], position: "left" },
      { id: "list-pane", required: true, variants: ["list-pane"], position: "flow" },
      { id: "detail-pane", required: true, variants: ["detail-pane"], position: "flow" },
      { id: "meta-pane", required: false, variants: ["meta-pane"], position: "right" },
    ],
    preferredFeels: ["cool", "serene", "monochrome"],
    preferredNarratives: ["monochrome-accent", "muted-harmony"],
  },
  {
    id: "app-settings",
    name: "App Settings",
    slots: [
      { id: "header", required: true, variants: ["header-minimal", "header-bold"], position: "top" },
      { id: "settings-sidebar", required: true, variants: ["settings-sidebar"], position: "left" },
      { id: "form-section", required: true, variants: ["form-section"], position: "flow" },
    ],
    preferredFeels: ["serene", "elegant", "monochrome"],
    preferredNarratives: ["monochrome-accent", "muted-harmony"],
  },
  {
    id: "auth-split",
    name: "Auth Split",
    slots: [
      { id: "image-panel", required: true, variants: ["image-panel"], position: "left" },
      { id: "form-panel", required: true, variants: ["form-panel"], position: "right" },
    ],
    preferredFeels: ["elegant", "warm", "ethereal", "ocean"],
    preferredNarratives: ["dual-accent", "colored-canvas", "tone-on-tone"],
  },
  {
    id: "auth-centered",
    name: "Auth Centered",
    slots: [
      { id: "centered-form", required: true, variants: ["centered-form"], position: "flow" },
    ],
    preferredFeels: ["minimalist", "serene", "monochrome", "noir"],
    preferredNarratives: ["monochrome-accent", "muted-harmony", "dark-signature"],
  },
  {
    id: "editorial",
    name: "Editorial / Content",
    slots: [
      { id: "header", required: true, variants: ["header-minimal", "header-bold"], position: "top" },
      { id: "hero", required: false, variants: ["hero-centered", "hero-fullbleed"], position: "flow" },
      { id: "content-block", required: true, variants: ["content-block"], position: "flow" },
      { id: "meta-sidebar", required: false, variants: ["meta-sidebar"], position: "right" },
      { id: "footer", required: true, variants: ["footer-minimal", "footer-rich"], position: "bottom" },
    ],
    preferredFeels: ["elegant", "vintage", "serene", "warm"],
    preferredNarratives: ["muted-harmony", "tone-on-tone", "monochrome-accent"],
  },
  {
    id: "bento-showcase",
    name: "Bento Showcase",
    slots: [
      { id: "header", required: true, variants: ["header-minimal", "header-bold"], position: "top" },
      { id: "bento-grid", required: true, variants: ["bento-grid"], position: "flow" },
      { id: "footer", required: false, variants: ["footer-minimal"], position: "bottom" },
    ],
    preferredFeels: ["playful", "vibrant", "aurora", "jewel"],
    preferredNarratives: ["vibrant-clash", "dual-accent", "colored-canvas"],
  },
  {
    id: "app-workspace-classic",
    name: "App Workspace (Classic Mail)",
    slots: [
      { id: "workspace-page", required: true, variants: ["workspace-mail-classic"], position: "flow" },
    ],
    preferredFeels: ["cool", "serene", "monochrome", "industrial"],
    preferredNarratives: ["monochrome-accent", "muted-harmony"],
  },
  {
    id: "app-dashboard-classic",
    name: "App Dashboard (Classic Stats)",
    slots: [
      { id: "dashboard-page", required: true, variants: ["dashboard-stats-classic"], position: "flow" },
    ],
    preferredFeels: ["cool", "industrial", "cyber", "monochrome"],
    preferredNarratives: ["monochrome-accent", "dark-signature", "muted-harmony"],
  },
];
