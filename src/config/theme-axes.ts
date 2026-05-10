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
        "surface-blur": "12px",
        "surface-alpha": "0.7",
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
    { id: "hairline", cssVars: { "axis-border-width": "1px", "axis-border-color": "var(--border)" } },
    { id: "standard", cssVars: { "axis-border-width": "1px", "axis-border-color": "var(--border)" } },
    { id: "heavy", cssVars: { "axis-border-width": "2px", "axis-border-color": "var(--border)" } },
    { id: "accented", cssVars: { "axis-border-width": "2px", "axis-border-color": "var(--primary)" } },
  ],
  surface: [
    { id: "flat", cssVars: { "axis-surface-image": "none" } },
    {
      id: "gradient",
      cssVars: {
        "axis-surface-image":
          "linear-gradient(180deg, var(--background) 0%, color-mix(in oklch, var(--background) 92%, var(--primary) 8%) 100%)",
      },
    },
    {
      id: "noise",
      cssVars: {
        "axis-surface-image":
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.05'/></svg>\")",
      },
    },
    {
      id: "pattern",
      cssVars: {
        "axis-surface-image":
          "radial-gradient(circle, color-mix(in oklch, var(--foreground) 6%, transparent) 1px, transparent 1.5px)",
      },
    },
    {
      id: "mesh",
      cssVars: {
        "axis-surface-image":
          "radial-gradient(at 0% 0%, color-mix(in oklch, var(--primary) 25%, transparent) 0%, transparent 50%), radial-gradient(at 100% 0%, color-mix(in oklch, var(--accent) 20%, transparent) 0%, transparent 50%), radial-gradient(at 50% 100%, color-mix(in oklch, var(--secondary) 18%, transparent) 0%, transparent 50%)",
      },
    },
  ],
  component: [
    {
      id: "solid",
      cssVars: { "radius-button": "var(--radius)", "radius-card": "var(--radius)", "radius-input": "var(--radius)" },
    },
    {
      id: "outline",
      cssVars: { "radius-button": "var(--radius)", "radius-card": "var(--radius)", "radius-input": "var(--radius)" },
    },
    {
      id: "pill",
      cssVars: { "radius-button": "9999px", "radius-card": "var(--radius)", "radius-input": "9999px" },
    },
    {
      id: "sharp",
      cssVars: { "radius-button": "0", "radius-card": "0", "radius-input": "0" },
    },
    {
      id: "embossed",
      cssVars: {
        "radius-button": "var(--radius)",
        "radius-card": "var(--radius)",
        "radius-input": "var(--radius)",
      },
    },
  ],
};
