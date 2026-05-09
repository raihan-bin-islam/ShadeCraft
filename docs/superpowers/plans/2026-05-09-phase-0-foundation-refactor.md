# Phase 0 — Foundation Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note:** This project does NOT use automated tests. Verification is done via TypeScript type-checking (`npx tsc --noEmit`), lint (`npm run lint`), and manual smoke testing in the dev server. Do not add `.test.ts` / `.spec.ts` files or test infrastructure.

**Goal:** Prepare the theme generator codebase for Phase 1 (Narratives) by splitting `generators/theme.ts` into focused files, fixing two bugs flagged in the audit (C1 mutation, C2 regex), removing hygiene issues, and adding a `cssVarsBuilder` helper that scales as new tokens are added.

**Architecture:** Pure-refactor phase. No user-visible behavior changes (other than the two bug fixes which restore intended behavior). The 313-line `theme.ts` becomes a slim orchestrator that calls focused per-stage modules (`theme-name.ts`, `chart-tokens.ts`, `sidebar-tokens.ts`), small utilities move to existing folders (`converters/`, `core/`), and CSS var assembly uses a chainable builder so adding axes/narrative tokens later doesn't bloat the orchestrator.

**Tech Stack:** TypeScript 5, Next.js 15.3, React 19, Tailwind v4, `colorjs.io`, Jotai 2.12. Verification commands: `npx tsc --noEmit`, `npm run lint`, `npm run dev`.

---

## File Structure

**Files created:**
- `src/lib/theme-kit/core/theme-tokens.ts` — `groupThemeTokens` helper
- `src/lib/theme-kit/core/css-vars-builder.ts` — chainable CSS var builder
- `src/lib/theme-kit/generators/theme-name.ts` — `generateThemeName`
- `src/lib/theme-kit/generators/chart-tokens.ts` — `generateChartTokens`
- `src/lib/theme-kit/generators/sidebar-tokens.ts` — `generateSidebarTokens`

**Files modified:**
- `src/lib/theme-kit/generators/css.ts` — fix C1 mutation bug (shallow-copy in `generateCssVars` + `generateInlineTheme`)
- `src/lib/theme-kit/generators/theme.ts` — fix C2 regex bug, remove inline helpers (now imported), remove 3 `console.log`s, refactor to use `cssVarsBuilder`
- `src/lib/theme-kit/converters/to-rgb.ts` — add `hslToRgb`
- `src/lib/theme-kit/converters/index.ts` — re-export `hslToRgb`
- `src/lib/theme-kit/core/index.ts` — re-export new helpers
- `src/hooks/theme-module/use-theme-generator.ts` — fix `seCurrentFont` typo

**Acceptance:** `npm run dev` shows themes generating correctly with no console errors. `npx tsc --noEmit` passes. `npm run lint` passes. Generated CSS export looks correct (no missing/duplicate keys). HSL var output uses real numbers, not the literal `oklch(...)` string.

---

## Task 1: Fix C1 — Mutation bug in `generateCssVars` + `generateInlineTheme`

**Why:** `renameKey` mutates the caller's object. The caller is `theme.cssVars.light` from the Jotai store, so every CSS export permanently corrupts the store by deleting `fontName` and replacing it with `font-display`. Subsequent generations and any UI reading `theme.cssVars.light.fontName` see the mutation.

**Files:**
- Modify: `src/lib/theme-kit/generators/css.ts:31-32, 61-64`

- [ ] **Step 1: Read `src/lib/theme-kit/generators/css.ts` to confirm current state.**

Confirm `renameKey(vars, "fontName", "font-display")` is called directly on `vars` at line 32 (in `generateCssVars`) and line 64 (in `generateInlineTheme`).

- [ ] **Step 2: Replace `generateCssVars` to work on a shallow copy.**

In `src/lib/theme-kit/generators/css.ts`, replace the entire `generateCssVars` function:

```typescript
/**
 * Converts a flat key-value theme object into CSS custom properties.
 */
export function generateCssVars(vars: TailwindV4Theme["cssVars"]["light"]): string {
  const workingCopy: Record<string, string> = { ...vars };
  renameKey(workingCopy, "fontName", "font-display");

  const normalKeys = Object.keys(workingCopy).filter((k) => !filterKeys.includes(k) && k !== "radius" && !k.startsWith("font-"));
  const fontKeys = Object.keys(workingCopy).filter((k) => !filterKeys.includes(k) && k.startsWith("font-"));
  const radiusKeys = Object.keys(workingCopy).filter((k) => !filterKeys.includes(k) && k === "radius");

  const lines: string[] = [];

  // Normal keys first
  normalKeys.forEach((key) => {
    lines.push(`  --${key}: ${workingCopy[key]};`);
  });

  // Font keys second last
  fontKeys.forEach((key) => {
    lines.push(`\n  --${key}: ${workingCopy[key]};`);
  });

  // Radius keys at the bottom
  radiusKeys.forEach((key) => {
    lines.push(` --${key}: ${workingCopy[key]};`);
  });

  return lines.join("\n");
}
```

- [ ] **Step 3: Replace `generateInlineTheme` to work on a shallow copy.**

