# Phase 4 — Engine B (Procedural Composition) + Mode Toggle

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note:** Tests scoped to pure utilities in `src/lib/theme-kit/**/*.test.ts` only. Engine B's composition logic gets unit tests; React UI for the mode toggle does not.
>
> **Package manager:** Yarn only.
>
> **Shell conventions (per CLAUDE.md):** Run commands directly from project root or use relative `cd .claude/worktrees/<branch> && ...`. No routine `pwd`/`(Get-Location).Path` checks. Don't include per-task branch verification in dispatch prompts (the controller verified once at phase start). Chain non-destructive compound commands freely (`yarn test && npx tsc --noEmit && yarn lint && yarn build`); only split chained destructive sequences (merge + worktree remove + branch delete go in separate Bash calls).

**Goal:** Add a procedural layout engine (Engine B) driven by 5 design-system DNAs (swiss-grid, bauhaus, brutalist, editorial, magazine-bento), and a `template | procedural | auto` mode toggle that lets the user choose how layouts are generated. Auto defaults to 70% template / 30% procedural so the experience leans on the polished template path while letting procedural surface as a creative wildcard.

**Architecture:** Engine B is **rules-based recombination**, not unconstrained procedural. Each DNA declares: which slot types it can use (subset of the existing slot library), per-slot variant pools, slot-count range, must-have slots, must-not-have slots, position overrides, and first/last ordering rules. The generator samples a slot count, picks slot types respecting must-have/avoid lists, applies first/last ordering, assigns positions, then picks a variant per slot from the DNA's per-slot pool. Output is the same `LayoutSpec` shape Engine A emits — the existing `LayoutPreview` renderer handles both engines unchanged. The `generateLayout` entry point gets a `mode` parameter; `auto` mode does a weighted choice between engines (70/30). UI exposes the mode via a segmented control in the existing controls area, persisted via a Jotai atom.

**Tech Stack:** TypeScript 5, Next.js 15.3, React 19, Tailwind v4, Jotai 2.12, Vitest 1+. Verification: `yarn test`, `npx tsc --noEmit`, `yarn lint`, `yarn build`.

---

## File Structure

**Files created:**

```
src/config/design-system-dnas.ts                          DesignSystemDNA type + 5 DNAs catalog
src/lib/theme-kit/generators/layout/procedural.ts         Engine B implementation
src/lib/theme-kit/generators/layout/procedural.test.ts    Engine B unit tests
src/components/molecules/layout-mode-toggle.tsx           Segmented control UI for mode
```

**Files modified:**

- `src/lib/theme-kit/generators/layout/index.ts` — extend `generateLayout` with `mode: LayoutMode` param; add weighted engine selection for `auto` mode
- `src/lib/theme-kit/generators/theme.ts` — read `engineMode` atom value, pass through to `generateLayout`
- `src/store/theme.ts` — add `layoutModeAtom` (defaults to `"auto"`)
- `src/components/organisms/theme/theme-editor.tsx` (or wherever feel/tone/font controls live) — mount `<LayoutModeToggle />` next to existing selectors

**Acceptance:**

- `yarn test` passes (28 from prior phases + new Engine B tests = ~34+)
- `npx tsc --noEmit` passes
- `yarn lint` passes (only pre-existing warnings)
- `yarn build` passes
- `yarn dev`: the controls area shows a `Template / Procedural / Auto` segmented control. Switching modes and regenerating produces visibly different layouts:
  - `template` mode: every regeneration uses Engine A archetypes (Phase 3 behavior)
  - `procedural` mode: every regeneration uses one of the 5 DNAs; layouts are structurally novel but coherent
  - `auto` mode: ~70% of regenerations match template behavior, ~30% match procedural behavior
- `currentTheme.layout.engine` reflects which engine produced the spec (`"template"` or `"procedural"`)
- `currentTheme.layout.archetype` holds the archetype id for template, the DNA id for procedural

---

## Task 1: `design-system-dnas.ts` — DNA type + 5 DNAs catalog

**Why:** Defines the data layer Engine B reads from. Each DNA encodes the structural rules of a design system as data (slot pool, count range, must-have/avoid, position overrides, first/last ordering). Engine B in Task 2 consumes this catalog.

