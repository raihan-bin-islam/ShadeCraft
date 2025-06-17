export interface OKLCH {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4+)
  h: number; // Hue (0-360)
  a?: number; // Alpha (0-1)
}

export interface HSL {
  h: number; // Hue angle [0..360)
  s: number; // Saturation [0..1]
  l: number; // Lightness [0..1]
  a?: number; // Optional alpha [0..1]
}
// More accurate HSL to OKLCH conversion using proper color space math
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

/*
 * Convert OKLCH color to HSL, following the provided interface.
 */

// Clamp helper
function clamp(value: number, min = 0, max = 1): number {
  return Math.min(Math.max(value, min), max);
}

// 1. OKLCH -> OKLab
function oklchToOkLab({ l, c, h }: OKLCH) {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);
  return { L: l, a, b };
}

// 2. OKLab -> linear sRGB
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

// sRGB companding
function linearToSrgb(channel: number): number {
  if (channel <= 0.0031308) {
    return 12.92 * channel;
  }
  return 1.055 * channel ** (1 / 2.4) - 0.055;
}

// 3. linear sRGB -> HSL
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

/**
 * Main function: Convert OKLCH to HSL.
 * Preserves optional alpha channel if provided.
 */
export function oklchToHsl(oklch: OKLCH): HSL {
  const { l, c, h, a } = oklch;
  const okLab = oklchToOkLab({ l, c, h });
  const { rLin, gLin, bLin } = okLabToLinearSrgb(okLab);
  const { h: H, s, l: L } = srgbToHsl(rLin, gLin, bLin);

  return a !== undefined ? { h: H, s, l: L, a } : { h: H, s, l: L };
}

// Convert OKLCH to CSS string for Tailwind v4
export function oklchToCss(oklch: OKLCH): string {
  if (oklch.a !== undefined && oklch.a < 1) {
    return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)} / ${(oklch.a * 100).toFixed(0)}%)`;
  }
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${oklch.h.toFixed(1)})`;
}

// Create OKLCH color with adjustments
export function adjustOklch(
  base: OKLCH,
  adjustments: {
    lightness?: number;
    chroma?: number;
    hue?: number;
    alpha?: number;
  }
): OKLCH {
  return {
    l: Math.max(0, Math.min(1, base.l + (adjustments.lightness || 0))),
    c: Math.max(0, Math.min(0.4, base.c + (adjustments.chroma || 0))),
    h: (base.h + (adjustments.hue || 0) + 360) % 360,
    a: adjustments.alpha !== undefined ? adjustments.alpha : base.a,
  };
}

// Generate tint (lighter version) in OKLCH
export function createOklchTint(oklch: OKLCH, amount: number): OKLCH {
  return adjustOklch(oklch, {
    lightness: amount * 0.01, // Convert percentage to decimal
    chroma: -amount * 0.001, // Slightly reduce chroma for lighter colors
  });
}

// Generate shade (darker version) in OKLCH
export function createOklchShade(oklch: OKLCH, amount: number): OKLCH {
  return adjustOklch(oklch, {
    lightness: -amount * 0.01, // Convert percentage to decimal
    chroma: amount * 0.001, // Slightly increase chroma for darker colors
  });
}

// Adjust chroma (saturation equivalent)
export function adjustOklchChroma(oklch: OKLCH, amount: number): OKLCH {
  return adjustOklch(oklch, {
    chroma: amount * 0.001, // Convert to appropriate scale
  });
}

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

// Check if OKLCH color is light or dark
export function isOklchLight(oklch: OKLCH): boolean {
  return oklch.l > 0.5;
}

// Generate appropriate foreground color for OKLCH background
export function generateOklchForeground(background: OKLCH): OKLCH {
  const isLight = isOklchLight(background);

  if (isLight) {
    // For light backgrounds, use dark text
    return {
      h: background.h,
      c: Math.min(0.02, background.c * 0.5), // Very low chroma for readability
      l: 0.15, // Very dark
    };
  } else {
    // For dark backgrounds, use light text
    return {
      h: background.h,
      c: Math.min(0.01, background.c * 0.3), // Very low chroma for readability
      l: 0.95, // Very light
    };
  }
}

// Ensure minimum contrast in OKLCH space
export function ensureOklchContrast(foreground: OKLCH, background: OKLCH, minContrast = 5): OKLCH {
  const adjustedForeground = { ...foreground };

  // Simple contrast approximation using lightness difference
  // For production, you'd want to convert to RGB and use proper contrast calculation
  for (let attempts = 0; attempts < 20; attempts++) {
    const lightnessDiff = Math.abs(adjustedForeground.l - background.l);
    const approximateContrast = lightnessDiff * 20; // Rough approximation

    if (approximateContrast >= minContrast / 2) {
      // Adjusted threshold for OKLCH
      return adjustedForeground;
    }

    // Adjust lightness for better contrast
    if (isOklchLight(background)) {
      adjustedForeground.l = Math.max(0, adjustedForeground.l - 0.05);
    } else {
      adjustedForeground.l = Math.min(1, adjustedForeground.l + 0.05);
    }
  }

  // Fallback to high contrast
  if (isOklchLight(background)) {
    return { h: background.h, c: 0.01, l: 0.1 };
  } else {
    return { h: background.h, c: 0.01, l: 0.98 };
  }
}

