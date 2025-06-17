import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { oklchToCss } from "@/lib/theme-kit/converters/to-css";
import { ensureOklchContrast, isOklchLight } from "@/lib/theme-kit/core";
import { adjustOklch, adjustOklchChroma, createOklchShade, createOklchTint } from "@/lib/theme-kit/core/adjustment";
import {
  getOklchAnalogous,
  getOklchComplementary,
  getOklchSplitComplementary,
  getOklchTetradic,
  getOklchTriadic,
} from "@/lib/theme-kit/core/harmony";
import { randomChoice, randomInRange } from "@/lib/utils";
import { OKLCH } from "@/types/theme-kit/color-space";
import { ColorHarmony } from "@/types/theme-kit/harmony";

export function generateBaseOklchColor(feel: (typeof THEME_FEELS_V4)[0]): OKLCH {
  const hue = randomChoice(feel.preferredHues) + randomInRange(-20, 20); // Add some variation
  const lightness = randomInRange(feel.lightnessRange[0], feel.lightnessRange[1]);
  const chroma = randomInRange(feel.chromaRange[0], feel.chromaRange[1]);

  return {
    h: (hue + 360) % 360, // Ensure positive
    l: Math.max(0, Math.min(1, lightness)),
    c: Math.max(0, Math.min(0.4, chroma)),
  };
}

export function generateOklchBackgrounds(primaryColor: OKLCH): {
  background: OKLCH;
  card: OKLCH;
  muted: OKLCH;
  border: OKLCH;
  input: OKLCH;
} {
  // Create very light, desaturated backgrounds
  const background = {
    h: primaryColor.h,
    l: +(Math.random() * 0.02 + 0.98).toFixed(2),
    c: Math.min(0.005, primaryColor.c * 0.1),
  };

  const card = {
    h: primaryColor.h,
    l: 0.99,
    c: Math.min(0.003, primaryColor.c * 0.08),
  };

  const muted = {
    h: primaryColor.h,
    l: 0.95,
    c: Math.min(0.01, primaryColor.c * 0.15),
  };

  const border = {
    h: primaryColor.h,
    l: 0.9,
    c: Math.min(0.015, primaryColor.c * 0.2),
  };

  const input = {
    h: primaryColor.h,
    l: 0.92,
    c: Math.min(0.012, primaryColor.c * 0.18),
  };

  return { background, card, muted, border, input };
}

export function generateOklchDarkBackgrounds(primaryColor: OKLCH): {
  background: OKLCH;
  card: OKLCH;
  muted: OKLCH;
  border: OKLCH;
  input: OKLCH;
} {
  // Create very dark, slightly saturated backgrounds
  const background = {
    h: primaryColor.h,
    l: 0.15,
    c: Math.min(0.02, primaryColor.c * 0.3),
  };

  const card = {
    h: primaryColor.h,
    l: 0.3,
    c: Math.min(0.025, primaryColor.c * 0.35),
  };

  const muted = {
    h: primaryColor.h,
    l: 0.25,
    c: Math.min(0.03, primaryColor.c * 0.4),
  };

  const border = {
    h: primaryColor.h,
    l: 0.28,
    c: Math.min(0.035, primaryColor.c * 0.45),
  };

  const input = {
    h: primaryColor.h,
    l: 0.33,
    c: Math.min(0.032, primaryColor.c * 0.42),
  };

  return { background, card, muted, border, input };
}

export function generateOklchForeground(background: OKLCH): OKLCH {
  const isLight = isOklchLight(background);

  if (isLight) {
    // For light backgrounds, use dark text
    return {
      h: background.h,
      c: Math.min(0.02, background.c * 0.5), // Very low chroma for readability
      l: 0.15, // Very dark
    };
  } else {
    // For dark backgrounds, use light text
    return {
      h: background.h,
      c: Math.min(0.01, background.c * 0.3), // Very low chroma for readability
      l: 0.95, // Very light
    };
  }
}

export function generateOklchSidebarColors(
  background: OKLCH,
  foreground: OKLCH,
  primary: OKLCH,
  accent: OKLCH,
  border: OKLCH
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

export function generateOklchChartColors(baseOklch: OKLCH): Record<string, string> {
  const charts: Record<string, string> = {};

  // Generate 5 chart colors with different hues and chromas
  for (let i = 1; i <= 5; i++) {
    const hueShift = (i - 1) * 72; // 72 degrees apart for good contrast
    const newHue = (baseOklch.h + hueShift) % 360;
    const chromaVariation = Math.min(0.25, baseOklch.c * (0.8 + i * 0.1)); // Vary chroma slightly
    const lightnessVariation = Math.max(0.3, Math.min(0.8, baseOklch.l + (i % 2 === 0 ? 0.1 : -0.1)));

    const chartColor: OKLCH = {
      l: lightnessVariation,
      c: chromaVariation,
      h: newHue,
    };

    charts[`chart-${i}`] = oklchToCss(chartColor);
  }

  return charts;
}

export function generateOklchContrastPair(baseColor: OKLCH): { background: OKLCH; foreground: OKLCH } {
  const background = baseColor;
  const foreground = generateOklchForeground(background);
  const adjustedForeground = ensureOklchContrast(foreground, background);

  return {
    background,
    foreground: adjustedForeground,
  };
}

export function generateOklchColorPalette(baseColor: OKLCH, harmony: ColorHarmony): OKLCH[] {
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

// // Generate Beautiful Palette
// type ThemeTokens = {
//   primary: string; // HEX
//   secondary: string;
//   accent: string;
//   background: string;
// };

// type GenerateThemeOptions = {
//   mode?: "dark" | "light";
//   baseChroma?: number;
//   baseLightness?: number;
// };
// export function generateThemePalette(seedHue: number, options?: GenerateThemeOptions): ThemeTokens {
//   const baseHue = seedHue;
//   const bgLightness = 0.3 + rand(0, 0.05); // for dark themes
//   const accentDelta = rand(100, 140) * (rand(0, 1) > 0.5 ? 1 : -1);

//   return {
//     primary: oklch(0.65 + rand(-0.05, 0.05), 0.22 + rand(-0.02, 0.03), baseHue),
//     secondary: oklch(0.4 + rand(-0.03, 0.03), 0.05 + rand(-0.03, 0.03), baseHue + rand(-15, 15)),
//     accent: oklch(0.45 + rand(-0.05, 0.05), 0.12 + rand(-0.03, 0.03), baseHue + accentDelta),
//     background: oklch(bgLightness, 0.02 + rand(0, 0.02), baseHue + rand(-20, 20)),
//   };
// }
