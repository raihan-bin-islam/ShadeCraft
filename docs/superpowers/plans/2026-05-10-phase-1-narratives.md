# Phase 1 — Narratives Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note:** This plan is the FIRST plan in the project to introduce automated tests. Tests are scoped narrowly per `CLAUDE.md` — only for pure utility functions in `src/lib/theme-kit/`. Verification is also via TypeScript type-checking (`npx tsc --noEmit`), lint (`yarn lint`), and manual smoke testing in `yarn dev`.
>
> **Package manager:** This project uses **Yarn**. Use `yarn add`, `yarn lint`, `yarn dev`, `yarn build`, `yarn test`. Do NOT run `npm install` or `npm run *`.

**Goal:** Replace the current independent random-sampling palette generation in `theme.ts` with narrative-driven palette assembly, so two generated themes can have visibly different *palette structure* (where color lives, how primary/secondary/accent/background relate) — not just different hues.

**Architecture:** Add a `narrative` dimension that sits between `feel` and palette generation. Seven narrative archetypes encoded as data in `theme-narratives.ts`. A new `narrative.ts` generator picks a compatible narrative for the chosen feel (weighted by `preferredFeels`/`avoidedFeels`), then derives primary/secondary/accent/background tokens that satisfy the narrative's structural rules. The existing `generateOklchBackgrounds` is extended to honor optional lightness/chroma overrides so narratives like `dark-signature` and `colored-canvas` can actually express their background intent. Vitest is set up for the first time, scoped to pure utilities in `lib/theme-kit/` only.

**Tech Stack:** TypeScript 5, Next.js 15.3, React 19, Tailwind v4, `colorjs.io`, Jotai 2.12, **Vitest 1+** (new). Verification commands: `yarn test`, `npx tsc --noEmit`, `yarn lint`, `yarn dev`.

---

## File Structure

**Files created:**
- `vitest.config.ts` — Vitest configuration with `@/` alias matching tsconfig
- `src/lib/theme-kit/core/css-vars-builder.test.ts` — pure-utility tests for the builder we shipped in Phase 0 (the deferred test we owe)
- `src/config/theme-narratives.ts` — `Narrative` type + `NARRATIVES` array (7 archetypes)
- `src/lib/theme-kit/generators/narrative.ts` — `pickNarrative()` + `generateNarrativePalette()`
- `src/lib/theme-kit/generators/narrative.test.ts` — narrative sampling + palette assembly tests

**Files modified:**
- `package.json` — add `vitest` devDep + `test` script
- `src/types/theme-kit/theme.ts` — add optional `narrative?: string` field to `TailwindV4Theme`
- `src/lib/theme-kit/palettes/default.ts` — extend `generateOklchBackgrounds` to accept optional lightness/chroma overrides
- `src/lib/theme-kit/generators/theme.ts` — replace harmony-based palette assembly with narrative-driven sampling; populate `narrative` metadata on output
- `CLAUDE.md` — add `yarn test` to the verification list

**Acceptance:**
- `yarn test` runs and all tests pass
- `npx tsc --noEmit` passes
- `yarn lint` passes
- `yarn dev` shows themes generating, with each theme's narrative archetype meaningfully visible (compare a `monochrome-accent` theme vs a `vibrant-clash` theme — they should look structurally different, not just recolored)
- `currentTheme.narrative` is populated and visible in React DevTools / Jotai state

**Note on backwards compat:** The spec mentions migrating existing built-in themes to populate the new `narrative` field. The current `src/data/built-in-themes.ts` is mostly commented-out CSS reference (no active themes exported). No migration code is needed in this phase. If/when real built-in themes are added, the `narrative` field's optionality means they remain valid without it — populate later as needed.

---

## Task 1: Set up Vitest + write the deferred `cssVarsBuilder` test

**Why:** This phase introduces the project's first test infrastructure. Per `CLAUDE.md`, tests are scoped strictly to pure utilities in `src/lib/theme-kit/`. The `cssVarsBuilder` test is the one we owed from Phase 0 — it locks in the builder's contract before Phase 1 work depends on it.

**Files:**
- Create: `vitest.config.ts`
- Create: `src/lib/theme-kit/core/css-vars-builder.test.ts`
- Modify: `package.json` (add `vitest` devDep + `test` script)
- Modify: `CLAUDE.md` (add `yarn test` to verification list)

- [ ] **Step 1: Install Vitest as a dev dependency**

Run: `yarn add -D vitest@^1`
Expected: yarn.lock updated, vitest installed in node_modules.

- [ ] **Step 2: Add `test` script to `package.json`**

Open `package.json`. In the `"scripts"` block (currently has `dev`, `build`, `start`, `lint`), add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

The full scripts block should look like:

```json
"scripts": {
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "vitest run",
  "test:watch": "vitest"
}
```

- [ ] **Step 3: Create `vitest.config.ts`**

