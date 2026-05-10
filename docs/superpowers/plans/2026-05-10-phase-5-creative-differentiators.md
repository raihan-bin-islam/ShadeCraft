# Phase 5 — Creative Differentiators Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note:** Tests scoped to pure utilities in `src/lib/theme-kit/**/*.test.ts` only. Seedable RNG, identity templating, and DNA URL encode/decode are pure utilities — they get tests. React UI for cards / lock icons / switcher / variations panel does not.
>
> **Package manager:** Yarn only.
>
> **Shell conventions (per CLAUDE.md):** Run commands directly from project root or use `cd .claude/worktrees/<branch> && ...` for worktree work. No routine `pwd` checks. Don't include per-task branch verification in dispatch prompts. Chain non-destructive compound commands; only split chained destructive sequences (merge + worktree remove + branch delete).

**Goal:** Add the five creative differentiators that turn the generator into a design-system explorer: theme identity (every theme is a pitchable artifact with name + tagline + use-case + DNA badge), lock & shuffle (any dimension lockable, re-roll preserves locks), multi-archetype switcher (preview the same theme across multiple layouts), shareable DNA URL (encode full DNA into a permalink that reproduces the exact theme), and variations panel (4 sibling themes, each one dimension swapped).

**Architecture:** A new seedable RNG (`src/lib/theme-kit/rng.ts`) wraps `Math.random` so the same seed reliably reproduces a theme — this is the foundation for shareable DNA URLs and variations. `theme.ts` accepts a `seed` param plus optional dimension locks (narrative, axes, layout) so any subset of dimensions can be pinned during regeneration. Identity (name + tagline + designedFor + DNA badge) is templated from the chosen dimensions via lookup tables in `identity.ts` — no AI, no runtime cost. Lock state lives in a new `lockedDimensionsAtom`; the generator reads it and respects any locked dimensions. The multi-archetype switcher uses a `previewArchetypeAtom` that overrides the theme's picked archetype at render time (cosmetic, doesn't mutate the underlying theme). Shareable DNA URLs encode the dimension set + seed into a base64 hash; on app load, if a hash is present it restores the theme deterministically. Variations panel re-runs the generator with the current dimensions plus one swap, using the lock-respecting param shape.

**Tech Stack:** TypeScript 5, Next.js 15.3, React 19, Tailwind v4, Jotai 2.12, Vitest 1+. Verification: `yarn test`, `npx tsc --noEmit`, `yarn lint`, `yarn build`.

---

## File Structure

**Files created:**

```
src/lib/theme-kit/rng.ts                                  Seedable RNG + withSeed wrapper
src/lib/theme-kit/rng.test.ts                             RNG determinism tests
src/lib/theme-kit/identity.ts                             ThemeIdentity type + templated lookup tables
src/lib/theme-kit/identity.test.ts                        Identity generation tests
src/lib/theme-kit/dna.ts                                  DNA encode/decode (URL hash) + ThemeDNA type
src/lib/theme-kit/dna.test.ts                             DNA round-trip tests
src/components/molecules/theme-identity-card.tsx          Name + tagline + designedFor + DNA badge UI
src/components/molecules/dna-badge.tsx                    5 small color-coded chips
src/components/molecules/lock-icon.tsx                    Reusable lock toggle (used by 6 selectors)
src/components/molecules/archetype-switcher.tsx           Preview-as switcher in preview area
src/components/molecules/variations-panel.tsx             4 sibling-theme cards
src/components/molecules/permalink-button.tsx             Copy-DNA-URL button
src/hooks/theme-module/use-shareable-dna.ts               Read URL hash on mount, write on theme change
```

**Files modified:**

- `src/lib/utils.ts` — switch `randomChoice / randomInRange / randomHueFromRanges / weightedChoice` from `Math.random()` to `rng()`
- `src/lib/theme-kit/palettes/balanced.ts` + `default.ts` — same swap
- `src/lib/theme-kit/generators/{narrative,axes,procedural,template,sidebar-tokens,theme-name,chart-tokens}.ts` + `layout/index.ts` — replace internal `Math.random()` calls with `rng()`
- `src/types/theme-kit/theme.ts` — add `identity?: ThemeIdentity`, `seed?: number` fields
- `src/lib/theme-kit/generators/theme.ts` — accept `seed`, narrative, axes, layout overrides; wrap entire generation in `withSeed`; produce identity
- `src/store/theme.ts` — add `lockedDimensionsAtom`, `previewArchetypeAtom`
- `src/hooks/theme-module/use-theme-generator.ts` — read locks, pass to generator; add `applyDNA(dna)` method for permalink restoration
- `src/components/atoms/combobox-input.tsx` (or wherever feel/tone/font selector chrome lives) — add a `<LockIcon />` next to each
- `src/components/organisms/theme/theme-showcase.tsx` — mount `<ThemeIdentityCard />`, `<ArchetypeSwitcher />`, `<VariationsPanel />`, `<PermalinkButton />`
- `src/components/organisms/theme/layout-preview.tsx` — accept optional `archetypeOverride` to support the preview switcher
- `src/app/page.tsx` (or whichever entry component owns top-level state) — call `useShareableDNA()` so URL hash drives theme on mount

**Acceptance:**

- `yarn test` passes (35 prior + new tests for RNG / identity / DNA = ~45+)
- `npx tsc --noEmit` passes
- `yarn lint` passes
- `yarn build` passes
- `yarn dev`:
  - Each theme card shows a name + tagline + designedFor line + DNA badge (5 chips)
  - Each selector (feel/tone/font, plus narrative/axes/layout if exposed) has a clickable lock icon. Locking + shuffling preserves the locked dimension across regenerations
  - The preview area has a `Preview as: Marketing | Dashboard | Workspace | Auth | ...` switcher; switching renders the SAME theme on a different archetype without changing `currentTheme.layout`
  - A `Copy permalink` button copies a URL with `?dna=...` hash; pasting that URL into a fresh tab restores the exact theme
  - A "Variations" panel below the preview shows 4 small sibling theme cards (one dimension swapped each). Clicking a variation applies it as the new current theme

---

## Task 1: Seedable RNG infrastructure

**Why:** Permalinks and reproducible variations require deterministic generation given a seed. The current generator uses `Math.random()` directly throughout. This task introduces a centralized `rng()` function and a `withSeed(seed, fn)` wrapper, then swaps every `Math.random()` call inside the theme generation pipeline to use the centralized function. After this lands, the same seed always produces the same theme.

**Files:**
- Create: `src/lib/theme-kit/rng.ts`
- Create: `src/lib/theme-kit/rng.test.ts`
- Modify: `src/lib/utils.ts` — replace `Math.random()` in `randomChoice`, `randomInRange`, `randomHueFromRanges`, `weightedChoice`
- Modify: `src/lib/theme-kit/palettes/balanced.ts` — replace `Math.random()` in `rand` and `clampHue`-related calls
- Modify: `src/lib/theme-kit/palettes/default.ts` — replace `Math.random()` calls
- Modify: `src/lib/theme-kit/generators/{narrative,axes,procedural,template,sidebar-tokens,chart-tokens,theme-name}.ts` and `layout/index.ts` — replace any direct `Math.random()` calls

- [ ] **Step 1: Create `src/lib/theme-kit/rng.ts`**

