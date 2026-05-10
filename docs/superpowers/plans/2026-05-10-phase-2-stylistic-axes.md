# Phase 2 — Stylistic Axes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note:** Tests are scoped narrowly per `CLAUDE.md` — only for pure utility functions in `src/lib/theme-kit/`. The new `axes.ts` module gets unit tests for sampling logic; CSS rules in `theme-axes.css` are verified via manual smoke testing in `yarn dev`.
>
> **Package manager:** This project uses **Yarn**. Use `yarn add`, `yarn lint`, `yarn dev`, `yarn build`, `yarn test`. Do NOT run `npm install` or `npm run *`.

**Goal:** Add four stylistic axes (shadow language, border treatment, surface treatment, component personality) that sample per generation alongside narrative + feel + tone, so a `flat + heavy + noise + sharp` brutalist theme is visually unmistakable from a `glow + accented + mesh + embossed` cyber theme — even when their colors happen to land nearby.

**Architecture:** Two-layer design. **Layer 1 (`cssVars` from `theme.ts`):** dynamic per-theme, emits base values like `--shadow-md`, `--radius-lg`, `--border-color-mode`. **Layer 2 (`theme-axes.css`):** static stylesheet shipped once, uses `[data-shadow]`, `[data-border]`, `[data-surface]`, `[data-personality]` attribute selectors on `<html>` to apply variant-specific overrides (border widths, surface backgrounds, embossed gradients) that can't be expressed purely through CSS variables. A small effect in `providers.tsx` syncs the four data attributes to `currentTheme.axes` whenever the theme changes.

**Tech Stack:** TypeScript 5, Next.js 15.3, React 19, Tailwind v4, Jotai 2.12, Vitest 1+. Verification: `yarn test`, `npx tsc --noEmit`, `yarn lint`, `yarn build`, `yarn dev` (manual).

---

## File Structure

**Files created:**
- `src/config/theme-axes.ts` — `Axes` types + `AXES` catalog (shadow / border / surface / component variants with their CSS-var emissions)
- `src/lib/theme-kit/generators/axes.ts` — `sampleAxes()` + `getAxisCssVars()` functions
- `src/lib/theme-kit/generators/axes.test.ts` — sampling logic tests
- `src/styles/theme-axes.css` — variant-specific rules driven by `[data-*]` attribute selectors

**Files modified:**
- `src/types/theme-kit/theme.ts` — add `axes?: AxisSelection` field to `TailwindV4Theme`
- `src/config/theme-tones.ts` — add `axisPreferences` to all 9 tones
- `src/config/theme-feels.ts` — add `axisPreferences` to 8 most opinionated feels (others stay neutral)
- `src/lib/theme-kit/generators/theme.ts` — sample axes, emit base CSS vars via builder, store `axes` metadata
- `src/app/globals.css` — `@import "@/styles/theme-axes.css"`
- `src/components/atoms/providers.tsx` — effect to sync `data-shadow / data-border / data-surface / data-personality` to `<html>` when `currentTheme.axes` changes

**Acceptance:**
- `yarn test` runs and all tests pass (16 from Phase 1 + new axes tests)
- `npx tsc --noEmit` passes
- `yarn lint` passes
- `yarn build` passes
- `yarn dev` shows themes generating, with each theme's axis selection meaningfully visible:
  - A `glow` shadow theme has glowing shadows on cards/buttons
  - A `heavy` border theme has thicker borders than a `hairline` theme
  - A `mesh` surface theme has a multi-stop gradient background
  - A `pill` personality theme has fully-rounded buttons; a `sharp` theme has zero-radius buttons
- `currentTheme.axes` is populated and visible in React DevTools / Jotai state
- `<html>` has `data-shadow="..."`, `data-border="..."`, `data-surface="..."`, `data-personality="..."` attributes

---

## Task 1: Create `theme-axes.ts` catalog

**Why:** Defines the data structure (types + variant catalogs) for the four axes. Each variant declares the CSS vars it emits so `getAxisCssVars()` in Task 3 can compose them. Each variant ID also corresponds to a `data-*` attribute value in `theme-axes.css`. This task lands before the field is added to `TailwindV4Theme` (Task 2) so each commit keeps the codebase compiling.

**Files:**
- Create: `src/config/theme-axes.ts`

- [ ] **Step 1: Create the file**

Create `src/config/theme-axes.ts` with this exact content:

```typescript
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
```

A few design notes that match the rest of the system:

