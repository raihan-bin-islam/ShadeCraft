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
