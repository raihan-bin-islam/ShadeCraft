import { THEME_FEELS_V4 } from "@/config/theme-feels";
import {
  type OKLCH,
  oklchToCss,
  createOklchTint,
  createOklchShade,
  adjustOklchChroma,
  getOklchComplementary,
  getOklchTriadic,
  getOklchAnalogous,
  getOklchSplitComplementary,
  getOklchTetradic,
  generateOklchForeground,
  ensureOklchContrast,
  generateOklchContrastPair,
  generateOklchChartColors,
  generateOklchSidebarColors,
  oklchToHsl,
} from "./oklch-converter";

export interface TailwindV4Theme {
  name: string;
  description: string;
  feel: string;
  cssVars: { light: Record<string, string>; dark: Record<string, string> };
  hslVars?: Record<string, string>;
  previewColors: {
    primary: string;
    secondary: string;
    accent: string;
    lightBg: string;
    darkBg: string;
  };
}

type ColorHarmony = "complementary" | "triadic" | "analogous" | "splitComplementary" | "tetradic" | "monochromatic";

function randomInRange(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function randomChoice<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateBaseOklchColor(feel: (typeof THEME_FEELS_V4)[0]): OKLCH {
  const hue = randomChoice(feel.preferredHues) + randomInRange(-20, 20); // Add some variation
  const lightness = randomInRange(feel.lightnessRange[0], feel.lightnessRange[1]);
  const chroma = randomInRange(feel.chromaRange[0], feel.chromaRange[1]);

  return {
    h: (hue + 360) % 360, // Ensure positive
    l: Math.max(0, Math.min(1, lightness)),
    c: Math.max(0, Math.min(0.4, chroma)),
  };
}

function generateOklchColorPalette(baseColor: OKLCH, harmony: ColorHarmony): OKLCH[] {
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

function generateOklchBackgrounds(primaryColor: OKLCH): {
  background: OKLCH;
  card: OKLCH;
  muted: OKLCH;
  border: OKLCH;
  input: OKLCH;
} {
  // Create very light, desaturated backgrounds
  const background = {
    h: primaryColor.h,
    l: 0.98,
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

function generateOklchDarkBackgrounds(primaryColor: OKLCH): {
  background: OKLCH;
  card: OKLCH;
  muted: OKLCH;
  border: OKLCH;
  input: OKLCH;
} {
  // Create very dark, slightly saturated backgrounds
  const background = {
    h: primaryColor.h,
    l: 0.1,
    c: Math.min(0.02, primaryColor.c * 0.3),
  };

  const card = {
    h: primaryColor.h,
    l: 0.2,
    c: Math.min(0.025, primaryColor.c * 0.35),
  };

  const muted = {
    h: primaryColor.h,
    l: 0.15,
    c: Math.min(0.03, primaryColor.c * 0.4),
  };

  const border = {
    h: primaryColor.h,
    l: 0.25,
    c: Math.min(0.035, primaryColor.c * 0.45),
  };

  const input = {
    h: primaryColor.h,
    l: 0.1,
    c: Math.min(0.032, primaryColor.c * 0.42),
  };

  return { background, card, muted, border, input };
}

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

export function generateTailwindV4Theme(): TailwindV4Theme {
  const feel = randomChoice(THEME_FEELS_V4);
  const harmony = randomChoice<ColorHarmony>([
    "complementary",
    "triadic",
    "analogous",
    "splitComplementary",
    "tetradic",
    "monochromatic",
  ]);

  const baseColor = generateBaseOklchColor(feel);
  const palette = generateOklchColorPalette(baseColor, harmony);

  const primary = palette[0];
  const secondary = palette[1] || adjustOklchChroma(createOklchTint(primary, 20), -0.03);
  const accent = palette[2] || adjustOklchChroma(createOklchShade(primary, 10), 0.02);

  const colorNames = ["Crimson", "Azure", "Emerald", "Amber", "Violet", "Coral", "Teal", "Rose", "Sage", "Indigo"];
  const suffixes = ["Dream", "Mist", "Glow", "Bloom", "Zen", "Vibe", "Flow", "Spark", "Aura", "Wave"];
  const themeName = `${randomChoice(colorNames)} ${randomChoice(suffixes)}`;

  const lightBgs = generateOklchBackgrounds(primary);
  const darkBgs = generateOklchDarkBackgrounds(primary);

  const primaryPair = generateOklchContrastPair(primary);
  const secondaryPair = generateOklchContrastPair(secondary);
  const accentPair = generateOklchContrastPair(accent);

  const destructive: OKLCH = { h: 0, l: 0.55, c: 0.22 }; // Red in OKLCH
  const destructiveDark: OKLCH = { h: 0, l: 0.6, c: 0.25 };

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
    "muted-foreground": oklchToCss({ ...lightBgs.muted, l: 0.6 }),
    accent: oklchToCss(accentPair.background),
    "accent-foreground": oklchToCss(accentPair.foreground),
    destructive: oklchToCss(destructive),
    "destructive-foreground": oklchToCss(generateOklchForeground(destructive)),
    border: oklchToCss(lightBgs.border),
    input: oklchToCss(lightBgs.input),
    ring: oklchToCss(primary),

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

  // Add sidebar colors (light mode)
  const sidebarColors = generateOklchSidebarColors(
    lightBgs.background,
    generateOklchForeground(lightBgs.background),
    primary,
    accent,
    lightBgs.border
  );
  Object.assign(cssVars, sidebarColors);

  // Add dark mode sidebar colors
  const darkSidebarColors = generateOklchSidebarColors(
    darkBgs.background,
    generateOklchForeground(darkBgs.background),
    createOklchTint(primary, 10),
    createOklchTint(accent, 15),
    darkBgs.border
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
