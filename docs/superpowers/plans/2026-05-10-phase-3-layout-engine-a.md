# Phase 3 — Layout Slot Library + Engine A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.
>
> **Note:** Tests are scoped to pure utilities in `src/lib/theme-kit/**/*.test.ts` only — `generateLayoutTemplate` (Engine A) gets unit tests; React slot components do NOT get tests. Verification is `yarn test` + `npx tsc --noEmit` + `yarn lint` + `yarn build` + manual smoke in `yarn dev`.
>
> **Package manager:** Yarn only. Use `yarn add`, `yarn lint`, `yarn dev`, `yarn build`, `yarn test`.
>
> **Shell conventions (per CLAUDE.md):** Run commands directly from project root — no `cd <absolute-path> && ...` prefix. For worktree work, use relative `cd .claude/worktrees/<branch> && <command>` with forward slashes only. Verify branch (`git branch --show-current`) before every commit.

**Goal:** Implement the full layout slot library (38 token-only React components across 15 slot folders), 8 layout archetypes, Engine A (template-based layout generator), and `LayoutPreview` renderer. Each generated theme picks an archetype and renders on it, replacing the current fixed showcase.

**Architecture:** Slots are React components in `src/lib/theme-kit/slots/<category>/<variant>.tsx` that consume design tokens via Tailwind classes (e.g., `bg-primary`, `border`, `text-foreground`) — zero hardcoded colors / spacing / shadows. A `SLOT_REGISTRY` maps variant IDs (`"header-minimal"`, `"hero-bento"`, etc.) to components. `layout-archetypes.ts` declares 8 archetypes; each has an ordered list of slot definitions specifying which variants are eligible. Engine A picks one variant per slot via weighted choice (axes-aware coupling). The `LayoutPreview` walks a `LayoutSpec` and renders the chosen variants. `theme.ts` adds layout sampling alongside narrative + axes; `currentTheme.layout` drives the preview.

**Tech Stack:** TypeScript 5, Next.js 15.3, React 19, Tailwind v4, shadcn/ui (vendored), Recharts 2.15 (for chart slots), `@dnd-kit/*` (kanban already pulled in via existing packages), Vitest 1+. Verification: `yarn test`, `npx tsc --noEmit`, `yarn lint`, `yarn build`.

---

## File Structure

**Files created (15 slot folders, 38 components, plus infrastructure):**

```
src/lib/theme-kit/slots/
├── _types.ts              (SlotComponent type, SlotPosition, etc.)
├── _registry.ts           (SLOT_REGISTRY map: variant id → component)
├── header/
│   ├── header-minimal.tsx
│   ├── header-glass.tsx
│   └── header-bold.tsx
├── hero/
│   ├── hero-centered.tsx
│   ├── hero-split.tsx
│   ├── hero-bento.tsx
│   └── hero-fullbleed.tsx
├── logo-cloud/
│   ├── logo-cloud-grid.tsx
│   └── logo-cloud-marquee.tsx
├── features/
│   ├── features-3col.tsx
│   ├── features-bento.tsx
│   └── features-alternating.tsx
├── testimonials/
│   ├── testimonials-grid.tsx
│   └── testimonials-quote.tsx
├── pricing/
│   ├── pricing-3col.tsx
│   └── pricing-comparison.tsx
├── cta/
│   ├── cta-banner.tsx
│   └── cta-card.tsx
├── footer/
│   ├── footer-minimal.tsx
│   └── footer-rich.tsx
├── sidebar/
│   ├── sidebar-icon.tsx
│   ├── sidebar-rich.tsx
│   └── sidebar-floating.tsx
├── content/
│   ├── stat-cards.tsx
│   ├── chart-area.tsx
│   ├── data-table.tsx
│   └── kanban.tsx
├── workspace/
│   ├── list-pane.tsx
│   ├── detail-pane.tsx
│   └── meta-pane.tsx
├── settings/
│   ├── settings-sidebar.tsx
│   └── form-section.tsx
├── auth/
│   ├── image-panel.tsx
│   ├── form-panel.tsx
│   └── centered-form.tsx
├── editorial/
│   ├── content-block.tsx
│   └── meta-sidebar.tsx
└── bento/
    └── bento-grid.tsx

src/config/layout-archetypes.ts       (8 archetypes data + LayoutArchetype type)
src/lib/theme-kit/generators/layout/
├── template.ts                       (Engine A: generateLayoutTemplate)
├── template.test.ts                  (Engine A unit tests)
└── index.ts                          (single entry point: generateLayout — for now wraps template only; Phase 4 adds procedural)
src/types/theme-kit/layout.ts         (LayoutSpec, SlotPlacement types)
src/components/organisms/theme/layout-preview.tsx
```

**Files modified:**

- `src/types/theme-kit/theme.ts` — add `layout?: LayoutSpec` field
- `src/lib/theme-kit/generators/theme.ts` — sample layout, store on theme output
- `src/components/organisms/theme/theme-previewer.tsx` — replace fixed showcase with `<LayoutPreview spec={currentTheme.layout} />`

**Acceptance:**

- `yarn test` runs and all tests pass (24 from Phase 2 + new Engine A tests = ~30+)
- `npx tsc --noEmit` passes
- `yarn lint` passes
- `yarn build` passes
- `yarn dev` shows themes generating, with each theme rendering on its picked layout archetype. Shuffling shows 8 visibly distinct page structures (marketing landing, dashboard, 3-pane workspace, settings, auth split, auth centered, editorial article, bento showcase).
- `currentTheme.layout` is populated and visible in React DevTools / Jotai state with `engine: "template"`, `archetype: "<id>"`, and `slots: [...]`.

---

## Slot Component Conventions (apply to ALL 38 slot variants)

Every slot component follows the same conventions. Include this verbatim in every implementer prompt for slot tasks; do not deviate.

1. **Token-only styling.** Use Tailwind utility classes that map to CSS vars (`bg-background`, `bg-card`, `bg-primary`, `text-foreground`, `text-muted-foreground`, `border`, `border-input`, `rounded-md`, `shadow-md`, etc.). NEVER hardcode colors (no `bg-red-500`, no `text-#1a1a1a`, no inline `style={{ color: "..." }}` with literal color values). NEVER hardcode spacing in pixels — use Tailwind spacing scale (`p-4`, `gap-6`, etc.). Shadows use `shadow-*` Tailwind utilities, which read `--shadow-*` vars emitted by Phase 2.

2. **Sample content only.** Slots render plausible-looking placeholder content (lorem ipsum, generic product names, fake user names). They take NO data props beyond `position`. The goal is a pleasant *showcase* of what a theme looks like in this layout, not a real app.

