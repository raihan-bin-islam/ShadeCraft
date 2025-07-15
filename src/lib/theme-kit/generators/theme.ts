import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { hexToOklch, oklchToCss, oklchToHsl } from "@/lib/theme-kit/converters";
import { ensureOklchContrast } from "@/lib/theme-kit/core";

import { adjustOklch, adjustOklchChroma, createOklchShade, createOklchTint } from "@/lib/theme-kit/core/adjustment";
import { generateBalancedTheme } from "@/lib/theme-kit/palettes/balanced";

import {
  generateBaseOklchColor,
  generateOklchBackgrounds,
  generateOklchChartColors,
  generateOklchColorPalette,
  generateOklchContrastPair,
  generateOklchDarkBackgrounds,
  generateOklchForeground,
  generateOklchSidebarColors,
} from "@/lib/theme-kit/palettes/default";

import { randomChoice } from "@/lib/utils";

import type { ColorHarmony, OKLCH, TailwindV4Theme } from "@/types/theme-kit";

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

  const paletteBalancedOklch: OKLCH[] = [
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
  const background = palette[3] || primary;

  const colorNames = ["Crimson", "Azure", "Emerald", "Amber", "Violet", "Coral", "Teal", "Rose", "Sage", "Indigo"];
  const suffixes = ["Dream", "Mist", "Glow", "Bloom", "Zen", "Vibe", "Flow", "Spark", "Aura", "Wave"];
  const themeName = `${randomChoice(colorNames)} ${randomChoice(suffixes)}`;

  const lightBgs = generateOklchBackgrounds(background);
  const darkBgs = generateOklchDarkBackgrounds(background);

  const primaryPair = generateOklchContrastPair(primary);
  const secondaryPair = generateOklchContrastPair(secondary);
  const accentPair = generateOklchContrastPair(accent);

  const destructive: OKLCH = { h: 0, l: 0.55, c: 0.22 }; // Red in OKLCH
  const destructiveDark: OKLCH = { h: 0, l: 0.6, c: 0.25 };

  const cssVars = {
    toneId: tone.id,
    feelId: feel.id,
    fontFamily: font.className,
    fontName: font.name,
    radius: tone.radius,
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
    "muted-foreground": oklchToCss({ ...lightBgs.muted, l: 0.6 }),
    accent: oklchToCss(accentPair.background),
    "accent-foreground": oklchToCss(accentPair.foreground),
    destructive: oklchToCss(destructive),
    "destructive-foreground": oklchToCss(generateOklchForeground(destructive)),
    border: oklchToCss(lightBgs.border),
    input: oklchToCss(lightBgs.input),
    ring: oklchToCss(primary),

    "dark-toneId": tone.id,
    "dark-feelId": feel.id,
    "dark-fontFamily": font.className,
    "dark-fontName": font.name,
    "dark-radius": tone.radius,
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
    "dark-muted-foreground": oklchToCss({ ...lightBgs.muted, l: 0.5 }),
    "dark-accent": oklchToCss(createOklchTint(accentPair.background, 15)),
    "dark-accent-foreground": oklchToCss(ensureOklchContrast(accentPair.foreground, createOklchTint(accentPair.background, 15))),
    "dark-destructive": oklchToCss(destructiveDark),
    "dark-destructive-foreground": oklchToCss(generateOklchForeground(destructiveDark)),
    "dark-border": oklchToCss(darkBgs.border),
    "dark-input": oklchToCss(darkBgs.input),
    "dark-ring": oklchToCss(createOklchTint(primary, 10)),
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

  // Add sidebar colors (light mode) - create subtle lightness difference for better contrast
  const lightSidebarBg = adjustOklch(lightBgs.background, { lightness: -0.02 }); // Slightly darker than main background
  const sidebarColors = generateOklchSidebarColors(
    lightSidebarBg,
    generateOklchForeground(lightSidebarBg),
    primary,
    accent,
    adjustOklch(lightBgs.border, { lightness: -0.01 }) // Slightly darker border
  );
  Object.assign(cssVars, sidebarColors);

  // Add dark mode sidebar colors - create subtle lightness difference for better contrast
  const darkSidebarBg = adjustOklch(darkBgs.background, { lightness: 0.1 }); // Slightly lighter than main background
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
        const match = value.match(/oklch$$([^)]+)$$/);
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

  const hslToRgb = (hsl: { h: number; s: number; l: number }) => {
    const h = hsl.h / 360;
    const s = hsl.s / 100;
    const l = hsl.l / 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    if (s === 0) {
      const gray = Math.round(l * 255);
      return { r: gray, g: gray, b: gray };
    }

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    return {
      r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
      g: Math.round(hue2rgb(p, q, h) * 255),
      b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
    };
  };

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

export function generateThemeFromBrandColors(primary: string, secondary?: string, accent?: string) {
  const primaryOklch = hexToOklch(primary);
  const secondaryOklch = secondary
    ? hexToOklch(secondary)
    : {
        l: primaryOklch.l * 0.9,
        c: primaryOklch.c * 0.7,
        h: (primaryOklch.h + 30) % 360,
      };
  const accentOklch = accent
    ? hexToOklch(accent)
    : {
        l: primaryOklch.l * 1.1,
        c: primaryOklch.c * 0.8,
        h: (primaryOklch.h + 180) % 360,
      };

  return {
    light: {
      background: { l: 0.98, c: 0.003, h: primaryOklch.h },
      foreground: { l: 0.15, c: 0.02, h: primaryOklch.h },
      card: { l: 0.99, c: 0.002, h: primaryOklch.h },
      cardForeground: { l: 0.15, c: 0.02, h: primaryOklch.h },
      popover: { l: 0.99, c: 0.002, h: primaryOklch.h },
      popoverForeground: { l: 0.15, c: 0.02, h: primaryOklch.h },
      primary: primaryOklch,
      primaryForeground: { l: 0.98, c: 0.005, h: 0 },
      secondary: secondaryOklch,
      secondaryForeground: { l: 0.15, c: 0.02, h: 0 },
      muted: { l: 0.95, c: 0.01, h: primaryOklch.h },
      mutedForeground: { l: 0.55, c: 0.02, h: primaryOklch.h },
      accent: accentOklch,
      accentForeground: { l: 0.15, c: 0.02, h: 0 },
      destructive: { l: 0.577, c: 0.245, h: 27.325 },
      destructiveForeground: { l: 0.98, c: 0.005, h: 0 },
      border: { l: 0.92, c: 0.01, h: primaryOklch.h },
      input: { l: 0.92, c: 0.01, h: primaryOklch.h },
      ring: primaryOklch,
      chart1: primaryOklch,
      chart2: secondaryOklch,
      chart3: accentOklch,
      chart4: { l: 0.828, c: 0.189, h: 84.429 },
      chart5: { l: 0.769, c: 0.188, h: 70.08 },
    },
    dark: {
      background: { l: 0.14, c: 0.02, h: primaryOklch.h },
      foreground: { l: 0.98, c: 0.005, h: primaryOklch.h },
      card: { l: 0.16, c: 0.02, h: primaryOklch.h },
      cardForeground: { l: 0.98, c: 0.005, h: primaryOklch.h },
      popover: { l: 0.16, c: 0.02, h: primaryOklch.h },
      popoverForeground: { l: 0.98, c: 0.005, h: primaryOklch.h },
      primary: { ...primaryOklch, l: Math.min(0.9, primaryOklch.l * 1.2) },
      primaryForeground: { l: 0.16, c: 0.02, h: primaryOklch.h },
      secondary: { l: 0.269, c: 0.05, h: secondaryOklch.h },
      secondaryForeground: { l: 0.98, c: 0.005, h: primaryOklch.h },
      muted: { l: 0.269, c: 0.02, h: primaryOklch.h },
      mutedForeground: { l: 0.708, c: 0.02, h: primaryOklch.h },
      accent: { ...accentOklch, l: Math.min(0.8, accentOklch.l * 0.8) },
      accentForeground: { l: 0.16, c: 0.02, h: primaryOklch.h },
      destructive: { l: 0.396, c: 0.141, h: 25.723 },
      destructiveForeground: { l: 0.637, c: 0.237, h: 25.331 },
      border: { l: 0.269, c: 0.02, h: primaryOklch.h },
      input: { l: 0.269, c: 0.02, h: primaryOklch.h },
      ring: { ...primaryOklch, l: Math.max(0.2, primaryOklch.l * 0.6) },
      chart1: { ...primaryOklch, l: Math.max(0.2, primaryOklch.l * 0.8) },
      chart2: { ...secondaryOklch, l: Math.max(0.2, secondaryOklch.l * 0.9) },
      chart3: accentOklch,
      chart4: { l: 0.627, c: 0.265, h: 303.9 },
      chart5: { l: 0.645, c: 0.246, h: 16.439 },
    },
  };
}
