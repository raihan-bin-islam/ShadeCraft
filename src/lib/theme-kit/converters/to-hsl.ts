import { clamp } from "@/lib/utils";
import { HSL, OKLCH, RGB } from "@/types/theme-kit/color-space";

//!------------------------------------------- OKLCH TO HSL --------------------------------------------

function oklchToOkLab({ l, c, h }: OKLCH) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  return { L: l, a, b };
}

function okLabToLinearSrgb({ L, a, b }: { L: number; a: number; b: number }) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b;

  const l = l_ ** 3;
  const m = m_ ** 3;
  const s = s_ ** 3;

  const rLin = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const gLin = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const bLin = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return { rLin, gLin, bLin };
}

function linearToSrgb(channel: number): number {
  if (channel <= 0.0031308) {
    return 12.92 * channel;
  }
  return 1.055 * channel ** (1 / 2.4) - 0.055;
}

function srgbToHsl(rLin: number, gLin: number, bLin: number): HSL {
  const r = clamp(linearToSrgb(rLin));
  const g = clamp(linearToSrgb(gLin));
  const b = clamp(linearToSrgb(bLin));

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;

  const l = (max + min) / 2;

  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
  }

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = 60 * h;
    if (h < 0) h += 360;
  }

  return { h, s, l };
}

export function oklchToHsl(oklch: OKLCH): HSL {
  const { l, c, h, a } = oklch;
  const okLab = oklchToOkLab({ l, c, h });
  const { rLin, gLin, bLin } = okLabToLinearSrgb(okLab);
  const { h: H, s, l: L } = srgbToHsl(rLin, gLin, bLin);

  return a !== undefined ? { h: H, s, l: L, a } : { h: H, s, l: L };
}

//!------------------------------------------- RGB TO HSL --------------------------------------------

export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const sum = max + min;
  const l = sum / 2;

  if (diff === 0) {
    return { h: 0, s: 0, l: l * 100 };
  }

  const s = l > 0.5 ? diff / (2 - sum) : diff / sum;

  let h: number;
  switch (max) {
    case r:
      h = ((g - b) / diff + (g < b ? 6 : 0)) / 6;
      break;
    case g:
      h = ((b - r) / diff + 2) / 6;
      break;
    case b:
      h = ((r - g) / diff + 4) / 6;
      break;
    default:
      h = 0;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}