Create file at the project root (`vitest.config.ts`):

```typescript
import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    environment: "node",
    include: ["src/lib/theme-kit/**/*.test.ts"],
  },
});
```

The `include` glob is intentionally narrow — only test files inside `src/lib/theme-kit/` are picked up, enforcing the project's testing scope at the config level.

- [ ] **Step 4: Write the cssVarsBuilder test file**

Create `src/lib/theme-kit/core/css-vars-builder.test.ts`:

```typescript
import { describe, it, expect } from "vitest";
import { createCssVarsBuilder } from "./css-vars-builder";

describe("createCssVarsBuilder", () => {
  it("light() adds tokens unprefixed", () => {
    const vars = createCssVarsBuilder().light({ background: "white", foreground: "black" }).build();
    expect(vars).toEqual({ background: "white", foreground: "black" });
  });

  it("dark() prefixes tokens with 'dark-'", () => {
    const vars = createCssVarsBuilder().dark({ background: "black", foreground: "white" }).build();
    expect(vars).toEqual({ "dark-background": "black", "dark-foreground": "white" });
  });

  it("both() adds tokens in both light and dark forms", () => {
    const vars = createCssVarsBuilder().both({ toneId: "minimalist" }).build();
    expect(vars).toEqual({ toneId: "minimalist", "dark-toneId": "minimalist" });
  });

  it("merge() adds pre-prefixed tokens verbatim", () => {
    const vars = createCssVarsBuilder().merge({ "chart-1": "red", "dark-chart-1": "darkred" }).build();
    expect(vars).toEqual({ "chart-1": "red", "dark-chart-1": "darkred" });
  });

  it("build() returns a shallow copy (mutation does not affect builder state)", () => {
    const builder = createCssVarsBuilder().light({ background: "white" });
    const first = builder.build();
    first.background = "mutated";
    const second = builder.build();
    expect(second.background).toBe("white");
  });

  it("methods are chainable", () => {
    const vars = createCssVarsBuilder()
      .light({ a: "1" })
      .dark({ a: "2" })
      .both({ b: "3" })
      .merge({ "c-merged": "4" })
      .build();
    expect(vars).toEqual({ a: "1", "dark-a": "2", b: "3", "dark-b": "3", "c-merged": "4" });
  });
});
```

- [ ] **Step 5: Run the test**

Run: `yarn test`
Expected: 6 tests pass in `css-vars-builder.test.ts`.

If a test fails, the builder logic is wrong, not the test. Read the failure carefully — these tests assert the contract documented in `CLAUDE.md`.

- [ ] **Step 6: Update `CLAUDE.md` to mention `yarn test`**

In `CLAUDE.md`, the "Testing strategy" section currently lists three verification commands at the bottom. Replace the verification block:

```markdown
When adding UI components, hooks, store atoms, integration paths, or visual quality changes, do NOT add tests. Verification path is:

1. `npx tsc --noEmit` — type check
2. `yarn lint` — lint
3. Manual smoke testing in `yarn dev`
```

with:

```markdown
When adding UI components, hooks, store atoms, integration paths, or visual quality changes, do NOT add tests. Verification path is:

1. `yarn test` — run the pure-utility test suite (only files in `src/lib/theme-kit/**/*.test.ts`)
2. `npx tsc --noEmit` — type check
3. `yarn lint` — lint
4. Manual smoke testing in `yarn dev`
```

- [ ] **Step 7: Commit**

```bash
git add package.json yarn.lock vitest.config.ts src/lib/theme-kit/core/css-vars-builder.test.ts CLAUDE.md
git commit -m "feat: add vitest infrastructure and cssVarsBuilder test

Sets up Vitest with the @ alias matching tsconfig and a narrow include
glob (src/lib/theme-kit/**/*.test.ts) that enforces the project's
testing scope. Lands the deferred cssVarsBuilder test from Phase 0,
locking in the builder's contract (light/dark/both/merge/build) before
Phase 1 work consumes it."
```

---

## Task 2: Add `narrative?: string` to `TailwindV4Theme` type

**Why:** Phase 1's generator output needs to record which narrative archetype was used. Optional field so existing themes (without a narrative) still type-check.

**Files:**
- Modify: `src/types/theme-kit/theme.ts`

- [ ] **Step 1: Add the field**

Open `src/types/theme-kit/theme.ts`. Find the `TailwindV4Theme` interface (currently at lines 14-29). Add a `narrative?: string;` field after the existing `feel: string;` field:

```typescript
export interface TailwindV4Theme {
  name: string;
  description: string;
  feel: string;
  narrative?: string;
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
Expected: passes (no consumers of `TailwindV4Theme` need to change since the field is optional).

- [ ] **Step 3: Commit**

```bash
git add src/types/theme-kit/theme.ts
git commit -m "feat: add optional narrative field to TailwindV4Theme