// Generate contrast pair in OKLCH
export function generateOklchContrastPair(baseColor: OKLCH): { background: OKLCH; foreground: OKLCH } {
  const background = baseColor;
  const foreground = generateOklchForeground(background);
  const adjustedForeground = ensureOklchContrast(foreground, background);

  return {
    background,
    foreground: adjustedForeground,
  };
}

// Generate chart colors in OKLCH format
export function generateOklchChartColors(baseOklch: OKLCH): Record<string, string> {
  const charts: Record<string, string> = {};

  // Generate 5 chart colors with different hues and chromas
  for (let i = 1; i <= 5; i++) {
    const hueShift = (i - 1) * 72; // 72 degrees apart for good contrast
    const newHue = (baseOklch.h + hueShift) % 360;
    const chromaVariation = Math.min(0.25, baseOklch.c * (0.8 + i * 0.1)); // Vary chroma slightly
    const lightnessVariation = Math.max(0.3, Math.min(0.8, baseOklch.l + (i % 2 === 0 ? 0.1 : -0.1)));

    const chartColor: OKLCH = {
      l: lightnessVariation,
      c: chromaVariation,
      h: newHue,
    };

    charts[`chart-${i}`] = oklchToCss(chartColor);
  }

  return charts;
}

// Generate sidebar colors in OKLCH format
export function generateOklchSidebarColors(
  background: OKLCH,
  foreground: OKLCH,
  primary: OKLCH,
  accent: OKLCH,
  border: OKLCH
): Record<string, string> {
  return {
    sidebar: oklchToCss(background),
    "sidebar-foreground": oklchToCss(foreground),
    "sidebar-primary": oklchToCss(primary),
    "sidebar-primary-foreground": oklchToCss(generateOklchForeground(primary)),
    "sidebar-accent": oklchToCss(accent),
    "sidebar-accent-foreground": oklchToCss(generateOklchForeground(accent)),
    "sidebar-border": oklchToCss(border),
    "sidebar-ring": oklchToCss(adjustOklch(primary, { chroma: -0.05 })),
  };
}

// Convert HSL theme to OKLCH format
export function convertThemeToOklch(theme: Record<string, string>): Record<string, string> {
  const oklchVars: Record<string, string> = {};

  // Convert each HSL value to OKLCH
  Object.entries(theme).forEach(([key, value]) => {
    // Handle special cases like opacity values with "/"
    if (value.includes("/")) {
      const [colorPart, alphaPart] = value.split("/").map((s) => s.trim());
      const hsl = parseHslString(colorPart);
      if (hsl) {
        const oklch = hslToOklch(hsl);
        const alpha = Number.parseFloat(alphaPart.replace("%", "")) / 100;
        oklch.a = alpha;
        oklchVars[key] = oklchToCss(oklch);
      } else {
        oklchVars[key] = value; // Keep original if can't parse
      }
    } else {
      const hsl = parseHslString(value);
      if (hsl) {
        const oklch = hslToOklch(hsl);
        oklchVars[key] = oklchToCss(oklch);
      } else {
        // Handle non-color values like radius
        oklchVars[key] = value;
      }
    }
  });

  return oklchVars;
}

// Parse OKLCH string to OKLCH object
export function parseOklchString(oklchString: string): OKLCH | null {
  try {
    const match = oklchString.match(/oklch$$([^)]+)$$/);
    if (!match) return null;

    const values = match[1].split(/[\s,]+/).filter(Boolean);
    if (values.length < 3) return null;

    const l = Number.parseFloat(values[0]);
    const c = Number.parseFloat(values[1]);
    const h = Number.parseFloat(values[2]);

    let a: number | undefined;
    if (values.length > 3 && values[3].includes("/")) {
      const alphaPart = values[3].split("/")[1];
      a = Number.parseFloat(alphaPart.replace("%", "")) / 100;
    }

    return { l, c, h, a };
  } catch {
    return null;
  }
}
// Helper function to parse HSL string
function parseHslString(hslString: string): HSL | null {
  try {
    const parts = hslString.trim().split(/\s+/);
    if (parts.length >= 3) {
      return {
        h: Number.parseFloat(parts[0]),
        s: Number.parseFloat(parts[1].replace("%", "")),
        l: Number.parseFloat(parts[2].replace("%", "")),
      };
    }
    return null;
  } catch {
    return null;
  }
}