- All CSS-var keys are written WITHOUT the `--` prefix (matching the convention used by `cssVarsBuilder` and existing `theme.ts` token literals — the prefix is added by `generateCssVars` at export time).
- `axis-border-*` and `axis-surface-*` use the `axis-` prefix to avoid collisions with the existing `--border` (color) and `--background` (color) tokens.
- The `glassy` shadow variant emits two extra vars (`surface-blur`, `surface-alpha`) in addition to shadows. This is fine — the consumer just reads them when present.
- The `outline` and `embossed` component variants emit the same radius vars as `solid` because their distinguishing styling is in `theme-axes.css` (data-attribute targeting), not in CSS-var values.

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit`
Expected: passes — the new file is self-contained and not yet imported anywhere.

- [ ] **Step 3: Commit**

```bash
git add src/config/theme-axes.ts
git commit -m "feat: add theme-axes catalog with 4 axes and variants

Defines AxisSelection, AxisCatalog, AxisPreferences types and the
AXES constant. Shadow has 5 variants (flat/soft/elevated/glassy/
glow), border 4 (hairline/standard/heavy/accented), surface 5
(flat/gradient/noise/pattern/mesh), component personality 5 (solid/
outline/pill/sharp/embossed). Each variant declares the CSS vars
it emits."
```

---

## Task 2: Add `axes?: AxisSelection` to `TailwindV4Theme`

**Why:** Generator output records the axis values used so the UI/devtools/preview can read them, and the providers effect can mirror them onto `<html>` data attributes.

**Files:**
- Modify: `src/types/theme-kit/theme.ts`

- [ ] **Step 1: Add the import + field**

In `src/types/theme-kit/theme.ts`, add the `AxisSelection` import at the top (alongside existing imports):

```typescript
import type { AxisSelection } from "@/config/theme-axes";
```

Then find the `TailwindV4Theme` interface and add `axes?: AxisSelection;` between `narrative?:` and `tone?:`:

```typescript
export interface TailwindV4Theme {
  name: string;
  description: string;
  feel: string;
  narrative?: string;
  axes?: AxisSelection;
  tone?: (typeof TONES)[0];
  cssVars: { light: Theme; dark: Theme };
  theme: { light: Theme; dark: Theme };
  hslVars?: Theme;
  previewColors: {
    primary: string;
    secondary: string;
    accent: string;
    lightBg: string;
    darkBg: string;
  };
}
```

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit`
Expected: passes (the catalog from Task 1 already exports `AxisSelection`).

- [ ] **Step 3: Commit**

```bash
git add src/types/theme-kit/theme.ts
git commit -m "feat: add optional axes field to TailwindV4Theme

Generator output records the four axis values (shadow, border,
surface, component personality) chosen for each theme. Optional so
existing themes type-check unchanged."
```

---

## Task 3: Implement `sampleAxes` + `getAxisCssVars` with tests

**Why:** Sampling logic that picks one variant per axis using `weightedChoice`, with weights computed by multiplying feel-preference × tone-preference (defaults to 1 when missing). CSS-var assembly merges the four chosen variants' vars into one flat record.

**Files:**
- Create: `src/lib/theme-kit/generators/axes.ts`
- Create: `src/lib/theme-kit/generators/axes.test.ts`

- [ ] **Step 1: Create `src/lib/theme-kit/generators/axes.ts`**