Phase 1 generator output records which narrative archetype was used.
Optional so existing themes type-check unchanged."
```

---

## Task 3: Create `theme-narratives.ts` with type and 7 archetypes

**Why:** The narrative catalog is data. Per the spec (section 5), 7 archetypes cover the meaningful color stories. Each archetype declares its structural rules (chroma/lightness ranges per token, hue-relationship modes, feel coupling). The generator in Task 5 will read from this catalog.

**Files:**
- Create: `src/config/theme-narratives.ts`

- [ ] **Step 1: Create the file with the type and all 7 archetypes**

Create `src/config/theme-narratives.ts`:

```typescript
export type SecondaryMode = "neutral" | "analogous" | "complement";
export type AccentMode = "echo-primary" | "complement" | "distant";

export type Narrative = {
  id: string;
  name: string;
  description: string;
  primary: { chroma: [number, number]; lightness: [number, number] };
  secondary: { chroma: [number, number]; lightness: [number, number]; mode: SecondaryMode };
  accent: { chroma: [number, number]; lightness: [number, number]; mode: AccentMode };
  background: { chroma: [number, number]; lightness: [number, number]; saturated: boolean };
  /** Range of hue degrees added to primary hue when accent.mode === "distant". */
  accentHueOffset: [number, number];
  /** Range of hue degrees added to primary hue when secondary.mode === "analogous". */
  secondaryHueOffset: [number, number];
  preferredFeels?: string[];
  avoidedFeels?: string[];
};

export const NARRATIVES: Narrative[] = [
  {
    id: "monochrome-accent",
    name: "Monochrome + Accent",
    description: "Neutral palette with one saturated color carrying all emphasis.",
    primary: { chroma: [0.14, 0.22], lightness: [0.45, 0.65] },
    secondary: { chroma: [0.0, 0.02], lightness: [0.85, 0.95], mode: "neutral" },
    accent: { chroma: [0.0, 0.03], lightness: [0.8, 0.92], mode: "echo-primary" },
    background: { chroma: [0.0, 0.01], lightness: [0.96, 0.99], saturated: false },
    accentHueOffset: [0, 0],
    secondaryHueOffset: [0, 360],
    avoidedFeels: ["vibrant", "playful", "aurora"],
  },
  {
    id: "dark-signature",
    name: "Dark Signature",
    description: "Dark background with one bold signature color and high text contrast.",
    primary: { chroma: [0.16, 0.24], lightness: [0.55, 0.7] },
    secondary: { chroma: [0.0, 0.02], lightness: [0.4, 0.55], mode: "neutral" },
    accent: { chroma: [0.0, 0.03], lightness: [0.65, 0.8], mode: "echo-primary" },
    background: { chroma: [0.01, 0.04], lightness: [0.1, 0.2], saturated: false },
    accentHueOffset: [0, 0],
    secondaryHueOffset: [0, 360],
    preferredFeels: ["noir", "cyber", "midnight"],
    avoidedFeels: ["pastel", "frosted"],
  },
  {
    id: "dual-accent",
    name: "Dual Accent",
    description: "Two distinct saturated colors (primary + accent) with a neutral secondary bridge.",
    primary: { chroma: [0.14, 0.22], lightness: [0.45, 0.65] },
    secondary: { chroma: [0.0, 0.04], lightness: [0.7, 0.88], mode: "neutral" },
    accent: { chroma: [0.14, 0.22], lightness: [0.5, 0.65], mode: "complement" },
    background: { chroma: [0.0, 0.015], lightness: [0.95, 0.99], saturated: false },
    accentHueOffset: [150, 210],
    secondaryHueOffset: [0, 360],
    preferredFeels: ["vibrant", "jewel", "ocean"],
  },
  {
    id: "colored-canvas",
    name: "Colored Canvas",
    description: "Saturated background or chrome (sidebar/header), with a neutral content area.",
    primary: { chroma: [0.12, 0.2], lightness: [0.45, 0.6] },
    secondary: { chroma: [0.0, 0.04], lightness: [0.7, 0.88], mode: "analogous" },
    accent: { chroma: [0.1, 0.18], lightness: [0.5, 0.7], mode: "echo-primary" },
    background: { chroma: [0.06, 0.14], lightness: [0.55, 0.75], saturated: true },
    accentHueOffset: [0, 0],
    secondaryHueOffset: [-30, 30],
    preferredFeels: ["warm", "elegant", "sunset", "terracotta"],
    avoidedFeels: ["monochrome", "industrial"],
  },
  {
    id: "muted-harmony",
    name: "Muted Harmony",
    description: "Low chroma everywhere; no single color dominates. Sophisticated/editorial.",
    primary: { chroma: [0.04, 0.09], lightness: [0.4, 0.6] },
    secondary: { chroma: [0.03, 0.07], lightness: [0.55, 0.75], mode: "analogous" },
    accent: { chroma: [0.04, 0.09], lightness: [0.5, 0.7], mode: "distant" },
    background: { chroma: [0.0, 0.015], lightness: [0.94, 0.98], saturated: false },
    accentHueOffset: [60, 120],
    secondaryHueOffset: [-40, 40],
    preferredFeels: ["serene", "elegant", "vintage", "pastel"],
    avoidedFeels: ["vibrant", "cyber", "aurora"],
  },
  {
    id: "tone-on-tone",
    name: "Tone on Tone",
    description: "All tokens share one hue family. Variation comes from lightness and chroma only.",
    primary: { chroma: [0.12, 0.2], lightness: [0.45, 0.65] },
    secondary: { chroma: [0.06, 0.12], lightness: [0.65, 0.8], mode: "analogous" },
    accent: { chroma: [0.1, 0.18], lightness: [0.55, 0.7], mode: "echo-primary" },
    background: { chroma: [0.0, 0.02], lightness: [0.95, 0.99], saturated: false },
    accentHueOffset: [0, 0],
    secondaryHueOffset: [-15, 15],
    preferredFeels: ["forest", "ocean", "warm", "cool"],
  },
  {
    id: "vibrant-clash",
    name: "Vibrant Clash",
    description: "Two high-saturation colors in unexpected pairing (orange+teal, purple+lime, etc.).",
    primary: { chroma: [0.18, 0.26], lightness: [0.5, 0.65] },
    secondary: { chroma: [0.0, 0.04], lightness: [0.7, 0.88], mode: "neutral" },
    accent: { chroma: [0.18, 0.26], lightness: [0.55, 0.7], mode: "distant" },
    background: { chroma: [0.0, 0.015], lightness: [0.96, 0.99], saturated: false },
    accentHueOffset: [120, 200],
    secondaryHueOffset: [0, 360],
    preferredFeels: ["vibrant", "playful", "aurora", "cyber"],
    avoidedFeels: ["serene", "noir", "monochrome", "elegant"],
  },
];
```

- [ ] **Step 2: Verify type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 3: Commit**

```bash
git add src/config/theme-narratives.ts
git commit -m "feat: add theme-narratives catalog with 7 archetypes

