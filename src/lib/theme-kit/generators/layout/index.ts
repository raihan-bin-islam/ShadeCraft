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
