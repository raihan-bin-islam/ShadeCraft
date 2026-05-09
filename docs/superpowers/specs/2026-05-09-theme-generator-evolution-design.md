# ShadeCraft Theme Generator — Evolution Design

**Date:** 2026-05-09
**Author:** Raihan + Claude (brainstorming session)
**Status:** Approved design, ready for implementation planning

---

## 1. Problem Statement

ShadeCraft's current theme generator produces beautiful individual themes, but generated themes often feel similar to each other. Diagnostic read of the codebase identifies the root causes:

1. **Color is doing 100% of the differentiation work.** Same shadcn components, same layout, same shadows, same borders, same density — only hex codes change. So even very different palettes feel like "the same app, repainted."
2. **Hue ranges overlap heavily across feels.** Cool, frosted, ocean, midnight, ethereal, cyber all sample ~200–280°. Generated themes share hue families across nominally different feels.
3. **Backgrounds are structurally identical.** Always near-white in light, near-black in dark. No theme has a colored background, an off-cream, or a paper texture — exactly the qualities that give Linear / Notion / Vercel their identity.
4. **Tone → font/radius mapping is 1:1.** 9 tones × 4 fonts = small visible pool, and most radii cluster at 0.3–0.7rem.
5. **No "narrative" binding the choices.** Primary/secondary/accent are sampled independently per palette — no stylistic logic like "single accent on neutral" vs "dual accent" vs "monochrome with one pop."
6. **Single fixed showcase.** The same demo page renders for every theme, so users perceive less variety than the colors actually contain.

## 2. Goals

- **Structural variety** between generated themes, not just chromatic variety.
- **Production-grade output** — generated themes should be indistinguishable from a hand-designed system.
- **Layered, additive expansion** — keep existing `feel` + `tone` selectors and built-in themes working unchanged.
- **Pitchable artifacts** — themes should feel like products users want to keep, share, and iterate on, not throwaway generator output.

## 3. Non-goals

- True unconstrained procedural layout generation (research-grade scope, not feasible for v1).
- Replacing or breaking existing built-in themes (backwards compat required).
- Full export-as-starter-app (slot library is for in-app preview, not bundled export).
- AI-driven anything (the system stays deterministic-ish given seed; no LLM calls).

## 4. Architecture

### 4.1 Mental model

The generator gets two new dimensions stacked on top of feel + tone, plus layout as a fifth output dimension. All sampled per generation and feed into a multi-stage pipeline.

```
DIMENSIONS (sampled per generation):
  feel  →  tone  →  narrative(NEW)  →  axes(NEW)  →  layout(NEW)
  (color  (font/  (color structure   (shadow/border/  (page
   mood)   radius) archetype)         surface/comp.)   composition)

PIPELINE:
  1. Pick feel + tone (existing)
  2. Pick narrative → drives primary/secondary/accent/bg structure
  3. Sample axis values → emits new CSS vars + component variants
  4. Pick layout engine (template OR procedural) → composes page
  5. Assemble theme object

OUTPUT: TailwindV4Theme (extended)
  feel, tone,
  narrative,           // NEW: color story metadata
  axes,                // NEW: stylistic axis values
  layout,              // NEW: layout composition spec
  cssVars,             // EXTENDED: + shadow-*, border-*, surface-*, radius-*
  identity,            // NEW: name + tagline + designedFor + DNA badge
```

### 4.2 New files

| File | Purpose |
|------|---------|
| `src/config/theme-narratives.ts` | Narrative archetype definitions |
| `src/config/theme-axes.ts` | Axis value catalogs (shadow / border / surface / component) |
| `src/config/layout-archetypes.ts` | Template archetypes for Engine A |
| `src/config/design-system-dnas.ts` | Design system DNAs for Engine B |
| `src/lib/theme-kit/generators/narrative.ts` | Narrative-driven palette assembly |
| `src/lib/theme-kit/generators/axes.ts` | Axis sampling + CSS var emission |
| `src/lib/theme-kit/generators/layout/template.ts` | Layout Engine A |
| `src/lib/theme-kit/generators/layout/procedural.ts` | Layout Engine B |
| `src/lib/theme-kit/generators/layout/index.ts` | Engine selector + shared primitives |
| `src/lib/theme-kit/identity.ts` | Theme identity (name / tagline / DNA badge) |
| `src/lib/theme-kit/slots/` | Slot variant component library (~25 components) |
| `src/styles/theme-axes.css` | Component personality data-attribute styles |
| `src/components/organisms/theme/layout-preview.tsx` | Layout renderer |