```typescript
import {
  AXES,
  type AxisCatalog,
  type AxisPreferences,
  type AxisSelection,
  type BorderId,
  type ComponentId,
  type ShadowId,
  type SurfaceId,
} from "@/config/theme-axes";
import { weightedChoice } from "@/lib/utils";

type AxisName = keyof AxisCatalog;

interface SampleAxesParams {
  feelPreferences?: AxisPreferences;
  tonePreferences?: AxisPreferences;
}

function pickAxisVariant<Id extends string>(
  variants: { id: Id }[],
  feelWeights?: Partial<Record<Id, number>>,
  toneWeights?: Partial<Record<Id, number>>
): Id {
  const weighted = variants.map((variant) => {
    const feelWeight = feelWeights?.[variant.id] ?? 1;
    const toneWeight = toneWeights?.[variant.id] ?? 1;
    return { item: variant.id, weight: feelWeight * toneWeight };
  });
  return weightedChoice(weighted);
}

/**
 * Picks one variant per axis (shadow / border / surface / component) using
 * weighted choice. Weights come from multiplying the feel's per-axis preference
 * by the tone's per-axis preference; missing preferences default to 1 (uniform).
 */
export function sampleAxes(params: SampleAxesParams = {}): AxisSelection {
  return {
    shadow: pickAxisVariant<ShadowId>(AXES.shadow, params.feelPreferences?.shadow, params.tonePreferences?.shadow),
    border: pickAxisVariant<BorderId>(AXES.border, params.feelPreferences?.border, params.tonePreferences?.border),
    surface: pickAxisVariant<SurfaceId>(AXES.surface, params.feelPreferences?.surface, params.tonePreferences?.surface),
    component: pickAxisVariant<ComponentId>(
      AXES.component,
      params.feelPreferences?.component,
      params.tonePreferences?.component
    ),
  };
}

/**
 * Returns the flat CSS-var record for a given axis selection by merging the
 * four chosen variants' cssVars. Keys are the unprefixed token names
 * (consistent with the existing cssVarsBuilder convention).
 */
export function getAxisCssVars(selection: AxisSelection): Record<string, string> {
  const merged: Record<string, string> = {};

  const shadowVariant = AXES.shadow.find((v) => v.id === selection.shadow);
  const borderVariant = AXES.border.find((v) => v.id === selection.border);
  const surfaceVariant = AXES.surface.find((v) => v.id === selection.surface);
  const componentVariant = AXES.component.find((v) => v.id === selection.component);

  if (shadowVariant) Object.assign(merged, shadowVariant.cssVars);
  if (borderVariant) Object.assign(merged, borderVariant.cssVars);
  if (surfaceVariant) Object.assign(merged, surfaceVariant.cssVars);
  if (componentVariant) Object.assign(merged, componentVariant.cssVars);

  return merged;
}

// Re-export for convenience
export type { AxisName };
```

- [ ] **Step 2: Create `src/lib/theme-kit/generators/axes.test.ts`**

```typescript
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
    // Expected: 5/9 ≈ 56% → ~278 of 500. Tolerance 200-360.
    expect(glowCount).toBeGreaterThan(200);
    expect(glowCount).toBeLessThan(360);
  });

  it("multiplies feel and tone weights", () => {
    // Feel says 3x for sharp, tone says 3x for sharp → 9x relative to baseline
    const feelPreferences: AxisPreferences = { component: { sharp: 3 } };
    const tonePreferences: AxisPreferences = { component: { sharp: 3 } };
    let sharpCount = 0;
    const trials = 500;
    for (let i = 0; i < trials; i++) {
      if (sampleAxes({ feelPreferences, tonePreferences }).component === "sharp") sharpCount++;
    }
    // Expected: 9/(9 + 4*1) = 9/13 ≈ 69% → ~346 of 500. Tolerance 280-420.
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
```

- [ ] **Step 3: Run tests**

Run: `yarn test`
Expected: 24 tests pass total (16 from Phase 1 + 4 sampleAxes + 4 getAxisCssVars).

- [ ] **Step 4: Verify type check + lint**

Run: `npx tsc --noEmit && yarn lint`
Expected: both pass.

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme-kit/generators/axes.ts src/lib/theme-kit/generators/axes.test.ts
git commit -m "feat: implement sampleAxes and getAxisCssVars with tests