**Files:**
- Create: `src/config/design-system-dnas.ts`

- [ ] **Step 1: Create the file with the type and all 5 DNAs**

```typescript
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
```

- [ ] **Step 2: Verify type check + commit**

```bash
npx tsc --noEmit && git add src/config/design-system-dnas.ts && git commit -m "feat: add design-system DNAs catalog with 5 archetypes

DesignSystemDNA + DESIGN_SYSTEM_DNAS catalog. Five DNAs cover the
structural fingerprints of real design traditions: swiss-grid (modular,
generous whitespace), bauhaus (asymmetric, primary-color blocks),
brutalist (exposed structure, monospace), editorial (wide reading
column + meta sidebar), magazine-bento (variable-size cards, dense
info packing). Each declares slot variant pools, count range,
must-have/avoid lists, and position rules. Engine B will read this
to compose procedural layouts."
```

---

## Task 2: Engine B — `procedural.ts` + tests

**Why:** Implements `generateProceduralLayout`, the rules-based composer. Decomposes into focused helpers: `sampleSlotCount`, `sampleSlotTypes`, `orderSlots`, `pickVariant`. Tests verify slot-count range, must-have inclusion, avoid-list exclusion, position overrides, first/last ordering, variant eligibility.

**Files:**
- Create: `src/lib/theme-kit/generators/layout/procedural.ts`
- Create: `src/lib/theme-kit/generators/layout/procedural.test.ts`

- [ ] **Step 1: Create `procedural.ts`**

```typescript
import type { DesignSystemDNA } from "@/config/design-system-dnas";
import type { LayoutSpec, SlotPlacement, SlotPosition } from "@/types/theme-kit/layout";
import type { AxisSelection } from "@/config/theme-axes";
import type { Narrative } from "@/config/theme-narratives";
import { randomChoice, randomInRange } from "@/lib/utils";

interface GenerateProceduralParams {
  dna: DesignSystemDNA;
  axes: AxisSelection;
  narrative: Narrative;
}

/**
 * Builds a LayoutSpec procedurally from a design-system DNA. Samples a slot
 * count within the DNA's range, picks slot types respecting must-have / avoid
 * lists, applies first/last ordering and position overrides, then picks one
 * variant per slot from the DNA's per-slot pool.
 */
export function generateProceduralLayout(params: GenerateProceduralParams): LayoutSpec {
  const { dna } = params;

  const targetCount = sampleSlotCount(dna);
  const slotTypes = sampleSlotTypes(dna, targetCount);
  const orderedSlotTypes = orderSlots(slotTypes, dna);
  const slots: SlotPlacement[] = orderedSlotTypes.map((slotType) => ({
    slotId: slotType,
    variant: pickVariant(slotType, dna),
    position: positionFor(slotType, dna),
  }));

  return {
    engine: "procedural",
    archetype: dna.id,
    slots,
  };
}

function sampleSlotCount(dna: DesignSystemDNA): number {
  const [min, max] = dna.slotCountRange;
  return Math.floor(randomInRange(min, max + 1));
}

function sampleSlotTypes(dna: DesignSystemDNA, targetCount: number): string[] {
  const pool = Object.keys(dna.slotVariants).filter((slot) => !dna.mustNotHave?.includes(slot));
  const required = dna.mustHave.filter((slot) => pool.includes(slot));
  const optional = pool.filter((slot) => !required.includes(slot));

  // Always include all must-have slots first
  const selected = new Set<string>(required);

  // Fill remaining capacity with random optional slots
  const remainingCapacity = Math.max(0, targetCount - selected.size);
  const shuffledOptional = [...optional].sort(() => Math.random() - 0.5);
  for (let i = 0; i < remainingCapacity && i < shuffledOptional.length; i++) {
    selected.add(shuffledOptional[i]);
  }

  return Array.from(selected);
}

function orderSlots(slotTypes: string[], dna: DesignSystemDNA): string[] {
  const others = slotTypes.filter((s) => s !== dna.firstSlot && s !== dna.lastSlot);
  const ordered: string[] = [];
  if (dna.firstSlot && slotTypes.includes(dna.firstSlot)) ordered.push(dna.firstSlot);
  ordered.push(...others);
  if (dna.lastSlot && slotTypes.includes(dna.lastSlot)) ordered.push(dna.lastSlot);
  return ordered;
}

function pickVariant(slotType: string, dna: DesignSystemDNA): string {
  const variants = dna.slotVariants[slotType];
  if (!variants || variants.length === 0) {
    // Defensive fallback — slot type not in pool. Return a placeholder string;
    // the renderer will surface this as a missing variant.
    return `${slotType}-unknown`;
  }
  return randomChoice(variants);
}

function positionFor(slotType: string, dna: DesignSystemDNA): SlotPosition | undefined {
  return dna.positionOverrides?.[slotType];
}
```