3. **Shadcn primitives are encouraged.** Use existing components from `src/components/ui/*` (Button, Card, Input, Avatar, Separator, etc.) where they fit. Don't reinvent buttons or cards.

4. **Component signature:**
   ```typescript
   import { type SlotComponentProps } from "../_types";

   export function HeaderMinimal({ position }: SlotComponentProps) {
     return (/* JSX */);
   }
   ```
   Every slot accepts `SlotComponentProps` (defined in Task 3).

5. **Default export NOT used.** Use named export matching PascalCase of the variant ID: `header-minimal` → `HeaderMinimal`, `logo-cloud-grid` → `LogoCloudGrid`, etc.

6. **Accessibility.** Use semantic HTML (`<header>`, `<nav>`, `<section>`, `<article>`, `<aside>`, `<footer>`). Buttons get text or `aria-label`. Images get `alt`. Sufficient color contrast follows from token use.

7. **No client-only behavior unless required.** Most slots are static content. Add `"use client"` only when a slot needs interactivity (e.g., `kanban` for drag-and-drop, `data-table` if it has sorting). Most slots stay server-renderable.

8. **Imagery.** When a slot needs a placeholder image (hero-split, image-panel, logo-cloud), render a styled `<div>` with a gradient or solid bg using theme tokens — do NOT use external image URLs. Example pattern:
   ```tsx
   <div className="aspect-video bg-gradient-to-br from-muted to-card rounded-lg" />
   ```

9. **Sample data length.** Lists, grids, tables: 3-6 items. Stat cards: 4. Pricing tiers: 3. Testimonials: 3-6.

10. **No `console.log`, no debug commented code, no TODO comments.** Production-quality output even though the components are sample/showcase.

---

## Task 1: Layout types + `LayoutSpec` + `TailwindV4Theme.layout` field

**Why:** Defines the contract that slots, the engine, the renderer, and `theme.ts` all consume. Self-contained — nothing imports it yet, so the file lands cleanly before downstream tasks build on it.

**Files:**
- Create: `src/types/theme-kit/layout.ts`
- Modify: `src/types/theme-kit/theme.ts` (add `layout?: LayoutSpec` field)

- [ ] **Step 1: Create `src/types/theme-kit/layout.ts`**

```typescript
/**
 * The compiled output of a layout engine (Engine A or Engine B). Slots are
 * rendered in array order. `engine` and `archetype` (or DNA) are recorded for
 * debugging, persistence, and future variations features.
 */
export type LayoutEngine = "template" | "procedural";

export type SlotPosition = "top" | "bottom" | "left" | "right" | "flow";

export interface SlotPlacement {
  /** Identifies the slot in the archetype (e.g., "header", "hero", "footer"). */
  slotId: string;
  /** Variant component id (key in SLOT_REGISTRY), e.g. "header-minimal". */
  variant: string;
  /** Optional positional hint used by the renderer for stacking direction. */
  position?: SlotPosition;
}

export interface LayoutSpec {
  engine: LayoutEngine;
  /** Archetype id (Engine A) or DNA id (Engine B). */
  archetype: string;
  slots: SlotPlacement[];
}
```

- [ ] **Step 2: Modify `src/types/theme-kit/theme.ts`**

Add this import at the top alongside existing imports:

```typescript
import type { LayoutSpec } from "./layout";
```

Then add `layout?: LayoutSpec;` to `TailwindV4Theme` between `axes?: AxisSelection;` and `tone?:`:

```typescript
export interface TailwindV4Theme {
  name: string;
  description: string;
  feel: string;
  narrative?: string;
  axes?: AxisSelection;
  layout?: LayoutSpec;
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

- [ ] **Step 3: Verify type check**

Run: `npx tsc --noEmit`
Expected: passes.

- [ ] **Step 4: Verify branch + commit**

Run: `git branch --show-current` → must be `worktree-phase-3-layout-engine-a`.

Commit:
```bash
git add src/types/theme-kit/layout.ts src/types/theme-kit/theme.ts
git commit -m "feat: add LayoutSpec type and layout field on TailwindV4Theme

Defines LayoutEngine (template | procedural), SlotPosition, SlotPlacement,
and LayoutSpec types. TailwindV4Theme.layout is optional so existing
themes type-check unchanged."
```

---

## Task 2: Slot registry infrastructure (`_types.ts` + `_registry.ts`)

**Why:** Establishes the contract every slot component implements (`SlotComponentProps`) and the central map (`SLOT_REGISTRY`) the renderer uses to look up components by variant id. The registry starts empty — slot tasks (4-18) populate it as components are added.

**Files:**
- Create: `src/lib/theme-kit/slots/_types.ts`
- Create: `src/lib/theme-kit/slots/_registry.ts`

- [ ] **Step 1: Create `src/lib/theme-kit/slots/_types.ts`**

```typescript
import type { SlotPosition } from "@/types/theme-kit/layout";

/** Props passed to every slot component by the LayoutPreview renderer. */
export interface SlotComponentProps {
  /** Optional positional hint for the slot. Most components ignore it. */
  position?: SlotPosition;
}

/** Component signature every slot variant must satisfy. */
export type SlotComponent = (props: SlotComponentProps) => React.JSX.Element;
```

- [ ] **Step 2: Create `src/lib/theme-kit/slots/_registry.ts`**

```typescript
import type { SlotComponent } from "./_types";

/**
 * Central map from slot variant id to component. Populated by importing each
 * variant module and assigning into this object. The renderer (LayoutPreview)
 * looks up components by id from this registry.
 *
 * Keys follow the kebab-case convention used everywhere else (variant ids in
 * archetype slot definitions, data attributes, etc.).
 */
export const SLOT_REGISTRY: Record<string, SlotComponent> = {};

/**
 * Helper used by each variant module's index/registration block to register
 * itself. Keeps registration co-located with the component file.
 */
export function registerSlot(id: string, component: SlotComponent) {
  SLOT_REGISTRY[id] = component;
}
```

- [ ] **Step 3: Verify type check + commit**

Run: `npx tsc --noEmit` (passes).

Verify branch is `worktree-phase-3-layout-engine-a`.

```bash
git add src/lib/theme-kit/slots/_types.ts src/lib/theme-kit/slots/_registry.ts
git commit -m "feat: add slot registry infrastructure

SlotComponentProps defines the contract every slot component implements.
SLOT_REGISTRY is the central map from variant id to component, populated
incrementally by each slot variant module via registerSlot()."
```

---

## Task 3: `layout-archetypes.ts` — 8 archetypes data

**Why:** The data layer that defines what each archetype's composition looks like. Engine A reads this to know which slots to fill in what order, and which variants are eligible for each slot.

**Files:**
- Create: `src/config/layout-archetypes.ts`

- [ ] **Step 1: Create `src/config/layout-archetypes.ts`**

```typescript
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
];
```

- [ ] **Step 2: Verify type check + commit**

Run: `npx tsc --noEmit` (passes — no consumers yet).

Verify branch.

```bash
git add src/config/layout-archetypes.ts
git commit -m "feat: add 8 layout archetypes with slot compositions

