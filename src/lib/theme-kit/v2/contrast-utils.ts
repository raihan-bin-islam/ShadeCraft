import { type HSL, hslToRgb, getRelativeLuminance, getContrastRatio } from "./color-theory";

// Calculate if a color is considered "light" or "dark"
export function isLightColor(hsl: HSL): boolean {
  const rgb = hslToRgb(hsl);
  const luminance = getRelativeLuminance(rgb);
  return luminance > 0.5;
}

// Generate appropriate foreground color for a given background
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function generateForegroundColor(background: HSL, targetContrast = 4.5): HSL {
  const isLight = isLightColor(background);

  if (isLight) {
    // For light backgrounds, use dark text
    return {
      h: background.h,
      s: Math.min(background.s, 20), // Low saturation for readability
      l: 15, // Very dark
    };
  } else {
    // For dark backgrounds, use light text
    return {
      h: background.h,
      s: Math.min(background.s, 15), // Low saturation for readability
      l: 95, // Very light
    };
  }
}

// Ensure minimum contrast ratio between two colors
export function ensureContrast(foreground: HSL, background: HSL, minContrast = 4.5): HSL {
  const adjustedForeground = { ...foreground };
  const backgroundRgb = hslToRgb(background);

  // Try adjusting lightness first
  for (let attempts = 0; attempts < 20; attempts++) {
    const foregroundRgb = hslToRgb(adjustedForeground);
    const contrast = getContrastRatio(foregroundRgb, backgroundRgb);

    if (contrast >= minContrast) {
      return adjustedForeground;
    }

    // If contrast is too low, adjust lightness
    const isBackgroundLight = isLightColor(background);
    if (isBackgroundLight) {
      // Make foreground darker
      adjustedForeground.l = Math.max(0, adjustedForeground.l - 5);
    } else {
      // Make foreground lighter
      adjustedForeground.l = Math.min(100, adjustedForeground.l + 5);
    }
  }

  // If we still don't have enough contrast, use high contrast defaults
  if (isLightColor(background)) {
    return { h: background.h, s: 10, l: 10 }; // Very dark
  } else {
    return { h: background.h, s: 5, l: 98 }; // Very light
  }
}

// Generate high contrast color pair
export function generateContrastPair(baseColor: HSL): { background: HSL; foreground: HSL } {
  const background = baseColor;
  const foreground = generateForegroundColor(background);
  const adjustedForeground = ensureContrast(foreground, background);

  return {
    background,
    foreground: adjustedForeground,
  };
}

// Validate all color pairs in a theme
export interface ContrastIssue {
  pair: string;
  contrast: number;
  required: number;
  severity: "critical" | "warning";
}

export function validateThemeContrast(theme: Record<string, string>): ContrastIssue[] {
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
    const fgValue = theme[pair.fg];
    const bgValue = theme[pair.bg];

    if (fgValue && bgValue) {
      try {
        // Parse HSL values (format: "217.2 32.6% 17.5%")
        const fgParts = fgValue.split(/\s+/);
        const bgParts = bgValue.split(/\s+/);

        if (fgParts.length >= 3 && bgParts.length >= 3) {
          const fgHsl: HSL = {
            h: Number.parseFloat(fgParts[0]),
            s: Number.parseFloat(fgParts[1].replace("%", "")),
            l: Number.parseFloat(fgParts[2].replace("%", "")),
          };

          const bgHsl: HSL = {
            h: Number.parseFloat(bgParts[0]),
            s: Number.parseFloat(bgParts[1].replace("%", "")),
            l: Number.parseFloat(bgParts[2].replace("%", "")),
          };

          const fgRgb = hslToRgb(fgHsl);
          const bgRgb = hslToRgb(bgHsl);
          const contrast = getContrastRatio(fgRgb, bgRgb);

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
