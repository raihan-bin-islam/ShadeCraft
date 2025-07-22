import { HSL, OKLCH } from "@/types/theme-kit/color-space";
import Color from "colorjs.io";

export function oklchToCss(oklch: OKLCH): string {
  const color = new Color("oklch", [oklch.l, oklch.c, oklch.h]);
  const safe = color.toGamut({ method: "clip", space: "srgb" });
  console.log({ safe: safe.oklch.h });

  // Better would be
  // safe.toString({format:"css"}) but has some issue with the current setup. Remember to update it later

  // !legacy
  // if (safe.oklch.a !== undefined && safe.oklch.a < 1) {
  //   return `oklch(${safe.oklch.l.toFixed(3)} ${safe.oklch.c.toFixed(3)} ${safe.oklch.h.toFixed(1)} / ${(
  //     safe.oklch.a * 100
  //   ).toFixed(0)}%)`;
  // }
  return `oklch(${safe?.oklch?.l?.toFixed(4)} ${safe?.oklch?.c?.toFixed(4)} ${safe?.oklch?.h?.toFixed(4)})`;
}

export function hslToCss(hsl: HSL): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}