### 4.3 Touched files

- `src/lib/theme-kit/generators/theme.ts` — orchestrator (split into multiple files in Phase 0)
- `src/types/theme-kit/theme.ts` — extends `TailwindV4Theme` with new fields
- `src/components/organisms/theme/theme-previewer.tsx` — uses `LayoutPreview`
- `src/components/ui/button.tsx`, `card.tsx`, `input.tsx` — read new CSS vars
- `src/store/theme.ts` — new atoms: `lockedDimensionsAtom`, `previewArchetypeAtom`, `engineModeAtom`

### 4.4 Coupling rules

- **Narrative ↔ feel:** light coupling via `preferredFeels` / `avoidedFeels` (e.g., `monochrome-accent` excludes `vibrant`, `playful`, `aurora`).
- **Axes ↔ feel + tone:** weighted preferences declared on each feel and tone (`axisPreferences` field). Multiplied to produce sampling weights.
- **Layout ↔ everything:** weighted choice of archetype/DNA biased by feel + tone + narrative compatibility.

### 4.5 Backwards compatibility

Existing built-in themes (`src/data/built-in-themes.ts`) lack the new fields. Phase 1 includes a one-time migration script that:
- Sets `narrative = 'monochrome-accent'` for themes with low chroma, `dual-accent` for themes with multiple saturated colors, `dark-signature` for themes with dark backgrounds, etc. (heuristic match against existing palette).
- Sets `axes` to safe defaults: `{ shadow: 'soft', border: 'standard', surface: 'flat', component: 'solid' }`.
- Sets `layout = { engine: 'template', archetype: 'app-dashboard', slots: [] }` (existing showcase remains the renderer until Phase 3).

Existing UI selectors (feel/tone/font) work unchanged. The new selectors (narrative / axes / layout / mode toggle) are additive.

---

## 5. Narratives (color-structure archetypes)

A **narrative** is the color story of a theme — how primary/secondary/accent/background relate. Replaces today's "random independent sampling" with "pick a story, then derive tokens that fit the story."

### 5.1 Catalog (7 archetypes)

| ID | Name | Color story | Real-world analog |
|----|------|-------------|-------------------|
| `monochrome-accent` | Monochrome + Accent | Neutral bg + cards, ONE saturated color carries everything. | Linear, Notion |
| `dark-signature` | Dark Signature | Dark bg + ONE bold signature color. High text contrast. | Spotify, Discord, Vercel-dark |
| `dual-accent` | Dual Accent | Two distinct saturated colors. Secondary is neutral bridge. | Stripe, Figma |
| `colored-canvas` | Colored Canvas | Saturated bg or saturated chrome (sidebar/header). Content area neutral. | Slack (classic), Mailchimp |
| `muted-harmony` | Muted Harmony | Low chroma everywhere. No single color dominates. | Apple Notes, NYT |
| `tone-on-tone` | Tone on Tone | All tokens share one hue family. Variation via lightness/chroma only. | Anthropic, Duolingo green sections |
| `vibrant-clash` | Vibrant Clash | Two high-saturation colors in unexpected pairing. | Figma marketing, Memphis |

### 5.2 Data shape

```ts
type Narrative = {
  id: string;
  name: string;
  description: string;
  primary:    { chroma: [number, number]; lightness: [number, number] };
  secondary:  { chroma: [number, number]; lightness: [number, number]; mode: 'neutral' | 'analogous' | 'complement' };
  accent:     { chroma: [number, number]; lightness: [number, number]; mode: 'echo-primary' | 'complement' | 'distant' };
  background: { chroma: [number, number]; lightness: [number, number]; saturated: boolean };
  accentHueOffset: [number, number];
  secondaryHueOffset: [number, number];
  preferredFeels?: string[];
  avoidedFeels?: string[];
};
```

