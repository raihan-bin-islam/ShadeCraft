import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { hexToOklch, hslToRgb, oklchToCss, oklchToHsl } from "@/lib/theme-kit/converters";
import { ensureOklchContrast, getReadableForeground } from "@/lib/theme-kit/core";

import { adjustOklch, adjustOklchChroma, createOklchShade, createOklchTint } from "@/lib/theme-kit/core/adjustment";
import { generateBalancedTheme } from "@/lib/theme-kit/palettes/balanced";

import {
  generateBaseOklchColor,
  generateDestructiveColor,
  generateOklchBackgrounds,
  generateOklchChartColors,
  generateOklchColorPalette,
  generateOklchContrastPair,
  generateOklchDarkBackgrounds,
  generateOklchForeground,
  generateOklchSidebarColors,
} from "@/lib/theme-kit/palettes/default";

import { randomChoice, weightedChoice } from "@/lib/utils";

import type { ColorHarmony, OKLCH, TailwindV4Theme } from "@/types/theme-kit";
import Color from "colorjs.io";

const groupThemeTokens = (theme: Record<string, string>) => {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  for (const [key, value] of Object.entries(theme)) {
    if (key.startsWith("dark-")) {
      dark[key.replace(/^dark-/, "")] = value;
    } else {
      light[key] = value;
    }
  }

  return { light, dark };
};

type GenerateThemeParams = {
  feel?: (typeof THEME_FEELS_V4)[0];
  tone?: (typeof TONES)[0];
  font?: (typeof TONES)[0]["fonts"][0];
};

