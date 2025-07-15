import { OKLCH } from "@/types/theme-kit/color-space";
import { parseHslString, parseOklchString } from "@/lib/theme-kit/core/parser";
import { hslToRgb } from "@/lib/theme-kit/converters/to-rgb";
import { oklchToHsl } from "@/lib/theme-kit/converters/to-hsl";
import { ColorComparison } from "@/types/theme-kit";

// Calculate Delta E (perceptual color difference)
export function calculateDeltaE(rgb1: { r: number; g: number; b: number }, rgb2: { r: number; g: number; b: number }): number {
  // Simplified Delta E calculation (CIE76)
  // For production, you'd want to use more accurate Delta E 2000

  // Convert RGB to LAB (simplified)
  const rgbToLab = (rgb: { r: number; g: number; b: number }) => {
    // Normalize RGB
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    // Apply gamma correction
    r = r > 0.04045 ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = g > 0.04045 ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = b > 0.04045 ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    // Convert to XYZ
    let x = r * 0.4124564 + g * 0.3575761 + b * 0.1804375;
    let y = r * 0.2126729 + g * 0.7151522 + b * 0.072175;
    let z = r * 0.0193339 + g * 0.119192 + b * 0.9503041;

    // Normalize for D65 illuminant
    x = x / 0.95047;
    y = y / 1.0;
    z = z / 1.08883;

    // Convert to LAB
    x = x > 0.008856 ? Math.pow(x, 1 / 3) : 7.787 * x + 16 / 116;
    y = y > 0.008856 ? Math.pow(y, 1 / 3) : 7.787 * y + 16 / 116;
    z = z > 0.008856 ? Math.pow(z, 1 / 3) : 7.787 * z + 16 / 116;

    const L = 116 * y - 16;
    const a = 500 * (x - y);
    const b_lab = 200 * (y - z);

    return { L, a, b: b_lab };
  };

  const lab1 = rgbToLab(rgb1);
  const lab2 = rgbToLab(rgb2);

  const deltaL = lab1.L - lab2.L;
  const deltaA = lab1.a - lab2.a;
  const deltaB = lab1.b - lab2.b;

  return Math.sqrt(deltaL * deltaL + deltaA * deltaA + deltaB * deltaB);
}

// Check if OKLCH color is outside sRGB gamut
export function isOutsideSrgbGamut(oklch: OKLCH): boolean {
  // Convert OKLCH to RGB and check if values are outside 0-255 range
  try {
    const hsl = oklchToHsl(oklch);
    const rgb = hslToRgb(hsl);

    // Check if any RGB value is outside valid range or if conversion resulted in clamping
    return rgb.r < 0 || rgb.r > 255 || rgb.g < 0 || rgb.g > 255 || rgb.b < 0 || rgb.b > 255;
  } catch {
    return true; // If conversion fails, assume it's outside gamut
  }
}

// Compare HSL and OKLCH colors
export function compareColors(name: string, hslValue: string, oklchValue: string): ColorComparison {
  const hsl = parseHslString(hslValue);
  const oklch = parseOklchString(oklchValue);

  if (!hsl || !oklch) {
    throw new Error(`Failed to parse colors for ${name}`);
  }

  const hslRgb = hslToRgb(hsl);
  const oklchHsl = oklchToHsl(oklch);
  const oklchRgb = hslToRgb(oklchHsl);

  const deltaE = calculateDeltaE(hslRgb, oklchRgb);

  let perceptualDifference: ColorComparison["difference"]["perceptualDifference"];
  if (deltaE < 1) perceptualDifference = "identical";
  else if (deltaE < 2.3) perceptualDifference = "minimal";
  else if (deltaE < 5) perceptualDifference = "noticeable";
  else perceptualDifference = "significant";

  const gamutExpansion = isOutsideSrgbGamut(oklch);

  return {
    name,
    hsl: {
      value: hsl,
      css: `hsl(${hsl.h} ${hsl.s}% ${hsl.l}%)`,
      rgb: hslRgb,
    },
    oklch: {
      value: oklch,
      css: `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`,
      rgb: oklchRgb,
    },
    difference: {
      deltaE,
      perceptualDifference,
      gamutExpansion,
    },
  };
}