### 5.3 Sampling logic

```ts
function pickNarrative(feel: Feel): Narrative {
  const compatible = NARRATIVES.filter(n => !n.avoidedFeels?.includes(feel.id));
  const weighted = compatible.map(n => ({
    item: n,
    weight: n.preferredFeels?.includes(feel.id) ? 3 : 1
  }));
  return weightedChoice(weighted);
}

function generateNarrativePalette(narrative: Narrative, feel: Feel): Color[] {
  // 1. Pick primary hue from feel.preferredHues (existing behavior)
  // 2. Sample primary chroma/lightness from narrative.primary rules
  // 3. Derive secondary/accent/background per narrative structural rules
  // 4. Return [primary, secondary, accent, background]
}
```

### 5.4 Integration

Replaces current logic in `theme.ts`:

```ts
// BEFORE
const harmony = randomChoice<ColorHarmony>(['complementary', 'triadic', ...]);
const baseColor = generateBaseOklchColor(feel);
const paletteDefault = generateOklchColorPalette(baseColor, harmony);
const paletteBalanced = generateBalancedTheme(randomHue);
const palette = randomChoice([paletteDefault, paletteBalanced]);

// AFTER
const narrative = pickNarrative(feel);
const palette  = generateNarrativePalette(narrative, feel);
```

The two existing palette generators (`balanced.ts`, `default.ts`) become callable strategies inside `generateNarrativePalette` for narratives that benefit (e.g., `dual-accent` calls into `generateBalancedTheme`).

---

## 6. Stylistic Axes

Four parallel axes, each sampled per generation. Three are pure CSS-var emissions (zero component code touched). The fourth (component personality) needs a small data-attribute hook.

### 6.1 Axis catalogs

**Shadow language:** `flat` / `soft` / `elevated` / `glassy` / `glow`

**Border treatment:** `hairline` / `standard` / `heavy` / `accented`

**Surface treatment:** `flat` / `gradient` / `noise` / `pattern` / `mesh`

**Component personality:** `solid` / `outline` / `pill` / `sharp` / `embossed`

Full variant tables and CSS surface mappings detailed in section 3 of the brainstorm transcript; encoded canonically in `src/config/theme-axes.ts`.

### 6.2 Data shape

```ts
type AxisCatalog = {
  shadow:    { id: ShadowId;    cssVars: Record<string, string> }[];
  border:    { id: BorderId;    cssVars: Record<string, string> }[];
  surface:   { id: SurfaceId;   cssVars: Record<string, string> }[];
  component: { id: ComponentId; cssVars: Record<string, string>; dataAttr: string }[];
};

type AxisSelection = {
  shadow:    ShadowId;
  border:    BorderId;
  surface:   SurfaceId;
  component: ComponentId;
};
```

### 6.3 Coupling

Each tone and feel declares `axisPreferences` per axis. Sampling multiplies feel + tone weights, falls back to uniform when neither declares.

```ts
// Example: Brutalist tone
axisPreferences: {
  shadow:    { flat: 5, elevated: 2, soft: 1 },
  border:    { heavy: 5, standard: 2, hairline: 0 },
  surface:   { flat: 4, noise: 3, pattern: 1 },
  component: { sharp: 5, solid: 3, outline: 2 },
}

// Example: Noir feel
axisPreferences: {
  shadow:    { glow: 4, soft: 2, flat: 1 },
  surface:   { flat: 3, gradient: 3, mesh: 2 },
  border:    { accented: 3, hairline: 2 },
}
```

### 6.4 New CSS vars (light + dark each)

```
--shadow-xs, --shadow-sm, --shadow-md, --shadow-lg, --shadow-xl
--border-width, --border-color-mode  (mode = 'neutral' | 'accent')
--surface-image, --surface-blur, --surface-alpha
--radius-button, --radius-card, --radius-input
```

### 6.5 Component personality stylesheet

`src/styles/theme-axes.css` reads `data-personality="..."` set on `<html>`:

```css
[data-personality="embossed"] .btn-primary {
  background-image: linear-gradient(180deg, oklch(... +0.05) 0%, var(--primary) 100%);
  box-shadow: inset 0 1px 0 oklch(... +0.1), var(--shadow-md);
}
[data-personality="outline"] .btn-primary {
  background: transparent;
  color: var(--primary);
  border: 2px solid var(--primary);
}
/* ... etc per personality variant */
```