export function generateTailwindV4Theme(params?: GenerateThemeParams): TailwindV4Theme {
  console.log({ defaultFont: params?.font });

  const feel = params?.feel ?? randomChoice(THEME_FEELS_V4);
  const tone = params?.tone ?? randomChoice(TONES);
  const font = params?.font ?? randomChoice(tone.fonts);
  const harmony = randomChoice<ColorHarmony>([
    "complementary",
    "triadic",
    "analogous",
    "splitComplementary",
    "tetradic",
    "monochromatic",
  ]);

  const baseColor = generateBaseOklchColor(feel);
  const randomHue = randomChoice(feel.preferredHues);

  const paletteDefault = generateOklchColorPalette(baseColor, harmony); // This was the main theme before
  const paletteBalanced = generateBalancedTheme(randomHue); // We have now added a balanced theme palette too

  const paletteBalancedOklch: Color[] = [
    paletteBalanced.primary,
    paletteBalanced.secondary,
    paletteBalanced.accent,
    paletteBalanced.background,
  ];

  const palettes = [paletteDefault, paletteBalancedOklch];
  const palette = randomChoice(palettes); // Finally here we choose between the balanced and default palette randomly

  // Selected Palette
  const primary = palette[0];
  const secondary = palette[1] || adjustOklchChroma(createOklchTint(primary, 20), -0.03);
  const accent = palette[2] || adjustOklchChroma(createOklchShade(primary, 10), 0.02);
  const background = palette[3] || secondary;

  const colorNames = ["Crimson", "Azure", "Emerald", "Amber", "Violet", "Coral", "Teal", "Rose", "Sage", "Indigo"];
  const suffixes = ["Dream", "Mist", "Glow", "Bloom", "Zen", "Vibe", "Flow", "Spark", "Aura", "Wave"];
  const themeName = `${randomChoice(colorNames)} ${randomChoice(suffixes)}`;

  const lightBgs = generateOklchBackgrounds(background);
  const darkBgs = generateOklchDarkBackgrounds(background);

  const primaryPair = getReadableForeground(primary);
  console.log({ primaryPair });

  const secondaryPair = getReadableForeground(secondary);
  const accentPair = getReadableForeground(accent);

  const destructive = generateDestructiveColor(); // Red in OKLCH
  const destructiveDark = new Color("oklch", [Math.min(1, destructive.l + 0.05), destructive.c, destructive.h]);

  console.log({ muted: lightBgs.muted, dark: darkBgs.muted });

  const cssVars = {
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
    toneId: tone.id,
    feelId: feel.id,
    fontFamily: font.className,
    fontName: `${font.name}, ${font.fallback}`,
    radius: tone.radius,

    "dark-background": oklchToCss(darkBgs.background),
    "dark-foreground": oklchToCss(generateOklchForeground(darkBgs.background)),
    "dark-card": oklchToCss(darkBgs.card),
    "dark-card-foreground": oklchToCss(generateOklchForeground(darkBgs.card)),
    "dark-popover": oklchToCss(darkBgs.card),
    "dark-popover-foreground": oklchToCss(generateOklchForeground(darkBgs.card)),
    "dark-primary": oklchToCss(createOklchTint(primaryPair.background, 10)),
    "dark-primary-foreground": oklchToCss(
      ensureOklchContrast(primaryPair.foreground, createOklchTint(primaryPair.background, 10))
    ),
    "dark-secondary": oklchToCss(createOklchTint(secondaryPair.background, 15)),
    "dark-secondary-foreground": oklchToCss(
      ensureOklchContrast(secondaryPair.foreground, createOklchTint(secondaryPair.background, 15))
    ),
    "dark-muted": oklchToCss(darkBgs.muted),
    "dark-muted-foreground": oklchToCss(lightBgs.muted.set("oklch.l", 0.5)),
    "dark-accent": oklchToCss(createOklchTint(accentPair.background, 15)),
    "dark-accent-foreground": oklchToCss(ensureOklchContrast(accentPair.foreground, createOklchTint(accentPair.background, 15))),
    "dark-destructive": oklchToCss(destructiveDark),
    "dark-destructive-foreground": oklchToCss(generateOklchForeground(destructiveDark)),
    "dark-border": oklchToCss(darkBgs.border),
    "dark-input": oklchToCss(darkBgs.input),
    "dark-ring": oklchToCss(createOklchTint(primary, 10)),
    "dark-toneId": tone.id,
    "dark-feelId": feel.id,
    "dark-fontFamily": font.className,
    "dark-fontName": `${font.name}, ${font.fallback}`,
    "dark-radius": tone.radius,
  };

  // Add chart colors (light mode)
  const chartColors = generateOklchChartColors(primary);
  Object.assign(cssVars, chartColors);

  // Add dark mode chart colors
  const darkChartColors = generateOklchChartColors(createOklchTint(primary, 10));
  const darkChartVars: Record<string, string> = {};
  Object.entries(darkChartColors).forEach(([key, value]) => {
    darkChartVars[`dark-${key}`] = value;
  });
  Object.assign(cssVars, darkChartVars);

  const lightSidebarBase = [lightBgs.background, accentPair.foreground, secondaryPair.foreground, primaryPair.foreground];
  const darkSidebarBase = [darkBgs.background, accentPair.background, secondaryPair.background, primaryPair.background];

  const totalWeight = 100;
  const mostDesiredBgWeight = 80;
  const indicesWithWeight = lightSidebarBase.map((_, item, arr) => ({
    item,
    weight: item === 0 ? mostDesiredBgWeight : (totalWeight - mostDesiredBgWeight) / arr.length,
  }));

  const chosenIndex = weightedChoice(indicesWithWeight);

  // Add sidebar colors (light mode) - create subtle lightness difference for better contrast
  const lightSidebarBg = adjustOklch(lightSidebarBase[chosenIndex], { lightness: -0.02 }); // Slightly darker than main background
  const sidebarColors = generateOklchSidebarColors(
    lightSidebarBg,
    generateOklchForeground(lightSidebarBg),
    primary,
    accent,
    adjustOklch(lightBgs.border, { lightness: -0.01 }) // Slightly darker border
  );
  Object.assign(cssVars, sidebarColors);

  // Add dark mode sidebar colors - create subtle lightness difference for better contrast
  const darkSidebarBg = adjustOklch(darkSidebarBase[chosenIndex], { lightness: 0.1 }); // Slightly lighter than main background
  const darkSidebarColors = generateOklchSidebarColors(
    darkSidebarBg,
    generateOklchForeground(darkSidebarBg),
    createOklchTint(primary, 10),
    createOklchTint(accent, 15),
    adjustOklch(darkBgs.border, { lightness: 0.02 }) // Slightly lighter border
  );
  const darkSidebarVars: Record<string, string> = {};
  Object.entries(darkSidebarColors).forEach(([key, value]) => {
    darkSidebarVars[`dark-${key}`] = value;
  });
  Object.assign(cssVars, darkSidebarVars);

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
