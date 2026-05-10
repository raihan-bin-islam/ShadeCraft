import {
  AXES,
  type AxisCatalog,
  type AxisPreferences,
  type AxisSelection,
  type BorderId,
  type ComponentId,
  type ShadowId,
  type SurfaceId,
} from "@/config/theme-axes";
import { weightedChoice } from "@/lib/utils";

type AxisName = keyof AxisCatalog;

interface SampleAxesParams {
  feelPreferences?: AxisPreferences;
  tonePreferences?: AxisPreferences;
}

function pickAxisVariant<Id extends string>(
  variants: { id: Id }[],
  feelWeights?: Partial<Record<Id, number>>,
  toneWeights?: Partial<Record<Id, number>>
): Id {
  const weighted = variants.map((variant) => {
    const feelWeight = feelWeights?.[variant.id] ?? 1;
    const toneWeight = toneWeights?.[variant.id] ?? 1;
    return { item: variant.id, weight: feelWeight * toneWeight };
  });
  return weightedChoice(weighted);
}

/**
 * Picks one variant per axis (shadow / border / surface / component) using
 * weighted choice. Weights come from multiplying the feel's per-axis preference
 * by the tone's per-axis preference; missing preferences default to 1 (uniform).
 */
export function sampleAxes(params: SampleAxesParams = {}): AxisSelection {
  return {
    shadow: pickAxisVariant<ShadowId>(AXES.shadow, params.feelPreferences?.shadow, params.tonePreferences?.shadow),
    border: pickAxisVariant<BorderId>(AXES.border, params.feelPreferences?.border, params.tonePreferences?.border),
    surface: pickAxisVariant<SurfaceId>(AXES.surface, params.feelPreferences?.surface, params.tonePreferences?.surface),
    component: pickAxisVariant<ComponentId>(
      AXES.component,
      params.feelPreferences?.component,
      params.tonePreferences?.component
    ),
  };
}

/**
 * Returns the flat CSS-var record for a given axis selection by merging the
 * four chosen variants' cssVars. Keys are the unprefixed token names
 * (consistent with the existing cssVarsBuilder convention).
 */
export function getAxisCssVars(selection: AxisSelection): Record<string, string> {
  const merged: Record<string, string> = {};

  const shadowVariant = AXES.shadow.find((v) => v.id === selection.shadow);
  const borderVariant = AXES.border.find((v) => v.id === selection.border);
  const surfaceVariant = AXES.surface.find((v) => v.id === selection.surface);
  const componentVariant = AXES.component.find((v) => v.id === selection.component);

  if (shadowVariant) Object.assign(merged, shadowVariant.cssVars);
  if (borderVariant) Object.assign(merged, borderVariant.cssVars);
  if (surfaceVariant) Object.assign(merged, surfaceVariant.cssVars);
  if (componentVariant) Object.assign(merged, componentVariant.cssVars);

  return merged;
}

export type { AxisName };