LayoutArchetype + SlotDef types + LAYOUT_ARCHETYPES catalog. Each
archetype declares an ordered slot composition with eligible variants
per slot, plus soft preference biases for feels / tones / narratives.
Slot variant ids will be backed by components from Tasks 4-18."
```

---

## Tasks 4-18: Slot variant components (38 components in 15 folders)

Each task in this block creates one slot folder's components. The implementer prompt for each task includes:

- Working directory + branch verification (per CLAUDE.md shell conventions)
- The Slot Component Conventions section above (verbatim)
- A description of each variant's intended layout/structure
- The component file paths to create
- Registration calls in `_registry.ts`
- A reminder that `_types.ts` exports `SlotComponentProps` and `SlotComponent`

After ALL 38 components are created, the `_registry.ts` file holds 38 `registerSlot(...)` entries (one per variant), populated by importing each variant module's registration side-effect.

**Critical for every slot task:** the implementer must add a `registerSlot()` call AND ensure the variant module is actually imported somewhere so the side-effect runs. The clean pattern: each slot folder gets an `index.ts` that re-exports + registers all variants in that folder. Then `_registry.ts` imports each folder's `index.ts`.

**Adjusted registry pattern (replaces Task 2's `_registry.ts`):**

After Task 2 lands, `_registry.ts` is a bare map. Each slot task (4-18) appends its folder's `index.ts` import to `_registry.ts`. After Task 18, `_registry.ts` looks like:

```typescript
import type { SlotComponent } from "./_types";
import "./header";       // imports populate SLOT_REGISTRY via registerSlot
import "./hero";
import "./logo-cloud";
import "./features";
import "./testimonials";
import "./pricing";
import "./cta";
import "./footer";
import "./sidebar";
import "./content";
import "./workspace";
import "./settings";
import "./auth";
import "./editorial";
import "./bento";

export const SLOT_REGISTRY: Record<string, SlotComponent> = {};
export function registerSlot(id: string, component: SlotComponent) {
  SLOT_REGISTRY[id] = component;
}
```

Each slot folder has its own `index.ts`:

```typescript
// src/lib/theme-kit/slots/header/index.ts
import { registerSlot } from "../_registry";
import { HeaderMinimal } from "./header-minimal";
import { HeaderGlass } from "./header-glass";
import { HeaderBold } from "./header-bold";

registerSlot("header-minimal", HeaderMinimal);
registerSlot("header-glass", HeaderGlass);
registerSlot("header-bold", HeaderBold);
```

Each task sets up its folder's `index.ts` accordingly.

---

### Task 4: `header/` slot variants (3 components)

**Files:**
- Create: `src/lib/theme-kit/slots/header/header-minimal.tsx`
- Create: `src/lib/theme-kit/slots/header/header-glass.tsx`
- Create: `src/lib/theme-kit/slots/header/header-bold.tsx`
- Create: `src/lib/theme-kit/slots/header/index.ts`
- Modify: `src/lib/theme-kit/slots/_registry.ts` (add `import "./header";` line)

**Variant descriptions:**

- **header-minimal:** Single horizontal row with brand on left, ~4 nav links in the middle/right, an optional `Sign in` button on the far right. Hairline border at the bottom. Compact height (`h-14` or so). Uses `bg-background`, `border-b`, `text-foreground`, `text-muted-foreground` for nav links.
- **header-glass:** Same horizontal structure but with `sticky top-0`, `backdrop-blur` (Tailwind has `backdrop-blur-md` or use `backdrop-filter` directly), semi-transparent `bg-background/70`. Hairline border bottom.
- **header-bold:** Tall (`h-20`), oversized brand mark (large `text-2xl` or `text-3xl`, `font-bold`), nav with prominent typography, optional accent bar (`h-1 bg-primary`) at the very bottom. Uses `bg-card` or `bg-background`.

**Sample brand:** "Acme" or "Brandkit" or similar generic. Sample nav links: "Product", "Pricing", "Docs", "Blog". Generic — no real names.

- [ ] **Step 1: Create the three component files**

Each component follows the structure shown in the conventions section above. Use shadcn `Button` from `@/components/ui/button` for any buttons. Use `<a>` tags for nav links (no real routing).

Example skeleton (HeaderMinimal):

```tsx
import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

export function HeaderMinimal(_props: SlotComponentProps) {
  return (
    <header className="flex h-14 w-full items-center justify-between border-b border-border bg-background px-6">
      <span className="text-base font-semibold text-foreground">Acme</span>
      <nav className="hidden gap-6 md:flex">
        <a className="text-sm text-muted-foreground hover:text-foreground" href="#">Product</a>
        <a className="text-sm text-muted-foreground hover:text-foreground" href="#">Pricing</a>
        <a className="text-sm text-muted-foreground hover:text-foreground" href="#">Docs</a>
        <a className="text-sm text-muted-foreground hover:text-foreground" href="#">Blog</a>
      </nav>
      <Button size="sm">Sign in</Button>
    </header>
  );
}
```

Build the other two variants following the descriptions above with the same import / props pattern.

- [ ] **Step 2: Create `src/lib/theme-kit/slots/header/index.ts`**

```typescript
import { registerSlot } from "../_registry";
import { HeaderMinimal } from "./header-minimal";
import { HeaderGlass } from "./header-glass";
import { HeaderBold } from "./header-bold";

registerSlot("header-minimal", HeaderMinimal);
registerSlot("header-glass", HeaderGlass);
registerSlot("header-bold", HeaderBold);
```

- [ ] **Step 3: Add the folder import to `_registry.ts`**

In `src/lib/theme-kit/slots/_registry.ts`, the file from Task 2 currently has:

```typescript
import type { SlotComponent } from "./_types";

export const SLOT_REGISTRY: Record<string, SlotComponent> = {};
export function registerSlot(id: string, component: SlotComponent) {
  SLOT_REGISTRY[id] = component;
}
```

The variant-import lines need to come BELOW the `SLOT_REGISTRY` declaration so the symbol exists when the imports run. Update to:

```typescript
import type { SlotComponent } from "./_types";

export const SLOT_REGISTRY: Record<string, SlotComponent> = {};
export function registerSlot(id: string, component: SlotComponent) {
  SLOT_REGISTRY[id] = component;
}