In the same file, replace the entire `generateInlineTheme` function:

```typescript
/**
 * Converts color and utility keys into `@theme inline` format.
 */
function generateInlineTheme(vars: TailwindV4Theme["cssVars"]["light"]): string {
  const workingCopy: Record<string, string> = { ...vars };
  const lines: string[] = [];

  renameKey(workingCopy, "fontName", "font-display");

  const normalKeys = Object.keys(workingCopy).filter((k) => !filterKeys.includes(k) && k !== "radius" && !k.startsWith("font-"));
  const fontKeys = Object.keys(workingCopy).filter((k) => !filterKeys.includes(k) && k.startsWith("font-"));
  const radiusKeys = Object.keys(workingCopy).filter((k) => !filterKeys.includes(k) && k === "radius");

  // Normal keys first
  for (const key of normalKeys) {
    if (key.startsWith("shadow-")) {
      lines.push(`  --${key}: var(--${key});`);
    } else if (key === "tracking-normal" || key === "spacing") {
      lines.push(`  --${key}: var(--${key});`);
    } else {
      lines.push(`  --color-${key}: var(--${key});`);
    }
  }

  // Font keys second last
  for (const key of fontKeys) {
    lines.push(`\n  --${key}: var(--${key});`);
  }

  // Radius keys at the bottom
  for (const key of radiusKeys) {
    lines.push(`\n  --radius-sm: calc(var(--radius) - 4px);`);
    lines.push(`  --radius-md: calc(var(--radius) - 2px);`);
    lines.push(`  --radius-lg: var(--radius);`);
    lines.push(`  --radius-xl: calc(var(--radius) + 4px);`);
  }

  return lines.join("\n");
}
```

- [ ] **Step 4: Run type check.**

Run: `npx tsc --noEmit`
Expected: completes with no errors.

- [ ] **Step 5: Run lint.**

Run: `npm run lint`
Expected: no new warnings or errors related to `css.ts`.

- [ ] **Step 6: Manual smoke test.**

Run: `npm run dev`
Open the app. Generate a theme. Open the theme code/export panel. Verify CSS output looks valid (has both `fontName`/`font-display` keys absent from the live theme atom — they should appear in the *generated CSS string* as `--font-display`, but `currentTheme.cssVars.light.fontName` in the Jotai store should remain intact). Generate a second theme. Verify the app does not throw and the generated CSS still looks correct.

Stop the dev server.

- [ ] **Step 7: Commit.**

```bash
git add src/lib/theme-kit/generators/css.ts
git commit -m "fix: prevent css generators from mutating theme store

generateCssVars and generateInlineTheme called renameKey directly on
the caller's object, which is currentTheme.cssVars.light from Jotai.
Each export permanently deleted the fontName key from the store. Now
both work on shallow copies."
```

---

## Task 2: Fix C2 — Broken regex in HSL conversion

**Why:** The OKLCH→HSL conversion in `theme.ts` uses `match(/oklch$$([^)]+)$$/)`. The `$$` is a literal "end-of-string anchor twice" which never matches inside a normal string. The intent was `\(...\)` to capture the parenthesized contents of `oklch(...)`. Currently the catch block silently returns the original `oklch(...)` string as the HSL value, so `hslVars` is broken in production.

**Files:**
- Modify: `src/lib/theme-kit/generators/theme.ts:213`

- [ ] **Step 1: Read `src/lib/theme-kit/generators/theme.ts` lines 208-235 to locate the regex.**

Confirm the current code reads:
```typescript
const match = value.match(/oklch$$([^)]+)$$/);
```

- [ ] **Step 2: Replace the regex with the correct pattern.**

Change the line to:
```typescript
const match = value.match(/oklch\(([^)]+)\)/);
```

- [ ] **Step 3: Run type check.**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 4: Manual smoke test.**

Run: `npm run dev`
Open the app and generate a theme. In dev tools, evaluate `document.documentElement` and inspect Jotai state via React DevTools, or add a one-off `console.log(currentTheme.hslVars)` to a component that reads the atom. Verify `hslVars` values look like `"217.2 91.2% 59.8%"` (three numeric tokens), NOT `"oklch(0.5 0.15 250)"`. After confirming, remove any debug log you added.

Stop the dev server.

- [ ] **Step 5: Commit.**

```bash
git add src/lib/theme-kit/generators/theme.ts
git commit -m "fix: correct broken oklch regex in hsl conversion

The pattern /oklch\$\$([^)]+)\$\$/ used literal end-anchors instead of
escaped parentheses, so every oklch->hsl conversion silently failed
and hslVars contained the original oklch(...) strings instead of
HSL triplets."
```

---

## Task 3: Move `hslToRgb` from `theme.ts` to `converters/to-rgb.ts`

**Why:** A 28-line color conversion utility currently lives inline at the bottom of `theme.ts`. It belongs with the other converters, and its inlineness makes the orchestrator harder to read. Pure move — no behavior change.