### 6.6 Component changes

Minimal — most variation is pure token swaps. `Button`, `Card`, `Input` already consume CSS vars; just ensure they read new vars (`--radius-button`, `--shadow-md`, `--border-width`).

A theme provider effect sets `data-personality="..."` on `<html>` based on `currentThemeAtom`.

---

## 7. Layout Personality (dual-engine system)

Two engines that share output shape, gated by a mode toggle.

### 7.1 Layout archetype catalog (Engine A)

| ID | Name | Slot composition |
|----|------|------------------|
| `marketing-landing` | Marketing Landing | header → hero → logo-cloud → features → testimonials → pricing → cta → footer |
| `app-dashboard` | App Dashboard | sidebar + header + (stat-cards · chart · table) |
| `app-workspace` | App Workspace (3-pane) | sidebar + (list · detail · meta) |
| `app-settings` | App Settings | top-nav + (settings-sidebar · form-section) |
| `auth-split` | Auth Split | image-panel + form-panel |
| `auth-centered` | Auth Centered | centered-form |
| `editorial` | Editorial / Content | header + hero + (content · meta-sidebar) + footer |
| `bento-showcase` | Bento Showcase | header + bento-grid + footer |

### 7.2 Slot library structure

```
src/lib/theme-kit/slots/
├── header/        (header-minimal, header-glass, header-bold)
├── hero/          (hero-centered, hero-split, hero-bento, hero-fullbleed)
├── features/      (features-3col, features-bento, features-alternating)
├── sidebar/       (sidebar-icon, sidebar-rich, sidebar-floating)
├── content/       (stat-cards, chart-area, data-table, kanban)
├── pricing/       (pricing-3col, pricing-comparison)
├── cta/           (cta-banner, cta-card)
└── footer/        (footer-minimal, footer-rich)
```

v1: ~25 components. Each consumes design tokens only (no hardcoded colors/spacing/shadows).

### 7.3 Engine A — parameterized templates

```ts
function generateLayoutTemplate(
  archetype: LayoutArchetype,
  axes: AxisSelection,
  narrative: Narrative,
): LayoutSpec {
  const slots = archetype.slots.map(slotDef => {
    const variants = filterByAxes(slotDef.variants, axes);
    const variant  = weightedChoice(
      variants.map(v => ({ item: v, weight: variantWeight(v, axes, narrative) }))
    );
    return { slotId: slotDef.id, variant, position: slotDef.position };
  });
  return { engine: 'template', archetype: archetype.id, slots };
}
```

### 7.4 Engine B — procedural composition (rules-based)

Not unconstrained procedural — rules-based recombination using design-system DNAs.

```ts
type DesignSystemDNA = {
  id: string;
  gridRules: GridRules;
  hierarchyRules: HierarchyRules;
  whitespaceRatio: [number, number];
  allowedSlots: string[];
  composition: CompositionRule[];
};
```

**5 DNAs in v1:** `swiss-grid`, `bauhaus`, `brutalist`, `editorial`, `magazine-bento`.

```ts
function generateProceduralLayout(
  dna: DesignSystemDNA, axes: AxisSelection, narrative: Narrative,
): LayoutSpec {
  const slotCount = sampleSlotCount(dna);
  const slotTypes = sampleSlotTypes(dna, slotCount);
  const slotOrder = applyCompositionRules(slotTypes, dna);
  const variants  = slotOrder.map(s => pickVariant(s, dna, axes, narrative));
  return { engine: 'procedural', archetype: dna.id, slots: variants };
}
```

### 7.5 Engine selection

```ts
type LayoutMode = 'template' | 'procedural' | 'auto';

function generateLayout(
  feel: Feel, tone: Tone, narrative: Narrative, axes: AxisSelection,
  mode: LayoutMode = 'auto',
): LayoutSpec {
  const engine = mode === 'auto'
    ? weightedChoice([
        { item: 'template',   weight: 7 },
        { item: 'procedural', weight: 3 },
      ])
    : mode;
  // ... dispatch
}
```

