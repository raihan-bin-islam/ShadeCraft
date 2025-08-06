import { HSL } from "@/types/theme-kit/color-space";
import Color from "colorjs.io";

export function oklchToCss(oklch: Color): string {
  try {
    const color = new Color("oklch", [oklch.l, oklch.c, oklch.h]);
    const safe = color.toGamut({ method: "clip", space: "srgb" });

    return safe.toString({ format: "css" });
  } catch (error) {
    return oklch.toString();
  }
}

export function hslToCss(hsl: HSL): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`;
}

export function hexToOklchCss(hex: string): string {
  const color = new Color(hex);
  return color.to("oklch").toString();

  // // Format components
  // const lPercent = (l * 100).toFixed(2); // L in percent
  // const cVal = c.toFixed(4);
  // const hVal = h.toFixed(2);

  // console.log("TEST::", { l, c, h, lPercent, cVal, hVal });
  // return `oklch(${lPercent}% ${cVal} ${hVal})`;
}
