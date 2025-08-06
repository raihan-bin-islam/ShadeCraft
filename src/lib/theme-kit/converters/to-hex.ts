import { RGB } from "@/types/theme-kit/color-space";
import Color from "colorjs.io";

export function oklchCssToHex(css: string): string {
  // if (!css) return "#000";
  const color = new Color(css); // Parses OKLCH, HSL, etc.
  return color.to("srgb").toString({ format: "hex" });
}

export function rgbToHex(rgb: RGB): string {
  return "#" + ((1 << 24) + (rgb.r << 16) + (rgb.g << 8) + rgb.b).toString(16).slice(1);
}
