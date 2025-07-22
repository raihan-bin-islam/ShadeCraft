import { oklchToRgb } from "@/lib/theme-kit/converters";
import { parseOklchString } from "@/lib/theme-kit/core/parser";
import { TailwindV4Theme } from "@/types/theme-kit";
import { OKLCH } from "@/types/theme-kit/color-space";
import { ContrastIssue } from "@/types/theme-kit/contrast";

export function validateThemeContrast(theme: TailwindV4Theme["theme"]["light"]): ContrastIssue[] {
  const issues: ContrastIssue[] = [];

  // Define color pairs that should have good contrast
  const contrastPairs = [
    { fg: "foreground", bg: "background", name: "body text" },
    { fg: "primary-foreground", bg: "primary", name: "primary button" },
    { fg: "secondary-foreground", bg: "secondary", name: "secondary button" },
    { fg: "accent-foreground", bg: "accent", name: "accent elements" },
    { fg: "muted-foreground", bg: "muted", name: "muted text" },
    { fg: "card-foreground", bg: "card", name: "card content" },
    { fg: "destructive-foreground", bg: "destructive", name: "destructive button" },
  ];

  for (const pair of contrastPairs) {
    const fgValue = theme?.[pair.fg];
    const bgValue = theme?.[pair.bg];

    if (fgValue && bgValue) {
      try {
        const fgOklch = parseOklchString(fgValue);
        const bgOklch = parseOklchString(bgValue);

        if (fgOklch && bgOklch) {
          const contrast = getContrastRatio(fgOklch, bgOklch);

          if (contrast < 4.5) {
            issues.push({
              pair: pair.name,
              contrast,
              required: 4.5,
              severity: contrast < 3 ? "critical" : "warning",
            });
          }
        }
      } catch (error) {
        console.warn(`Failed to parse colors for ${pair.name}:`, error);
      }
    }
  }

  return issues;
}

export function isOklchLight(oklch: OKLCH): boolean {
  return oklch.l > 0.5;
}

export function ensureOklchContrast(foreground: OKLCH, background: OKLCH, minContrast = 5): OKLCH {
  const adjustedForeground = { ...foreground };

  // Simple contrast approximation using lightness difference
  // For production, you'd want to convert to RGB and use proper contrast calculation
  for (let attempts = 0; attempts < 20; attempts++) {
    const lightnessDiff = Math.abs(adjustedForeground.l - background.l);
    const approximateContrast = lightnessDiff * 20; // Rough approximation

    if (approximateContrast >= minContrast / 2) {
      // Adjusted threshold for OKLCH
      return adjustedForeground;
    }

    // Adjust lightness for better contrast
    if (isOklchLight(background)) {
      adjustedForeground.l = Math.max(0, adjustedForeground.l - 0.05);
    } else {
      adjustedForeground.l = Math.min(1, adjustedForeground.l + 0.05);
    }
  }

  // Fallback to high contrast
  if (isOklchLight(background)) {
    return { h: background.h, c: 0.01, l: 0.1 };
  } else {
    return { h: background.h, c: 0.01, l: 0.98 };
  }
}

export function getRelativeLuminance(oklch: OKLCH): number {
  const rgb = oklchToRgb(oklch);
  const rsRGB = rgb.r / 255;
  const gsRGB = rgb.g / 255;
  const bsRGB = rgb.b / 255;

  const r = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const g = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const b = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getContrastRatio(color1: OKLCH, color2: OKLCH): number {
  const l1 = getRelativeLuminance(color1);
  const l2 = getRelativeLuminance(color2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

// Check if contrast meets WCAG AA standards (4.5:1 for normal text)
export function hasGoodContrast(foreground: OKLCH, background: OKLCH): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

import Color from "colorjs.io";

/**
 * Generates a readable contrasting color from a background
 */
export function getReadableForeground(
  backgroundInput: OKLCH,
  {
    desiredContrast = 4.5,
    direction = "auto", // "lighter", "darker", or "auto"
  }: {
    desiredContrast?: number;
    direction?: "lighter" | "darker" | "auto";
  } = {}
): { background: OKLCH; foreground: OKLCH } {
  const background = new Color("oklch", [backgroundInput.l, backgroundInput.c, backgroundInput.h]);
  const { l, c, h } = background;

  const maxSteps = 25;
  const delta = 0.025;

  const isDark = l < 0.5;
  const searchDirection = direction === "auto" ? (isDark ? "lighter" : "darker") : direction;

  for (let i = 1; i <= maxSteps; i++) {
    const newL = searchDirection === "lighter" ? Math.min(l + delta * i, 1) : Math.max(l - delta * i, 0);

    const test = new Color("oklch", [newL, c, h]);

    if (test.inGamut("srgb")) {
      const contrast = test.contrast(background, "WCAG21");
      if (contrast >= desiredContrast) {
        return {
          background: backgroundInput,
          foreground: { l: test.l, c: test.c, h: test.h },
          // oklch: best.to("oklch").toString({ format: "oklch", precision: 3 }),
          // hex: best.to("srgb").toString({ format: "hex" }),
          // contrast: Math.max(whiteContrast, blackContrast),
        };
      }
    }
  }

  // fallback to white or black
  const white = new Color("#fff");
  const black = new Color("#000");
  const whiteContrast = white.contrast(background, "WCAG21");
  const blackContrast = black.contrast(background, "WCAG21");
  const best = whiteContrast > blackContrast ? white : black;

  return {
    background: backgroundInput,
    foreground: { l: best.l, c: best.c, h: best.h },
    // oklch: best.to("oklch").toString({ format: "oklch", precision: 3 }),
    // hex: best.to("srgb").toString({ format: "hex" }),
    // contrast: Math.max(whiteContrast, blackContrast),
  };
}