import "./header";
```

Each subsequent slot task adds its `import "./<folder>";` line to this list.

- [ ] **Step 4: Verify type check + lint + commit**

Run: `npx tsc --noEmit && yarn lint`. Both must pass.

Verify branch.

```bash
git add src/lib/theme-kit/slots/header src/lib/theme-kit/slots/_registry.ts
git commit -m "feat(slots): add header variants (minimal, glass, bold)

Three header variants - minimal hairline-border row, glass with
sticky/blur/translucency, bold with oversized brand and accent bar.
All token-only (Tailwind classes mapping to CSS vars), with shadcn
Button for sign-in CTAs."
```

---

### Task 5: `hero/` slot variants (4 components)

**Files:**
- Create: `src/lib/theme-kit/slots/hero/{hero-centered,hero-split,hero-bento,hero-fullbleed}.tsx`
- Create: `src/lib/theme-kit/slots/hero/index.ts`
- Modify: `src/lib/theme-kit/slots/_registry.ts` (add `import "./hero";`)

**Variant descriptions:**

- **hero-centered:** Centered single column. Large heading (`text-5xl` or `text-6xl`, `font-bold`), one-line subhead in `text-muted-foreground`, two CTA buttons (`Button` + `Button variant="outline"`). Generous vertical padding (`py-24`). `text-center`. Optional small "What's new" badge above heading using `bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs`.
- **hero-split:** Two-column grid (`grid-cols-2`). Left: heading + subhead + buttons. Right: a styled placeholder representing a product screenshot — use `aspect-video` or `aspect-square` with a `bg-gradient-to-br from-muted to-card` filling the area, optionally with `border` and `shadow-md`. `gap-12` between columns. `py-20`.
- **hero-bento:** Two-column. Left: heading + subhead + buttons (similar to hero-split). Right: an asymmetric bento grid of 3-4 cards in a `grid grid-cols-2 grid-rows-2 gap-4` arrangement, where one card spans 2 rows and another spans 2 columns. Each card uses `bg-card border rounded-lg p-4` with placeholder labels like "Speed", "Reliability", "Scale", "Insights".
- **hero-fullbleed:** Full-width section with a tinted background. Use `bg-gradient-to-br from-primary/10 via-background to-accent/10` (the `/10` makes it subtle). Centered heading + subhead + CTAs (similar to hero-centered) but with the tinted background giving it an editorial/marketing feel. `py-32`.

Sample heading: "Build your design system in minutes". Sample subhead: "From a single brief to a polished interface, ship faster with confidence." Sample CTAs: "Get started" and "View docs".

- [ ] **Step 1: Create the four component files** (follow conventions; produce visually distinct, polished hero sections)
- [ ] **Step 2: Create `src/lib/theme-kit/slots/hero/index.ts`** registering all four
- [ ] **Step 3: Add `import "./hero";` to `_registry.ts`**
- [ ] **Step 4: Verify + commit**

```bash
git add src/lib/theme-kit/slots/hero src/lib/theme-kit/slots/_registry.ts
git commit -m "feat(slots): add hero variants (centered, split, bento, fullbleed)"
```

---

### Task 6: `logo-cloud/` slot variants (2 components)

**Files:**
- Create: `src/lib/theme-kit/slots/logo-cloud/{logo-cloud-grid,logo-cloud-marquee}.tsx`
- Create: `src/lib/theme-kit/slots/logo-cloud/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **logo-cloud-grid:** Centered "Trusted by leading teams" heading in `text-muted-foreground text-sm uppercase tracking-wide`, then a 6-column grid (collapse to 3 on mobile) of 6 placeholder logos. Each "logo" is `h-8` containing styled brand-name text in `text-muted-foreground` font with varying weights/styles. Sample names: "Stark", "Atlas", "Helix", "Nova", "Quanta", "Forge".
- **logo-cloud-marquee:** Same heading, then a single horizontal row that visually suggests scrolling (use Tailwind's `animate-pulse` is wrong here — use `overflow-hidden` with the same 6 logos in a `flex gap-12 justify-around` row; for true marquee, use the existing `tw-animate-css` package's keyframe-based animation if convenient, otherwise a static scrolling impression with `flex` is acceptable for v1).

```bash
git commit -m "feat(slots): add logo-cloud variants (grid, marquee)"
```

---

### Task 7: `features/` slot variants (3 components)

**Files:**
- Create: `src/lib/theme-kit/slots/features/{features-3col,features-bento,features-alternating}.tsx`
- Create: `src/lib/theme-kit/slots/features/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **features-3col:** Standard 3-column grid (collapses to 1 col on mobile). Each column has an icon (use `lucide-react` — pick from `Zap`, `Shield`, `Sparkles`, `Layers`, `Compass`, `Box`), a `h3` heading, a 2-3 line description in `text-muted-foreground`. Section heading + subhead at the top. `py-20`. Cards use `bg-card border rounded-lg p-6`.
- **features-bento:** A 3x2 (or 2x3) bento grid where one card spans 2 columns and another spans 2 rows. Mix of feature card sizes — large card has more content (heading + paragraph + maybe a placeholder visualization), smaller cards have icon + heading. Use `grid grid-cols-3 grid-rows-2 gap-4`.
- **features-alternating:** 3 alternating rows. Row 1: image-left + text-right. Row 2: text-left + image-right. Row 3: image-left + text-right. Each row has a styled placeholder visualization (`aspect-video bg-gradient-to-br from-muted to-card rounded-lg`) on one side and text content on the other. `gap-16` between rows.

Sample features: "Lightning fast", "Battle tested", "Beautifully designed". Generic but plausible product capabilities.

```bash
git commit -m "feat(slots): add features variants (3col, bento, alternating)"
```

---

### Task 8: `testimonials/` slot variants (2 components)

**Files:**
- Create: `src/lib/theme-kit/slots/testimonials/{testimonials-grid,testimonials-quote}.tsx`
- Create: `src/lib/theme-kit/slots/testimonials/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **testimonials-grid:** Section heading "Loved by developers" then a 3-column grid of 6 testimonial cards. Each card: shadcn `Card` with `<CardContent>` containing avatar (use shadcn `Avatar` with `<AvatarFallback>` showing initials, no image), name, role, and a short quote (~3 lines) in `text-muted-foreground`. `gap-6`.
- **testimonials-quote:** A single oversized testimonial. Centered, large quotation marks (use `Quote` lucide icon), large quote text (`text-2xl` or `text-3xl`, `text-foreground`), avatar + name + role below. `max-w-3xl mx-auto py-24`.

Sample names: "Jordan Lee", "Sam Chen", "Avery Rivera", "Morgan Patel", etc. Sample roles: "Frontend Lead at Atlas", "Designer at Helix", "Eng Manager at Stark", etc.