- [ ] **Step 2: Create `procedural.test.ts`**

```typescript
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
```

- [ ] **Step 3: Run tests + commit**

```bash
yarn test && npx tsc --noEmit && yarn lint
git add src/lib/theme-kit/generators/layout/procedural.ts src/lib/theme-kit/generators/layout/procedural.test.ts
git commit -m "feat: implement Engine B (generateProceduralLayout) with tests

Rules-based recombination: samples a slot count within the DNA's
range, picks slot types respecting must-have / avoid lists, applies
first/last ordering and position overrides, picks variants from
the DNA's per-slot pool. Tests cover engine + archetype id, slot
count range, must-have inclusion, mustNotHave exclusion, first/last
ordering, position overrides, variant eligibility."
```

---

## Task 3: Extend `layout/index.ts` with mode toggle

**Why:** The entry point that dispatches to Engine A or Engine B based on a `mode` parameter. `auto` mode (default) does a 70/30 weighted choice between template and procedural. Existing `generateLayout` calls in `theme.ts` will pass the mode through.

**Files:**
- Modify: `src/lib/theme-kit/generators/layout/index.ts`

- [ ] **Step 1: Read current state**

The current `index.ts` (from Phase 3) has:
- `generateLayout({ feel, tone, narrative, axes }): LayoutSpec` — wraps `generateLayoutTemplate`
- `pickArchetype(params): LayoutArchetype` — weighted by feel/tone/narrative

- [ ] **Step 2: Replace `index.ts` with the extended version**

Replace the entire content with:

```typescript
import { LAYOUT_ARCHETYPES, type LayoutArchetype } from "@/config/layout-archetypes";
import { DESIGN_SYSTEM_DNAS, type DesignSystemDNA } from "@/config/design-system-dnas";
import type { AxisSelection } from "@/config/theme-axes";
import type { Narrative } from "@/config/theme-narratives";
import type { LayoutSpec } from "@/types/theme-kit/layout";
import { weightedChoice } from "@/lib/utils";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { generateLayoutTemplate } from "./template";
import { generateProceduralLayout } from "./procedural";

type Feel = (typeof THEME_FEELS_V4)[0];
type Tone = (typeof TONES)[0];

export type LayoutMode = "template" | "procedural" | "auto";

interface GenerateLayoutParams {
  feel: Feel;
  tone: Tone;
  narrative: Narrative;
  axes: AxisSelection;
  mode?: LayoutMode;
}

/**
 * Picks a layout engine (template or procedural) based on `mode`, then runs
 * the chosen engine to produce a LayoutSpec. `auto` mode does a 70/30 weighted
 * choice between template and procedural — leans on the polished template path
 * with procedural surfacing as a creative wildcard.
 */
export function generateLayout(params: GenerateLayoutParams): LayoutSpec {
  const mode: LayoutMode = params.mode ?? "auto";

  const engine =
    mode === "auto"
      ? weightedChoice([
          { item: "template" as const, weight: 7 },
          { item: "procedural" as const, weight: 3 },
        ])
      : mode;

  if (engine === "template") {
    const archetype = pickArchetype(params);
    return generateLayoutTemplate({ archetype, axes: params.axes, narrative: params.narrative });
  } else {
    const dna = pickDNA(params);
    return generateProceduralLayout({ dna, axes: params.axes, narrative: params.narrative });
  }
}

function pickArchetype(params: GenerateLayoutParams): LayoutArchetype {
  const weighted = LAYOUT_ARCHETYPES.map((arch) => {
    let weight = 1;
    if (arch.preferredFeels?.includes(params.feel.id)) weight *= 3;
    if (arch.preferredTones?.includes(params.tone.id)) weight *= 2;
    if (arch.preferredNarratives?.includes(params.narrative.id)) weight *= 2;
    return { item: arch, weight };
  });
  return weightedChoice(weighted);
}

function pickDNA(params: GenerateLayoutParams): DesignSystemDNA {
  const weighted = DESIGN_SYSTEM_DNAS.map((dna) => {
    let weight = 1;
    if (dna.preferredFeels?.includes(params.feel.id)) weight *= 3;
    if (dna.preferredTones?.includes(params.tone.id)) weight *= 2;
    if (dna.preferredNarratives?.includes(params.narrative.id)) weight *= 2;
    return { item: dna, weight };
  });
  return weightedChoice(weighted);
}
```

