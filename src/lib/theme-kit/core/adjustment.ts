import Color from "colorjs.io";

// Adjust OKLCH color with optional lightness, chroma, hue, alpha changes.
// Automatically clips to sRGB gamut only if out of gamut.
export function adjustOklch(
  base: Color,
  adjustments: {
    lightness?: number;
    chroma?: number;
    hue?: number;
    alpha?: number;
  } = {}
): Color {
  const [l, c, h] = base.oklch;
  const alpha = base.alpha ?? 1;

  const newColor = new Color("oklch", [
    Math.max(0, Math.min(1, l + (adjustments.lightness ?? 0))),
    Math.max(0, Math.min(0.4, c + (adjustments.chroma ?? 0))),
    (h + (adjustments.hue ?? 0) + 360) % 360,
  ]);

  newColor.alpha = adjustments.alpha !== undefined ? adjustments.alpha : alpha;

  // Clip to sRGB gamut only if out of gamut
  if (!newColor.inGamut("srgb")) {
    return newColor.toGamut({ method: "clip", space: "srgb" });
  }

  return newColor;
}

// Generate a lighter tint by increasing lightness and slightly reducing chroma
export function createOklchTint(base: Color, amount: number): Color {
  return adjustOklch(base, {
    lightness: amount * 0.01, // increase lightness by percent
    chroma: -amount * 0.001, // reduce chroma slightly
  });
}

// Generate a darker shade by decreasing lightness and slightly increasing chroma
export function createOklchShade(base: Color, amount: number): Color {
  return adjustOklch(base, {
    lightness: -amount * 0.01, // decrease lightness by percent
    chroma: amount * 0.001, // increase chroma slightly
  });
}

// Adjust chroma (saturation equivalent) by given amount
export function adjustOklchChroma(base: Color, amount: number): Color {
  return adjustOklch(base, {
    chroma: amount * 0.001,
  });
}