sampleAxes picks one variant per axis using weightedChoice with feel
x tone weight multiplication. getAxisCssVars merges the four chosen
variants' CSS-var maps into one flat record. Tests cover the valid-id
range, weight distribution, weight=0 exclusion, and the merged-vars
contract for each personality."
```

---

## Task 4: Extend `theme-tones.ts` with `axisPreferences` for all 9 tones

**Why:** Tones encode strong stylistic intent (Brutalist wants flat shadows + heavy borders + sharp components, Luxury wants soft shadows + hairline borders + embossed components). Each tone gets an `axisPreferences` block. Sampling reads these to bias variant selection.

**Files:**
- Modify: `src/config/theme-tones.ts`

- [ ] **Step 1: Read the current file structure**

Open `src/config/theme-tones.ts`. The file currently exports a `TONES` array with 9 entries (`minimalist`, `brutalist`, `luxury`, `playful`, `cyber`, `vintage`, `elegant`, `industrial`, `serene`). Each entry has `id`, `name`, `fonts`, `radius`.

- [ ] **Step 2: Add the import for `AxisPreferences` type**

At the top of `theme-tones.ts`, alongside the existing imports, add:

```typescript
import type { AxisPreferences } from "./theme-axes";
```

- [ ] **Step 3: Define the new shape and update each tone**

The existing entries are inferred as a literal array. Adding optional `axisPreferences` field per-entry will widen the type acceptably. Update each tone's object literal to add `axisPreferences`. Use this exact data per tone (replace the entire `TONES` array body):

```typescript
export const TONES = [
  {
    id: "minimalist",
    name: "Minimalist",
    fonts: [FONT_OBJECTS.inter, FONT_OBJECTS.ibmPlexSans, FONT_OBJECTS.beVietnamPro, FONT_OBJECTS.rubik],
    radius: "0.4rem",
    axisPreferences: {
      shadow: { flat: 4, soft: 3, elevated: 1 },
      border: { hairline: 5, standard: 2 },
      surface: { flat: 5, gradient: 1 },
      component: { solid: 4, outline: 2 },
    } as AxisPreferences,
  },
  {
    id: "brutalist",
    name: "Brutalist",
    fonts: [FONT_OBJECTS.spaceGrotesk, FONT_OBJECTS.anton, FONT_OBJECTS.bebasNeue, FONT_OBJECTS.leagueSpartan],
    radius: "0rem",
    axisPreferences: {
      shadow: { flat: 5, elevated: 2, soft: 1 },
      border: { heavy: 5, standard: 2, hairline: 0 },
      surface: { flat: 4, noise: 3, pattern: 1 },
      component: { sharp: 5, solid: 3, outline: 2 },
    } as AxisPreferences,
  },
  {
    id: "luxury",
    name: "Luxury",
    fonts: [FONT_OBJECTS.playfair, FONT_OBJECTS.cormorantGaramond, FONT_OBJECTS.merriweather, FONT_OBJECTS.lora],
    radius: "0.8rem",
    axisPreferences: {
      shadow: { soft: 4, elevated: 4, glassy: 2 },
      border: { hairline: 5, standard: 1 },
      surface: { flat: 3, gradient: 3, mesh: 2 },
      component: { embossed: 4, solid: 3, outline: 1 },
    } as AxisPreferences,
  },
  {
    id: "playful",
    name: "Playful",
    fonts: [FONT_OBJECTS.poppins, FONT_OBJECTS.inter, FONT_OBJECTS.rubik, FONT_OBJECTS.beVietnamPro],
    radius: "1rem",
    axisPreferences: {
      shadow: { soft: 4, elevated: 3, glow: 2 },
      border: { standard: 3, accented: 3 },
      surface: { gradient: 3, mesh: 3, pattern: 2 },
      component: { pill: 5, solid: 2 },
    } as AxisPreferences,
  },
  {
    id: "cyber",
    name: "Cyber",
    fonts: [FONT_OBJECTS.rajdhani, FONT_OBJECTS.rubik, FONT_OBJECTS.inter, FONT_OBJECTS.ibmPlexSans],
    radius: "0.3rem",
    axisPreferences: {
      shadow: { glow: 5, flat: 2, elevated: 1 },
      border: { accented: 4, hairline: 2 },
      surface: { mesh: 3, gradient: 3, flat: 2 },
      component: { sharp: 4, solid: 3 },
    } as AxisPreferences,
  },
  {
    id: "vintage",
    name: "Vintage",
    fonts: [FONT_OBJECTS.lora, FONT_OBJECTS.merriweather, FONT_OBJECTS.cormorantGaramond, FONT_OBJECTS.publicSans],
    radius: "0.6rem",
    axisPreferences: {
      shadow: { soft: 4, flat: 2 },
      border: { standard: 3, hairline: 2 },
      surface: { noise: 4, pattern: 2, flat: 2 },
      component: { solid: 3, outline: 2 },
    } as AxisPreferences,
  },
  {
    id: "elegant",
    name: "Elegant",
    fonts: [FONT_OBJECTS.lora, FONT_OBJECTS.playfair, FONT_OBJECTS.merriweather, FONT_OBJECTS.cormorantGaramond],
    radius: "0.7rem",
    axisPreferences: {
      shadow: { soft: 4, elevated: 2, glassy: 2 },
      border: { hairline: 5, standard: 1 },
      surface: { gradient: 3, flat: 3 },
      component: { solid: 4, outline: 2, embossed: 2 },
    } as AxisPreferences,
  },
  {
    id: "industrial",
    name: "Industrial",
    fonts: [FONT_OBJECTS.rajdhani, FONT_OBJECTS.rubik, FONT_OBJECTS.workSans, FONT_OBJECTS.ibmPlexSans],
    radius: "0.2rem",
    axisPreferences: {
      shadow: { flat: 4, soft: 2 },
      border: { heavy: 4, standard: 2 },
      surface: { flat: 4, noise: 2, pattern: 1 },
      component: { sharp: 4, solid: 3 },
    } as AxisPreferences,
  },
  {
    id: "serene",
    name: "Serene",
    fonts: [FONT_OBJECTS.publicSans, FONT_OBJECTS.lora, FONT_OBJECTS.inter, FONT_OBJECTS.ibmPlexSans],
    radius: "0.5rem",
    axisPreferences: {
      shadow: { soft: 4, flat: 3 },
      border: { hairline: 4, standard: 2 },
      surface: { gradient: 3, flat: 3, mesh: 2 },
      component: { solid: 3, pill: 2 },
    } as AxisPreferences,
  },
];
```

- [ ] **Step 4: Verify type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/config/theme-tones.ts
git commit -m "feat: add axisPreferences to all 9 tones

Each tone now declares its preferred axis variants. Brutalist wants
flat shadows + heavy borders + sharp components; Luxury wants soft
shadows + hairline borders + embossed components; Cyber wants glow
shadows + accented borders + sharp components; etc. Used by sampleAxes
to bias variant selection."
```