UI: segmented control next to existing feel/tone/font selectors. State stored in `engineModeAtom`.

### 7.6 LayoutSpec output type

Both engines emit the same shape — single renderer, no consumer fork:

```ts
type LayoutSpec = {
  engine: 'template' | 'procedural';
  archetype: string;        // archetype id (Engine A) or DNA id (Engine B)
  slots: {
    slotId: string;         // 'hero', 'sidebar', 'footer', etc.
    variant: string;        // resolves to a key in SLOT_REGISTRY
    position?: 'top' | 'bottom' | 'left' | 'right' | 'flow';
    props?: Record<string, unknown>; // forwarded to the slot component
  }[];
};
```

### 7.7 Renderer

```tsx
function LayoutPreview({ spec }: { spec: LayoutSpec }) {
  return (
    <div data-personality={currentTheme.axes.component}>
      {spec.slots.map(slot => {
        const SlotComponent = SLOT_REGISTRY[slot.variant];
        return <SlotComponent key={slot.slotId} position={slot.position} />;
      })}
    </div>
  );
}
```

Single renderer for both engines (same `LayoutSpec` shape).

---

## 8. Creative Differentiators

### 8.1 Theme identity

Every generated theme gets:

```ts
type ThemeIdentity = {
  name: string;            // "Aurora Drift"
  tagline: string;         // "Ethereal calm with one bold accent"
  designedFor: string;     // "Fintech dashboards selling trust"
  dna: DnaBadge;           // 5 small color-coded chips
  designSystemRef?: string; // "feels like Linear meets Apple Calendar"
};
```

`tagline` and `designedFor` are templated from dimensions via lookup tables in `src/lib/theme-kit/identity.ts`. No AI / no runtime cost.

### 8.2 Lock & shuffle

Every dimension is independently lockable. Re-roll preserves locked dimensions.

```ts
const lockedDimensionsAtom = atom<{
  feel: boolean; tone: boolean; narrative: boolean;
  axes: { shadow: boolean; border: boolean; surface: boolean; component: boolean };
  layout: boolean;
}>({ feel: false, tone: false, narrative: false, axes: {...}, layout: false });
```

UI: small lock icon next to each selector. Generator reads locks; only re-samples unlocked dimensions.

### 8.3 Multi-archetype switcher

Preview area gets a switcher to render the current theme on multiple layout archetypes:

```
Preview as:  [ Marketing ] [ Dashboard ] [ Workspace ] [ Auth ]
                              ↑ active
```

`previewArchetypeAtom` controls which archetype renders. `theme.layout.archetype` reflects the generator's pick (recommended one).

### 8.4 Shareable DNA URL

Theme = deterministic function of dimensions + seed. Every generation captures a `seed: number` (random uint32) that is the only stochastic input — given the same dimensions + seed, narrative palette assembly, axis sampling, and slot variant picks all produce identical output.

DNA URL structure:

```ts
type ThemeDNA = {
  feel: string;
  tone: string;
  narrative: string;
  axes: AxisSelection;
  layout: { mode: LayoutMode; archetypeOrDna: string };
  seed: number;
  v: number; // schema version, for future migrations
};

// Encode: btoa(JSON.stringify(dna)) → URL-safe base64
// URL: shadecraft.app/?dna=<base64>
```

Adds:
- "Copy permalink" button
- "Save to gallery" (localStorage stores arrays of DNA objects)
- Future: community gallery (DNAs become user-submitted entries)

The seed is set once at generation and stored on the theme object alongside DNA fields. Lock & shuffle (8.2) preserves seed for any locked dimension's stochastic sub-choices, advances seed for unlocked dimensions.

### 8.5 Variations panel

For any current theme, show 4 one-dimension-swapped variants:

```
↳ Same colors, different layout
↳ Same layout, calmer narrative
↳ Same everything, sharper components
↳ Same everything, dark signature
```

Implementation: re-run generator with selective dimension overrides.

---

## 9. Foundation Refactor (Phase 0)

Scoped strictly to what serves the new work.

