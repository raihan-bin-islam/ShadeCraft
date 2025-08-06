import { parseOklchString } from "@/lib/theme-kit/core/parser";
import { binarySearch } from "@/lib/utils";
import { TailwindV4Theme } from "@/types/theme-kit";
import { ContrastIssue } from "@/types/theme-kit/contrast";
import Color from "colorjs.io";

/**
 * Validate theme contrast pairs for WCAG compliance using colorjs contrast method
 */
export function validateThemeContrast(theme: TailwindV4Theme["theme"]["light"]): ContrastIssue[] {
  const issues: ContrastIssue[] = [];

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
          const fgColor = new Color("oklch", [fgOklch.l, fgOklch.c, fgOklch.h]);
          const bgColor = new Color("oklch", [bgOklch.l, bgOklch.c, bgOklch.h]);

          const contrast = fgColor.contrast(bgColor, "WCAG21");

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

/**
 * Check if an OKLCH color is light based on lightness channel
 */
export function isOklchLight(color: Color): boolean {
  // color.oklch returns [l, c, h], l is lightness
  const [l] = color.oklch;
  return l > 0.5;
}

/**
 * Adjust foreground color to ensure minimum contrast against background
 */
export function ensureOklchContrast(foreground: Color, background: Color, minContrast = 5): Color {
  const maxAttempts = 20;
  const delta = 0.05;
  let adjusted = foreground.clone();

  for (let i = 0; i < maxAttempts; i++) {
    const contrast = adjusted.contrast(background, "WCAG21");
    if (contrast >= minContrast) {
      return adjusted;
    }
    const [l, c, h] = adjusted.oklch;
    const isBgLight = isOklchLight(background);

    // Adjust lightness opposite direction of bg to increase contrast
    const newL = isBgLight ? Math.max(0, l - delta) : Math.min(1, l + delta);
    adjusted = new Color("oklch", [newL, c, h]);
  }

  // If no suitable contrast found, fallback to black or white foreground
  const white = new Color("#fff");
  const black = new Color("#000");
  const whiteContrast = white.contrast(background, "WCAG21");
  const blackContrast = black.contrast(background, "WCAG21");
  return whiteContrast > blackContrast ? white.to("oklch") : black.to("oklch");
}

/**
 * Check if foreground/background colors have good contrast according to WCAG 2.1
 */
export function hasGoodContrast(foreground: Color, background: Color): boolean {
  return foreground.contrast(background, "WCAG21") >= 4.5;
}

/**
 * Generates a readable contrasting color from a background (returns Colors)
 */
export function getReadableForeground(
  background: Color,
  {
    desiredContrast = 4.5,
    direction = "auto",
    tolerance = 0.005,
    maxIterations = 20,
  }: {
    desiredContrast?: number;
    direction?: "lighter" | "darker" | "auto";
    tolerance?: number;
    maxIterations?: number;
  } = {}
): { background: Color; foreground: Color } {
  const oklch = background.oklch;
  if (!oklch || oklch.length < 3) {
    throw new Error(`Invalid OKLCH color input ${oklch}`);
  }
  const [l, c, h] = oklch;
  console.log({ readableFg: { l, c, h } });

  const isDark = l < 0.5;
  const searchDirection = direction === "auto" ? (isDark ? "lighter" : "darker") : direction;

  // let low = 0;
  // let high = 1;

  const range = 0.4;
  let low = Math.max(0, l - (searchDirection === "darker" ? range : 0));
  let high = Math.min(1, l + (searchDirection === "lighter" ? range : 0));

  if (searchDirection === "lighter") {
    low = l;
  } else {
    high = l;
  }

  const bestLightness = binarySearch(
    low,
    high,
    (testL) => {
      // Clamp testL just in case
      const clampedL = Math.min(1, Math.max(0, testL));
      // const testColor = new Color("oklch", [clampedL, c, h]);
      const testColor = new Color("oklch", [clampedL, Math.max(0, c - 0.02), h]);

      if (!testColor.inGamut("srgb")) return false;

      const contrast = testColor.contrast(background, "WCAG21");
      return contrast >= desiredContrast;
    },
    { tolerance, maxIterations }
  );

  if (bestLightness === null || bestLightness === undefined) {
    // fallback to black or white
    const white = new Color("#fff");
    const black = new Color("#000");
    const whiteContrast = white.contrast(background, "WCAG21");
    const blackContrast = black.contrast(background, "WCAG21");
    const bestFallback = whiteContrast > blackContrast ? white : black;
    const bestFallbackOklch = bestFallback.to("oklch"); // ✅ convert to OKLCH

    console.log({ bestFallback: bestFallbackOklch });

    return { background, foreground: bestFallbackOklch };
  }

  const bestColor = new Color("oklch", [bestLightness, c, h]);
  console.log({ bestColor: bestColor });

  return { background, foreground: bestColor };
}