```typescript
/**
 * Centralized random number generator used by all theme-kit utilities. Default
 * implementation delegates to Math.random for unseeded operation. Wrap a
 * generation pipeline in `withSeed(seed, fn)` to make it deterministic — every
 * call to `rng()` inside `fn` will use a Mulberry32-seeded PRNG instead.
 */
let currentRng: () => number = Math.random;

export function rng(): number {
  return currentRng();
}

/**
 * Run `fn` with a deterministic RNG seeded by `seed`. Restores the previous
 * RNG implementation after fn returns, even on throw. Synchronous only —
 * async fn would race other callers of rng().
 */
export function withSeed<T>(seed: number, fn: () => T): T {
  const previous = currentRng;
  currentRng = mulberry32(seed >>> 0);
  try {
    return fn();
  } finally {
    currentRng = previous;
  }
}

/**
 * Mulberry32: a simple, fast 32-bit PRNG. Identical seed => identical output
 * sequence. Good enough for theme generation determinism (we don't need
 * cryptographic quality; we need reproducibility).
 */
function mulberry32(a: number): () => number {
  return function () {
    a = (a + 0x6d2b79f5) | 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 2: Create `src/lib/theme-kit/rng.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import { rng, withSeed } from "./rng";

describe("rng / withSeed", () => {
  it("default rng returns numbers in [0, 1)", () => {
    for (let i = 0; i < 50; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("withSeed produces deterministic output for the same seed", () => {
    const sequence1 = withSeed(42, () => Array.from({ length: 10 }, () => rng()));
    const sequence2 = withSeed(42, () => Array.from({ length: 10 }, () => rng()));
    expect(sequence1).toEqual(sequence2);
  });

  it("withSeed produces different output for different seeds", () => {
    const seq1 = withSeed(1, () => Array.from({ length: 10 }, () => rng()));
    const seq2 = withSeed(2, () => Array.from({ length: 10 }, () => rng()));
    expect(seq1).not.toEqual(seq2);
  });

  it("withSeed restores the previous rng after fn returns", () => {
    const before = rng;
    withSeed(42, () => rng());
    expect(rng).toBe(before);
  });

  it("withSeed restores the previous rng even on throw", () => {
    const before = rng;
    expect(() => withSeed(42, () => { throw new Error("boom"); })).toThrow();
    expect(rng).toBe(before);
  });

  it("nested withSeed restores correctly", () => {
    const outerSeq: number[] = [];
    const innerSeq: number[] = [];
    withSeed(1, () => {
      outerSeq.push(rng(), rng());
      withSeed(2, () => {
        innerSeq.push(rng(), rng());
      });
      outerSeq.push(rng()); // continues outer-1 sequence after inner returns
    });

    // Re-run outer-1 alone to confirm the inner withSeed didn't disturb it
    const outerAlone = withSeed(1, () => [rng(), rng(), rng()]);
    expect(outerSeq).toEqual(outerAlone);
  });
});
```

- [ ] **Step 3: Replace `Math.random()` in `src/lib/utils.ts`**

Read the current file. Find the four utilities that call `Math.random()`:

```typescript
export function randomHueFromRanges(ranges: [number, number][]): number {
  if (!ranges.length) throw new Error("No hue ranges provided");
  const [start, end] = ranges[Math.floor(Math.random() * ranges.length)];
  return start + Math.random() * (end - start);
}

export function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function weightedChoice<T>(items: WeightedItem<T>[]): T {
  const total = items.reduce((acc, item) => acc + item.weight, 0);
  const roll = Math.random() * total;
  // ...
}
```

Add the import at the top of `src/lib/utils.ts`:

```typescript
import { rng } from "@/lib/theme-kit/rng";
```

Replace EVERY `Math.random()` in those four functions with `rng()`. Don't touch anything else in utils.ts.

- [ ] **Step 4: Replace `Math.random()` in palette generators and theme-kit modules**

Run a grep to find every remaining `Math.random()` in the theme-kit directory:

```bash
grep -rn "Math.random()" src/lib/theme-kit
```

For each file found, add the import:

```typescript
import { rng } from "@/lib/theme-kit/rng";
```

Then replace every `Math.random()` with `rng()`. The files likely affected (post-Phase-4 state):

- `src/lib/theme-kit/palettes/balanced.ts`
- `src/lib/theme-kit/palettes/default.ts`
- `src/lib/theme-kit/generators/narrative.ts`
- `src/lib/theme-kit/generators/axes.ts`
- `src/lib/theme-kit/generators/template.ts`
- `src/lib/theme-kit/generators/procedural.ts`
- `src/lib/theme-kit/generators/sidebar-tokens.ts`
- `src/lib/theme-kit/generators/chart-tokens.ts`
- `src/lib/theme-kit/generators/theme-name.ts`
- `src/lib/theme-kit/generators/theme.ts`
- `src/lib/theme-kit/generators/layout/index.ts`

Skip any file that has zero `Math.random()` matches.

- [ ] **Step 5: Verify + commit**

```bash
yarn test && npx tsc --noEmit && yarn lint
git add src/lib/theme-kit/rng.ts src/lib/theme-kit/rng.test.ts src/lib/utils.ts src/lib/theme-kit
git commit -m "feat: add seedable RNG and route theme-kit utilities through it

src/lib/theme-kit/rng.ts exposes rng() (default delegates to Math.random)
and withSeed(seed, fn) (synchronously swaps in a Mulberry32 PRNG, then
restores previous rng on fn return or throw). Replaces Math.random()
calls in lib/utils helpers and every theme-kit generator/palette
module. Lays the foundation for shareable DNA URLs and reproducible
variations: same seed + same dimensions => same theme."
```

---

## Task 2: `ThemeIdentity` + `identity.ts` (templated lookup tables)

**Why:** Every theme should feel like a pitchable artifact, not random output. `identity.ts` templates a tagline and `designedFor` use-case from the chosen dimensions via lookup tables. Zero AI cost, zero runtime cost. Output: `ThemeIdentity { name, tagline, designedFor, designSystemRef? }`.

**Files:**
- Create: `src/lib/theme-kit/identity.ts`
- Create: `src/lib/theme-kit/identity.test.ts`
- Modify: `src/types/theme-kit/theme.ts` — add `identity?: ThemeIdentity` field

- [ ] **Step 1: Create `src/lib/theme-kit/identity.ts`**

```typescript
import type { Narrative } from "@/config/theme-narratives";
import type { LayoutSpec } from "@/types/theme-kit/layout";
import type { THEME_FEELS_V4 } from "@/config/theme-feels";
import type { TONES } from "@/config/theme-tones";

type Feel = (typeof THEME_FEELS_V4)[0];
type Tone = (typeof TONES)[0];

export interface ThemeIdentity {
  /** Short two-word theme name (already generated by theme-name.ts; passed in). */
  name: string;
  /** One-line description templated from feel + narrative descriptors. */
  tagline: string;
  /** Use-case suggestion, e.g. "fintech dashboards selling trust". */
  designedFor: string;
  /** Optional design-system analog, e.g. "feels like Linear meets Apple Calendar". */
  designSystemRef?: string;
}

/**
 * Tagline = "<feel descriptor> with <narrative story>".
 * Narrative story half is keyed off narrative.id; feel descriptor uses the
 * feel's own description (lowercased, trimmed of trailing periods).
 */
const NARRATIVE_STORY: Record<string, string> = {
  "monochrome-accent": "one bold accent on neutral",
  "dark-signature": "a single signature color in the dark",
  "dual-accent": "two confident accents in dialogue",
  "colored-canvas": "a saturated canvas grounding everything",
  "muted-harmony": "no single color dominating",
  "tone-on-tone": "one hue family, deeply explored",
  "vibrant-clash": "two unexpected colors at full volume",
};

/**
 * designedFor = use-case suggestion based on (narrative, layout archetype/DNA) pair.
 * Falls back to a feel-only suggestion if the pair isn't matched, or to a
 * generic suggestion if even the feel lookup misses.
 */
const USE_CASE: Record<string, string> = {
  "monochrome-accent::app-dashboard": "SaaS dashboards selling trust",
  "monochrome-accent::auth-centered": "minimal auth flows that disappear into the product",
  "monochrome-accent::editorial": "editorial reading where the writing is the brand",
  "monochrome-accent::swiss-grid": "documentation that respects the reader",
  "dark-signature::app-dashboard": "developer tools that feel like home in a dark IDE",
  "dark-signature::bento-showcase": "product showcases for night-owl creators",
  "dark-signature::auth-split": "premium signup with a bold first impression",
  "dual-accent::marketing-landing": "growth pages that convert without shouting",
  "dual-accent::auth-split": "branded onboarding for two-sided products",
  "dual-accent::bauhaus": "design tools where every block matters",
  "colored-canvas::marketing-landing": "lifestyle brands with personality",
  "colored-canvas::editorial": "magazines that own their voice",
  "colored-canvas::auth-split": "consumer auth that earns the email address",
  "muted-harmony::editorial": "long-form publications with restraint",
  "muted-harmony::app-workspace": "knowledge tools for sustained focus",
  "muted-harmony::app-settings": "settings that don't beg for attention",
  "tone-on-tone::marketing-landing": "single-product launches with clear identity",
  "tone-on-tone::bento-showcase": "portfolio sites with strong point of view",
  "vibrant-clash::marketing-landing": "creator economy products",
  "vibrant-clash::bento-showcase": "showcase pages that demand attention",
  "vibrant-clash::magazine-bento": "media brands with editorial swagger",
};

const FEEL_USE_CASE_FALLBACK: Record<string, string> = {
  noir: "products with cinematic restraint",
  cyber: "technical tools for power users",
  vibrant: "consumer products with energy",
  serene: "wellness and mindfulness products",
  elegant: "luxury and premium experiences",
  playful: "consumer apps for delight",
  industrial: "B2B tools for serious work",
  pastel: "soft consumer experiences",
  ethereal: "creative and dreamlike products",
  warm: "hospitality and community products",
  cool: "B2B SaaS with poise",
};

const GENERIC_USE_CASE = "any product with a clear point of view";

/** Trims trailing punctuation and lowercases the first letter. */
function descriptorFromFeel(feel: Feel): string {
  return feel.description.replace(/[.!?]+$/, "").replace(/^./, (c) => c.toLowerCase());
}

export interface BuildIdentityParams {
  name: string;
  feel: Feel;
  tone: Tone;
  narrative: Narrative;
  layout: LayoutSpec;
}

/**
 * Builds a ThemeIdentity from the chosen dimensions. Pure templating — no AI,
 * no runtime cost beyond a few object lookups.
 */
export function buildIdentity(params: BuildIdentityParams): ThemeIdentity {
  const { name, feel, narrative, layout } = params;
  const tagline = `${descriptorFromFeel(feel)} with ${NARRATIVE_STORY[narrative.id] ?? "a clear color story"}`;
  const designedFor =
    USE_CASE[`${narrative.id}::${layout.archetype}`] ??
    FEEL_USE_CASE_FALLBACK[feel.id] ??
    GENERIC_USE_CASE;

  return {
    name,
    tagline,
    designedFor,
  };
}
```

- [ ] **Step 2: Create `src/lib/theme-kit/identity.test.ts`**

```typescript
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
    // feel descriptor: "dark, moody, and cinematic with low-light ambiance"
    // narrative story: "a single signature color in the dark"
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
```

- [ ] **Step 3: Add `identity?: ThemeIdentity` field to `TailwindV4Theme`**

In `src/types/theme-kit/theme.ts`, add the import:

```typescript
import type { ThemeIdentity } from "@/lib/theme-kit/identity";
```

Then add `identity?: ThemeIdentity;` between `layout?:` and `tone?:`:

```typescript
export interface TailwindV4Theme {
  name: string;
  description: string;
  feel: string;
  narrative?: string;
  axes?: AxisSelection;
  layout?: LayoutSpec;
  identity?: ThemeIdentity;
  tone?: (typeof TONES)[0];
  cssVars: { light: Theme; dark: Theme };
  theme: { light: Theme; dark: Theme };
  hslVars?: Theme;
  previewColors: { primary: string; secondary: string; accent: string; lightBg: string; darkBg: string };
}
```

- [ ] **Step 4: Verify + commit**

```bash
yarn test && npx tsc --noEmit && yarn lint
git add src/lib/theme-kit/identity.ts src/lib/theme-kit/identity.test.ts src/types/theme-kit/theme.ts
git commit -m "feat: add ThemeIdentity + buildIdentity templating

ThemeIdentity holds name + tagline + designedFor + optional designSystemRef.
buildIdentity templates tagline from feel.description + narrative story
lookup, and designedFor from a (narrative, archetype) pair lookup with
feel-only fallback and a generic fallback. Pure templating, no AI cost.
Tests cover lookup hits, feel fallback, and generic fallback. Adds the
optional field to TailwindV4Theme."
```

---

## Task 3: Wire `seed`, dimension overrides, and identity into `theme.ts`

**Why:** The generator needs to (a) accept and use a seed via `withSeed`, (b) accept narrative / axes / layout overrides so locks work for those dimensions, and (c) call `buildIdentity` to produce the identity field on output.

**Files:**
- Modify: `src/lib/theme-kit/generators/theme.ts`
- Modify: `src/types/theme-kit/theme.ts` — add `seed?: number` field

- [ ] **Step 1: Read `theme.ts` to map current state**

Currently (post-Phase 4) the file has:
- `GenerateThemeParams { feel?, tone?, font?, mode? }`
- `generateTailwindV4Theme(params?)` — samples feel/tone/font (if not provided), then narrative, axes, layout
- Returns the assembled theme

- [ ] **Step 2: Extend `GenerateThemeParams` with new optional fields**

Add imports at the top of `theme.ts`:

```typescript
import { withSeed } from "@/lib/theme-kit/rng";
import { buildIdentity } from "@/lib/theme-kit/identity";
import type { Narrative } from "@/config/theme-narratives";
import type { AxisSelection } from "@/config/theme-axes";
import type { LayoutSpec } from "@/types/theme-kit/layout";
```

(Skip any of these that are already imported.)

Extend `GenerateThemeParams`:

```typescript
type GenerateThemeParams = {
  feel?: (typeof THEME_FEELS_V4)[0];
  tone?: (typeof TONES)[0];
  font?: (typeof TONES)[0]["fonts"][0];
  mode?: LayoutMode;
  /** Lock the chosen narrative (skips pickNarrative). */
  narrative?: Narrative;
  /** Lock the chosen axes (skips sampleAxes). */
  axes?: AxisSelection;
  /** Lock the chosen layout spec (skips generateLayout). */
  layout?: LayoutSpec;
  /** Seed for deterministic generation. If omitted, a fresh seed is sampled. */
  seed?: number;
};
```

- [ ] **Step 3: Wrap the generation body in `withSeed` + use overrides + build identity**

Refactor the body of `generateTailwindV4Theme`. The new shape:

```typescript
export function generateTailwindV4Theme(params?: GenerateThemeParams): TailwindV4Theme {
  const seed = params?.seed ?? Math.floor(Math.random() * 0xffffffff);

  return withSeed(seed, () => {
    const feel = params?.feel ?? randomChoice(THEME_FEELS_V4);
    const tone = params?.tone ?? randomChoice(TONES);
    const font = params?.font ?? randomChoice(tone.fonts);

    const narrative = params?.narrative ?? pickNarrative(feel);
    const palette = generateNarrativePalette(narrative, feel);
    const axes = params?.axes ?? sampleAxes({
      feelPreferences: feel.axisPreferences,
      tonePreferences: tone.axisPreferences,
    });

    // ... existing color/css-var assembly (unchanged) ...

    const layout = params?.layout ?? generateLayout({ feel, tone, narrative, axes, mode: params?.mode });
    const themeName = generateThemeName();
    const identity = buildIdentity({ name: themeName, feel, tone, narrative, layout });

    return {
      name: themeName,
      description: feel.description,
      feel: feel.name,
      narrative: narrative.id,
      axes,
      layout,
      identity,
      seed,
      tone,
      // ... rest unchanged ...
    };
  });
}
```

The key changes:
- `seed` resolved from params or sampled
- Entire body wrapped in `withSeed(seed, () => { ... })`
- `narrative`, `axes`, `layout` honor params if provided (locks)
- `identity` built and added to return
- `seed` added to return

Add `seed?: number` to `TailwindV4Theme` interface in `src/types/theme-kit/theme.ts`:

```typescript
export interface TailwindV4Theme {
  name: string;
  // ...
  identity?: ThemeIdentity;
  seed?: number;
  tone?: (typeof TONES)[0];
  // ...
}
```

- [ ] **Step 4: Update `generateTailwindV4ThemeCollection` to accept and forward seed/locks (optional but consistent)**

```typescript
export function generateTailwindV4ThemeCollection(
  count = 5,
  mode?: LayoutMode,
): TailwindV4Theme[] {
  // unchanged — collection always generates fresh themes; seed/locks are
  // for individual targeted regeneration via generateTailwindV4Theme.
}
```

(No change needed here — collections are intentionally not seeded; only individual regenerations honor seeds/locks.)

- [ ] **Step 5: Verify + commit**

```bash
yarn test && npx tsc --noEmit && yarn lint && yarn build
git add src/lib/theme-kit/generators/theme.ts src/types/theme-kit/theme.ts
git commit -m "feat: theme generator accepts seed, dimension locks, and emits identity

GenerateThemeParams gains optional seed, narrative, axes, layout fields.
seed defaults to a fresh random uint32 when absent; the entire generation
body runs under withSeed so identical params reproduce identical themes.
Provided narrative / axes / layout skip their respective sampling stages
(this is the foundation for lock & shuffle in Task 5). Output now
includes identity (built via buildIdentity) and seed (so consumers can
re-run with the exact same seed)."
```

---

## Task 4: Theme identity card UI + DNA badge

**Why:** Surfaces the identity in the UI so each generation feels like a pitchable artifact. The DNA badge is 5 small color-coded chips (one per dimension: feel / tone / narrative / axes / layout). Hovering a chip shows the actual value.

**Files:**
- Create: `src/components/molecules/dna-badge.tsx`
- Create: `src/components/molecules/theme-identity-card.tsx`
- Modify: `src/components/organisms/theme/theme-showcase.tsx` — mount `<ThemeIdentityCard />` in the controls area

- [ ] **Step 1: Create `src/components/molecules/dna-badge.tsx`**

```tsx
"use client";
import React from "react";
import type { TailwindV4Theme } from "@/types/theme-kit/theme";

interface DnaBadgeProps {
  theme: TailwindV4Theme;
  className?: string;
}

interface Chip {
  label: string;
  value: string;
  /** Tailwind class for the chip's color block. */
  colorClass: string;
}

/**
 * Five small color-coded chips representing the theme's DNA across all
 * dimensions: feel, tone, narrative, axes (single chip summarizing the four
 * axis values), and layout. Hover each chip to see its value via the title
 * attribute.
 */
export function DnaBadge({ theme, className }: DnaBadgeProps) {
  const chips: Chip[] = [
    { label: "Feel", value: theme.feel, colorClass: "bg-primary" },
    { label: "Tone", value: theme.tone?.name ?? "—", colorClass: "bg-secondary" },
    { label: "Narrative", value: theme.narrative ?? "—", colorClass: "bg-accent" },
    {
      label: "Axes",
      value: theme.axes
        ? `${theme.axes.shadow} · ${theme.axes.border} · ${theme.axes.surface} · ${theme.axes.component}`
        : "—",
      colorClass: "bg-muted-foreground",
    },
    {
      label: "Layout",
      value: theme.layout ? `${theme.layout.engine}: ${theme.layout.archetype}` : "—",
      colorClass: "bg-foreground",
    },
  ];

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`} aria-label="Theme DNA">
      {chips.map((chip) => (
        <span
          key={chip.label}
          title={`${chip.label}: ${chip.value}`}
          className={`inline-block h-3 w-3 rounded-sm ${chip.colorClass} ring-1 ring-border/50`}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/molecules/theme-identity-card.tsx`**

```tsx
"use client";
import React from "react";
import { useAtomValue } from "jotai";
import { currentThemeAtom } from "@/store/theme";
import { DnaBadge } from "./dna-badge";

interface ThemeIdentityCardProps {
  className?: string;
}

/**
 * Displays the current theme's identity: name, tagline, designedFor use case,
 * and DNA badge. If no theme is loaded or identity is missing, renders nothing.
 */
export function ThemeIdentityCard({ className }: ThemeIdentityCardProps) {
  const theme = useAtomValue(currentThemeAtom);
  if (!theme?.identity) return null;

  const { name, tagline, designedFor } = theme.identity;

  return (
    <div
      className={`flex flex-col gap-2 rounded-lg border bg-card p-4 text-card-foreground ${className ?? ""}`}
    >
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold tracking-tight">{name}</h3>
        <DnaBadge theme={theme} />
      </div>
      <p className="text-sm text-muted-foreground">{tagline}</p>
      <p className="text-xs text-muted-foreground">
        Designed for <span className="text-foreground">{designedFor}</span>
      </p>
    </div>
  );
}
```

- [ ] **Step 3: Mount `<ThemeIdentityCard />` in `theme-showcase.tsx`**

Read `src/components/organisms/theme/theme-showcase.tsx` to find the right spot. Add the import:

```tsx
import { ThemeIdentityCard } from "@/components/molecules/theme-identity-card";
```

Render `<ThemeIdentityCard className="mt-4" />` somewhere appropriate — typically near the existing controls or above the LayoutPreview, wherever fits the existing layout. Don't redesign the showcase; just add the card.

- [ ] **Step 4: Verify + commit**

```bash
yarn build && npx tsc --noEmit && yarn lint
git add src/components/molecules/dna-badge.tsx src/components/molecules/theme-identity-card.tsx src/components/organisms/theme/theme-showcase.tsx
git commit -m "feat: add ThemeIdentityCard + DnaBadge UI

ThemeIdentityCard shows name + tagline + designedFor + DNA badge for the
current theme. DnaBadge renders 5 small color-coded chips (feel / tone /
narrative / axes / layout) with hover-tooltip values. Mounted in the
showcase's controls area."
```

---

## Task 5: Lock & shuffle — `lockedDimensionsAtom` + lock icons + generator respects locks

**Why:** Users find a theme they almost-love and want to iterate on it. Lock the parts they like, shuffle to re-roll only the parts they don't.

**Files:**
- Create: `src/components/molecules/lock-icon.tsx` — reusable lock toggle
- Modify: `src/store/theme.ts` — add `lockedDimensionsAtom`
- Modify: `src/hooks/theme-module/use-theme-generator.ts` — read locks, pass current theme's locked dimensions to generator on regeneration
- Modify: wherever feel/tone/font selectors render (likely `theme-showcase.tsx` or a sub-component) — mount a `<LockIcon dimension="..." />` next to each selector

- [ ] **Step 1: Add `lockedDimensionsAtom` to `src/store/theme.ts`**

Add this near the other atoms:

```typescript
export type LockableDimension = "feel" | "tone" | "font" | "narrative" | "axes" | "layout";

export const lockedDimensionsAtom = atom<Record<LockableDimension, boolean>>({
  feel: false,
  tone: false,
  font: false,
  narrative: false,
  axes: false,
  layout: false,
});
```

- [ ] **Step 2: Create `src/components/molecules/lock-icon.tsx`**

```tsx
"use client";
import React from "react";
import { useAtom } from "jotai";
import { Lock, Unlock } from "lucide-react";
import { lockedDimensionsAtom, type LockableDimension } from "@/store/theme";

interface LockIconProps {
  dimension: LockableDimension;
  className?: string;
}

/**
 * Toggles the lock state for a single dimension. Renders a Lock icon when
 * locked, Unlock icon when unlocked. Used next to each dimension selector
 * (feel / tone / font / narrative / axes / layout).
 */
export function LockIcon({ dimension, className }: LockIconProps) {
  const [locks, setLocks] = useAtom(lockedDimensionsAtom);
  const isLocked = locks[dimension];

  return (
    <button
      type="button"
      onClick={() => setLocks({ ...locks, [dimension]: !isLocked })}
      className={`inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground ${
        isLocked ? "text-foreground" : ""
      } ${className ?? ""}`}
      aria-label={`${isLocked ? "Unlock" : "Lock"} ${dimension}`}
      title={`${isLocked ? "Locked" : "Click to lock"} ${dimension}`}
    >
      {isLocked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
    </button>
  );
}
```

- [ ] **Step 3: Update `use-theme-generator.ts` to respect locks on regeneration**

Read `src/hooks/theme-module/use-theme-generator.ts`. Find `generateSingle`. Add a lock-aware branch:

1. Add the import:
   ```typescript
   import { lockedDimensionsAtom } from "@/store/theme";
   ```

2. Read the locks atom in the hook body:
   ```typescript
   const locks = useAtomValue(lockedDimensionsAtom);
   ```

3. In `generateSingle`, BEFORE calling `generateTailwindV4Theme`, build a params object that includes locked dimensions from the current theme:

```typescript
const lockedParams: Partial<Parameters<typeof generateTailwindV4Theme>[0]> = {};
if (currentTheme) {
  if (locks.feel) lockedParams.feel = THEME_FEELS_V4.find((f) => f.name === currentTheme.feel);
  if (locks.tone) lockedParams.tone = currentTheme.tone;
  if (locks.font && currentFont) {
    lockedParams.font = Object.values(FONT_OBJECTS).find((f) => f.className === currentFont);
  }
  if (locks.narrative && currentTheme.narrative) {
    lockedParams.narrative = NARRATIVES.find((n) => n.id === currentTheme.narrative);
  }
  if (locks.axes) lockedParams.axes = currentTheme.axes;
  if (locks.layout) lockedParams.layout = currentTheme.layout;
}
const theme = generateTailwindV4Theme({ ...params, ...lockedParams, mode: layoutMode });
```

(Add the imports for `THEME_FEELS_V4`, `NARRATIVES`, `FONT_OBJECTS` if not already imported.)

The lock-aware params take priority over the explicit params from the caller — but if both are present, lock wins (so a user-selected feel during a locked-feel state still gets ignored, which is the correct behavior).

- [ ] **Step 4: Mount `<LockIcon />` next to each selector**

Read the file hosting feel/tone/font selectors (likely `theme-showcase.tsx`). For each selector that's already there, render a `<LockIcon dimension="..." />` next to it.

Example pattern:

```tsx
<div className="flex items-center gap-2">
  <ComboboxInput .../* the existing feel selector */ />
  <LockIcon dimension="feel" />
</div>
```

Add for at least feel / tone / font. If narrative / axes / layout aren't currently exposed as user-selectable controls, skip those for now — the locks still work via the API even without UI for them (they'll just always default to unlocked).

- [ ] **Step 5: Verify + commit**

```bash
yarn build && npx tsc --noEmit && yarn lint
git add src/store/theme.ts src/components/molecules/lock-icon.tsx src/hooks/theme-module/use-theme-generator.ts <showcase-file>
git commit -m "feat: add lock & shuffle for any dimension

lockedDimensionsAtom holds boolean lock state per dimension (feel / tone /
font / narrative / axes / layout). LockIcon component toggles the state.
useThemeGenerator reads the atom and constructs lockedParams from the
current theme's values, passing them to generateTailwindV4Theme so
regeneration preserves locked dimensions and only re-rolls the rest.
LockIcons are mounted next to feel/tone/font selectors in the showcase."
```

---

## Task 6: Multi-archetype switcher + `previewArchetypeAtom`

**Why:** Users want to see how the same theme renders across different archetypes (marketing landing vs dashboard vs auth). The switcher overrides the theme's picked archetype at render time without mutating the underlying theme.

**Files:**
- Modify: `src/store/theme.ts` — add `previewArchetypeAtom`
- Create: `src/components/molecules/archetype-switcher.tsx`
- Modify: `src/components/organisms/theme/layout-preview.tsx` — accept optional `archetypeOverride` prop and re-generate spec for that archetype

- [ ] **Step 1: Add `previewArchetypeAtom` to `src/store/theme.ts`**

```typescript
/**
 * Optional override for the layout archetype shown in the preview area.
 * When set, LayoutPreview renders the current theme on the chosen archetype
 * instead of the one the generator picked. Doesn't mutate the underlying
 * theme — purely cosmetic for the preview surface.
 */
export const previewArchetypeAtom = atom<string | null>(null);
```

- [ ] **Step 2: Update `LayoutPreview` to honor `previewArchetypeAtom`**

In `src/components/organisms/theme/layout-preview.tsx`:

1. Add imports:
   ```typescript
   import { useAtomValue } from "jotai";
   import { previewArchetypeAtom, currentThemeAtom } from "@/store/theme";
   import { LAYOUT_ARCHETYPES } from "@/config/layout-archetypes";
   import { DESIGN_SYSTEM_DNAS } from "@/config/design-system-dnas";
   import { generateLayoutTemplate } from "@/lib/theme-kit/generators/layout/template";
   import { generateProceduralLayout } from "@/lib/theme-kit/generators/layout/procedural";
   import type { LayoutSpec } from "@/types/theme-kit/layout";
   ```

2. Read the override and current theme inside the component:
   ```typescript
   const previewArchetype = useAtomValue(previewArchetypeAtom);
   const theme = useAtomValue(currentThemeAtom);
   ```

3. Compute the effective spec — if `previewArchetype` is set AND it differs from the theme's `layout.archetype`, regenerate a spec for that archetype (using current theme's axes + narrative). Otherwise use `spec` from props:

   ```typescript
   const effectiveSpec: LayoutSpec | undefined = (() => {
     if (!previewArchetype || !theme?.layout || previewArchetype === spec?.archetype) {
       return spec;
     }
     // Find archetype or DNA matching the override
     const archetype = LAYOUT_ARCHETYPES.find((a) => a.id === previewArchetype);
     if (archetype && theme.axes && theme.narrative) {
       return generateLayoutTemplate({
         archetype,
         axes: theme.axes,
         narrative: { id: theme.narrative } as never, // narrative shape is referenced by ID only here
       });
     }
     const dna = DESIGN_SYSTEM_DNAS.find((d) => d.id === previewArchetype);
     if (dna && theme.axes && theme.narrative) {
       return generateProceduralLayout({
         dna,
         axes: theme.axes,
         narrative: { id: theme.narrative } as never,
       });
     }
     return spec;
   })();
   ```

   Replace the existing `spec` reference in the rest of the component with `effectiveSpec`.

   **Note:** the `as never` cast is a small sin to avoid carrying full Narrative objects through the previewer. The downstream functions in this overrride path only consume narrative.id-derived properties for variant filtering (which v1 doesn't do). If this becomes an issue in a later phase, refactor to load the full narrative from `NARRATIVES` by id.

- [ ] **Step 3: Create `src/components/molecules/archetype-switcher.tsx`**

```tsx
"use client";
import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { previewArchetypeAtom, currentThemeAtom } from "@/store/theme";
import { LAYOUT_ARCHETYPES } from "@/config/layout-archetypes";
import { DESIGN_SYSTEM_DNAS } from "@/config/design-system-dnas";

interface ArchetypeSwitcherProps {
  className?: string;
}

/**
 * Tab strip that lets the user preview the current theme on any layout
 * archetype (or DNA). Selecting one sets previewArchetypeAtom; LayoutPreview
 * re-generates the spec for the override and renders. Selecting the active
 * theme's own archetype clears the override.
 */
export function ArchetypeSwitcher({ className }: ArchetypeSwitcherProps) {
  const [override, setOverride] = useAtom(previewArchetypeAtom);
  const theme = useAtomValue(currentThemeAtom);

  if (!theme?.layout) return null;

  const themeArchetype = theme.layout.archetype;
  const allOptions = [
    ...LAYOUT_ARCHETYPES.map((a) => ({ id: a.id, label: a.name })),
    ...DESIGN_SYSTEM_DNAS.map((d) => ({ id: d.id, label: d.name })),
  ];

  return (
    <div className={`flex items-center gap-1 overflow-x-auto ${className ?? ""}`} role="tablist">
      <span className="text-xs text-muted-foreground mr-2 shrink-0">Preview as:</span>
      {allOptions.map((opt) => {
        const isActive = (override ?? themeArchetype) === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setOverride(opt.id === themeArchetype ? null : opt.id)}
            className={`shrink-0 rounded-md px-3 py-1 text-xs ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 4: Mount `<ArchetypeSwitcher />` in the showcase**

In the file hosting the LayoutPreview (likely `theme-showcase.tsx`), add the import and render the switcher just above `<LayoutPreview ...>`:

```tsx
import { ArchetypeSwitcher } from "@/components/molecules/archetype-switcher";
// ...
<ArchetypeSwitcher className="mb-2" />
<LayoutPreview spec={currentTheme?.layout} />
```

- [ ] **Step 5: Verify + commit**

```bash
yarn build && npx tsc --noEmit && yarn lint
git add src/store/theme.ts src/components/molecules/archetype-switcher.tsx src/components/organisms/theme/layout-preview.tsx <showcase-file>
git commit -m "feat: add multi-archetype preview switcher

previewArchetypeAtom optionally overrides the layout archetype shown
in the preview without mutating the underlying theme. ArchetypeSwitcher
renders a tab strip of all archetypes + DNAs with the current selection
highlighted. LayoutPreview honors the override by re-running the
appropriate engine (template or procedural) with the current theme's
axes and narrative."
```

---

## Task 7: Shareable DNA URL — encode/decode + permalink button + URL hash restoration

**Why:** Themes become assets users can share via permalink. Encoding the dimension set + seed into a base64 URL hash lets anyone with the URL reproduce the exact theme.

**Files:**
- Create: `src/lib/theme-kit/dna.ts` — `ThemeDNA` type + `encodeDNA / decodeDNA` functions
- Create: `src/lib/theme-kit/dna.test.ts` — round-trip tests
- Create: `src/components/molecules/permalink-button.tsx` — copy-to-clipboard button
- Create: `src/hooks/theme-module/use-shareable-dna.ts` — read URL hash on mount, write on theme change
- Modify: `src/hooks/theme-module/use-theme-generator.ts` — add `applyDNA(dna)` method that calls generateTailwindV4Theme with the decoded dimensions
- Modify: `src/app/page.tsx` (or whichever entry component renders the theme generator UI) — call `useShareableDNA()`

- [ ] **Step 1: Create `src/lib/theme-kit/dna.ts`**

```typescript
import type { AxisSelection } from "@/config/theme-axes";

/**
 * Encoded representation of a theme's full dimension set + seed. Encoded into
 * a URL hash, this is enough to reproduce the exact theme via the seedable
 * generator.
 */
export interface ThemeDNA {
  feel: string;
  tone: string;
  font: string;
  narrative?: string;
  axes?: AxisSelection;
  layoutArchetype?: string;
  layoutEngine?: "template" | "procedural";
  seed: number;
  /** Schema version for future migrations. */
  v: number;
}

const SCHEMA_VERSION = 1;

/**
 * Encode a ThemeDNA to a URL-safe base64 string suitable for a URL hash.
 * Output is round-trippable via decodeDNA.
 */
export function encodeDNA(dna: ThemeDNA): string {
  const payload = { ...dna, v: SCHEMA_VERSION };
  const json = JSON.stringify(payload);
  // btoa works in browser; in Node tests we polyfill with Buffer
  const base64 =
    typeof btoa === "function"
      ? btoa(json)
      : Buffer.from(json, "utf-8").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * Decode a URL-safe base64 string back into a ThemeDNA. Returns null if the
 * input is malformed, empty, or has a missing/incompatible schema version.
 */
export function decodeDNA(encoded: string): ThemeDNA | null {
  if (!encoded) return null;
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf-8");
    const parsed = JSON.parse(json);
    if (typeof parsed !== "object" || parsed === null) return null;
    if (parsed.v !== SCHEMA_VERSION) return null;
    if (typeof parsed.feel !== "string" || typeof parsed.tone !== "string" || typeof parsed.seed !== "number") return null;
    return parsed as ThemeDNA;
  } catch {
    return null;
  }
}
```

- [ ] **Step 2: Create `src/lib/theme-kit/dna.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import { encodeDNA, decodeDNA, type ThemeDNA } from "./dna";

const sample: ThemeDNA = {
  feel: "noir",
  tone: "minimalist",
  font: "inter",
  narrative: "dark-signature",
  axes: { shadow: "glow", border: "accented", surface: "flat", component: "sharp" },
  layoutArchetype: "app-dashboard",
  layoutEngine: "template",
  seed: 0xdeadbeef,
  v: 1,
};

describe("encodeDNA / decodeDNA", () => {
  it("round-trips a full DNA without loss", () => {
    const encoded = encodeDNA(sample);
    const decoded = decodeDNA(encoded);
    expect(decoded).toEqual(sample);
  });

  it("produces URL-safe characters only", () => {
    const encoded = encodeDNA(sample);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it("decodeDNA returns null for empty input", () => {
    expect(decodeDNA("")).toBeNull();
  });

  it("decodeDNA returns null for malformed input", () => {
    expect(decodeDNA("not-base64-!@#$")).toBeNull();
  });

  it("decodeDNA returns null when schema version mismatches", () => {
    const stale = { ...sample, v: 999 };
    const encoded =
      typeof btoa === "function"
        ? btoa(JSON.stringify(stale))
        : Buffer.from(JSON.stringify(stale), "utf-8").toString("base64");
    expect(decodeDNA(encoded.replace(/=+$/, ""))).toBeNull();
  });

  it("round-trips a minimal DNA (no optional fields)", () => {
    const minimal: ThemeDNA = { feel: "warm", tone: "elegant", font: "lora", seed: 1, v: 1 };
    expect(decodeDNA(encodeDNA(minimal))).toEqual(minimal);
  });
});
```

- [ ] **Step 3: Add `applyDNA(dna)` to `use-theme-generator.ts`**

In the hook, add a method that takes a `ThemeDNA`, resolves it back to a full set of params, and calls `generateTailwindV4Theme`:

```typescript
import { type ThemeDNA } from "@/lib/theme-kit/dna";
// ...
const applyDNA = useCallback(
  (dna: ThemeDNA) => {
    const feel = THEME_FEELS_V4.find((f) => f.id === dna.feel);
    const tone = TONES.find((t) => t.id === dna.tone);
    const font = Object.values(FONT_OBJECTS).find((f) => f.className === dna.font);
    const narrative = dna.narrative ? NARRATIVES.find((n) => n.id === dna.narrative) : undefined;
    const theme = generateTailwindV4Theme({
      feel,
      tone,
      font,
      narrative,
      axes: dna.axes,
      seed: dna.seed,
      mode: dna.layoutEngine,
    });
    setCurrentTheme(theme);
  },
  [setCurrentTheme]
);

// Add applyDNA to the returned object
return {
  // ... existing ...
  applyDNA,
};
```

- [ ] **Step 4: Create `src/hooks/theme-module/use-shareable-dna.ts`**

```typescript
"use client";
import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { currentThemeAtom } from "@/store/theme";
import { encodeDNA, decodeDNA, type ThemeDNA } from "@/lib/theme-kit/dna";
import { useThemeGenerator } from "./use-theme-generator";

const HASH_KEY = "dna";

/**
 * Hook that wires the URL hash to theme state:
 * - On mount, if `?dna=...` is present, decode and apply it as the current theme
 * - When currentTheme changes, write its DNA to the URL hash (without page reload)
 *
 * Mount this once at the top-level page that owns the generator.
 */
export function useShareableDNA() {
  const theme = useAtomValue(currentThemeAtom);
  const { applyDNA } = useThemeGenerator();
  const restored = useRef(false);

  // Restore from URL on mount (once)
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get(HASH_KEY);
    if (!encoded) return;
    const dna = decodeDNA(encoded);
    if (dna) applyDNA(dna);
  }, [applyDNA]);

  // Sync theme to URL whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!theme || theme.seed === undefined) return;
    const dna: ThemeDNA = {
      feel: theme.feel,
      tone: theme.tone?.id ?? "",
      font: theme.cssVars.light.fontFamily ?? "",
      narrative: theme.narrative,
      axes: theme.axes,
      layoutArchetype: theme.layout?.archetype,
      layoutEngine: theme.layout?.engine,
      seed: theme.seed,
      v: 1,
    };
    const encoded = encodeDNA(dna);
    const url = new URL(window.location.href);
    url.searchParams.set(HASH_KEY, encoded);
    window.history.replaceState({}, "", url.toString());
  }, [theme]);
}
```

- [ ] **Step 5: Create `src/components/molecules/permalink-button.tsx`**

```tsx
"use client";
import React, { useState } from "react";
import { useAtomValue } from "jotai";
import { Link2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { currentThemeAtom } from "@/store/theme";

interface PermalinkButtonProps {
  className?: string;
}

/**
 * Copies the current page URL (which includes the encoded DNA hash) to the
 * clipboard. Shows a brief check-mark confirmation after a successful copy.
 */
export function PermalinkButton({ className }: PermalinkButtonProps) {
  const theme = useAtomValue(currentThemeAtom);
  const [copied, setCopied] = useState(false);

  if (!theme) return null;

  const handleCopy = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard write may fail in non-secure contexts; silently no-op
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={className}
      title="Copy permalink to this theme"
      aria-label="Copy permalink"
    >
      {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
      <span className="ml-2">{copied ? "Copied" : "Permalink"}</span>
    </Button>
  );
}
```

- [ ] **Step 6: Mount `useShareableDNA()` and `<PermalinkButton />`**

Find the top-level page or layout that renders the theme generator UI (likely `src/app/page.tsx` and/or `src/components/pages/v2/index.tsx`). In the entry component, call `useShareableDNA()` once near the top of the body (after providers are set up, since the hook reads jotai atoms).

If the entry component is a server component (Next.js App Router default), the hook can't be called there — wrap with a small `"use client"` shim:

```tsx
// In a small client component, e.g., ShareableDNAEffect.tsx
"use client";
import { useShareableDNA } from "@/hooks/theme-module/use-shareable-dna";
export function ShareableDNAEffect() {
  useShareableDNA();
  return null;
}
```

Mount `<ShareableDNAEffect />` near the top of the page.

For the button, add `<PermalinkButton />` to the showcase controls area (next to the existing controls — feel/tone/font selectors, mode toggle, etc.).

- [ ] **Step 7: Verify + commit**

```bash
yarn test && npx tsc --noEmit && yarn lint && yarn build
git add src/lib/theme-kit/dna.ts src/lib/theme-kit/dna.test.ts src/hooks/theme-module/use-shareable-dna.ts src/hooks/theme-module/use-theme-generator.ts src/components/molecules/permalink-button.tsx <entry-component> <showcase-file>
git commit -m "feat: shareable DNA URLs (encode/decode + permalink + restoration)

ThemeDNA encodes a theme's full dimension set + seed into a URL-safe
base64 string. encodeDNA / decodeDNA round-trip losslessly with schema
versioning. useShareableDNA reads the URL hash on mount (restoring the
exact theme via applyDNA) and writes the current theme's DNA to the
URL on every change. PermalinkButton copies the current URL to the
clipboard. Tests cover round-trips, URL safety, malformed input,
schema mismatch, and minimal DNA."
```

---

## Task 8: Variations panel — 4 sibling-theme cards

**Why:** Anticipates the user's natural next click — "I like this theme, but what if X?" The variations panel shows 4 small theme cards, each one dimension swapped from the current theme. Click a variation to apply it as the new current theme.

**Files:**
- Create: `src/components/molecules/variations-panel.tsx`
- Modify: `src/components/organisms/theme/theme-showcase.tsx` — mount `<VariationsPanel />` below the preview area

- [ ] **Step 1: Create `src/components/molecules/variations-panel.tsx`**

```tsx
"use client";
import React, { useMemo } from "react";
import { useAtom } from "jotai";
import { currentThemeAtom } from "@/store/theme";
import { generateTailwindV4Theme } from "@/lib/theme-kit/generators/theme";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { NARRATIVES } from "@/config/theme-narratives";
import { randomChoice } from "@/lib/utils";
import type { TailwindV4Theme } from "@/types/theme-kit/theme";

interface VariationsPanelProps {
  className?: string;
}

interface Variation {
  label: string;
  theme: TailwindV4Theme;
}

/**
 * Renders 4 sibling-theme cards. Each variation re-runs the generator with
 * the current theme's dimensions but ONE swapped (different layout, different
 * narrative, different axes, different feel). Clicking a card applies it as
 * the new current theme.
 */
export function VariationsPanel({ className }: VariationsPanelProps) {
  const [currentTheme, setCurrentTheme] = useAtom(currentThemeAtom);

  const variations = useMemo<Variation[]>(() => {
    if (!currentTheme) return [];

    const feel = THEME_FEELS_V4.find((f) => f.name === currentTheme.feel);
    const tone = currentTheme.tone;
    if (!feel || !tone) return [];

    const narrative = currentTheme.narrative ? NARRATIVES.find((n) => n.id === currentTheme.narrative) : undefined;
    const axes = currentTheme.axes;
    const layout = currentTheme.layout;

    const out: Variation[] = [];

    // Variation 1: same feel/tone/narrative/axes, NEW layout
    out.push({
      label: "Different layout",
      theme: generateTailwindV4Theme({ feel, tone, narrative, axes }),
    });

    // Variation 2: same feel/tone/axes/layout, NEW narrative
    const otherNarratives = NARRATIVES.filter((n) => n.id !== currentTheme.narrative);
    out.push({
      label: "Calmer narrative",
      theme: generateTailwindV4Theme({ feel, tone, narrative: randomChoice(otherNarratives), axes, layout }),
    });

    // Variation 3: same feel/tone/narrative/layout, NEW axes
    out.push({
      label: "Sharper components",
      theme: generateTailwindV4Theme({ feel, tone, narrative, layout }),
    });

    // Variation 4: same tone/narrative/axes, NEW feel
    const otherFeels = THEME_FEELS_V4.filter((f) => f.name !== currentTheme.feel);
    out.push({
      label: "Different palette",
      theme: generateTailwindV4Theme({ feel: randomChoice(otherFeels), tone, narrative, axes, layout }),
    });

    return out;
  }, [currentTheme]);

  if (variations.length === 0) return null;

  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variations</h4>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {variations.map((variation, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentTheme(variation.theme)}
            className="group flex flex-col gap-2 rounded-lg border bg-card p-3 text-left text-card-foreground hover:border-primary"
          >
            <div className="flex h-12 gap-1.5">
              <div className="flex-1 rounded-sm" style={{ background: variation.theme.previewColors.primary }} />
              <div className="flex-1 rounded-sm" style={{ background: variation.theme.previewColors.secondary }} />
              <div className="flex-1 rounded-sm" style={{ background: variation.theme.previewColors.accent }} />
              <div className="flex-1 rounded-sm" style={{ background: variation.theme.previewColors.lightBg }} />
            </div>
            <span className="text-xs font-medium">{variation.label}</span>
            <span className="truncate text-xs text-muted-foreground">{variation.theme.identity?.name ?? variation.theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Mount `<VariationsPanel />` in the showcase**

In `theme-showcase.tsx` (or wherever the LayoutPreview renders), add the import and render `<VariationsPanel />` below the preview:

```tsx
import { VariationsPanel } from "@/components/molecules/variations-panel";
// ...
<LayoutPreview spec={currentTheme?.layout} />
<VariationsPanel className="mt-6" />
```

- [ ] **Step 3: Verify + commit**

```bash
yarn build && npx tsc --noEmit && yarn lint
git add src/components/molecules/variations-panel.tsx <showcase-file>
git commit -m "feat: add variations panel with 4 sibling themes

Each variation re-runs the generator with the current theme's dimensions
but ONE swapped: different layout (same colors), calmer narrative
(same axes/layout), sharper components (new axes), different palette
(new feel). Clicking a card applies it as the current theme. Anticipates
the natural next click after a user finds an almost-loved theme."
```

---

## Task 9: Final verification

**Why:** Phase 5 acceptance gate. Confirms tests, type check, lint, build all pass and the git log tells a coherent story.

- [ ] **Step 1: Run the full test suite**

```bash
yarn test
```
Expected: ~45+ tests pass (35 from prior phases + 6 RNG + 5 identity + 6 DNA = 52, give or take).

- [ ] **Step 2: Type check + lint + build**

```bash
npx tsc --noEmit && yarn lint && yarn build
```
All must pass. Build is essential — surfaces any client/server boundary issues from the new hooks and UI components.

- [ ] **Step 3: Inspect git log**

```bash
git log --oneline -10
```
Expected: 8 implementation commits matching Tasks 1-8 (Task 9 is verification, no commit). Conventional prefixes throughout.

---

## Done

Phase 5 complete. The generator is now a design-system explorer:

- Every theme has a pitchable identity (name + tagline + designedFor + DNA badge)
- Any dimension is lockable; shuffle re-rolls only the unlocked dimensions
- The same theme can be previewed across multiple layout archetypes via a switcher
- A permalink encodes the full theme DNA into a URL hash; pasting the URL reproduces the exact theme
- A variations panel surfaces 4 sibling themes (one dimension swapped each); clicking applies a variation

**Updated state:**
- ~52 tests passing (35 prior + 6 RNG + 5 identity + 6 DNA)
- Seedable RNG underpins reproducible generation (mulberry32)
- ThemeIdentity + DNA badge surfaced per theme
- 6 lockable dimensions wired through the generator
- Multi-archetype switcher overrides preview without mutating theme
- Shareable DNA URLs round-trip losslessly with schema versioning
- 4 variation cards anticipate the next exploratory click

**Backlog (out of Phase 5 scope):**
- Save-to-gallery (localStorage collection of DNAs) — natural follow-up since DNA serialization is in place
- Community gallery (user-submitted DNAs) — requires backend
- Tagline templating could be enriched with more lookup combinations (currently uses ~20 entries; ~50+ would feel less repetitive)
- The `archetypeOverride` path in LayoutPreview uses an `as never` cast to avoid carrying full Narrative objects through the previewer. If a future phase needs narrative-aware variant filtering in the override path, refactor to load the full narrative from `NARRATIVES` by id.
- Identity does not currently include `designSystemRef` ("feels like Linear meets Apple Calendar"); this was scoped out for v1 to avoid the comparison-database problem. Add when curating real-world references makes sense.
