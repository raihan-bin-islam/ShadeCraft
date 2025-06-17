import type { OKLCHColor, RGB } from "@/types/theme";
import { hslToOklch } from "./converters/oklch-converter";

// Convert hex to RGB
export function hexToRgb(hex: string): RGB {
  // Remove # if present
  hex = hex.replace("#", "");

  return {
    r: Number.parseInt(hex.substr(0, 2), 16),
    g: Number.parseInt(hex.substr(2, 2), 16),
    b: Number.parseInt(hex.substr(4, 2), 16),
  };
}

// Convert RGB to hex
export function rgbToHex(rgb: RGB): string {
  return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}

// Convert hex to OKLCH
export function hexToOklch(hex: string): OKLCHColor {
  // Remove # if present
  hex = hex.replace("#", "");

  // Convert hex to RGB
  const r = Number.parseInt(hex.substr(0, 2), 16) / 255;
  const g = Number.parseInt(hex.substr(2, 2), 16) / 255;
  const b = Number.parseInt(hex.substr(4, 2), 16) / 255;

  // Convert RGB to HSL first (simplified approach)
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  // Convert HSL to OKLCH using our converter
  return hslToOklch({ h, s: s * 100, l: l * 100 });
}

// Convert OKLCH to CSS string
export function oklchToString(color: OKLCHColor): string {
  return `oklch(${color.l} ${color.c} ${color.h})`;
}

// Generate theme colors from brand colors
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

// Generate CSS variables from theme
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateCSSVariables(theme: any, mode: "light" | "dark"): string {
  const colors = theme[mode];
  return Object.entries(colors)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

      if (!value) return ""; //! added this line for type-safety if creates an error remove later
      // Check if the value is an OKLCH object or a string
      const cssValue = typeof value === "object" && "l" in value ? oklchToString(value as OKLCHColor) : value;

      return `  --${cssKey}: ${cssValue};`;
    })
    .join("\n");
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