**Files:**
- Read first: `src/lib/theme-kit/converters/to-rgb.ts`
- Modify: `src/lib/theme-kit/converters/to-rgb.ts` (append `hslToRgb`)
- Modify: `src/lib/theme-kit/converters/index.ts` (re-export `hslToRgb`)
- Modify: `src/lib/theme-kit/generators/theme.ts:241-268` (remove inline definition), and lines using it

- [ ] **Step 1: Read `src/lib/theme-kit/converters/to-rgb.ts` to learn its style and existing exports.**

Note the existing exports and import patterns. We'll match its style.

- [ ] **Step 2: Append `hslToRgb` to `src/lib/theme-kit/converters/to-rgb.ts`.**

Add at the end of the file (after existing exports):

```typescript
/**
 * Converts an HSL color (h: 0-360, s: 0-100, l: 0-100) to 8-bit RGB.
 */
export function hslToRgb(hsl: { h: number; s: number; l: number }): { r: number; g: number; b: number } {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}
```

- [ ] **Step 3: Re-export `hslToRgb` from the converters barrel.**

Open `src/lib/theme-kit/converters/index.ts` and ensure it re-exports everything from `to-rgb.ts`. If it already does (`export * from "./to-rgb"`), no change needed. Otherwise, add:

```typescript
export { hslToRgb } from "./to-rgb";
```

- [ ] **Step 4: Remove the inline `hslToRgb` definition from `theme.ts`.**

In `src/lib/theme-kit/generators/theme.ts`, delete the entire inline `hslToRgb` arrow function (lines 241-268 in the current file — the block starting with `const hslToRgb = (hsl: { h: number; s: number; l: number }) => {` through to its closing `};`).

- [ ] **Step 5: Add an import for `hslToRgb` at the top of `theme.ts`.**

Find the existing converter import (`import { hexToOklch, oklchToCss, oklchToHsl } from "@/lib/theme-kit/converters";`) and add `hslToRgb`:

```typescript
import { hexToOklch, hslToRgb, oklchToCss, oklchToHsl } from "@/lib/theme-kit/converters";
```

- [ ] **Step 6: Run type check.**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 7: Run lint.**

Run: `npm run lint`
Expected: no warnings/errors.

- [ ] **Step 8: Manual smoke test.**

Run: `npm run dev`. Generate a theme. Verify the RGB preview colors in the theme card / showcase render correctly (no broken color swatches).

Stop the dev server.

- [ ] **Step 9: Commit.**

```bash
git add src/lib/theme-kit/converters/to-rgb.ts src/lib/theme-kit/converters/index.ts src/lib/theme-kit/generators/theme.ts
git commit -m "refactor: move hslToRgb from theme.ts to converters/to-rgb.ts"
```

---

## Task 4: Move `groupThemeTokens` from `theme.ts` to `core/theme-tokens.ts`

**Why:** Small theme-orchestration utility that currently lives at the top of `theme.ts`. Belongs with other core helpers. Pure move.

**Files:**
- Create: `src/lib/theme-kit/core/theme-tokens.ts`
- Modify: `src/lib/theme-kit/core/index.ts` (re-export)
- Modify: `src/lib/theme-kit/generators/theme.ts:26-39` (remove inline, import)

- [ ] **Step 1: Create `src/lib/theme-kit/core/theme-tokens.ts`.**

```typescript
/**
 * Splits a flat theme token object into light/dark groups. Tokens prefixed
 * with "dark-" go into the dark group with the prefix removed; everything
 * else goes into the light group.
 */
export function groupThemeTokens(theme: Record<string, string>): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  for (const [key, value] of Object.entries(theme)) {
    if (key.startsWith("dark-")) {
      dark[key.replace(/^dark-/, "")] = value;
    } else {
      light[key] = value;
    }
  }

  return { light, dark };
}
```

- [ ] **Step 2: Re-export from the core barrel.**

Open `src/lib/theme-kit/core/index.ts`. If it already uses `export * from "./..."` patterns, add:

```typescript
export * from "./theme-tokens";
```

If it uses named exports, add:

```typescript
export { groupThemeTokens } from "./theme-tokens";
```

(Match the style of the other exports in that file.)

- [ ] **Step 3: Remove the inline `groupThemeTokens` from `theme.ts`.**

In `src/lib/theme-kit/generators/theme.ts`, delete lines 26-39 (the entire `const groupThemeTokens = (theme: Record<string, string>) => { ... };` block).

- [ ] **Step 4: Add an import for `groupThemeTokens`.**

In the existing core import block at the top of `theme.ts`, add `groupThemeTokens`. The current line reads:

```typescript
import { ensureOklchContrast, getReadableForeground } from "@/lib/theme-kit/core";
```

Change to:

```typescript
import { ensureOklchContrast, getReadableForeground, groupThemeTokens } from "@/lib/theme-kit/core";
```

- [ ] **Step 5: Run type check.**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 6: Run lint.**

Run: `npm run lint`
Expected: no warnings/errors.

- [ ] **Step 7: Manual smoke test.**

Run: `npm run dev`. Generate a theme. Toggle dark mode. Verify both light and dark mode tokens apply correctly to the preview. Verify the theme code panel shows separate light and dark blocks.