---

## Task 5: Extend `theme-feels.ts` with `axisPreferences` for opinionated feels

**Why:** Some feels carry strong axis intent independent of tone — `noir` wants glow shadows and dark surfaces, `pastel` wants flat shadows and gradient surfaces. We populate preferences for the 8 most opinionated feels; the other 15 stay neutral (uniform sampling).

**Files:**
- Modify: `src/config/theme-feels.ts`

- [ ] **Step 1: Add the type import**

At the top of `src/config/theme-feels.ts`, add:

```typescript
import type { AxisPreferences } from "./theme-axes";
```

- [ ] **Step 2: Update the `ThemFeelType` to include the optional field**

Find the `ThemFeelType` declaration (currently lines 1-9) and add the optional field:

```typescript
type ThemFeelType = {
  id: string;
  name: string;
  description: string;
  lightnessRange: number[];
  chromaRange: number[];
  preferredHues: number[];
  preferredHueRanges: [number, number][];
  axisPreferences?: AxisPreferences;
};
```

- [ ] **Step 3: Add `axisPreferences` to the 8 most opinionated feels**

Locate each of the following feels in the `THEME_FEELS_V4` array and add the `axisPreferences` field as the LAST property of the object (after `preferredHueRanges`). Do NOT change any existing fields.

**Feel: `cyber`** — find the entry with `id: "cyber"` and add:
```typescript
    axisPreferences: {
      shadow: { glow: 4, elevated: 2 },
      border: { accented: 3, hairline: 2 },
      surface: { mesh: 3, gradient: 2, flat: 2 },
      component: { sharp: 3, solid: 2 },
    },
```

**Feel: `noir`** — find the entry with `id: "noir"` and add:
```typescript
    axisPreferences: {
      shadow: { glow: 4, soft: 2, flat: 1 },
      border: { accented: 3, hairline: 2 },
      surface: { flat: 3, gradient: 3, mesh: 2 },
    },
```

**Feel: `frosted`** — find the entry with `id: "frosted"` and add:
```typescript
    axisPreferences: {
      shadow: { glassy: 5, soft: 2 },
      border: { hairline: 4, standard: 2 },
      surface: { gradient: 3, mesh: 3, flat: 1 },
      component: { solid: 3, pill: 2 },
    },
```

**Feel: `pastel`** — find the entry with `id: "pastel"` and add:
```typescript
    axisPreferences: {
      shadow: { soft: 4, flat: 3, glow: 1 },
      border: { hairline: 4, standard: 2 },
      surface: { gradient: 4, mesh: 2, flat: 2 },
      component: { pill: 4, solid: 2 },
    },
```

**Feel: `vibrant`** — find the entry with `id: "vibrant"` and add:
```typescript
    axisPreferences: {
      shadow: { elevated: 3, glow: 3, soft: 1 },
      border: { accented: 3, standard: 2 },
      surface: { gradient: 3, mesh: 3, flat: 2 },
      component: { solid: 3, pill: 2 },
    },
```

**Feel: `midnight`** — find the entry with `id: "midnight"` and add:
```typescript
    axisPreferences: {
      shadow: { glow: 4, soft: 2 },
      border: { accented: 3, standard: 2 },
      surface: { flat: 3, gradient: 3, mesh: 2 },
    },
```

**Feel: `ethereal`** — find the entry with `id: "ethereal"` and add:
```typescript
    axisPreferences: {
      shadow: { glassy: 4, soft: 2 },
      border: { hairline: 3, standard: 2 },
      surface: { mesh: 4, gradient: 3, flat: 1 },
    },
```

**Feel: `aurora`** — find the entry with `id: "aurora"` and add:
```typescript
    axisPreferences: {
      shadow: { glow: 4, glassy: 2 },
      border: { accented: 3, hairline: 2 },
      surface: { mesh: 5, gradient: 2 },
    },
```