```bash
git commit -m "feat(slots): add testimonials variants (grid, quote)"
```

---

### Task 9: `pricing/` slot variants (2 components)

**Files:**
- Create: `src/lib/theme-kit/slots/pricing/{pricing-3col,pricing-comparison}.tsx`
- Create: `src/lib/theme-kit/slots/pricing/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **pricing-3col:** Three pricing cards side by side. Free / Pro / Enterprise tiers. Each card: tier name, price (e.g., "$0", "$29 / mo", "Custom"), short description, list of 4-6 features (use `Check` lucide icon next to each), and a CTA button. Middle (Pro) tier has a `Recommended` badge using shadcn `Badge` and a primary-bg background to stand out. Use `bg-card border rounded-lg p-8`.
- **pricing-comparison:** Single table with rows for features and columns for tiers. Headers: blank / Free / Pro / Enterprise. ~8 feature rows, each marked with `Check` (included) or `Minus` (not included) icons in cells. Use shadcn `Table` from `@/components/ui/table`.

```bash
git commit -m "feat(slots): add pricing variants (3col, comparison)"
```

---

### Task 10: `cta/` slot variants (2 components)

**Files:**
- Create: `src/lib/theme-kit/slots/cta/{cta-banner,cta-card}.tsx`
- Create: `src/lib/theme-kit/slots/cta/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **cta-banner:** Full-width section with heading "Ready to get started?" + one-line subhead + two buttons (`Get started`, `Talk to sales`). `bg-primary text-primary-foreground` to stand out. `py-16`. Centered text.
- **cta-card:** Centered card on muted background. `max-w-3xl mx-auto`. Card has gradient bg (`bg-gradient-to-br from-card to-muted`), heading + subhead + single primary button. `p-12 rounded-xl border shadow-md`.

```bash
git commit -m "feat(slots): add cta variants (banner, card)"
```

---

### Task 11: `footer/` slot variants (2 components)

**Files:**
- Create: `src/lib/theme-kit/slots/footer/{footer-minimal,footer-rich}.tsx`
- Create: `src/lib/theme-kit/slots/footer/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **footer-minimal:** Single row. Brand on left, copyright in `text-muted-foreground text-sm`, 3-4 small links on right. `py-8 border-t`. `bg-background`.
- **footer-rich:** Multi-column footer (4 columns: Product / Company / Resources / Legal), each with a heading and 4-5 links in `text-muted-foreground`. Brand block on the left with logo + tagline + social icons (use lucide `Github`, `Twitter`, `Linkedin`). Bottom border bar with copyright. `py-16 border-t`.

```bash
git commit -m "feat(slots): add footer variants (minimal, rich)"
```

---

### Task 12: `sidebar/` slot variants (3 components)

**Files:**
- Create: `src/lib/theme-kit/slots/sidebar/{sidebar-icon,sidebar-rich,sidebar-floating}.tsx`
- Create: `src/lib/theme-kit/slots/sidebar/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **sidebar-icon:** Narrow vertical bar (`w-16`), icon-only nav (use lucide icons: `Home`, `LayoutDashboard`, `Inbox`, `Settings`, `User`). Each icon is centered in a `h-12 w-12` hover-bg button. Active state uses `bg-accent text-accent-foreground`. Bottom of sidebar has a user avatar.
- **sidebar-rich:** Wider sidebar (`w-64`), icons + labels + sections. Multiple grouped sections (e.g., "Workspace", "Team"), each with section heading in `text-xs uppercase text-muted-foreground` and a list of nav items. Bottom shows user info (avatar + name + role).
- **sidebar-floating:** Same width as `sidebar-rich` (`w-64`), but rendered as a floating card detached from edges with `m-4 rounded-xl border bg-card shadow-md`. Inner contents similar to `sidebar-rich` (icons + labels).

Use the existing shadcn `Sidebar` primitive from `@/components/ui/sidebar` if it cleanly fits — otherwise build from scratch with simple `nav` + `<a>` markup.

```bash
git commit -m "feat(slots): add sidebar variants (icon, rich, floating)"
```

---

### Task 13: `content/` slot variants (4 components)

**Files:**
- Create: `src/lib/theme-kit/slots/content/{stat-cards,chart-area,data-table,kanban}.tsx`
- Create: `src/lib/theme-kit/slots/content/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **stat-cards:** Row of 4 stat cards. Each: small uppercase label (`text-xs text-muted-foreground uppercase tracking-wide`), large number (`text-3xl font-bold`), small change indicator with up/down arrow (`text-success` and `text-destructive` for direction). Sample stats: "Revenue $12,345", "Users 8,432", "Conversion 4.7%", "Sessions 23,891". `grid grid-cols-2 md:grid-cols-4 gap-4`.
- **chart-area:** Single full-width card with a chart inside. Use `recharts` (already installed) — render a simple AreaChart or BarChart with 7-12 sample data points. Use `var(--primary)` for chart line/fill via inline `style` or chart config. Card has a heading "Revenue over time" and a brief description. `h-80` chart area.
- **data-table:** A standard data table with header row + 6-8 sample rows. Columns: Name, Email, Status (use shadcn `Badge`), Plan, Last active. Use shadcn `Table`. Sample names like the testimonial samples. `border rounded-lg overflow-hidden`.
- **kanban:** Three columns (To do / In progress / Done), each containing 2-3 task cards. Each task card has a title, optional badge for priority, and an avatar. Use `bg-card border rounded-md p-3` for cards. Columns use `bg-muted rounded-lg p-4 min-h-[400px]`. Static layout — no actual drag-and-drop in v1 (simpler to ship).

This task is bigger than others; budget extra time. The chart-area task may need `"use client"` if recharts requires it.

```bash
git commit -m "feat(slots): add content variants (stat-cards, chart-area, data-table, kanban)"
```

---

### Task 14: `workspace/` slot variants (3 components)

**Files:**
- Create: `src/lib/theme-kit/slots/workspace/{list-pane,detail-pane,meta-pane}.tsx`
- Create: `src/lib/theme-kit/slots/workspace/index.ts`
- Modify: `_registry.ts`

**Variants (think mail/inbox 3-pane):**

- **list-pane:** Vertical scrolling list of 8-12 items. Each item is a row with avatar, sender/title, snippet of content, and timestamp. Selected state for one item using `bg-accent`. `border-r` on the right. `w-80` width. Sample items like email subjects ("Re: design review", "Weekly summary", "Invoice #4521", etc.).
- **detail-pane:** Detail view of one selected item. Header section with title, sender, timestamp, action buttons. Body section with multi-paragraph lorem-ipsum content using `text-foreground` and `prose` if available. `flex-1` width.
- **meta-pane:** Right-side panel with metadata about the selected item. Sections: Properties (key-value pairs), Tags (badges), Activity (timeline-style list of small events). `w-72 border-l`. `bg-muted/30`.

```bash
git commit -m "feat(slots): add workspace variants (list-pane, detail-pane, meta-pane)"
```

---

### Task 15: `settings/` slot variants (2 components)

**Files:**
- Create: `src/lib/theme-kit/slots/settings/{settings-sidebar,form-section}.tsx`
- Create: `src/lib/theme-kit/slots/settings/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **settings-sidebar:** Narrow left nav with sections like "Account", "Profile", "Security", "Notifications", "Billing", "Integrations", "API". Active item highlighted with `bg-accent text-accent-foreground`. `w-56`.
- **form-section:** Form section with heading "Profile information" + subhead, then a form with: avatar upload area (placeholder square + button), text fields for Name / Email / Bio (use shadcn `Input` and `Textarea`), and a save/cancel button row at the bottom. `max-w-2xl`. Use shadcn `Label` for field labels. `space-y-6`.

