import { HSL, OKLCH } from "@/types/theme-kit/color-space";

export function oklchToCss(oklch: OKLCH): string {
  if (oklch.a !== undefined && oklch.a < 1) {
    return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)} / ${(oklch.a * 100).toFixed(0)}%)`;
  }
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`;
}

export function hslToCss(hsl: HSL): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}