Stop the dev server.

- [ ] **Step 8: Commit.**

```bash
git add src/lib/theme-kit/core/theme-tokens.ts src/lib/theme-kit/core/index.ts src/lib/theme-kit/generators/theme.ts
git commit -m "refactor: move groupThemeTokens to core/theme-tokens.ts"
```

---

## Task 5: Extract `generateThemeName` to its own file

**Why:** Theme name generation is its own concern (random adjective + noun pick). Phase 5 of the spec replaces this with a richer identity system; isolating it now makes that swap a single-file change.

**Files:**
- Create: `src/lib/theme-kit/generators/theme-name.ts`
- Modify: `src/lib/theme-kit/generators/theme.ts:84-86` (replace inline lines with a call)

- [ ] **Step 1: Create `src/lib/theme-kit/generators/theme-name.ts`.**

```typescript
import { randomChoice } from "@/lib/utils";

const COLOR_NAMES = [
  "Crimson",
  "Azure",
  "Emerald",
  "Amber",
  "Violet",
  "Coral",
  "Teal",
  "Rose",
  "Sage",
  "Indigo",
];

const SUFFIXES = ["Dream", "Mist", "Glow", "Bloom", "Zen", "Vibe", "Flow", "Spark", "Aura", "Wave"];

/**
 * Returns a randomized two-word theme name like "Crimson Dream".
 */
export function generateThemeName(): string {
  return `${randomChoice(COLOR_NAMES)} ${randomChoice(SUFFIXES)}`;
}
```

- [ ] **Step 2: Replace the inline name generation in `theme.ts`.**

Locate the current block in `src/lib/theme-kit/generators/theme.ts` (around lines 84-86):

```typescript
const colorNames = ["Crimson", "Azure", "Emerald", "Amber", "Violet", "Coral", "Teal", "Rose", "Sage", "Indigo"];
const suffixes = ["Dream", "Mist", "Glow", "Bloom", "Zen", "Vibe", "Flow", "Spark", "Aura", "Wave"];
const themeName = `${randomChoice(colorNames)} ${randomChoice(suffixes)}`;
```

Replace with:

```typescript
const themeName = generateThemeName();
```

- [ ] **Step 3: Add the import.**

At the top of `theme.ts`, add:

```typescript
import { generateThemeName } from "./theme-name";
```

- [ ] **Step 4: Run type check + lint.**

Run: `npx tsc --noEmit && npm run lint`
Expected: both pass.

- [ ] **Step 5: Manual smoke test.**

Run: `npm run dev`. Generate several themes. Verify each gets a distinct two-word name (Color + Suffix).

Stop the dev server.

- [ ] **Step 6: Commit.**

```bash
git add src/lib/theme-kit/generators/theme-name.ts src/lib/theme-kit/generators/theme.ts
git commit -m "refactor: extract generateThemeName to its own module"
```

---

## Task 6: Extract chart token generation to `chart-tokens.ts`

**Why:** Chart token assembly (light + dark with `dark-` prefixing) is a self-contained ~10-line block that pollutes `theme.ts`. Extracting it shrinks the orchestrator and lets us iterate on chart generation independently.

**Files:**
- Create: `src/lib/theme-kit/generators/chart-tokens.ts`
- Modify: `src/lib/theme-kit/generators/theme.ts:158-167` (replace block with a call)

- [ ] **Step 1: Create `src/lib/theme-kit/generators/chart-tokens.ts`.**

```typescript
import Color from "colorjs.io";
import { createOklchTint } from "@/lib/theme-kit/core/adjustment";
import { generateOklchChartColors } from "@/lib/theme-kit/palettes/default";

/**
 * Generates flat chart token map for both light and dark modes. Dark-mode
 * tokens are prefixed with "dark-" so they merge cleanly into the master
 * cssVars object.
 */
export function generateChartTokens(primary: Color): Record<string, string> {
  const lightChart = generateOklchChartColors(primary);
  const darkChart = generateOklchChartColors(createOklchTint(primary, 10));

  const tokens: Record<string, string> = { ...lightChart };
  for (const [key, value] of Object.entries(darkChart)) {
    tokens[`dark-${key}`] = value;
  }

  return tokens;
}
```

- [ ] **Step 2: Replace the inline chart block in `theme.ts`.**

Locate the current block in `theme.ts` (around lines 158-167):

```typescript
// Add chart colors (light mode)
const chartColors = generateOklchChartColors(primary);
Object.assign(cssVars, chartColors);

// Add dark mode chart colors
const darkChartColors = generateOklchChartColors(createOklchTint(primary, 10));
const darkChartVars: Record<string, string> = {};
Object.entries(darkChartColors).forEach(([key, value]) => {
  darkChartVars[`dark-${key}`] = value;
});
Object.assign(cssVars, darkChartVars);
```

Replace with:

```typescript
Object.assign(cssVars, generateChartTokens(primary));
```

- [ ] **Step 3: Add the import for `generateChartTokens`.**

At the top of `theme.ts`, add:

```typescript
import { generateChartTokens } from "./chart-tokens";
```