- [ ] **Step 3: Verify + commit**

```bash
yarn test && npx tsc --noEmit && yarn lint
git add src/lib/theme-kit/generators/layout/index.ts
git commit -m "feat: extend generateLayout with template/procedural/auto mode

mode='template' always uses Engine A (existing behavior). mode='procedural'
always uses Engine B (Phase 4 new path). mode='auto' (default) does a
70/30 weighted choice between the two — polished template path with
procedural as a creative wildcard. Adds pickDNA mirroring pickArchetype
with feel/tone/narrative weighted preferences."
```

---

## Task 4: Add `layoutModeAtom` to the store

**Why:** Persists the user's mode choice across regenerations. Atom is read by `theme.ts` when generating; UI toggles it.

**Files:**
- Modify: `src/store/theme.ts`

- [ ] **Step 1: Add the atom**

In `src/store/theme.ts`, add the import (alongside existing imports from jotai):

```typescript
import type { LayoutMode } from "@/lib/theme-kit/generators/layout";
```

Then add the atom near the other atoms (`isDarkModeAtom`, etc.):

```typescript
export const layoutModeAtom = atom<LayoutMode>("auto");
```

- [ ] **Step 2: Verify + commit**

```bash
npx tsc --noEmit && yarn lint
git add src/store/theme.ts
git commit -m "feat: add layoutModeAtom to store (defaults to 'auto')

Persists the user's layout-engine mode choice. theme.ts reads this
atom value when generating; the LayoutModeToggle UI sets it."
```

---

## Task 5: Wire `layoutModeAtom` into `theme.ts`

**Why:** The generator needs to read the user's mode choice. Since `generateTailwindV4Theme` is a pure function (not a React hook), the atom value must be read by the caller (the generator hook) and passed in. Extend the function signature to accept an optional `mode` param, and update the hook that calls it to read the atom.

**Files:**
- Modify: `src/lib/theme-kit/generators/theme.ts` — add `mode` param to `GenerateThemeParams`, pass to `generateLayout`
- Modify: `src/hooks/theme-module/use-theme-generator.ts` — read `layoutModeAtom`, pass to `generateSingle` calls

- [ ] **Step 1: Extend `theme.ts` to accept `mode`**

In `src/lib/theme-kit/generators/theme.ts`:

1. Add the import (with other layout imports):
   ```typescript
   import type { LayoutMode } from "./layout";
   ```

2. Extend `GenerateThemeParams` (currently lines 26-30):
   ```typescript
   type GenerateThemeParams = {
     feel?: (typeof THEME_FEELS_V4)[0];
     tone?: (typeof TONES)[0];
     font?: (typeof TONES)[0]["fonts"][0];
     mode?: LayoutMode;
   };
   ```

3. In the body of `generateTailwindV4Theme`, find the line:
   ```typescript
   const layout = generateLayout({ feel, tone, narrative, axes });
   ```
   Change to:
   ```typescript
   const layout = generateLayout({ feel, tone, narrative, axes, mode: params?.mode });
   ```

- [ ] **Step 2: Update `use-theme-generator.ts` to read the atom**

In `src/hooks/theme-module/use-theme-generator.ts`:

1. Add the import (alongside existing jotai/store imports):
   ```typescript
   import { layoutModeAtom } from "@/store/theme";
   ```

2. In the hook body (alongside other `useAtom`/`useAtomValue` calls), add:
   ```typescript
   const layoutMode = useAtomValue(layoutModeAtom);
   ```
   (You may need to import `useAtomValue` from jotai if not already imported.)

