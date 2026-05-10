import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { oklchToCss } from "@/lib/theme-kit/converters/to-css";
import { ensureOklchContrast, hasGoodContrast, isOklchLight } from "@/lib/theme-kit/core";
import { adjustOklch, adjustOklchChroma, createOklchShade, createOklchTint } from "@/lib/theme-kit/core/adjustment";
import {
  getOklchAnalogous,
  getOklchComplementary,
  getOklchSplitComplementary,
  getOklchTetradic,
  getOklchTriadic,
} from "@/lib/theme-kit/core/harmony";
import { randomChoice, randomHueFromRanges, randomInRange } from "@/lib/utils";
import { rng } from "@/lib/theme-kit/rng";
import { OKLCH } from "@/types/theme-kit/color-space";
import { ColorHarmony } from "@/types/theme-kit/harmony";
import { Adjustment, Adjustments, BackgroundKey } from "@/types/theme-kit/palette";
import Color from "colorjs.io";

// Helper: extract OKLCH values from Color instance safely (without alpha)
const getOklch = (color: Color) => {
  const [l, c, h] = color.oklch;
  return { l, c, h };
};

export function generateBaseOklchColor(feel: (typeof THEME_FEELS_V4)[0]): Color {
  // const hue = randomChoice(feel.preferredHues) + randomInRange(-20, 20); // Add some variation
  const hue = randomHueFromRanges(feel?.preferredHueRanges);
  const lightness = randomInRange(feel.lightnessRange[0], feel.lightnessRange[1]);
  const chroma = randomInRange(feel.chromaRange[0], feel.chromaRange[1]);

  return new Color("oklch", [lightness, chroma, hue]);
}

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

  const usedAdjustments: Record<BackgroundKey, Adjustment> = {
    ...defaultAdjustments,
    ...adjustments,
  };

  const safeBase = base.toGamut({ method: "clip", space: "srgb" });
  const [, baseChroma, baseHue] = safeBase.oklch;

  const shouldUseComplementaryHue = rng() < 0.4;
  const baseHueForBg = shouldUseComplementaryHue ? (baseHue + 180) % 360 : baseHue;

  const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

  const results = {} as Record<BackgroundKey, Color>;

  (Object.keys(usedAdjustments) as BackgroundKey[]).forEach((key) => {
    const { lightness, chromaRatio, maxChroma = 0.04, lightnessVariance = 0 } = usedAdjustments[key];

    const hue = key === "background" ? baseHueForBg : baseHue;
    const adjustedLightness = clamp(lightness + (lightnessVariance ? rng() * lightnessVariance : 0), 0, 1);
    const adjustedChroma = clamp(chromaRatio * baseChroma, 0, maxChroma);

    const color = new Color("oklch", [adjustedLightness, adjustedChroma, hue]).toGamut({ method: "clip", space: "srgb" });

    results[key] = color;
  });

  return results;
}

export function generateOklchDarkBackgrounds(primaryColor: Color): Record<string, Color> {
  const { c, h } = getOklch(primaryColor);
  return {
    background: new Color("oklch", [0.15, Math.min(0.02, c * 0.3), h]),
    card: new Color("oklch", [0.3, Math.min(0.025, c * 0.35), h]),
    muted: new Color("oklch", [0.25, Math.min(0.03, c * 0.4), h]),
    border: new Color("oklch", [0.28, Math.min(0.035, c * 0.45), h]),
    input: new Color("oklch", [0.33, Math.min(0.032, c * 0.42), h]),
  };
}

export function generateOklchForeground(background: Color): Color {
  const { c, h, l } = getOklch(background);
  const light = isOklchLight(background);

  if (light) {
    return new Color("oklch", [0.15, Math.min(0.02, c * 0.5), h]);
  } else {
    return new Color("oklch", [0.95, Math.min(0.01, c * 0.3), h]);
  }
}

export function generateOklchSidebarColors(
  background: Color,
  foreground: Color,
  primary: Color,
  accent: Color,
  border: Color
): Record<string, string> {
  return {
    sidebar: oklchToCss(background),
    "sidebar-foreground": oklchToCss(foreground),
    "sidebar-primary": oklchToCss(primary),
    "sidebar-primary-foreground": oklchToCss(generateOklchForeground(primary)),
    "sidebar-accent": oklchToCss(accent),
    "sidebar-accent-foreground": oklchToCss(generateOklchForeground(accent)),
    "sidebar-border": oklchToCss(border),
    "sidebar-ring": oklchToCss(adjustOklch(primary, { chroma: -0.05 })),
  };
}

export function generateOklchChartColors(baseOklch: Color): Record<string, string> {
  const charts: Record<string, string> = {};
  const { l, c, h } = getOklch(baseOklch);

  for (let i = 1; i <= 5; i++) {
    const hueShift = (i - 1) * 72;
    const newHue = (h + hueShift) % 360;
    const chromaVariation = Math.min(0.25, c * (0.8 + i * 0.1));
    const lightnessVariation = Math.max(0.3, Math.min(0.8, l + (i % 2 === 0 ? 0.1 : -0.1)));

    const chartColor = new Color("oklch", [lightnessVariation, chromaVariation, newHue]);
    charts[`chart-${i}`] = oklchToCss(chartColor);
  }

  return charts;
}

export function generateOklchContrastPair(baseColor: Color): { background: Color; foreground: Color } {
  const background = baseColor;
  const foreground = generateOklchForeground(background);
  const adjustedForeground = ensureOklchContrast(foreground, background);
  console.log({ background, foreground, adjustedForeground });

  return {
    background,
    foreground: adjustedForeground,
  };
}

export function generateOklchColorPalette(baseColor: Color, harmony: ColorHarmony): Color[] {
  switch (harmony) {
    case "complementary":
      return [baseColor, getOklchComplementary(baseColor)];
    case "triadic":
      return [baseColor, ...getOklchTriadic(baseColor)];
    case "analogous":
      return [baseColor, ...getOklchAnalogous(baseColor)];
    case "splitComplementary":
      return [baseColor, ...getOklchSplitComplementary(baseColor)];
    case "tetradic":
      return [baseColor, ...getOklchTetradic(baseColor)];
    case "monochromatic":
      return [
        baseColor,
        adjustOklchChroma(createOklchShade(baseColor, 15), -5),
        adjustOklchChroma(createOklchTint(baseColor, 20), 5),
      ];
    default:
      return [baseColor, getOklchComplementary(baseColor)];
  }
}

export function generateDestructiveColor(): Color {
  // Red hue range in OKLCH — roughly 20° to 40°, but you can adjust as needed
  const redHueRange = [20, 40];
  const h = rng() * (redHueRange[1] - redHueRange[0]) + redHueRange[0];

  // Chroma: fairly saturated but not extreme
  const c = 0.18 + rng() * 0.1; // 0.18 to 0.28 approx.

  // Lightness: moderate for good visibility (adjust as needed)
  const l = 0.5 + rng() * 0.2; // 0.5 to 0.7 approx.

  return new Color("oklch", [l, c, h]);
}