Defines the Narrative type and the seven canonical color-story
archetypes from the spec: monochrome-accent, dark-signature,
dual-accent, colored-canvas, muted-harmony, tone-on-tone,
vibrant-clash. Each declares chroma/lightness ranges, hue-relationship
modes, and feel coupling preferences."
```

---

## Task 4: Implement `pickNarrative` with tests

**Why:** Sampling logic that picks a narrative compatible with the chosen feel. Filters out feels in `avoidedFeels`, weights `preferredFeels` 3x. Pure function — easy to unit test.

**Files:**
- Create: `src/lib/theme-kit/generators/narrative.ts` (initial — only `pickNarrative` for now)
- Create: `src/lib/theme-kit/generators/narrative.test.ts` (initial — only `pickNarrative` tests for now)

- [ ] **Step 1: Create `src/lib/theme-kit/generators/narrative.ts`**

```typescript
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { NARRATIVES, type Narrative } from "@/config/theme-narratives";
import { weightedChoice } from "@/lib/utils";

type Feel = (typeof THEME_FEELS_V4)[0];

/**
 * Picks a narrative archetype compatible with the chosen feel. Excludes any
 * narrative that lists this feel in `avoidedFeels`. Weights narratives that
 * list this feel in `preferredFeels` 3x more likely than baseline.
 */
export function pickNarrative(feel: Feel, narratives: Narrative[] = NARRATIVES): Narrative {
  const compatible = narratives.filter((n) => !n.avoidedFeels?.includes(feel.id));
  if (compatible.length === 0) {
    // Defensive: if every narrative excluded this feel, fall back to the full list.
    // Shouldn't happen with the curated catalog, but prevents undefined behavior.
    return narratives[0];
  }
  const weighted = compatible.map((n) => ({
    item: n,
    weight: n.preferredFeels?.includes(feel.id) ? 3 : 1,
  }));
  return weightedChoice(weighted);
}
```

- [ ] **Step 2: Create `src/lib/theme-kit/generators/narrative.test.ts`**

```typescript
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
```

- [ ] **Step 3: Run the tests**

Run: `yarn test`
Expected: all tests in `css-vars-builder.test.ts` (6) AND `narrative.test.ts` (4) pass = 10 total.

- [ ] **Step 4: Verify type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme-kit/generators/narrative.ts src/lib/theme-kit/generators/narrative.test.ts
git commit -m "feat: implement pickNarrative with feel-coupling weights

Filters narratives by avoidedFeels and weights preferredFeels 3x.
Tests cover exclusion, weight distribution (statistical), fallback
when every narrative is excluded, and integration with the real
NARRATIVES catalog."
```

---