3. Find the `generateSingle` function. Inside the function body, find the line that calls `generateTailwindV4Theme(...)`. The current call shape is:
   ```typescript
   const theme = generateTailwindV4Theme({ feel, tone, font });
   ```
   Update to:
   ```typescript
   const theme = generateTailwindV4Theme({ feel, tone, font, mode: layoutMode });
   ```

4. Find `generateMultiple` (if it also calls `generateTailwindV4Theme` directly or via a collection helper). If it calls `generateTailwindV4ThemeCollection`, that helper currently doesn't accept `mode`. Update `generateTailwindV4ThemeCollection` in `theme.ts` to accept an optional `mode` parameter and forward it:

   In `src/lib/theme-kit/generators/theme.ts`:
   ```typescript
   export function generateTailwindV4ThemeCollection(count = 5, mode?: LayoutMode): TailwindV4Theme[] {
     const themes: TailwindV4Theme[] = [];
     const usedFeels = new Set<string>();

     for (let i = 0; i < count; i++) {
       let theme = generateTailwindV4Theme({ mode });
       let attempts = 0;
       while (usedFeels.has(theme.feel) && attempts < 10) {
         theme = generateTailwindV4Theme({ mode });
         attempts++;
       }
       usedFeels.add(theme.feel);
       themes.push(theme);
     }
     return themes;
   }
   ```

   Then update the `generateMultiple` call in `use-theme-generator.ts` to pass `layoutMode`:
   ```typescript
   const themes = generateTailwindV4ThemeCollection(count, layoutMode);
   ```

- [ ] **Step 3: Verify + commit**

```bash
yarn test && npx tsc --noEmit && yarn lint && yarn build
git add src/lib/theme-kit/generators/theme.ts src/hooks/theme-module/use-theme-generator.ts
git commit -m "feat: wire layoutModeAtom into theme generation

generateTailwindV4Theme + generateTailwindV4ThemeCollection accept an
optional mode (template | procedural | auto). use-theme-generator reads
layoutModeAtom and forwards it to both generateSingle and generateMultiple
so theme regeneration respects the user's mode choice."
```

---

## Task 6: `LayoutModeToggle` UI component

**Why:** Lets the user pick template / procedural / auto. Implemented as a segmented control using shadcn `ToggleGroup` from `@/components/ui/toggle-group`. Wires to `layoutModeAtom` via Jotai.

**Files:**
- Create: `src/components/molecules/layout-mode-toggle.tsx`

- [ ] **Step 1: Create the component**

```tsx
"use client";
import React from "react";
import { useAtom } from "jotai";
import { Layers, Wand2, Shuffle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { layoutModeAtom } from "@/store/theme";
import type { LayoutMode } from "@/lib/theme-kit/generators/layout";

interface LayoutModeToggleProps {
  className?: string;
}

/**
 * Segmented control that lets the user pick the layout engine mode.
 * - template: always use Engine A (curated archetypes)
 * - procedural: always use Engine B (DNA-driven composition)
 * - auto (default): 70/30 weighted choice between the two
 *
 * The choice is persisted in layoutModeAtom and read by the theme generator.
 */
export function LayoutModeToggle({ className }: LayoutModeToggleProps) {
  const [mode, setMode] = useAtom(layoutModeAtom);

  return (
    <div className={className}>
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(value) => {
          if (value) setMode(value as LayoutMode);
        }}
        aria-label="Layout engine mode"
      >
        <ToggleGroupItem value="template" aria-label="Template mode" title="Curated archetypes (safe)">
          <Layers className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Template</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="procedural" aria-label="Procedural mode" title="DNA-driven composition (bold)">
          <Wand2 className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Procedural</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="auto" aria-label="Auto mode" title="Mix (70% template, 30% procedural)">
          <Shuffle className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Auto</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
```

- [ ] **Step 2: Verify + commit**

```bash
npx tsc --noEmit && yarn lint
git add src/components/molecules/layout-mode-toggle.tsx
git commit -m "feat: add LayoutModeToggle segmented control

Three-way toggle (Template / Procedural / Auto) wired to layoutModeAtom
via Jotai. Uses shadcn ToggleGroup + lucide icons. Labels collapse on
mobile (icon-only). Tooltips explain each mode's behavior."
```

