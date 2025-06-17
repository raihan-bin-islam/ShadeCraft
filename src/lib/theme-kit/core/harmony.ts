import { adjustOklch } from "@/lib/theme-kit/core/adjustment";
import { OKLCH } from "@/types/theme-kit/color-space";

// Generate complementary color in OKLCH
export function getOklchComplementary(oklch: OKLCH): OKLCH {
  return adjustOklch(oklch, {
    hue: 180,
  });
}

// Generate triadic colors in OKLCH
export function getOklchTriadic(oklch: OKLCH): [OKLCH, OKLCH] {
  return [adjustOklch(oklch, { hue: 120 }), adjustOklch(oklch, { hue: 240 })];
}

// Generate analogous colors in OKLCH
export function getOklchAnalogous(oklch: OKLCH): [OKLCH, OKLCH] {
  return [adjustOklch(oklch, { hue: 30 }), adjustOklch(oklch, { hue: -30 })];
}

// Generate split-complementary colors in OKLCH
export function getOklchSplitComplementary(oklch: OKLCH): [OKLCH, OKLCH] {
  return [adjustOklch(oklch, { hue: 150 }), adjustOklch(oklch, { hue: 210 })];
}

// Generate tetradic colors in OKLCH
export function getOklchTetradic(oklch: OKLCH): [OKLCH, OKLCH, OKLCH] {
  return [adjustOklch(oklch, { hue: 90 }), adjustOklch(oklch, { hue: 180 }), adjustOklch(oklch, { hue: 270 })];
}