- [ ] **Step 4: Remove the now-unused `generateOklchChartColors` import from `theme.ts` (if it's only used in the deleted block).**

Inspect the imports at the top of `theme.ts`. If `generateOklchChartColors` is no longer referenced anywhere else in the file, remove it from the import statement on the `palettes/default` import. If it IS still referenced elsewhere, leave it.

- [ ] **Step 5: Run type check + lint.**

Run: `npx tsc --noEmit && npm run lint`
Expected: both pass. Lint may flag the unused import if step 4 was skipped — fix by removing the import.

- [ ] **Step 6: Manual smoke test.**

Run: `npm run dev`. Generate a theme. Open the showcase that includes chart components. Verify the chart renders with theme-tinted colors. Toggle dark mode. Verify chart updates to dark variant.

Stop the dev server.

- [ ] **Step 7: Commit.**

```bash
git add src/lib/theme-kit/generators/chart-tokens.ts src/lib/theme-kit/generators/theme.ts
git commit -m "refactor: extract chart token generation to chart-tokens.ts"
```

---

## Task 7: Extract sidebar token generation to `sidebar-tokens.ts`

**Why:** Sidebar token generation is the largest extractable block in `theme.ts` (~35 lines). It picks a sidebar background from candidate bases via weighted choice, derives light/dark sidebar tokens, and merges them with `dark-` prefixing — exactly parallel to chart tokens.

**Files:**
- Create: `src/lib/theme-kit/generators/sidebar-tokens.ts`
- Modify: `src/lib/theme-kit/generators/theme.ts:170-206` (replace block with a call)

- [ ] **Step 1: Create `src/lib/theme-kit/generators/sidebar-tokens.ts`.**

```typescript
import Color from "colorjs.io";
import { adjustOklch, createOklchTint } from "@/lib/theme-kit/core/adjustment";
import { generateOklchForeground, generateOklchSidebarColors } from "@/lib/theme-kit/palettes/default";
import { weightedChoice } from "@/lib/utils";

interface BackgroundLayers {
  background: Color;
  border: Color;
}

interface ForegroundCandidates {
  primary: Color;
  secondary: Color;
  accent: Color;
}

/**
 * Generates flat sidebar token map for both light and dark modes. Picks the
 * sidebar background from a weighted set of candidate bases (heavily biased
 * toward the main background) and emits dark-mode tokens with a "dark-"
 * prefix so they merge cleanly into the master cssVars object.
 */
export function generateSidebarTokens(params: {
  light: BackgroundLayers;
  dark: BackgroundLayers;
  primary: Color;
  accent: Color;
  lightForegroundCandidates: ForegroundCandidates;
  darkBackgroundCandidates: ForegroundCandidates;
}): Record<string, string> {
  const lightSidebarBase = [
    params.light.background,
    params.lightForegroundCandidates.accent,
    params.lightForegroundCandidates.secondary,
    params.lightForegroundCandidates.primary,
  ];
  const darkSidebarBase = [
    params.dark.background,
    params.darkBackgroundCandidates.accent,
    params.darkBackgroundCandidates.secondary,
    params.darkBackgroundCandidates.primary,
  ];

  const totalWeight = 100;
  const mostDesiredBgWeight = 80;
  const indicesWithWeight = lightSidebarBase.map((_, item, arr) => ({
    item,
    weight: item === 0 ? mostDesiredBgWeight : (totalWeight - mostDesiredBgWeight) / arr.length,
  }));

  const chosenIndex = weightedChoice(indicesWithWeight);

  const lightSidebarBg = adjustOklch(lightSidebarBase[chosenIndex], { lightness: -0.02 });
  const lightTokens = generateOklchSidebarColors(
    lightSidebarBg,
    generateOklchForeground(lightSidebarBg),
    params.primary,
    params.accent,
    adjustOklch(params.light.border, { lightness: -0.01 })
  );

  const darkSidebarBg = adjustOklch(darkSidebarBase[chosenIndex], { lightness: 0.1 });
  const darkTokens = generateOklchSidebarColors(
    darkSidebarBg,
    generateOklchForeground(darkSidebarBg),
    createOklchTint(params.primary, 10),
    createOklchTint(params.accent, 15),
    adjustOklch(params.dark.border, { lightness: 0.02 })
  );

  const tokens: Record<string, string> = { ...lightTokens };
  for (const [key, value] of Object.entries(darkTokens)) {
    tokens[`dark-${key}`] = value;
  }

  return tokens;
}
```

- [ ] **Step 2: Replace the inline sidebar block in `theme.ts`.**

Locate the current sidebar generation block (around lines 170-206 — starts with `const lightSidebarBase = [...]` and ends after `Object.assign(cssVars, darkSidebarVars);`).

Replace the entire block with:

```typescript
Object.assign(
  cssVars,
  generateSidebarTokens({
    light: { background: lightBgs.background, border: lightBgs.border },
    dark: { background: darkBgs.background, border: darkBgs.border },
    primary,
    accent,
    lightForegroundCandidates: {
      primary: primaryPair.foreground,
      secondary: secondaryPair.foreground,
      accent: accentPair.foreground,
    },
    darkBackgroundCandidates: {
      primary: primaryPair.background,
      secondary: secondaryPair.background,
      accent: accentPair.background,
    },
  })
);
```

- [ ] **Step 3: Add the import.**

At the top of `theme.ts`, add:

```typescript
import { generateSidebarTokens } from "./sidebar-tokens";
```

- [ ] **Step 4: Remove now-unused imports from `theme.ts`.**

After the extraction, several imports may no longer be used in `theme.ts`: `adjustOklch`, `generateOklchSidebarColors`, `weightedChoice` (the latter only if not used elsewhere — search the file).

For each, check if there are other references in `theme.ts`. If not, remove from the import statements. Lint will flag any unused imports left behind.

- [ ] **Step 5: Run type check + lint.**

Run: `npx tsc --noEmit && npm run lint`
Expected: both pass.

- [ ] **Step 6: Manual smoke test.**

Run: `npm run dev`. Generate themes repeatedly. Verify the sidebar in the showcase renders with appropriate background, foreground, and accent treatments. Toggle dark mode and confirm the dark sidebar variant looks correct.

Stop the dev server.

- [ ] **Step 7: Commit.**

```bash
git add src/lib/theme-kit/generators/sidebar-tokens.ts src/lib/theme-kit/generators/theme.ts
git commit -m "refactor: extract sidebar token generation to sidebar-tokens.ts"
```

---

## Task 8: Add `cssVarsBuilder` helper

**Why:** The orchestrator currently mutates a flat `cssVars` object directly, with manual `dark-${key}` string concatenation peppered throughout. As Phase 1+2+3 add narrative/axes/layout tokens, this approach scales badly. A small chainable builder centralizes the prefixing logic and reads cleanly.

**Files:**
- Create: `src/lib/theme-kit/core/css-vars-builder.ts`
- Modify: `src/lib/theme-kit/core/index.ts` (re-export)

- [ ] **Step 1: Create `src/lib/theme-kit/core/css-vars-builder.ts`.**

```typescript
/**
 * Chainable builder for assembling a flat CSS-vars map where dark-mode
 * tokens are prefixed with "dark-". Use:
 *
 *   const vars = createCssVarsBuilder()
 *     .light({ background: "...", foreground: "..." })
 *     .dark({ background: "...", foreground: "..." })
 *     .both({ toneId: "minimalist" })          // same value for light + dark
 *     .merge({ "chart-1": "...", "dark-chart-1": "..." })  // pre-prefixed tokens
 *     .build();
 */
export interface CssVarsBuilder {
  light(tokens: Record<string, string>): CssVarsBuilder;
  dark(tokens: Record<string, string>): CssVarsBuilder;
  both(tokens: Record<string, string>): CssVarsBuilder;
  merge(prefixedTokens: Record<string, string>): CssVarsBuilder;
  build(): Record<string, string>;
}

export function createCssVarsBuilder(): CssVarsBuilder {
  const vars: Record<string, string> = {};

  const builder: CssVarsBuilder = {
    light(tokens) {
      Object.assign(vars, tokens);
      return builder;
    },
    dark(tokens) {
      for (const [key, value] of Object.entries(tokens)) {
        vars[`dark-${key}`] = value;
      }
      return builder;
    },
    both(tokens) {
      for (const [key, value] of Object.entries(tokens)) {
        vars[key] = value;
        vars[`dark-${key}`] = value;
      }
      return builder;
    },
    merge(prefixedTokens) {
      Object.assign(vars, prefixedTokens);
      return builder;
    },
    build() {
      return { ...vars };
    },
  };

  return builder;
}
```

- [ ] **Step 2: Re-export from the core barrel.**

In `src/lib/theme-kit/core/index.ts`, add (matching the file's existing style):

```typescript
export * from "./css-vars-builder";
```

- [ ] **Step 3: Run type check + lint.**

Run: `npx tsc --noEmit && npm run lint`
Expected: both pass.

- [ ] **Step 4: Commit.**

```bash
git add src/lib/theme-kit/core/css-vars-builder.ts src/lib/theme-kit/core/index.ts
git commit -m "feat: add cssVarsBuilder helper for theme token assembly"
```

---

## Task 9: Refactor `theme.ts` to use `cssVarsBuilder`

**Why:** Replaces the manual flat-object construction + scattered `dark-${key}` string concatenation with the builder. Reduces line count and makes adding new token groups (Phase 1+2 narrative/axes tokens) a single chained call.

**Files:**
- Modify: `src/lib/theme-kit/generators/theme.ts`

- [ ] **Step 1: Read the current `theme.ts` to map every token group it produces.**

You need to identify, in the current orchestrator (post-Tasks 1-7), each block that contributes to `cssVars`. Expected groups after prior tasks:
- Light-mode color tokens (background, foreground, card, primary, secondary, etc.)
- Dark-mode color tokens (with `dark-` prefix)
- Shared metadata in both light and dark blocks (`toneId`, `feelId`, `fontFamily`, `fontName`, `radius`)
- `Object.assign(cssVars, generateChartTokens(primary))` — already prefixed, use `merge`
- `Object.assign(cssVars, generateSidebarTokens(...))` — already prefixed, use `merge`

- [ ] **Step 2: Replace the cssVars construction block with the builder.**

Find the current block that starts with `const cssVars = { ... }` and replace it with chained builder calls. The exact replacement depends on the current content; the pattern is:

```typescript
const cssVars = createCssVarsBuilder()
  .light({
    background: oklchToCss(lightBgs.background),
    foreground: oklchToCss(generateOklchForeground(lightBgs.background)),
    card: oklchToCss(lightBgs.card),
    "card-foreground": oklchToCss(generateOklchForeground(lightBgs.card)),
    popover: oklchToCss(lightBgs.card),
    "popover-foreground": oklchToCss(generateOklchForeground(lightBgs.card)),
    primary: oklchToCss(primaryPair.background),
    "primary-foreground": oklchToCss(primaryPair.foreground),
    secondary: oklchToCss(secondaryPair.background),
    "secondary-foreground": oklchToCss(secondaryPair.foreground),
    muted: oklchToCss(lightBgs.muted),
    "muted-foreground": oklchToCss(lightBgs.muted.set("oklch.l", 0.6)),
    accent: oklchToCss(accentPair.background),
    "accent-foreground": oklchToCss(accentPair.foreground),
    destructive: oklchToCss(destructive),
    "destructive-foreground": oklchToCss(generateOklchForeground(destructive)),
    border: oklchToCss(lightBgs.border),
    input: oklchToCss(lightBgs.input),
    ring: oklchToCss(primary),
  })
  .dark({
    background: oklchToCss(darkBgs.background),
    foreground: oklchToCss(generateOklchForeground(darkBgs.background)),
    card: oklchToCss(darkBgs.card),
    "card-foreground": oklchToCss(generateOklchForeground(darkBgs.card)),
    popover: oklchToCss(darkBgs.card),
    "popover-foreground": oklchToCss(generateOklchForeground(darkBgs.card)),
    primary: oklchToCss(createOklchTint(primaryPair.background, 10)),
    "primary-foreground": oklchToCss(
      ensureOklchContrast(primaryPair.foreground, createOklchTint(primaryPair.background, 10))
    ),
    secondary: oklchToCss(createOklchTint(secondaryPair.background, 15)),
    "secondary-foreground": oklchToCss(
      ensureOklchContrast(secondaryPair.foreground, createOklchTint(secondaryPair.background, 15))
    ),
    muted: oklchToCss(darkBgs.muted),
    "muted-foreground": oklchToCss(lightBgs.muted.set("oklch.l", 0.5)),
    accent: oklchToCss(createOklchTint(accentPair.background, 15)),
    "accent-foreground": oklchToCss(ensureOklchContrast(accentPair.foreground, createOklchTint(accentPair.background, 15))),
    destructive: oklchToCss(destructiveDark),
    "destructive-foreground": oklchToCss(generateOklchForeground(destructiveDark)),
    border: oklchToCss(darkBgs.border),
    input: oklchToCss(darkBgs.input),
    ring: oklchToCss(createOklchTint(primary, 10)),
  })
  .both({
    toneId: tone.id,
    feelId: feel.id,
    fontFamily: font.className,
    fontName: `${font.name}, ${font.fallback}`,
    radius: tone.radius,
  })
  .merge(generateChartTokens(primary))
  .merge(
    generateSidebarTokens({
      light: { background: lightBgs.background, border: lightBgs.border },
      dark: { background: darkBgs.background, border: darkBgs.border },
      primary,
      accent,
      lightForegroundCandidates: {
        primary: primaryPair.foreground,
        secondary: secondaryPair.foreground,
        accent: accentPair.foreground,
      },
      darkBackgroundCandidates: {
        primary: primaryPair.background,
        secondary: secondaryPair.background,
        accent: accentPair.background,
      },
    })
  )
  .build();
```

Note: this replaces both the original flat `cssVars` literal AND the two `Object.assign` calls for chart and sidebar tokens (the `merge` calls absorb them).

- [ ] **Step 3: Add the `createCssVarsBuilder` import.**

Update the core import at the top of `theme.ts`:

```typescript
import { createCssVarsBuilder, ensureOklchContrast, getReadableForeground, groupThemeTokens } from "@/lib/theme-kit/core";
```

- [ ] **Step 4: Run type check + lint.**

Run: `npx tsc --noEmit && npm run lint`
Expected: both pass. Address any "unused variable" lint warnings by removing intermediate `chartColors`, `darkChartColors`, `darkChartVars`, `lightSidebarBase`, `darkSidebarBase`, `indicesWithWeight`, `chosenIndex`, `lightSidebarBg`, `sidebarColors`, `darkSidebarBg`, `darkSidebarColors`, `darkSidebarVars` if any of them survived previous tasks.

- [ ] **Step 5: Manual smoke test.**

Run: `npm run dev`. Generate at least 5 themes. Compare with mental model of pre-refactor output:
- Each theme has light + dark variants visible.
- Charts in showcase render with theme tints in both modes.
- Sidebars render with appropriate variant treatment.
- Theme code panel shows complete CSS with all expected tokens.

Toggle dark mode and confirm transitions still work.

Stop the dev server.

- [ ] **Step 6: Commit.**

```bash
git add src/lib/theme-kit/generators/theme.ts
git commit -m "refactor: assemble theme cssVars via cssVarsBuilder

Replaces the flat literal + scattered dark- prefix concatenations
with a single chainable build expression. Phase 1 narrative tokens
and Phase 2 axis tokens will plug in as additional .light/.dark/.merge
calls without growing the orchestrator."
```

---

## Task 10: Hygiene cleanup — remove `console.log`s and fix `seCurrentFont` typo

**Why:** Three production `console.log`s in `theme.ts` pollute every theme generation. The `seCurrentFont` identifier (missing the `t` in `set`) is a typo that survives only because it's syntactically valid; renaming improves readability with zero behavior change.

**Files:**
- Modify: `src/lib/theme-kit/generators/theme.ts` (3 console.log removals)
- Modify: `src/hooks/theme-module/use-theme-generator.ts:30, 131` (rename `seCurrentFont` → `setCurrentFont`)

- [ ] **Step 1: Remove the three `console.log` statements from `theme.ts`.**

In `src/lib/theme-kit/generators/theme.ts`, delete each of these lines:

```typescript
console.log({ defaultFont: params?.font });
console.log({ primaryPair });
console.log({ muted: lightBgs.muted, dark: darkBgs.muted });
```

Use Grep to verify all three are gone:

Run: `grep -n "console.log" src/lib/theme-kit/generators/theme.ts`
Expected: no matches.

- [ ] **Step 2: Fix the `seCurrentFont` typo in `use-theme-generator.ts`.**

Open `src/hooks/theme-module/use-theme-generator.ts`. There are two references:

Line 30 (declaration):
```typescript
const [currentFont, seCurrentFont] = useAtom(updateFontAtom);
```

Line 131 (return value):
```typescript
updateFont: seCurrentFont,
```

Use Edit with `replace_all: true` to rename `seCurrentFont` to `setCurrentFont` in this file.

- [ ] **Step 3: Run type check + lint.**

Run: `npx tsc --noEmit && npm run lint`
Expected: both pass.

- [ ] **Step 4: Manual smoke test.**

Run: `npm run dev`. Open browser dev tools console. Generate 3-4 themes. Confirm zero `console.log` output appears from the theme generator. Test the font selector — pick a different font, verify the theme updates with the new font (this exercises the renamed `setCurrentFont` callback).

Stop the dev server.

- [ ] **Step 5: Commit.**

```bash
git add src/lib/theme-kit/generators/theme.ts src/hooks/theme-module/use-theme-generator.ts
git commit -m "chore: remove debug console.logs and fix seCurrentFont typo"
```

---

## Final Verification (Phase 0 acceptance)

After Task 10 completes, run the full verification suite:

- [ ] **Step 1: Final type check.**

Run: `npx tsc --noEmit`
Expected: passes with no errors.

- [ ] **Step 2: Final lint.**

Run: `npm run lint`
Expected: no warnings or errors.

- [ ] **Step 3: Final build.**

Run: `npm run build`
Expected: completes successfully (this surfaces issues `tsc --noEmit` may miss, like Next.js-specific routing/config).

- [ ] **Step 4: Final manual smoke test.**

Run: `npm run dev`. Walk through this checklist in the browser:
- Generate at least 10 themes. Each gets a valid name + colors + fonts.
- Each theme displays in the showcase without console errors or visual artifacts.
- Toggle dark mode for several themes. Dark variants apply correctly.
- Open the theme code/export panel. Verify the generated CSS string is well-formed (no missing keys, no `oklch(...)` strings appearing where HSL values should be — they should look like `217 91% 60%` triplets).
- Switch fonts via the font selector. Theme updates with the new font.
- Inspect React DevTools / Jotai — verify `currentTheme.cssVars.light.fontName` exists and is NOT replaced with `font-display` after exporting CSS (this confirms C1 fix).

Stop the dev server.

- [ ] **Step 5: Inspect git log for the phase.**

Run: `git log --oneline -12`
Expected: 10 commits matching the task list above (1 commit per task, in order). All commits use lowercase conventional prefixes (`fix:`, `refactor:`, `feat:`, `chore:`).

If any task was split or merged differently from the plan, the log should still tell a coherent story of "Phase 0 = bug fixes + extractions + builder + hygiene."

---

## Done

Phase 0 complete. Phase 1 (Narratives) can now plug into `theme.ts` cleanly via the builder, dropping `.light({ ...narrativeTokens })` calls without touching chart/sidebar/component code.

Updated state:
- `theme.ts` reduced from 313 LOC to ~150 LOC orchestrator only.
- Theme name, chart tokens, sidebar tokens live in their own files.
- HSL→RGB lives with other converters; `groupThemeTokens` lives in core.
- C1 (mutation) and C2 (regex) bugs fixed.
- Three production `console.log`s and one typo eliminated.
- `cssVarsBuilder` ready to absorb new token groups.
