import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { NARRATIVES, type Narrative } from "@/config/theme-narratives";
import { randomHueFromRanges, randomInRange, weightedChoice } from "@/lib/utils";
import Color from "colorjs.io";

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
