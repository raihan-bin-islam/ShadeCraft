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
