import Color from "colorjs.io";
import { adjustOklch } from "@/lib/theme-kit/core/adjustment";

// Generate complementary color in OKLCH (Color.js instance)
export function getOklchComplementary(base: Color): Color {
  return adjustOklch(base, { hue: 180 });
}

// Generate triadic colors in OKLCH
export function getOklchTriadic(base: Color): [Color, Color] {
  return [adjustOklch(base, { hue: 120 }), adjustOklch(base, { hue: 240 })];
}

// Generate analogous colors in OKLCH
export function getOklchAnalogous(base: Color): [Color, Color] {
  return [adjustOklch(base, { hue: 30 }), adjustOklch(base, { hue: -30 })];
}

// Generate split-complementary colors in OKLCH
export function getOklchSplitComplementary(base: Color): [Color, Color] {
  return [adjustOklch(base, { hue: 150 }), adjustOklch(base, { hue: 210 })];
}

// Generate tetradic colors in OKLCH
export function getOklchTetradic(base: Color): [Color, Color, Color] {
  return [adjustOklch(base, { hue: 90 }), adjustOklch(base, { hue: 180 }), adjustOklch(base, { hue: 270 })];
}