```bash
git commit -m "feat(slots): add settings variants (settings-sidebar, form-section)"
```

---

### Task 16: `auth/` slot variants (3 components)

**Files:**
- Create: `src/lib/theme-kit/slots/auth/{image-panel,form-panel,centered-form}.tsx`
- Create: `src/lib/theme-kit/slots/auth/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **image-panel:** Full-height left panel with a tinted background — `bg-gradient-to-br from-primary to-accent` or `bg-primary` — and a large brand mark or quote overlaid. Centered text in `text-primary-foreground`. Hidden on mobile (`hidden md:flex`). Width `flex-1`.
- **form-panel:** Right-side auth form. Centered vertically. Heading "Welcome back" + subhead "Sign in to your account". Form: Email input, Password input, "Remember me" checkbox + "Forgot password?" link, Sign in button (full width), divider with "OR", Google sign-in button (use `Github` lucide as substitute icon). Bottom link "Don't have an account? Sign up". `w-full md:w-1/2 max-w-md mx-auto p-12`.
- **centered-form:** Standalone centered form (used when there's no split layout). Same content as form-panel but with the brand mark above the heading and centered on the page. `max-w-md mx-auto py-24`.

```bash
git commit -m "feat(slots): add auth variants (image-panel, form-panel, centered-form)"
```

---

### Task 17: `editorial/` slot variants (2 components)

**Files:**
- Create: `src/lib/theme-kit/slots/editorial/{content-block,meta-sidebar}.tsx`
- Create: `src/lib/theme-kit/slots/editorial/index.ts`
- Modify: `_registry.ts`

**Variants:**

- **content-block:** Article body. Wide reading column (`max-w-2xl`), generous line height (`leading-relaxed`), well-typed prose. Mix of headings (h2, h3), paragraphs, a blockquote (`<blockquote className="border-l-4 border-primary pl-4 italic">`), and a single inline image placeholder. Use shadcn typography conventions if a `prose` plugin exists, otherwise hand-style with `text-base text-foreground` and `space-y-6`.
- **meta-sidebar:** Right-side sticky sidebar (`sticky top-8`). Sections: Author block (avatar + name + bio link), Table of contents (4-6 anchored headings), Share/save action buttons. `w-64`. `text-sm`.

```bash
git commit -m "feat(slots): add editorial variants (content-block, meta-sidebar)"
```

---

### Task 18: `bento/` slot variant (1 component)

**Files:**
- Create: `src/lib/theme-kit/slots/bento/bento-grid.tsx`
- Create: `src/lib/theme-kit/slots/bento/index.ts`
- Modify: `_registry.ts`

**Variant:**

- **bento-grid:** A masonry-style asymmetric grid showcasing varied card sizes. Use `grid grid-cols-4 grid-rows-3 gap-4`. Cards span varying numbers of cells (e.g., one card spans `col-span-2 row-span-2` as the "hero" card; others span `col-span-1 row-span-1`, `col-span-2 row-span-1`, etc.). Six total cards. Each card has a heading, a few lines of body text, and one card includes a small placeholder visualization (like in features-bento). All cards use `bg-card border rounded-lg p-6`. Sample card titles: "Performance", "Security", "Designed for teams", "Ship faster", "Beautiful by default", "Insights".

```bash
git commit -m "feat(slots): add bento-grid variant"
```

---

## Task 19: Engine A — `generateLayoutTemplate` + tests

**Why:** The function that turns an archetype + axes + narrative into a `LayoutSpec`. Tests verify the spec output respects archetype slot definitions and only picks variants from each slot's eligibility list.

**Files:**
- Create: `src/lib/theme-kit/generators/layout/template.ts`
- Create: `src/lib/theme-kit/generators/layout/template.test.ts`
- Create: `src/lib/theme-kit/generators/layout/index.ts`

- [ ] **Step 1: Create `src/lib/theme-kit/generators/layout/template.ts`**

```typescript
import type { LayoutArchetype } from "@/config/layout-archetypes";
import type { LayoutSpec, SlotPlacement } from "@/types/theme-kit/layout";
import type { AxisSelection } from "@/config/theme-axes";
import type { Narrative } from "@/config/theme-narratives";
import { randomChoice } from "@/lib/utils";

interface GenerateTemplateParams {
  archetype: LayoutArchetype;
  axes: AxisSelection;
  narrative: Narrative;
}

/**
 * Builds a LayoutSpec from an archetype by picking one variant per slot.
 * For Phase 3 v1, picks uniformly at random from each slot's eligible
 * variants. Phase 4+ may extend this with axis/narrative-aware filtering
 * and weighted choice based on coupling rules.
 */
export function generateLayoutTemplate(params: GenerateTemplateParams): LayoutSpec {
  const { archetype } = params;

  const slots: SlotPlacement[] = archetype.slots
    .filter((slotDef) => slotDef.required || Math.random() < 0.7)
    .map((slotDef) => ({
      slotId: slotDef.id,
      variant: randomChoice(slotDef.variants),
      position: slotDef.position,
    }));

  return {
    engine: "template",
    archetype: archetype.id,
    slots,
  };
}
```

The 0.7 probability for non-required slots means optional slots (e.g., `logo-cloud`, `testimonials`, `meta-pane`) appear ~70% of the time when present in an archetype, giving variation across generations.

- [ ] **Step 2: Create `src/lib/theme-kit/generators/layout/index.ts`**

```typescript
import { LAYOUT_ARCHETYPES, type LayoutArchetype } from "@/config/layout-archetypes";
import type { AxisSelection } from "@/config/theme-axes";
import type { Narrative } from "@/config/theme-narratives";
import type { LayoutSpec } from "@/types/theme-kit/layout";
import { weightedChoice } from "@/lib/utils";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { generateLayoutTemplate } from "./template";

