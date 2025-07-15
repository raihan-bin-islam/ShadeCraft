import { HSL, OKLCH } from "@/types/theme-kit/color-space";
//! ------------------------------------------- HSL TO OKLCH --------------------------------------------
export function hslToOklch(hsl: HSL): OKLCH {
  // First convert HSL to RGB
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

  let r: number, g: number, b: number;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  // Convert RGB to Linear RGB
  const toLinear = (c: number) => {
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  // Convert to XYZ (D65 illuminant)
  const x = 0.4124564 * rLinear + 0.3575761 * gLinear + 0.1804375 * bLinear;
  const y = 0.2126729 * rLinear + 0.7151522 * gLinear + 0.072175 * bLinear;
  const z = 0.0193339 * rLinear + 0.119192 * gLinear + 0.9503041 * bLinear;

  // Convert XYZ to OKLCH
  // First to OKLab
  const lOk = Math.cbrt(0.8189330101 * x + 0.3618667424 * y - 0.1288597137 * z);
  const aOk = Math.cbrt(0.0329845436 * x + 0.9293118715 * y + 0.0361456387 * z);
  const bOk = Math.cbrt(0.0482003018 * x + 0.2643662691 * y + 0.633851707 * z);

  const L = 0.2104542553 * lOk + 0.793617785 * aOk - 0.0040720468 * bOk;
  const A = 1.9779984951 * lOk - 2.428592205 * aOk + 0.4505937099 * bOk;
  const B = 0.0259040371 * lOk + 0.7827717662 * aOk - 0.808675766 * bOk;

  // Convert to OKLCH
  const lightness = Math.max(0, Math.min(1, L));
  const chroma = Math.max(0, Math.sqrt(A * A + B * B));
  let hueOklch = (Math.atan2(B, A) * 180) / Math.PI;

  if (hueOklch < 0) hueOklch += 360;

  return {
    l: lightness,
    c: Math.min(0.4, chroma), // Cap chroma at reasonable value
    h: hueOklch,
  };
}

//! ------------------------------------------- HEX TO OKLCH --------------------------------------------
export function hexToOklch(hex: string): OKLCH {
  // Remove # if present
  hex = hex.replace("#", "");

  // Convert hex to RGB
  const r = Number.parseInt(hex.substr(0, 2), 16) / 255;
  const g = Number.parseInt(hex.substr(2, 2), 16) / 255;
  const b = Number.parseInt(hex.substr(4, 2), 16) / 255;

  // Convert RGB to HSL first (simplified approach)
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }

    h *= 60;
  }

  // Convert HSL to OKLCH using our converter
  return hslToOklch({ h, s: s * 100, l: l * 100 });
}