// Get legacy HSL values for themes (converted from original HSL themes)
export const legacyHslThemes = {
  aurora: {
    light: {
      background: "250 100% 99%",
      foreground: "262 15% 15%",
      card: "255 100% 98%",
      "card-foreground": "262 15% 15%",
      primary: "262 83% 58%",
      "primary-foreground": "255 100% 98%",
      secondary: "160 84% 39%",
      "secondary-foreground": "255 100% 98%",
      muted: "250 60% 95%",
      "muted-foreground": "262 25% 45%",
      accent: "217 91% 60%",
      "accent-foreground": "255 100% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "255 100% 98%",
      border: "250 40% 88%",
      input: "250 40% 92%",
      ring: "262 83% 58%",
    },
    dark: {
      background: "262 25% 8%",
      foreground: "250 100% 95%",
      card: "262 20% 12%",
      "card-foreground": "250 100% 95%",
      primary: "262 83% 65%",
      "primary-foreground": "262 25% 8%",
      secondary: "160 84% 45%",
      "secondary-foreground": "262 25% 8%",
      muted: "262 15% 15%",
      "muted-foreground": "250 30% 65%",
      accent: "217 91% 65%",
      "accent-foreground": "262 25% 8%",
      destructive: "0 84% 65%",
      "destructive-foreground": "262 25% 8%",
      border: "262 15% 18%",
      input: "262 15% 18%",
      ring: "262 83% 65%",
    },
  },
  serene: {
    light: {
      background: "210 25% 98%",
      foreground: "215 25% 20%",
      card: "210 40% 99%",
      "card-foreground": "215 25% 20%",
      primary: "217 19% 47%",
      "primary-foreground": "210 40% 99%",
      secondary: "215 20% 65%",
      "secondary-foreground": "217 19% 15%",
      muted: "210 30% 94%",
      "muted-foreground": "215 15% 50%",
      accent: "220 14% 90%",
      "accent-foreground": "217 19% 15%",
      destructive: "0 65% 55%",
      "destructive-foreground": "210 40% 99%",
      border: "210 20% 88%",
      input: "210 25% 92%",
      ring: "217 19% 47%",
    },
    dark: {
      background: "215 25% 10%",
      foreground: "210 25% 90%",
      card: "215 20% 14%",
      "card-foreground": "210 25% 90%",
      primary: "217 19% 47%",
      "primary-foreground": "210 40% 99%",
      secondary: "215 20% 65%",
      "secondary-foreground": "217 19% 15%",
      muted: "215 15% 18%",
      "muted-foreground": "210 15% 70%",
      accent: "210 20% 25%",
      "accent-foreground": "210 25% 90%",
      destructive: "0 65% 60%",
      "destructive-foreground": "215 25% 10%",
      border: "215 15% 22%",
      input: "215 15% 22%",
      ring: "217 19% 47%",
    },
  },
  tropical: {
    light: {
      background: "35 40% 97%",
      foreground: "25 30% 15%",
      card: "40 60% 98%",
      "card-foreground": "25 30% 15%",
      primary: "35 92% 51%",
      "primary-foreground": "40 60% 98%",
      secondary: "327 73% 52%",
      "secondary-foreground": "40 60% 98%",
      muted: "40 50% 92%",
      "muted-foreground": "25 20% 45%",
      accent: "189 94% 43%",
      "accent-foreground": "40 60% 98%",
      destructive: "0 84% 60%",
      "destructive-foreground": "40 60% 98%",
      border: "35 30% 85%",
      input: "40 40% 90%",
      ring: "35 92% 51%",
    },
    dark: {
      background: "25 35% 8%",
      foreground: "40 40% 92%",
      card: "30 25% 12%",
      "card-foreground": "40 40% 92%",
      primary: "35 92% 55%",
      "primary-foreground": "25 35% 8%",
      secondary: "327 73% 58%",
      "secondary-foreground": "25 35% 8%",
      muted: "25 20% 15%",
      "muted-foreground": "35 25% 65%",
      accent: "189 94% 48%",
      "accent-foreground": "25 35% 8%",
      destructive: "0 84% 65%",
      "destructive-foreground": "25 35% 8%",
      border: "25 20% 18%",
      input: "25 20% 18%",
      ring: "35 92% 55%",
    },
  },
  midnight: {
    light: {
      background: "235 30% 96%",
      foreground: "235 40% 12%",
      card: "240 50% 99%",
      "card-foreground": "235 40% 12%",
      primary: "239 84% 67%",
      "primary-foreground": "240 50% 99%",
      secondary: "250 91% 65%",
      "secondary-foreground": "240 50% 99%",
      muted: "235 25% 92%",
      "muted-foreground": "235 20% 45%",
      accent: "327 73% 52%",
      "accent-foreground": "240 50% 99%",
      destructive: "0 84% 60%",
      "destructive-foreground": "240 50% 99%",
      border: "235 20% 86%",
      input: "235 25% 90%",
      ring: "239 84% 67%",
    },
    dark: {
      background: "235 50% 6%",
      foreground: "240 30% 92%",
      card: "235 40% 10%",
      "card-foreground": "240 30% 92%",
      primary: "239 84% 72%",
      "primary-foreground": "235 50% 6%",
      secondary: "250 91% 70%",
      "secondary-foreground": "235 50% 6%",
      muted: "235 30% 12%",
      "muted-foreground": "240 20% 70%",
      accent: "327 73% 58%",
      "accent-foreground": "235 50% 6%",
      destructive: "0 84% 65%",
      "destructive-foreground": "235 50% 6%",
      border: "235 25% 16%",
      input: "235 25% 16%",
      ring: "239 84% 72%",
    },
  },
  candy: {
    light: {
      background: "320 30% 98%",
      foreground: "330 25% 20%",
      card: "315 60% 99%",
      "card-foreground": "330 25% 20%",
      primary: "330 81% 60%",
      "primary-foreground": "315 60% 99%",
      secondary: "262 60% 76%",
      "secondary-foreground": "330 25% 20%",
      muted: "320 40% 94%",
      "muted-foreground": "330 15% 50%",
      accent: "217 70% 79%",
      "accent-foreground": "330 25% 20%",
      destructive: "0 70% 60%",
      "destructive-foreground": "315 60% 99%",
      border: "320 25% 88%",
      input: "320 30% 92%",
      ring: "330 81% 60%",
    },
    dark: {
      background: "330 30% 8%",
      foreground: "315 40% 92%",
      card: "330 25% 12%",
      "card-foreground": "315 40% 92%",
      primary: "330 81% 65%",
      "primary-foreground": "330 30% 8%",
      secondary: "262 60% 80%",
      "secondary-foreground": "330 30% 8%",
      muted: "330 20% 15%",
      "muted-foreground": "315 25% 70%",
      accent: "217 70% 82%",
      "accent-foreground": "330 30% 8%",
      destructive: "0 70% 65%",
      "destructive-foreground": "330 30% 8%",
      border: "330 20% 18%",
      input: "330 20% 18%",
      ring: "330 81% 65%",
    },
  },
};