## Task 5: Implement `generateNarrativePalette` with tests

**Why:** The core algorithmic function — given a narrative and a feel, return 4 OKLCH colors (primary, secondary, accent, background) that satisfy the narrative's structural rules. This is what makes a `monochrome-accent` theme structurally distinct from a `vibrant-clash` theme.

**Files:**
- Modify: `src/lib/theme-kit/generators/narrative.ts` (add `generateNarrativePalette`)
- Modify: `src/lib/theme-kit/generators/narrative.test.ts` (add tests)

- [ ] **Step 1: Extend `narrative.ts` with the palette generator + helpers**

Open `src/lib/theme-kit/generators/narrative.ts`. Add these imports at the top (alongside the existing imports):

```typescript
import Color from "colorjs.io";
import { randomHueFromRanges, randomInRange } from "@/lib/utils";
```

Then add these helper functions and the main exported function below `pickNarrative`:

```typescript
function clampHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

function sampleInRange(range: [number, number]): number {
  return randomInRange(range[0], range[1]);
}

/**
 * Generates a 4-color palette [primary, secondary, accent, background] that
 * satisfies the narrative's structural rules. Primary hue comes from the
 * feel's preferred hue ranges; secondary/accent hues are derived per the
 * narrative's `mode` rules (neutral, analogous, complement, echo-primary,
 * distant). Chroma and lightness are sampled within the narrative's ranges.
 */
export function generateNarrativePalette(narrative: Narrative, feel: Feel): Color[] {
  const primaryHue = randomHueFromRanges(feel.preferredHueRanges);

  const primary = new Color("oklch", [
    sampleInRange(narrative.primary.lightness),
    sampleInRange(narrative.primary.chroma),
    primaryHue,
  ]);

  const secondaryHue =
    narrative.secondary.mode === "complement"
      ? clampHue(primaryHue + 180)
      : narrative.secondary.mode === "analogous"
      ? clampHue(primaryHue + sampleInRange(narrative.secondaryHueOffset))
      : primaryHue; // "neutral" — hue irrelevant at low chroma

  const secondary = new Color("oklch", [
    sampleInRange(narrative.secondary.lightness),
    sampleInRange(narrative.secondary.chroma),
    secondaryHue,
  ]);

  const accentHue =
    narrative.accent.mode === "complement"
      ? clampHue(primaryHue + 180)
      : narrative.accent.mode === "distant"
      ? clampHue(primaryHue + sampleInRange(narrative.accentHueOffset))
      : primaryHue; // "echo-primary"

  const accent = new Color("oklch", [
    sampleInRange(narrative.accent.lightness),
    sampleInRange(narrative.accent.chroma),
    accentHue,
  ]);

  const background = new Color("oklch", [
    sampleInRange(narrative.background.lightness),
    sampleInRange(narrative.background.chroma),
    primaryHue,
  ]);

  return [primary, secondary, accent, background];
}
```

- [ ] **Step 2: Add tests for `generateNarrativePalette`**

Open `src/lib/theme-kit/generators/narrative.test.ts`. Add this import at the top alongside existing imports:

```typescript
import { generateNarrativePalette } from "./narrative";
```

Then append a new `describe` block at the bottom of the file (after the existing `describe("pickNarrative", ...)` block):

```typescript
describe("generateNarrativePalette", () => {
  it("returns exactly four colors", () => {
    const narrative = fakeNarrative({});
    const palette = generateNarrativePalette(narrative, fakeFeel("noir"));
    expect(palette).toHaveLength(4);
  });

  it("primary chroma falls inside the narrative's primary chroma range", () => {
    const narrative = fakeNarrative({
      primary: { chroma: [0.18, 0.22], lightness: [0.5, 0.5] },
    });
    for (let i = 0; i < 50; i++) {
      const [primary] = generateNarrativePalette(narrative, fakeFeel("noir"));
      const [, c] = primary.oklch;
      expect(c).toBeGreaterThanOrEqual(0.18);
      expect(c).toBeLessThanOrEqual(0.22);
    }
  });

  it("primary lightness falls inside the narrative's primary lightness range", () => {
    const narrative = fakeNarrative({
      primary: { chroma: [0.1, 0.1], lightness: [0.55, 0.6] },
    });
    for (let i = 0; i < 50; i++) {
      const [primary] = generateNarrativePalette(narrative, fakeFeel("noir"));
      const [l] = primary.oklch;
      expect(l).toBeGreaterThanOrEqual(0.55);
      expect(l).toBeLessThanOrEqual(0.6);
    }
  });

  it("secondary mode='complement' places secondary hue at primary + 180", () => {
    const narrative = fakeNarrative({
      secondary: { chroma: [0.05, 0.05], lightness: [0.5, 0.5], mode: "complement" },
    });
    const feel = { ...fakeFeel("noir"), preferredHueRanges: [[100, 100]] as [number, number][] };
    const [, secondary] = generateNarrativePalette(narrative, feel);
    const [, , h] = secondary.oklch;
    // primary hue = 100, complement = 280
    expect(Math.round(h)).toBe(280);
  });

  it("accent mode='echo-primary' uses primary hue", () => {
    const narrative = fakeNarrative({
      accent: { chroma: [0.05, 0.05], lightness: [0.5, 0.5], mode: "echo-primary" },
    });
    const feel = { ...fakeFeel("noir"), preferredHueRanges: [[200, 200]] as [number, number][] };
    const [primary, , accent] = generateNarrativePalette(narrative, feel);
    const [, , primaryH] = primary.oklch;
    const [, , accentH] = accent.oklch;
    expect(accentH).toBe(primaryH);
  });

  it("background lightness respects the narrative's range (dark bg narrative produces dark bg seed)", () => {
    const narrative = fakeNarrative({
      background: { chroma: [0.0, 0.01], lightness: [0.1, 0.15], saturated: false },
    });
    for (let i = 0; i < 20; i++) {
      const [, , , background] = generateNarrativePalette(narrative, fakeFeel("noir"));
      const [l] = background.oklch;
      expect(l).toBeGreaterThanOrEqual(0.1);
      expect(l).toBeLessThanOrEqual(0.15);
    }
  });
});
```

