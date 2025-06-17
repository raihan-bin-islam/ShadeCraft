import { oklchToHsl } from "@/lib/theme-kit/converters/to-hsl";
import { HSL, OKLCH, RGB } from "@/types/theme-kit/color-space";

export function hslToRgb(hsl: HSL): RGB {
  const h = hsl.h / 360;
  const s = hsl.s / 100;
  const l = hsl.l / 100;

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };

  if (s === 0) {
    const gray = Math.round(l * 255);
    return { r: gray, g: gray, b: gray };
  }

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

//! -------------------------------------------------- HEX TO RGB --------------------------------------------------------------
export function hexToRgb(hex: string): RGB {
  // Remove # if present
  hex = hex.replace("#", "");

  return {
    r: Number.parseInt(hex.substr(0, 2), 16),
    g: Number.parseInt(hex.substr(2, 2), 16),
    b: Number.parseInt(hex.substr(4, 2), 16),
  };
}

export function oklchToRgb(oklch: OKLCH): RGB {
  const hsl = oklchToHsl(oklch);
  const rgb = hslToRgb(hsl);
  return rgb;
}
