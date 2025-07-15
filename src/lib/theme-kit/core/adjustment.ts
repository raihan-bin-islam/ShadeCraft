import { OKLCH } from "@/types/theme-kit/color-space";

// Create OKLCH color with adjustments
export function adjustOklch(
  base: OKLCH,
  adjustments: {
    lightness?: number;
    chroma?: number;
    hue?: number;
    alpha?: number;
  }
): OKLCH {
  return {
    l: Math.max(0, Math.min(1, base.l + (adjustments.lightness || 0))),
    c: Math.max(0, Math.min(0.4, base.c + (adjustments.chroma || 0))),
    h: (base.h + (adjustments.hue || 0) + 360) % 360,
    a: adjustments.alpha !== undefined ? adjustments.alpha : base.a,
  };
}

// Generate tint (lighter version) in OKLCH
export function createOklchTint(oklch: OKLCH, amount: number): OKLCH {
  return adjustOklch(oklch, {
    lightness: amount * 0.01, // Convert percentage to decimal
    chroma: -amount * 0.001, // Slightly reduce chroma for lighter colors
  });
}

// Generate shade (darker version) in OKLCH
export function createOklchShade(oklch: OKLCH, amount: number): OKLCH {
  return adjustOklch(oklch, {
    lightness: -amount * 0.01, // Convert percentage to decimal
    chroma: amount * 0.001, // Slightly increase chroma for darker colors
  });
}

// Adjust chroma (saturation equivalent)
export function adjustOklchChroma(oklch: OKLCH, amount: number): OKLCH {
  return adjustOklch(oklch, {
    chroma: amount * 0.001, // Convert to appropriate scale
  });
}
