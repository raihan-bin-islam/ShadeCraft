export type ShadowId = "flat" | "soft" | "elevated" | "glassy" | "glow";
export type BorderId = "hairline" | "standard" | "heavy" | "accented";
export type SurfaceId = "flat" | "gradient" | "noise" | "pattern" | "mesh";
export type ComponentId = "solid" | "outline" | "pill" | "sharp" | "embossed";

export type AxisSelection = {
  shadow: ShadowId;
  border: BorderId;
  surface: SurfaceId;
  component: ComponentId;
};

export type AxisVariant<Id extends string> = {
  id: Id;
  /** CSS vars emitted by this variant. Merged into the theme's :root via the builder. */
  cssVars: Record<string, string>;
};

export type AxisCatalog = {
  shadow: AxisVariant<ShadowId>[];
  border: AxisVariant<BorderId>[];
  surface: AxisVariant<SurfaceId>[];
  component: AxisVariant<ComponentId>[];
};

/**
 * Per-axis preferences expressed as weight maps. Higher weight = more likely.
 * Missing keys default to weight 1. Used by feels and tones to bias axis sampling.
 */
export type AxisPreferences = {
  shadow?: Partial<Record<ShadowId, number>>;
  border?: Partial<Record<BorderId, number>>;
  surface?: Partial<Record<SurfaceId, number>>;
  component?: Partial<Record<ComponentId, number>>;
};

/**
 * Only the `shadow` axis emits real CSS variables; the others remain as
 * sampling/biasing dimensions and as labels on the DNA badge. They previously
 * applied via a global theme-axes.css stylesheet that didn't ship with exports
 * and bled onto chrome, so the visual layer was dropped.
 */
export const AXES: AxisCatalog = {
  shadow: [
    {
      id: "flat",
      cssVars: {
        "shadow-xs": "0 0 0 1px var(--border)",
        "shadow-sm": "0 0 0 1px var(--border)",
        "shadow-md": "0 0 0 1px var(--border)",
        "shadow-lg": "0 0 0 1px var(--border)",
        "shadow-xl": "0 0 0 1px var(--border)",
      },
    },
    {
      id: "soft",
      cssVars: {
        "shadow-xs": "0 1px 2px rgb(0 0 0 / 0.05)",
        "shadow-sm": "0 1px 3px rgb(0 0 0 / 0.08), 0 1px 2px rgb(0 0 0 / 0.04)",
        "shadow-md": "0 4px 6px rgb(0 0 0 / 0.06), 0 2px 4px rgb(0 0 0 / 0.04)",
        "shadow-lg": "0 10px 15px rgb(0 0 0 / 0.08), 0 4px 6px rgb(0 0 0 / 0.04)",
        "shadow-xl": "0 20px 25px rgb(0 0 0 / 0.10), 0 8px 10px rgb(0 0 0 / 0.04)",
      },
    },
    {
      id: "elevated",
      cssVars: {
        "shadow-xs": "0 2px 4px rgb(0 0 0 / 0.10)",
        "shadow-sm": "0 4px 6px rgb(0 0 0 / 0.12), 0 2px 4px rgb(0 0 0 / 0.06)",
        "shadow-md": "0 8px 12px rgb(0 0 0 / 0.14), 0 4px 6px rgb(0 0 0 / 0.06)",
        "shadow-lg": "0 16px 24px rgb(0 0 0 / 0.16), 0 6px 10px rgb(0 0 0 / 0.06)",
        "shadow-xl": "0 32px 48px rgb(0 0 0 / 0.20), 0 12px 18px rgb(0 0 0 / 0.08)",
      },
    },
    {
      id: "glassy",
      cssVars: {
        "shadow-xs": "0 1px 2px rgb(0 0 0 / 0.04)",
        "shadow-sm": "0 4px 12px rgb(0 0 0 / 0.06)",
        "shadow-md": "0 8px 24px rgb(0 0 0 / 0.08)",
        "shadow-lg": "0 16px 40px rgb(0 0 0 / 0.10)",
        "shadow-xl": "0 24px 60px rgb(0 0 0 / 0.12)",
      },
    },
    {
      id: "glow",
      cssVars: {
        "shadow-xs": "0 0 0 1px var(--primary)",
        "shadow-sm": "0 0 8px var(--primary)",
        "shadow-md": "0 0 16px var(--primary)",
        "shadow-lg": "0 0 24px var(--primary)",
        "shadow-xl": "0 0 48px var(--primary)",
      },
    },
  ],
  border: [
    { id: "hairline", cssVars: {} },
    { id: "standard", cssVars: {} },
    { id: "heavy", cssVars: {} },
    { id: "accented", cssVars: {} },
  ],
  surface: [
    { id: "flat", cssVars: {} },
    { id: "gradient", cssVars: {} },
    { id: "noise", cssVars: {} },
    { id: "pattern", cssVars: {} },
    { id: "mesh", cssVars: {} },
  ],
  component: [
    { id: "solid", cssVars: {} },
    { id: "outline", cssVars: {} },
    { id: "pill", cssVars: {} },
    { id: "sharp", cssVars: {} },
    { id: "embossed", cssVars: {} },
  ],
};