- [ ] **Step 3: Run tests**

Run: `yarn test`
Expected: 16 tests pass total (6 from cssVarsBuilder, 4 from pickNarrative, 6 from generateNarrativePalette).

- [ ] **Step 4: Verify type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme-kit/generators/narrative.ts src/lib/theme-kit/generators/narrative.test.ts
git commit -m "feat: implement generateNarrativePalette

Builds a 4-color OKLCH palette that satisfies narrative structural
rules: chroma/lightness sampled per token's range, hue derived per
secondary/accent mode (neutral/analogous/complement/echo-primary/
distant). Tests cover range constraints, complement hue math, and
echo-primary hue equality."
```

---

## Task 6: Extend `generateOklchBackgrounds` to accept lightness/chroma overrides

**Why:** The narrative declares `background.lightness` and `background.chroma`, but the existing `generateOklchBackgrounds` always derives near-white light-mode bgs (lightness 0.98) regardless of the seed color's lightness. Without this extension, narratives like `dark-signature` and `colored-canvas` cannot express their background intent in light mode. This change ADDS optional override support; passing no overrides preserves current behavior (Phase 0 themes generate identically).

**Files:**
- Modify: `src/lib/theme-kit/palettes/default.ts`

- [ ] **Step 1: Read the current function**

Open `src/lib/theme-kit/palettes/default.ts`. Locate `generateOklchBackgrounds` (around lines 33-70). Note its current signature:

```typescript
export function generateOklchBackgrounds(base: Color, adjustments?: Adjustments): Record<BackgroundKey, Color>
```

It builds a map of `{ background, card, muted, border, input }` colors by applying per-key `Adjustment` records (lightness, chromaRatio, maxChroma, lightnessVariance) to a base color.

- [ ] **Step 2: Add a third parameter for narrative overrides**

Replace the function signature and the start of its body. Find:

```typescript
export function generateOklchBackgrounds(base: Color, adjustments?: Adjustments): Record<BackgroundKey, Color> {
  const defaultAdjustments: Record<BackgroundKey, Adjustment> = {
    background: { lightness: 0.98, chromaRatio: 0.1, maxChroma: 0.005, lightnessVariance: 0.02 },
    card: { lightness: 0.96, chromaRatio: 0.08, maxChroma: 0.003 },
    muted: { lightness: 0.88, chromaRatio: 0.05, maxChroma: 0.01 },
    border: { lightness: 0.9, chromaRatio: 0.03, maxChroma: 0.015 },
    input: { lightness: 0.89, chromaRatio: 0.06, maxChroma: 0.012 },
  };
```

Replace with:

```typescript
export interface NarrativeBackgroundOverride {
  /** Target lightness for the main background token. Other tokens (card, muted, etc.) shift relative to this. */
  lightness?: number;
  /** Cap on background chroma. Higher values let the background be visibly tinted/saturated. */
  maxChroma?: number;
}

export function generateOklchBackgrounds(
  base: Color,
  adjustments?: Adjustments,
  override?: NarrativeBackgroundOverride
): Record<BackgroundKey, Color> {
  const bgLightness = override?.lightness ?? 0.98;
  const bgMaxChroma = override?.maxChroma ?? 0.005;

  // Other tokens shift relative to the bg lightness so the layered hierarchy is preserved
  // when the narrative pushes the bg darker (e.g. dark-signature wants bg ~ 0.15).
  const lightnessShift = bgLightness - 0.98; // negative when bg is darker than default

  const defaultAdjustments: Record<BackgroundKey, Adjustment> = {
    background: { lightness: bgLightness, chromaRatio: 0.1, maxChroma: bgMaxChroma, lightnessVariance: 0.02 },
    card: { lightness: 0.96 + lightnessShift, chromaRatio: 0.08, maxChroma: 0.003 },
    muted: { lightness: 0.88 + lightnessShift, chromaRatio: 0.05, maxChroma: 0.01 },
    border: { lightness: 0.9 + lightnessShift, chromaRatio: 0.03, maxChroma: 0.015 },
    input: { lightness: 0.89 + lightnessShift, chromaRatio: 0.06, maxChroma: 0.012 },
  };
```

The rest of the function (from `const usedAdjustments = ...` onward) is unchanged.

- [ ] **Step 3: Verify backwards compat**

The function signature gained a third optional parameter, so existing call sites (which pass only `base`) continue to work. Verify by running:

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 4: Verify lint**

Run: `yarn lint`
Expected: no new warnings.

- [ ] **Step 5: Commit**

```bash
git add src/lib/theme-kit/palettes/default.ts
git commit -m "feat: extend generateOklchBackgrounds with narrative overrides

Adds optional NarrativeBackgroundOverride parameter (lightness +
maxChroma) so narratives like dark-signature and colored-canvas can
push the background away from near-white. When overrides are absent,
behavior is identical to before. Card / muted / border / input
lightness shifts relative to the new bg so the layered hierarchy is
preserved."
```

---

## Task 7: Wire `theme.ts` to use narrative-driven sampling

**Why:** The integration step. Replace the current harmony-based palette assembly (lines 36-59 of `theme.ts`) with `pickNarrative` + `generateNarrativePalette`. Pass narrative background overrides into `generateOklchBackgrounds`. Populate the new `narrative` field on the returned theme.

**Files:**
- Modify: `src/lib/theme-kit/generators/theme.ts`

- [ ] **Step 1: Add narrative imports at the top**

In `src/lib/theme-kit/generators/theme.ts`, after the existing imports, add:

```typescript
import { generateNarrativePalette, pickNarrative } from "./narrative";
```

- [ ] **Step 2: Remove the old harmony-based sampling block**

Find lines 36-59 (currently the `harmony` random pick + `paletteDefault` + `paletteBalanced` + `randomChoice([...])` block). Delete the entire block:

```typescript
const harmony = randomChoice<ColorHarmony>([
  "complementary",
  "triadic",
  "analogous",
  "splitComplementary",
  "tetradic",
  "monochromatic",
]);

const baseColor = generateBaseOklchColor(feel);
const randomHue = randomChoice(feel.preferredHues);

const paletteDefault = generateOklchColorPalette(baseColor, harmony); // This was the main theme before
const paletteBalanced = generateBalancedTheme(randomHue); // We have now added a balanced theme palette too

const paletteBalancedOklch: Color[] = [
  paletteBalanced.primary,
  paletteBalanced.secondary,
  paletteBalanced.accent,
  paletteBalanced.background,
];

const palettes = [paletteDefault, paletteBalancedOklch];
const palette = randomChoice(palettes); // Finally here we choose between the balanced and default palette randomly
```

Replace with:

```typescript
const narrative = pickNarrative(feel);
const palette = generateNarrativePalette(narrative, feel);
```

- [ ] **Step 3: Pass narrative background override to `generateOklchBackgrounds`**

Find this line (currently around line 69):

```typescript
const lightBgs = generateOklchBackgrounds(background);
```

Replace with:

```typescript
const lightBgs = generateOklchBackgrounds(background, undefined, {
  lightness: narrative.background.lightness[1], // use upper bound so layered tokens still have room to shift down
  maxChroma: narrative.background.saturated ? narrative.background.chroma[1] : undefined,
});
```

The `darkBgs` line just below stays unchanged — dark mode is already dark; narrative-driven dark bg overrides are out of scope for Phase 1.

- [ ] **Step 4: Populate the `narrative` field on the returned theme**

Find the `return { ... }` at the bottom of `generateTailwindV4Theme` (around lines 194-209). Add `narrative: narrative.id,` after the existing `feel:` line:

```typescript
return {
  name: themeName,
  description: feel.description,
  feel: feel.name,
  narrative: narrative.id,
  tone,
  // ... rest unchanged
};
```

- [ ] **Step 5: Remove now-unused imports**

After removing the harmony block, several imports may now be unused. Check each:

```bash
grep -n "ColorHarmony\|generateBaseOklchColor\|generateOklchColorPalette\|generateBalancedTheme" src/lib/theme-kit/generators/theme.ts
```

For each name above, if it appears only in the import line (not used in the function body anymore), remove it from the imports. Specifically expect these to become unused:

- `ColorHarmony` (from `@/types/theme-kit`)
- `generateBaseOklchColor` (from `@/lib/theme-kit/palettes/default`)
- `generateOklchColorPalette` (from `@/lib/theme-kit/palettes/default`)
- `generateBalancedTheme` (from `@/lib/theme-kit/palettes/balanced`)
- Possibly `randomChoice` (still used for feel/tone/font picks — verify before removing)

Update the import statements accordingly. Lint will flag any leftover unused imports.

- [ ] **Step 6: Run all checks**

```bash
yarn test          # 16 tests should still pass (no regression)
npx tsc --noEmit   # type check
yarn lint          # lint
```

Expected: all pass. New "no narrative warnings" or similar are expected if any.

- [ ] **Step 7: Manual smoke test**

Run: `yarn dev`

In the browser:
- Generate ~10 themes
- Open React DevTools / Jotai inspector
- Confirm `currentTheme.narrative` is populated with one of the seven IDs (e.g. `"monochrome-accent"`, `"vibrant-clash"`)
- Compare two themes generated with different narratives — they should look STRUCTURALLY different (e.g., a `monochrome-accent` theme has neutral cards/secondary tokens while a `vibrant-clash` theme has two saturated colors). Not just hue differences — different palette personality.
- Toggle dark mode for several themes — dark mode still works (we did not alter darkBgs).

If themes look wrong (overly desaturated, primary missing, etc.), STOP — the narrative ranges may need tuning. Report what looks off rather than committing.

- [ ] **Step 8: Commit**

```bash
git add src/lib/theme-kit/generators/theme.ts
git commit -m "feat: drive theme palette from narrative archetypes

Replaces the random harmony + balanced palette sampling with narrative-
driven generation. Each theme now picks a narrative compatible with
its feel (weighted by preferredFeels/avoidedFeels), then derives
primary/secondary/accent/background that satisfy the narrative's
structural rules. Background overrides flow into generateOklchBackgrounds
so narratives like dark-signature and colored-canvas can express their
bg intent. Theme output now records the narrative id."
```

---

## Task 8: Final verification

**Why:** Phase 1 acceptance gate before merging. Confirms tests, type check, lint, build, and manual smoke all pass.

- [ ] **Step 1: Run the full test suite**

Run: `yarn test`
Expected: 16 tests pass, 0 failures, 0 skipped.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: passes with no output.

- [ ] **Step 3: Lint**

Run: `yarn lint`
Expected: passes (only pre-existing warnings, nothing new from Phase 1 files).

- [ ] **Step 4: Build**

Run: `yarn build`
Expected: completes successfully, all pages generated.

- [ ] **Step 5: Manual narrative diversity check (browser)**

Run: `yarn dev`. In the browser, generate at least 15 themes. For each, note:
- The `narrative` field value (visible via React DevTools or by adding a temporary log)
- Whether the visual character matches the narrative's intent

Spot-check coverage:
- At least 4 different narrative IDs appear across the 15 generations (excludes are working, but no narrative is starved)
- A `monochrome-accent` theme looks distinctly different from a `dual-accent` theme (one accent vs two)
- A `dark-signature` theme has a noticeably darker light-mode bg seed than a `monochrome-accent` theme (override is taking effect)
- A `colored-canvas` theme has a tinted (non-white) background

If any of these checks fail visually, the narrative ranges or coupling may need tuning — open a follow-up rather than blocking the merge.

Stop the dev server.

- [ ] **Step 6: Inspect git log**

Run: `git log --oneline -10`
Expected: 7 commits matching Tasks 1-7 above (Task 8 is verification, no commit), in order. Conventional prefixes: `feat:` for the new modules, `feat:` for the integration commit.

---

## Done

Phase 1 complete. Two themes with different narratives now have visibly different palette structure — not just different hues. The `theme-narratives.ts` catalog and `narrative.ts` generator are ready to be combined with Phase 2 (Stylistic Axes) and Phase 3 (Layout) for the full evolution.

Updated state:
- Vitest infrastructure live, scoped to `src/lib/theme-kit/**/*.test.ts` only.
- 16 tests passing (6 cssVarsBuilder, 10 narrative).
- 7 narrative archetypes encoded with feel coupling rules.
- `pickNarrative` + `generateNarrativePalette` shipped.
- `generateOklchBackgrounds` accepts narrative-aware overrides.
- `theme.ts` orchestrator drives palette generation through the narrative layer.
- `TailwindV4Theme.narrative` field populated.

**Backlog for Phase 2 onward:**
- Existing palette generators (`palettes/default.ts` `generateOklchColorPalette`, `palettes/balanced.ts` `generateBalancedTheme`) are no longer called by `theme.ts`. They remain in the codebase as potential strategies for narratives that benefit (per spec section 5.4) but are currently dormant. Decide in Phase 2 whether to delete them, integrate them as narrative sub-strategies, or leave for future use.
- Narrative range tuning may be needed once Phase 3 layouts give the palette more visual surface area to express through.