---

## Task 7: Mount `LayoutModeToggle` in the controls area

**Why:** The toggle has to actually appear in the UI. The existing controls area (likely `theme-editor.tsx` or similar — find the file that hosts the feel/tone/font selectors) needs the new toggle mounted next to those controls.

**Files:**
- Modify: the file that hosts the existing feel/tone/font selectors (likely `src/components/organisms/theme/theme-editor.tsx` — verify by grepping)

- [ ] **Step 1: Find the controls host**

Run:
```bash
grep -l "useThemeGenerator\|FeelSelector\|ToneSelector\|fontFamily" src/components/organisms src/components/templates src/components/pages -r
```

The match showing the feel/tone/font selector layout is the controls host. The most likely candidate based on Phase 0-3 codebase structure: `src/components/organisms/theme/theme-editor.tsx`.

If multiple files render the controls (e.g., one for desktop, one for mobile), mount the toggle in whichever is the primary controls host. If unsure, mount it in `theme-editor.tsx` and report concerns.

- [ ] **Step 2: Add the import**

At the top of the controls host file:

```tsx
import { LayoutModeToggle } from "@/components/molecules/layout-mode-toggle";
```

- [ ] **Step 3: Render the toggle next to existing selectors**

Find where the feel/tone/font selectors render (typically in a `<div>` or flex container holding multiple controls). Add:

```tsx
<LayoutModeToggle />
```

next to or below the existing selectors. Pick the placement that fits the existing layout — don't redesign the controls area, just add this one component.

- [ ] **Step 4: Verify + commit**

```bash
yarn build       # crucial — confirms the new component renders without client/server boundary issues
git add <controls-host-file>
git commit -m "feat: mount LayoutModeToggle in the controls area

The toggle now appears next to the existing feel/tone/font selectors,
giving users direct control over which layout engine drives generation."
```

---

## Task 8: Final verification

**Why:** Phase 4 acceptance gate. Confirms tests, type check, lint, build all pass and the git log tells a coherent story.

- [ ] **Step 1: Run the full test suite**

```bash
yarn test
```
Expected: ~34 tests pass (28 from prior phases + ~6 new from generateProceduralLayout).

- [ ] **Step 2: Type check + lint + build**

```bash
npx tsc --noEmit && yarn lint && yarn build
```
All must pass. The build is essential — it surfaces any client/server boundary issues from the new `LayoutModeToggle` and the atom wiring.

- [ ] **Step 3: Inspect git log**

```bash
git log --oneline -10
```
Expected: 7 commits matching Tasks 1-7 (Task 8 is verification, no commit). Conventional prefixes throughout.

---

## Done

Phase 4 complete. Themes can now be generated through Engine A (curated archetypes), Engine B (DNA-driven procedural composition), or Auto (70/30 mix). The user controls this via a segmented control next to the existing feel/tone/font selectors.

**Updated state:**
- `~34 tests passing` (28 prior + 6 new procedural tests)
- 5 design-system DNAs encoded with structural rules
- Engine B (`generateProceduralLayout`) emits the same `LayoutSpec` shape as Engine A — single renderer handles both
- `generateLayout` dispatches based on `mode` (`template | procedural | auto`)
- `layoutModeAtom` persists the user's choice across regenerations
- `LayoutModeToggle` UI component lives in the controls area

**Backlog for Phase 5:**
- DNA preference biases (`preferredFeels` etc.) currently affect engine-internal weighting only. If `auto` mode's 70/30 split should also be influenced by feel/tone/narrative (e.g., bauhaus-friendly themes get a higher procedural weight), surface that as a tuning task.
- Procedural composition could be extended with axis-aware filtering (e.g., a `glow + mesh` theme prefers DNAs that allow visual richness). Out of scope for Phase 4; revisit if needed.
- The "Auto" label might benefit from showing the actual engine that fired in the last regeneration, so users see the 70/30 split in action. Phase 5 creative differentiators (theme identity, variations panel) are the natural place to surface this.
- The 5 DNAs cover the major design traditions but are not exhaustive — the catalog can be extended (e.g., Memphis, Glassmorphic-app, Y2K) without touching Engine B.
