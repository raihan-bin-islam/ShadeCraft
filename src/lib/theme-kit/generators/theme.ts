import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { hslToRgb, oklchToCss, oklchToHsl } from "@/lib/theme-kit/converters";
import { createCssVarsBuilder, ensureOklchContrast, getReadableForeground, groupThemeTokens } from "@/lib/theme-kit/core";

import { adjustOklchChroma, createOklchShade, createOklchTint } from "@/lib/theme-kit/core/adjustment";
import { generateThemeName } from "./theme-name";
import { generateChartTokens } from "./chart-tokens";
import { generateSidebarTokens } from "./sidebar-tokens";
import { generateNarrativePalette, pickNarrative } from "./narrative";
import { getAxisCssVars, sampleAxes } from "./axes";
import { generateLayout } from "./layout";

import {
  generateDestructiveColor,
  generateOklchBackgrounds,
  generateOklchDarkBackgrounds,
  generateOklchForeground,
} from "@/lib/theme-kit/palettes/default";

import { randomChoice } from "@/lib/utils";

import type { OKLCH, TailwindV4Theme } from "@/types/theme-kit";
import Color from "colorjs.io";
type GenerateThemeParams = {
  feel?: (typeof THEME_FEELS_V4)[0];
  tone?: (typeof TONES)[0];
  font?: (typeof TONES)[0]["fonts"][0];
};