type Feel = (typeof THEME_FEELS_V4)[0];
type Tone = (typeof TONES)[0];

interface GenerateLayoutParams {
  feel: Feel;
  tone: Tone;
  narrative: Narrative;
  axes: AxisSelection;
}

/**
 * Picks a layout archetype compatible with the chosen feel/tone/narrative
 * (weighted by preference biases) and runs Engine A to produce a LayoutSpec.
 * Phase 4 will add Engine B and a mode toggle here; for now, all generation
 * goes through Engine A.
 */
export function generateLayout(params: GenerateLayoutParams): LayoutSpec {
  const archetype = pickArchetype(params);
  return generateLayoutTemplate({ archetype, axes: params.axes, narrative: params.narrative });
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
```

- [ ] **Step 3: Create `src/lib/theme-kit/generators/layout/template.test.ts`**

```typescript
import { describe, it, expect } from "vitest";
import { generateLayoutTemplate } from "./template";
import type { LayoutArchetype } from "@/config/layout-archetypes";
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

const fakeArchetype: LayoutArchetype = {
  id: "test-archetype",
  name: "Test",
  slots: [
    { id: "header", required: true, variants: ["header-minimal", "header-bold"] },
    { id: "hero", required: true, variants: ["hero-centered"] },
    { id: "logo-cloud", required: false, variants: ["logo-cloud-grid"] },
    { id: "footer", required: true, variants: ["footer-minimal"] },
  ],
};

describe("generateLayoutTemplate", () => {
  it("returns a LayoutSpec with engine='template' and the right archetype id", () => {
    const spec = generateLayoutTemplate({ archetype: fakeArchetype, axes: fakeAxes, narrative: fakeNarrative });
    expect(spec.engine).toBe("template");
    expect(spec.archetype).toBe("test-archetype");
  });

  it("includes every required slot in the output", () => {
    const spec = generateLayoutTemplate({ archetype: fakeArchetype, axes: fakeAxes, narrative: fakeNarrative });
    const slotIds = spec.slots.map((s) => s.slotId);
    expect(slotIds).toContain("header");
    expect(slotIds).toContain("hero");
    expect(slotIds).toContain("footer");
  });

  it("only picks variants from each slot's eligible list", () => {
    for (let i = 0; i < 50; i++) {
      const spec = generateLayoutTemplate({ archetype: fakeArchetype, axes: fakeAxes, narrative: fakeNarrative });
      for (const slot of spec.slots) {
        const slotDef = fakeArchetype.slots.find((s) => s.id === slot.slotId);
        expect(slotDef).toBeDefined();
        expect(slotDef!.variants).toContain(slot.variant);
      }
    }
  });

  it("optional slots appear sometimes but not always", () => {
    let withOptional = 0;
    let withoutOptional = 0;
    for (let i = 0; i < 100; i++) {
      const spec = generateLayoutTemplate({ archetype: fakeArchetype, axes: fakeAxes, narrative: fakeNarrative });
      const hasLogoCloud = spec.slots.some((s) => s.slotId === "logo-cloud");
      if (hasLogoCloud) withOptional++;
      else withoutOptional++;
    }
    // optional slot uses 0.7 probability — expect both appearances and absences
    expect(withOptional).toBeGreaterThan(20);
    expect(withoutOptional).toBeGreaterThan(5);
  });
});
```

- [ ] **Step 4: Run tests + commit**

```bash
yarn test                       # all previous tests + 4 new = ~30 total
npx tsc --noEmit
yarn lint
```

Verify branch.

```bash
git add src/lib/theme-kit/generators/layout
git commit -m "feat: implement Engine A (generateLayoutTemplate) with tests

generateLayoutTemplate picks one variant per slot from the archetype's
eligible list, randomly including optional slots ~70% of the time.
generateLayout (in index.ts) wraps it with weighted archetype selection
biased by feel / tone / narrative preferences. Phase 4 will add Engine B
behind a mode toggle in this same file."
```

---

## Task 20: `LayoutPreview` renderer

**Why:** Walks a `LayoutSpec` and renders the chosen slot components using `SLOT_REGISTRY`. Replaces the existing fixed showcase as the primary preview surface.

**Files:**
- Create: `src/components/organisms/theme/layout-preview.tsx`

- [ ] **Step 1: Create `src/components/organisms/theme/layout-preview.tsx`**

```tsx
"use client";
import React from "react";
import type { LayoutSpec } from "@/types/theme-kit/layout";
import { SLOT_REGISTRY } from "@/lib/theme-kit/slots/_registry";

interface LayoutPreviewProps {
  spec: LayoutSpec | undefined;
}

/**
 * Renders a generated theme on its picked layout archetype. Reads the
 * LayoutSpec, looks up each slot variant in SLOT_REGISTRY, and renders
 * them in order. If the spec is missing or the archetype has no slots,
 * shows a fallback message.
 *
 * Layout shaping (left/right sidebars vs top/bottom headers) is achieved
 * via flex/grid containers that group slots by their `position`. v1 uses
 * a simple stacked layout that respects top/bottom/left/right hints.
 */
export function LayoutPreview({ spec }: LayoutPreviewProps) {
  if (!spec || spec.slots.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center text-muted-foreground">
        Generate a theme to see the preview.
      </div>
    );
  }

  const topSlots = spec.slots.filter((s) => s.position === "top");
  const bottomSlots = spec.slots.filter((s) => s.position === "bottom");
  const leftSlots = spec.slots.filter((s) => s.position === "left");
  const rightSlots = spec.slots.filter((s) => s.position === "right");
  const flowSlots = spec.slots.filter((s) => !s.position || s.position === "flow");

  const hasSides = leftSlots.length > 0 || rightSlots.length > 0;

  return (
    <div className="flex min-h-screen w-full flex-col bg-background text-foreground">
      {topSlots.map((slot) => renderSlot(slot))}

      {hasSides ? (
        <div className="flex flex-1">
          {leftSlots.map((slot) => renderSlot(slot))}
          <main className="flex flex-1 flex-col gap-8 p-8">
            {flowSlots.map((slot) => renderSlot(slot))}
          </main>
          {rightSlots.map((slot) => renderSlot(slot))}
        </div>
      ) : (
        <main className="flex flex-1 flex-col gap-12">
          {flowSlots.map((slot) => renderSlot(slot))}
        </main>
      )}

      {bottomSlots.map((slot) => renderSlot(slot))}
    </div>
  );
}