The other 15 feels (serene, warm, cool, elegant, playful, sunset, nature, monochrome, vintage, industrial, forest, ocean, jewel, terracotta) stay as-is (no `axisPreferences` field) — uniform sampling for those feels.

- [ ] **Step 4: Verify type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/config/theme-feels.ts
git commit -m "feat: add axisPreferences to 8 opinionated feels

Cyber/noir/frosted/pastel/vibrant/midnight/ethereal/aurora declare
their preferred axis variants. The other 15 feels remain neutral
(uniform sampling) to avoid over-constraining axis combinations."
```

---

## Task 6: Wire axes into `theme.ts`

**Why:** Sample axes per generation, emit base CSS vars via the builder, store the axis selection on the returned theme object so the providers effect can mirror it onto `<html>` data attributes.

**Files:**
- Modify: `src/lib/theme-kit/generators/theme.ts`

- [ ] **Step 1: Add imports**

In `src/lib/theme-kit/generators/theme.ts`, after the existing imports, add:

```typescript
import { getAxisCssVars, sampleAxes } from "./axes";
```

- [ ] **Step 2: Sample axes after picking feel + tone + narrative**

Find the line where `narrative` is picked (currently `const narrative = pickNarrative(feel);`). On the line below (before `const palette`), add:

```typescript
const axes = sampleAxes({
  feelPreferences: feel.axisPreferences,
  tonePreferences: tone.axisPreferences,
});
```

- [ ] **Step 3: Merge axis CSS vars into the builder chain**

Find the `cssVars` builder chain (currently around lines 80-153). At the end of the chain, BEFORE the final `.build()`, add a `.both(getAxisCssVars(axes))` call. The end of the chain should look like:

```typescript
    .merge(generateChartTokens(primary))
    .merge(
      generateSidebarTokens({ ... })  // unchanged
    )
    .both(getAxisCssVars(axes))
    .build();
```

Why `.both()` instead of `.merge()`: axis tokens (shadows, radii, etc.) apply identically in light and dark modes. `.both()` writes both `--shadow-md` and `--dark-shadow-md` with the same value; tooling that consumes only the dark or light section gets a complete set.

- [ ] **Step 4: Populate the `axes` field on the returned theme**

Find the `return { ... }` block. Add `axes,` after `narrative: narrative.id,`:

```typescript
return {
  name: themeName,
  description: feel.description,
  feel: feel.name,
  narrative: narrative.id,
  axes,
  tone,
  // ... rest unchanged
};
```

- [ ] **Step 5: Run tests + type check + lint**

```bash
yarn test          # 24 tests should still pass (no regression)
npx tsc --noEmit
yarn lint
```

Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add src/lib/theme-kit/generators/theme.ts
git commit -m "feat: sample axes per generation and emit axis CSS vars

theme.ts now picks shadow/border/surface/component variants alongside
narrative + feel + tone, weighted by feel x tone preferences. The
chosen variants' CSS vars (--shadow-*, --axis-border-*, --axis-surface-*,
--radius-button/card/input, --surface-blur, --surface-alpha) flow into
the cssVars builder via .both() so light/dark modes share them. Theme
output now records the AxisSelection."
```

---

## Task 7: Create `theme-axes.css` with data-attribute selectors

**Why:** Some axis effects (border width, surface backgrounds, embossed gradients, outline button styling) cannot be expressed purely via CSS vars consumed by Tailwind utilities. They require selectors targeting elements based on `<html>`'s data attributes. This static stylesheet ships once and applies surgical overrides per axis variant.

**Files:**
- Create: `src/styles/theme-axes.css`

- [ ] **Step 1: Create `src/styles/theme-axes.css`**