export function generateTailwindV4Theme(params?: GenerateThemeParams): TailwindV4Theme {
  const feel = params?.feel ?? randomChoice(THEME_FEELS_V4);
  const tone = params?.tone ?? randomChoice(TONES);
  const font = params?.font ?? randomChoice(tone.fonts);
  const narrative = pickNarrative(feel);
  const axes = sampleAxes({
    feelPreferences: feel.axisPreferences,
    tonePreferences: tone.axisPreferences,
  });
  const layout = generateLayout({ feel, tone, narrative, axes });
  const palette = generateNarrativePalette(narrative, feel);

  // Selected Palette
  const primary = palette[0];
  const secondary = palette[1] || adjustOklchChroma(createOklchTint(primary, 20), -0.03);
  const accent = palette[2] || adjustOklchChroma(createOklchShade(primary, 10), 0.02);
  const background = palette[3] || secondary;

  const themeName = generateThemeName();

  const lightBgs = generateOklchBackgrounds(background, undefined, {
    lightness: narrative.background.lightness[1], // upper bound — gives layered tokens room to shift down
    maxChroma: narrative.background.saturated ? narrative.background.chroma[1] : undefined,
  });
  const darkBgs = generateOklchDarkBackgrounds(background);

  const primaryPair = getReadableForeground(primary);

  const secondaryPair = getReadableForeground(secondary);
  const accentPair = getReadableForeground(accent);

  const destructive = generateDestructiveColor(); // Red in OKLCH
  const destructiveDark = new Color("oklch", [Math.min(1, destructive.l + 0.05), destructive.c, destructive.h]);

  const cssVars = createCssVarsBuilder()
    .light({
      background: oklchToCss(lightBgs.background),
      foreground: oklchToCss(generateOklchForeground(lightBgs.background)),
      card: oklchToCss(lightBgs.card),
      "card-foreground": oklchToCss(generateOklchForeground(lightBgs.card)),
      popover: oklchToCss(lightBgs.card),
      "popover-foreground": oklchToCss(generateOklchForeground(lightBgs.card)),
      primary: oklchToCss(primaryPair.background),
      "primary-foreground": oklchToCss(primaryPair.foreground),
      secondary: oklchToCss(secondaryPair.background),
      "secondary-foreground": oklchToCss(secondaryPair.foreground),
      muted: oklchToCss(lightBgs.muted),
      "muted-foreground": oklchToCss(lightBgs.muted.set("oklch.l", 0.6)),
      accent: oklchToCss(accentPair.background),
      "accent-foreground": oklchToCss(accentPair.foreground),
      destructive: oklchToCss(destructive),
      "destructive-foreground": oklchToCss(generateOklchForeground(destructive)),
      border: oklchToCss(lightBgs.border),
      input: oklchToCss(lightBgs.input),
      ring: oklchToCss(primary),
    })
    .dark({
      background: oklchToCss(darkBgs.background),
      foreground: oklchToCss(generateOklchForeground(darkBgs.background)),
      card: oklchToCss(darkBgs.card),
      "card-foreground": oklchToCss(generateOklchForeground(darkBgs.card)),
      popover: oklchToCss(darkBgs.card),
      "popover-foreground": oklchToCss(generateOklchForeground(darkBgs.card)),
      primary: oklchToCss(createOklchTint(primaryPair.background, 10)),
      "primary-foreground": oklchToCss(
        ensureOklchContrast(primaryPair.foreground, createOklchTint(primaryPair.background, 10))
      ),
      secondary: oklchToCss(createOklchTint(secondaryPair.background, 15)),
      "secondary-foreground": oklchToCss(
        ensureOklchContrast(secondaryPair.foreground, createOklchTint(secondaryPair.background, 15))
      ),
      muted: oklchToCss(darkBgs.muted),
      "muted-foreground": oklchToCss(lightBgs.muted.set("oklch.l", 0.5)),
      accent: oklchToCss(createOklchTint(accentPair.background, 15)),
      "accent-foreground": oklchToCss(ensureOklchContrast(accentPair.foreground, createOklchTint(accentPair.background, 15))),
      destructive: oklchToCss(destructiveDark),
      "destructive-foreground": oklchToCss(generateOklchForeground(destructiveDark)),
      border: oklchToCss(darkBgs.border),
      input: oklchToCss(darkBgs.input),
      ring: oklchToCss(createOklchTint(primary, 10)),
    })
    .both({
      toneId: tone.id,
      feelId: feel.id,
      fontFamily: font.className,
      fontName: `${font.name}, ${font.fallback}`,
      radius: tone.radius,
    })
    .merge(generateChartTokens(primary))
    .merge(
      generateSidebarTokens({
        light: { background: lightBgs.background, border: lightBgs.border },
        dark: { background: darkBgs.background, border: darkBgs.border },
        primary,
        accent,
        lightForegroundCandidates: {
          primary: primaryPair.foreground,
          secondary: secondaryPair.foreground,
          accent: accentPair.foreground,
        },
        darkBackgroundCandidates: {
          primary: primaryPair.background,
          secondary: secondaryPair.background,
          accent: accentPair.background,
        },
      })
    )
    .both(getAxisCssVars(axes))
    .build();

  const hslVars: Record<string, string> = {};
  Object.entries(cssVars).forEach(([key, value]) => {
    // This is a simplified conversion - in production you'd want more accurate conversion
    if (value.includes("oklch")) {
      try {
        // Parse OKLCH and convert to HSL approximation
        const match = value.match(/oklch\(([^)]+)\)/);
        if (match) {
          const parts = match[1].split(/\s+/);
          if (parts.length >= 3) {
            const oklch: OKLCH = {
              l: Number.parseFloat(parts[0]),
              c: Number.parseFloat(parts[1]),
              h: Number.parseFloat(parts[2]),
            };
            const hsl = oklchToHsl(oklch);
            hslVars[key] = `${hsl.h.toFixed(1)} ${hsl.s.toFixed(1)}% ${hsl.l.toFixed(1)}%`;
          }
        }
      } catch {
        hslVars[key] = value; // Fallback to original
      }
    } else {
      hslVars[key] = value;
    }
  });

  const primaryHsl = oklchToHsl(primary);
  const secondaryHsl = oklchToHsl(secondary);
  const accentHsl = oklchToHsl(accent);
  const lightBgHsl = oklchToHsl(lightBgs.background);
  const darkBgHsl = oklchToHsl(darkBgs.background);

  const primaryRgb = hslToRgb(primaryHsl);
  const secondaryRgb = hslToRgb(secondaryHsl);
  const accentRgb = hslToRgb(accentHsl);
  const lightBgRgb = hslToRgb(lightBgHsl);
  const darkBgRgb = hslToRgb(darkBgHsl);

  return {
    name: themeName,
    description: feel.description,
    feel: feel.name,
    narrative: narrative.id,
    axes,
    layout,
    tone,
    theme: groupThemeTokens(cssVars),
    cssVars: groupThemeTokens(cssVars),
    hslVars,
    previewColors: {
      primary: `rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`,
      secondary: `rgb(${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b})`,
      accent: `rgb(${accentRgb.r}, ${accentRgb.g}, ${accentRgb.b})`,
      lightBg: `rgb(${lightBgRgb.r}, ${lightBgRgb.g}, ${lightBgRgb.b})`,
      darkBg: `rgb(${darkBgRgb.r}, ${darkBgRgb.g}, ${darkBgRgb.b})`,
    },
  };
}

export function generateTailwindV4ThemeCollection(count = 5): TailwindV4Theme[] {
  const themes: TailwindV4Theme[] = [];
  const usedFeels = new Set<string>();

  for (let i = 0; i < count; i++) {
    let theme = generateTailwindV4Theme();

    // Try to avoid duplicate feels in the same collection
    let attempts = 0;
    while (usedFeels.has(theme.feel) && attempts < 10) {
      theme = generateTailwindV4Theme();
      attempts++;
    }

    usedFeels.add(theme.feel);
    themes.push(theme);
  }

  return themes;
}