function renderSlot(slot: { slotId: string; variant: string; position?: string }) {
  const Component = SLOT_REGISTRY[slot.variant];
  if (!Component) {
    return (
      <div key={slot.slotId} className="border border-destructive bg-destructive/10 p-4 text-sm text-destructive">
        Missing slot variant: <code>{slot.variant}</code>
      </div>
    );
  }
  return <Component key={slot.slotId} position={slot.position as never} />;
}
```

- [ ] **Step 2: Verify type check + commit**

```bash
npx tsc --noEmit
yarn lint
```

Verify branch.

```bash
git add src/components/organisms/theme/layout-preview.tsx
git commit -m "feat: add LayoutPreview renderer

Walks a LayoutSpec, looks up each variant in SLOT_REGISTRY, and renders
slots respecting their position hints (top/bottom/left/right/flow).
Side-positioned slots produce a left/right column layout; otherwise
slots stack vertically. Falls back to an empty-state message when no
spec is present and a missing-variant indicator if a registry lookup
fails."
```

---

## Task 21: Wire layout into `theme.ts` + replace fixed showcase

**Why:** The integration step. `theme.ts` samples a layout per generation and stores it on the theme; the previewer swaps from the fixed showcase to the new `LayoutPreview` component.

**Files:**
- Modify: `src/lib/theme-kit/generators/theme.ts` — call `generateLayout`, set `theme.layout`
- Modify: `src/components/organisms/theme/theme-previewer.tsx` — replace existing showcase with `<LayoutPreview spec={currentTheme.layout} />`

- [ ] **Step 1: Read `src/components/organisms/theme/theme-previewer.tsx` to understand its current structure**

The file currently renders a fixed showcase. Identify what should be replaced and what should stay (e.g., the surrounding container, controls, theme card). The minimum change: replace the fixed showcase JSX with `<LayoutPreview spec={currentTheme?.layout} />`.

- [ ] **Step 2: Update `theme.ts` to sample and store the layout**

In `src/lib/theme-kit/generators/theme.ts`:

1. Add this import:
   ```typescript
   import { generateLayout } from "./layout";
   ```

2. After the `axes` sampling (currently right after `pickNarrative` + `sampleAxes`), add layout sampling:
   ```typescript
   const layout = generateLayout({ feel, tone, narrative, axes });
   ```

3. In the returned theme object, add `layout` between `axes,` and `tone,`:
   ```typescript
   return {
     name: themeName,
     description: feel.description,
     feel: feel.name,
     narrative: narrative.id,
     axes,
     layout,
     tone,
     // ...
   };
   ```

- [ ] **Step 3: Update `theme-previewer.tsx` to use LayoutPreview**

Add the import:

```typescript
import { LayoutPreview } from "./layout-preview";
```

Replace the existing fixed showcase JSX with `<LayoutPreview spec={currentTheme?.layout} />`. Keep any surrounding container chrome (e.g., scroll area, theme code panel toggle, etc.) — only the showcase content changes.

If the existing showcase has a "no theme generated yet" state, the LayoutPreview already handles that internally (its own empty state). You can remove the duplicate empty handling.

- [ ] **Step 4: Run all checks**

```bash
yarn test                           # all tests still pass
npx tsc --noEmit
yarn lint
yarn build
```

All must pass. The build is essential — it surfaces any client/server boundary issues from the `"use client"` directive on LayoutPreview and slot components that need it.

- [ ] **Step 5: Verify branch + commit**

```bash
git add src/lib/theme-kit/generators/theme.ts src/components/organisms/theme/theme-previewer.tsx
git commit -m "feat: wire generated layout into theme.ts and previewer

theme.ts now samples a LayoutSpec via generateLayout (Engine A) for
each generation, recording it on currentTheme.layout. The previewer
replaces its fixed showcase with <LayoutPreview spec=...> so each
theme renders on its picked archetype with chosen slot variants.
Phase 4 will add Engine B and a template/procedural mode toggle."
```

---

## Task 22: Final verification

**Why:** Phase 3 acceptance gate. Confirms tests, type check, lint, build all pass and the git log tells a coherent story.

- [ ] **Step 1: Run the full test suite**

Run: `yarn test`
Expected: ~28 tests pass (24 from Phase 2 + 4 new generateLayoutTemplate tests). Test count may differ slightly depending on how many test files were added.

- [ ] **Step 2: Type check**

Run: `npx tsc --noEmit`
Expected: passes with no output.

- [ ] **Step 3: Lint**

Run: `yarn lint`
Expected: passes (only pre-existing warnings, nothing new from Phase 3 files).

- [ ] **Step 4: Build**

Run: `yarn build`
Expected: completes successfully, all pages generated.

- [ ] **Step 5: Inspect git log**

Run: `git log --oneline -22`
Expected: 21 commits matching Tasks 1-21 above (Task 22 is verification, no commit). Conventional prefixes throughout.

---

## Done

Phase 3 complete. Themes now render on one of 8 layout archetypes — marketing landing, app dashboard, app workspace (3-pane), app settings, auth split, auth centered, editorial, bento showcase — with slot variants picked from a 38-component library. Two themes feel structurally distinct: a `marketing-landing` theme with `hero-bento` and `pricing-3col` is unmistakably different from an `app-workspace` theme with `list-pane` + `detail-pane` + `meta-pane`.

Updated state:
- 38 token-only slot components in 15 folders
- 8 layout archetypes with feel/tone/narrative coupling
- Engine A (generateLayoutTemplate) with unit tests
- LayoutPreview renderer with position-aware layout shaping
- Theme generation now produces `theme.layout`
- Previewer uses LayoutPreview as its primary surface

**Backlog for Phase 4 onward:**
- The current `pickArchetype` weighting in `generateLayout` does not factor in axes (only feel/tone/narrative). Phase 4 may add axes-aware archetype filtering.
- `filterByAxes` was discussed in the spec for narrowing slot variants per axis context (e.g., a `glow + mesh` theme skipping `header-minimal`). Not implemented in Phase 3 — variants are picked uniformly within a slot. Phase 4 (when Engine B lands) is a natural place to add this if needed.
- The fixed showcase in `theme-previewer.tsx` may have had multiple render paths (theme code panel, export controls). Confirm none were lost in the LayoutPreview swap; surface anything missing as a follow-up.
- Tailwind v4 + shadcn vendored components: some slot variants will look different across archetypes once Phase 2 axes fully kick in (e.g., `data-personality="embossed"` adds gradients to `bg-primary` buttons). Spot-check that the visual story holds across archetype + axis combinations.
- Performance: rendering 8 archetypes × ~5 slots each across many regenerations may benefit from React.memo on slot components. Profile if regeneration feels slow.