```css
/* =============================================================================
 * Theme Axes — variant-specific styles driven by data-* attributes on <html>.
 *
 * The four axis selections (shadow / border / surface / component) are mirrored
 * onto <html> as data-shadow / data-border / data-surface / data-personality
 * by an effect in providers.tsx. This stylesheet uses those attributes to
 * apply variants that can't be expressed purely through CSS variables (border
 * width changes, surface background images, embossed gradients, etc.).
 *
 * Base CSS vars (--shadow-md, --axis-border-width, etc.) are emitted per-theme
 * by theme.ts and consumed here via var().
 * ========================================================================== */

/* ---------- Border treatment ----------------------------------------------- */
/*
 * Tailwind's `border` class compiles to `border-width: 1px; border-style: solid;
 * border-color: <color>`. We override width and color via attribute selectors.
 */

[data-border="heavy"] *:where(.border, .border-t, .border-r, .border-b, .border-l) {
  border-width: var(--axis-border-width, 2px);
}

[data-border="accented"] *:where(.border, .border-t, .border-r, .border-b, .border-l) {
  border-width: var(--axis-border-width, 2px);
  border-color: var(--axis-border-color, var(--primary));
}

/* ---------- Surface treatment ---------------------------------------------- */
/*
 * Apply the surface image to the body. Layered above the existing background
 * color so themes that pick `flat` surface (image: none) are unaffected.
 */

body {
  background-image: var(--axis-surface-image, none);
  background-attachment: fixed;
  background-size: cover;
}

[data-surface="noise"] body,
[data-surface="pattern"] body {
  background-size: auto;
  background-repeat: repeat;
}

[data-surface="mesh"] body {
  background-size: cover;
  background-attachment: fixed;
}

/* Glassy shadow language adds a backdrop blur to cards and popovers. */
[data-shadow="glassy"] *:where(.bg-card, .bg-popover) {
  backdrop-filter: blur(var(--surface-blur, 12px));
  background-color: color-mix(
    in oklch,
    var(--card) calc(var(--surface-alpha, 0.7) * 100%),
    transparent
  );
}

/* ---------- Component personality ----------------------------------------- */
/*
 * `pill` and `sharp` are pure radius overrides (already handled via CSS vars
 * --radius-button / --radius-input emitted by theme.ts; we just re-apply them
 * to shadcn's button/input class patterns since shadcn uses literal `rounded-md`
 * etc. utilities).
 */

[data-personality="pill"] button,
[data-personality="pill"] input,
[data-personality="pill"] *[role="button"]:where(.rounded-md, .rounded-lg, .rounded) {
  border-radius: var(--radius-button, 9999px);
}

[data-personality="sharp"] button,
[data-personality="sharp"] input,
[data-personality="sharp"] *:where(.rounded-md, .rounded-lg, .rounded, .rounded-sm, .rounded-xl) {
  border-radius: var(--radius-button, 0);
}

/*
 * `outline` flips primary buttons to outline style and primary backgrounds to
 * neutral with a primary border. Targets shadcn's bg-primary class on
 * interactive elements only (excludes ::before, ::after, and bg layers on
 * non-interactive surfaces).
 */
[data-personality="outline"] button.bg-primary,
[data-personality="outline"] *[role="button"].bg-primary {
  background-color: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}

/*
 * `embossed` adds a subtle highlight gradient + inner shadow to primary
 * surfaces. The gradient uses oklch lightening for the highlight via
 * color-mix.
 */
[data-personality="embossed"] button.bg-primary,
[data-personality="embossed"] *[role="button"].bg-primary,
[data-personality="embossed"] .bg-primary {
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--primary) 88%, white 12%) 0%,
    var(--primary) 100%
  );
  box-shadow: inset 0 1px 0 color-mix(in oklch, var(--primary) 75%, white 25%),
    var(--shadow-md);
}

[data-personality="embossed"] .bg-card {
  background-image: linear-gradient(
    180deg,
    color-mix(in oklch, var(--card) 95%, white 5%) 0%,
    var(--card) 100%
  );
}
```

- [ ] **Step 2: Verify the file is well-formed CSS**

Run a quick syntax check by importing it into a temporary HTML file or relying on Step 3's `yarn build` to surface CSS parse errors. Skip ahead — we'll validate via the import in Task 8.

- [ ] **Step 3: Commit**

```bash
git add src/styles/theme-axes.css
git commit -m "feat: add theme-axes.css with data-attribute variant rules

Static stylesheet that uses [data-shadow|border|surface|personality]
attribute selectors on <html> to apply variant rules that can't be
expressed via CSS vars alone — border width changes, surface bg
images, glassy backdrop blur, outline/embossed button styling, sharp/
pill radius overrides for shadcn class patterns."
```

---

## Task 8: Import `theme-axes.css` in globals + wire data attributes via providers

**Why:** Make the static stylesheet load with the app, and sync the four data attributes on `<html>` to `currentTheme.axes` whenever the theme changes. Without this, the CSS rules from Task 7 never apply.

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/atoms/providers.tsx`

- [ ] **Step 1: Add the import to `globals.css`**

In `src/app/globals.css`, the file currently starts with:

```css
@import "tailwindcss";
@import "tw-animate-css";
```

Add a third import line right after these two:

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "../styles/theme-axes.css";
```

(Relative path from `src/app/` up to `src/styles/`.)

- [ ] **Step 2: Update `providers.tsx` to sync data attributes**