| Item | What | Why |
|------|------|-----|
| Split `theme.ts` (313 LOC) | Orchestrator + `name.ts`, `chart.ts`, `sidebar.ts`, `hsl-rgb.ts` | New stages need clean plug-in points |
| Fix C1 (mutation in `generateCssVars` / `generateInlineTheme`) | Shallow-copy in both | Avoid corrupting Jotai store when adding new tokens |
| Fix C2 (broken regex `oklch$$...$$`) | Replace with `\(...\)` literal | HSL conversion currently silently broken |
| Move `hslToRgb`, `groupThemeTokens` | To `converters/` and `core/` | Cleanup |
| Remove production `console.log`s | Delete (3 occurrences in `theme.ts`) | Hygiene |
| Fix `seCurrentFont` typo | `setCurrentFont` | Hygiene |
| Add `cssVarsBuilder` helper | Composes light/dark token pairs cleanly | Keeps the flat object manageable as it grows |

**Acceptance:** existing themes generate identically; tests pass; no behavior visible to users.

---

## 10. Implementation Phases

| Phase | Scope | Duration | Independently shippable? |
|-------|-------|----------|--------------------------|
| **0** | Foundation refactor | 3-5 days | Yes (no behavior change) |
| **1** | Narratives | 5-7 days | Yes (palette structure variety) |
| **2** | Stylistic axes | 5-7 days | Yes (visual axis variety) |
| **3** | Slot library + Engine A | 10-15 days | Yes (layout variety) |
| **4** | Engine B + mode toggle | 5-7 days | Yes (procedural variety) |
| **5** | Creative differentiators | 5-7 days | Yes (product polish) |

**Total: 6-9 weeks** of focused work. Phases 0+1 (~2 weeks) deliver a meaningful improvement.

### Acceptance criteria per phase

- **Phase 0:** snapshot tests of existing built-in themes still pass.
- **Phase 1:** two themes with different narratives show clearly different *palette structure* (background type, accent placement, chroma distribution), not just different hues.
- **Phase 2:** a `flat + heavy + noise + sharp` brutalist theme is visually unmistakable from a `glow + accented + mesh + embossed` cyber theme — across colors, edges, shadows, surfaces, AND components.
- **Phase 3:** each generated theme renders on its picked layout archetype. Two themes feel structurally distinct.
- **Phase 4:** procedural mode produces structurally novel layouts that respect design rules. Auto mode mixes engines naturally.
- **Phase 5:** users can lock dimensions, share permalinks, view variations. Themes feel like keepable artifacts.

---

## 11. Open Questions / Followups

1. **Slot variants for marketing categories** — Tailark covers ~17 marketing categories with 5-22 variants each. Do we self-build slot variants, license/integrate Tailark, or hybrid?
2. **Preview performance** — rendering full layouts for every regeneration may be costly. Investigate memoization at the slot-component level and lazy-loading off-archetype slot variants.
3. **Built-in theme migration** — define exact default values for narrative/axes/layout for the existing built-in themes; one-time migration in Phase 1.
4. **Aceternity / Origin UI integration** — for Phase 5+, can we incorporate animated slot variants (e.g., Aceternity hero) without expanding the bundle excessively?
5. **Accessibility audit** — new axes (especially `glow` shadow + `mesh` surface) must pass WCAG contrast checks. Add automated check to generator that re-rolls if contrast fails.
6. **Storybook / Ladle** — slot variants benefit from an isolated dev environment. Consider adding before Phase 3.

---

## 12. References

- [shadcn/ui Blocks](https://ui.shadcn.com/blocks)
- [shadcn/ui Blocks changelog Feb 2026](https://ui.shadcn.com/docs/changelog/2026-02-blocks)
- [Tailark marketing blocks](https://tailark.com/)
- [Tailark Pro categories](https://pro.tailark.com/)
- [Aceternity UI shadcn-blocks](https://ui.aceternity.com/shadcn-blocks)
- [Origin UI](https://www.shadcn.io/template/origin-space-originui)
- [Best shadcn dashboard templates 2026](https://thefrontkit.com/blogs/best-shadcn-dashboard-templates-2026)
- [Existing internal audit](../../../CODEBASE_AUDIT_REPORT_v2.md) — informs Phase 0 refactor scope (C1, C2 findings).
