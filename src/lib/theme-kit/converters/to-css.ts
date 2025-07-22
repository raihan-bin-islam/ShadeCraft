import { HSL } from "@/types/theme-kit/color-space";
import Color from "colorjs.io";

export function oklchToCss(oklch: Pick<Color, "l" | "c" | "h">): string {
  const color = new Color("oklch", [oklch.l, oklch.c, oklch.h]);
  const safe = color.toGamut({ method: "clip", space: "srgb" });
  return safe.toString({ format: "css" });
}

export function hslToCss(hsl: HSL): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}