Open `src/components/atoms/providers.tsx`. It currently exports a thin `Providers` wrapper around jotai's `Provider`. Replace its content with:

```tsx
"use client";
import React, { ReactNode, useEffect } from "react";
import { Provider, useAtomValue } from "jotai";
import { currentThemeAtom } from "@/store/theme";

type Props = { children: ReactNode };

function ThemeAxesEffect() {
  const theme = useAtomValue(currentThemeAtom);

  useEffect(() => {
    const root = document.documentElement;
    if (!theme?.axes) {
      root.removeAttribute("data-shadow");
      root.removeAttribute("data-border");
      root.removeAttribute("data-surface");
      root.removeAttribute("data-personality");
      return;
    }
    root.setAttribute("data-shadow", theme.axes.shadow);
    root.setAttribute("data-border", theme.axes.border);
    root.setAttribute("data-surface", theme.axes.surface);
    root.setAttribute("data-personality", theme.axes.component);
  }, [theme?.axes]);

  return null;
}

export const Providers = (props: Props) => {
  return (
    <Provider>
      <ThemeAxesEffect />
      {props.children}
    </Provider>
  );
};
```

The `ThemeAxesEffect` is a render-null component that subscribes to `currentThemeAtom` and writes the four `data-*` attributes whenever `theme.axes` changes. Living inside the `<Provider>` ensures it has access to the jotai store.

- [ ] **Step 3: Verify type check + build**

```bash
npx tsc --noEmit
yarn build
```

Expected: both pass. The build also validates that the CSS import path resolves and the stylesheet is well-formed.

- [ ] **Step 4: Run tests**

Run: `yarn test`
Expected: 24 tests still pass (no regression).

- [ ] **Step 5: Commit**

```bash
git add src/app/globals.css src/components/atoms/providers.tsx
git commit -m "feat: load theme-axes.css and sync axes to html data attributes

globals.css imports theme-axes.css so the variant rules apply.
providers.tsx adds ThemeAxesEffect — a render-null component inside
the jotai Provider that subscribes to currentThemeAtom and writes
data-shadow / data-border / data-surface / data-personality on <html>
whenever theme.axes changes. Removes the attributes when no theme is
loaded so the page renders with default styles."
```

---

## Task 9: Final verification

**Why:** Phase 2 acceptance gate before merging. Confirms tests, type check, lint, build, and manual smoke (skipped per project preference, but the user is expected to verify in browser separately).

- [ ] **Step 1: Run the full test suite**

Run: `yarn test`
Expected: 24 tests pass total (16 from Phase 1 + 8 new from Phase 2: 4 sampleAxes + 4 getAxisCssVars).

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: passes with no output.

- [ ] **Step 3: Lint**

Run: `yarn lint`
Expected: passes (only pre-existing warnings, nothing new from Phase 2 files).

- [ ] **Step 4: Build**

Run: `yarn build`
Expected: completes successfully, all pages generated.

- [ ] **Step 5: Inspect git log**

Run: `git log --oneline -10`
Expected: 8 commits matching Tasks 1-8 above (Task 9 is verification, no commit). Conventional prefixes: `feat:` for all new modules and integration commits.

---

## Done

Phase 2 complete. Themes now have visibly distinct shadow language, border treatment, surface treatment, and component personality alongside narrative-driven palette structure. A `flat + heavy + noise + sharp` brutalist theme cannot be confused with a `glow + accented + mesh + embossed` cyber theme.

Updated state:
- 24 tests passing (16 previous + 4 sampleAxes + 4 getAxisCssVars)
- 4 axes × 4-5 variants each, sampled per generation
- 9 tones declare per-axis preferences (full coverage)
- 8 opinionated feels declare per-axis preferences (others uniform)
- `theme.axes` populated on every generated theme
- `<html>` carries `data-shadow / data-border / data-surface / data-personality` mirroring the active theme
- Static `theme-axes.css` applies variant-specific rules (border widths, surface bg images, glassy blur, embossed gradients, sharp/pill radii)

**Backlog for Phase 3 onward:**
- Verify `oklch from ...` / `color-mix(in oklch, ...)` browser support meets project's target floor; provide fallbacks for older browsers if needed.
- Consider tuning glassy `surface-alpha` and embossed gradient strength after seeing real themes.
- Some shadcn components use class names not yet covered by `theme-axes.css` (badge, alert, tooltip). Add coverage as Phase 3 layouts surface them.
- The `accented` border variant currently colors ALL borders on the page, which may overstate the effect. Consider scoping to interactive elements only (button/input/card) once Phase 3 layout primitives land.
