export type ColorHarmony =
  | "analogous"
  | "complementary"
  | "triadic"
  | "tetradic"
  | "monochromatic"
  | "split-complementary";

interface HSL {
  h: number;
  s: number;
  l: number;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface OKLCH {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4 is safe)
  h: number; // Hue (0-360)
}

// Convert hex to HSL
export function hexToHsl(hex: string): HSL {
  // Ensure hex is a valid format
  if (!hex || typeof hex !== "string") {
    return { h: 0, s: 0, l: 0 };
  }

  // Clean up the hex value
  hex = hex.trim();
  if (!hex.startsWith("#")) {
    hex = "#" + hex;
  }

  // Ensure we have a valid length
  if (![4, 7].includes(hex.length)) {
    // Default to black if invalid
    return { h: 0, s: 0, l: 0 };
  }

  // Convert hex to RGB
  const rgb = hexToRgb(hex);

  // Convert RGB to HSL
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

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

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// Convert hex to RGB
export function hexToRgb(hex: string): RGB {
  // Ensure hex is a valid format
  if (!hex || typeof hex !== "string") {
    return { r: 0, g: 0, b: 0 };
  }

  // Clean up the hex value
  hex = hex.trim();
  if (!hex.startsWith("#")) {
    hex = "#" + hex;
  }

  // Ensure we have a valid length
  if (![4, 7].includes(hex.length)) {
    // Default to black if invalid
    return { r: 0, g: 0, b: 0 };
  }

  let r = 0,
    g = 0,
    b = 0;

  // 3 digits (#RGB)
  if (hex.length === 4) {
    r = Number.parseInt(hex[1] + hex[1], 16);
    g = Number.parseInt(hex[2] + hex[2], 16);
    b = Number.parseInt(hex[3] + hex[3], 16);
  }
  // 6 digits (#RRGGBB)
  else if (hex.length === 7) {
    r = Number.parseInt(hex.substring(1, 3), 16);
    g = Number.parseInt(hex.substring(3, 5), 16);
    b = Number.parseInt(hex.substring(5, 7), 16);
  }

  // Handle invalid hex values
  if (isNaN(r) || isNaN(g) || isNaN(b)) {
    return { r: 0, g: 0, b: 0 };
  }

  return { r, g, b };
}

// Convert HSL to Hex
export function hslToHex(hsl: HSL): string {
  const { h, s, l } = hsl;
  const hDecimal = h / 360;
  const sDecimal = s / 100;
  const lDecimal = l / 100;

  if (sDecimal === 0) {
    const value = Math.round(lDecimal * 255);
    return `#${value.toString(16).padStart(2, "0").repeat(3)}`;
  }

  const q = lDecimal < 0.5 ? lDecimal * (1 + sDecimal) : lDecimal + sDecimal - lDecimal * sDecimal;
  const p = 2 * lDecimal - q;

  const r = Math.round(hueToRgb(p, q, hDecimal + 1 / 3) * 255);
  const g = Math.round(hueToRgb(p, q, hDecimal) * 255);
  const b = Math.round(hueToRgb(p, q, hDecimal - 1 / 3) * 255);

  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

// Helper function for HSL to RGB conversion
function hueToRgb(p: number, q: number, t: number): number {
  if (t < 0) t += 1;
  if (t > 1) t -= 1;
  if (t < 1 / 6) return p + (q - p) * 6 * t;
  if (t < 1 / 2) return q;
  if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
  return p;
}

// Adjust HSL values
function adjustHSL(hsl: HSL, adjustments: Partial<HSL>): HSL {
  return {
    h: (hsl.h + (adjustments.h || 0) + 360) % 360, // Ensure h is always positive
    s: Math.max(0, Math.min(100, hsl.s + (adjustments.s || 0))),
    l: Math.max(0, Math.min(100, hsl.l + (adjustments.l || 0))),
  };
}

// Convert RGB to OKLCH approximation
function rgbToOklch(rgb: RGB): OKLCH {
  // Convert RGB to linear RGB
  const r = srgbToLinear(rgb.r / 255);
  const g = srgbToLinear(rgb.g / 255);
  const b = srgbToLinear(rgb.b / 255);

  // Convert to XYZ
  const x = 0.4124 * r + 0.3576 * g + 0.1805 * b;
  const y = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const z = 0.0193 * r + 0.1192 * g + 0.9505 * b;

  // Convert XYZ to LAB (approximation)
  const l = 0.3 * Math.cbrt(y);
  const a = 0.5 * (Math.cbrt(x) - Math.cbrt(y));
  const b2 = 0.2 * (Math.cbrt(y) - Math.cbrt(z));

  // Convert LAB to LCH
  const c = Math.sqrt(a * a + b2 * b2);
  let h = Math.atan2(b2, a) * (180 / Math.PI);
  if (h < 0) h += 360;

  // Map to OKLCH range (approximation)
  return {
    l: Math.min(1, Math.max(0, l)),
    c: Math.min(0.4, Math.max(0, c * 0.3)), // Limit chroma to reasonable values
    h,
  };
}

// Helper for RGB to OKLCH conversion
function srgbToLinear(value: number): number {
  return value <= 0.04045 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
}

// Format OKLCH for CSS output
function oklchToString(oklch: OKLCH): string {
  return `oklch(${oklch.l.toFixed(3)} ${oklch.c.toFixed(3)} ${Math.round(oklch.h)})`;
}

// Convert hex to OKLCH string
export function hexToOklch(hex: string): string {
  const rgb = hexToRgb(hex);
  const oklch = rgbToOklch(rgb);
  return oklchToString(oklch);
}

// Calculate the relative luminance of a color (for WCAG contrast calculations)
export function getLuminance(color: string): number {
  const rgb = hexToRgb(color);

  // Convert RGB to linear values
  const r = srgbToLinear(rgb.r / 255);
  const g = srgbToLinear(rgb.g / 255);
  const b = srgbToLinear(rgb.b / 255);

  // Calculate luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// Calculate contrast ratio between two colors
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);

  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);

  return (lighter + 0.05) / (darker + 0.05);
}

// Adjust color to meet minimum contrast ratio
export function ensureContrast(foreground: string, background: string, minContrast = 4.5): string {
  const fgHsl = hexToHsl(foreground);
  const currentContrast = getContrastRatio(foreground, background);

  if (currentContrast >= minContrast) {
    return foreground;
  }

  // Determine if we need to lighten or darken the foreground
  const bgLuminance = getLuminance(background);
  const needDarker = bgLuminance > 0.5;

  // Adjust luminance until we meet contrast requirements
  const step = needDarker ? -2 : 2; // Larger step for faster convergence
  let attempts = 0;
  let newForeground = foreground;

  while (getContrastRatio(newForeground, background) < minContrast && attempts < 50) {
    fgHsl.l = Math.max(0, Math.min(100, fgHsl.l + step));
    newForeground = hslToHex(fgHsl);
    attempts++;

    // If we reach the extremes and still don't have enough contrast,
    // try adjusting saturation as well
    if ((fgHsl.l <= 5 || fgHsl.l >= 95) && attempts > 25) {
      fgHsl.s = Math.max(0, Math.min(100, fgHsl.s + (needDarker ? 10 : -10)));
      fgHsl.l = needDarker ? 5 : 95; // Reset to near extreme
    }
  }

  return newForeground;
}

// Generate chart colors with good visual distinction
function generateChartColors(baseHsl: HSL, count: number = 5): HSL[] {
  const colors: HSL[] = [];

  // Start with primary
  colors.push({ ...baseHsl });

  // Add colors at golden angle intervals for maximum distinction
  const goldenAngle = 137.5; // Golden angle in degrees

  for (let i = 1; i < count; i++) {
    const h = (baseHsl.h + goldenAngle * i) % 360;
    // Vary saturation and lightness for better distinction
    const s = Math.min(100, baseHsl.s + (i % 3) * 10 - 10);
    const l = Math.max(40, Math.min(75, baseHsl.l + (i % 2) * 15 - 7));

    colors.push({ h, s, l });
  }

  return colors;
}

// Generate harmony colors based on color theory principles
function generateHarmonyColors(baseHsl: HSL, harmony: ColorHarmony): HSL[] {
  switch (harmony) {
    case "analogous":
      return [
        { ...baseHsl, h: (baseHsl.h + 30) % 360 },
        { ...baseHsl, h: (baseHsl.h - 30 + 360) % 360 },
      ];
    case "complementary":
      return [{ ...baseHsl, h: (baseHsl.h + 180) % 360 }];
    case "triadic":
      return [
        { ...baseHsl, h: (baseHsl.h + 120) % 360 },
        { ...baseHsl, h: (baseHsl.h + 240) % 360 },
      ];
    case "tetradic":
      return [
        { ...baseHsl, h: (baseHsl.h + 90) % 360 },
        { ...baseHsl, h: (baseHsl.h + 180) % 360 },
        { ...baseHsl, h: (baseHsl.h + 270) % 360 },
      ];
    case "split-complementary":
      return [
        { ...baseHsl, h: (baseHsl.h + 150) % 360 },
        { ...baseHsl, h: (baseHsl.h + 210) % 360 },
      ];
    case "monochromatic":
      return [adjustHSL(baseHsl, { s: 10, l: -15 }), adjustHSL(baseHsl, { s: -10, l: 15 })];
    default:
      return [];
  }
}

// Generate a complete color palette including OKLCH values
export function generateColorPalette(baseColor: string, harmony: ColorHarmony = "analogous") {
  const baseHsl = hexToHsl(baseColor);

  // Generate harmony colors
  const harmonyColors = generateHarmonyColors(baseHsl, harmony);

  // Generate chart colors
  const chartColors = generateChartColors(baseHsl);

  // Create base palette
  const lightBackground = hslToHex({ h: baseHsl.h, s: 5, l: 98 });
  const darkBackground = hslToHex({ h: baseHsl.h, s: 15, l: 8 });

  const lightForeground = hslToHex({ h: baseHsl.h, s: 10, l: 10 });
  const darkForeground = hslToHex({ h: baseHsl.h, s: 5, l: 98 });

  // Ensure contrast for primary colors
  const lightPrimary = ensureContrast(baseColor, lightBackground, 4.5);
  const darkPrimary = ensureContrast(
    hslToHex(adjustHSL(baseHsl, { s: Math.min(15, baseHsl.s), l: Math.max(55, baseHsl.l) })),
    darkBackground,
    4.5
  );

  // Ensure contrast for secondary colors
  const secondaryHsl = harmonyColors[0] || adjustHSL(baseHsl, { h: 30 });
  const lightSecondary = ensureContrast(
    hslToHex(adjustHSL(secondaryHsl, { s: Math.min(70, secondaryHsl.s), l: 50 })),
    lightBackground,
    4.5
  );
  const darkSecondary = ensureContrast(
    hslToHex(adjustHSL(secondaryHsl, { s: Math.min(80, secondaryHsl.s), l: 60 })),
    darkBackground,
    4.5
  );

  // Define sidebar colors - slightly different from main theme for visual separation
  const lightSidebar = hslToHex({ h: baseHsl.h, s: 10, l: 96 });
  const darkSidebar = hslToHex({ h: baseHsl.h, s: 20, l: 10 });

  // Convert all colors to both hex and OKLCH format
  const palette = {
    hex: {
      background: {
        light: lightBackground,
        dark: darkBackground,
      },
      foreground: {
        light: lightForeground,
        dark: darkForeground,
      },
      card: {
        light: "#ffffff",
        dark: hslToHex({ h: baseHsl.h, s: 15, l: 12 }),
      },
      "card-foreground": {
        light: ensureContrast(lightForeground, "#ffffff", 4.5),
        dark: ensureContrast(darkForeground, hslToHex({ h: baseHsl.h, s: 15, l: 12 }), 4.5),
      },
      popover: {
        light: "#ffffff",
        dark: hslToHex({ h: baseHsl.h, s: 15, l: 16 }),
      },
      "popover-foreground": {
        light: ensureContrast(lightForeground, "#ffffff", 4.5),
        dark: ensureContrast(darkForeground, hslToHex({ h: baseHsl.h, s: 15, l: 16 }), 4.5),
      },
      primary: {
        light: lightPrimary,
        dark: darkPrimary,
      },
      "primary-foreground": {
        light: ensureContrast("#ffffff", lightPrimary, 4.5),
        dark: ensureContrast("#ffffff", darkPrimary, 4.5),
      },
      secondary: {
        light: lightSecondary,
        dark: darkSecondary,
      },
      "secondary-foreground": {
        light: ensureContrast("#ffffff", lightSecondary, 4.5),
        dark: ensureContrast("#ffffff", darkSecondary, 4.5),
      },
      accent: {
        light: ensureContrast(hslToHex(adjustHSL(baseHsl, { s: -50, l: 90 })), lightBackground, 3),
        dark: ensureContrast(hslToHex(adjustHSL(baseHsl, { s: -30, l: 25 })), darkBackground, 3),
      },
      "accent-foreground": {
        light: ensureContrast(lightForeground, hslToHex(adjustHSL(baseHsl, { s: -50, l: 90 })), 4.5),
        dark: ensureContrast(darkForeground, hslToHex(adjustHSL(baseHsl, { s: -30, l: 25 })), 4.5),
      },
      muted: {
        light: hslToHex(adjustHSL(baseHsl, { s: -80, l: 95 })),
        dark: hslToHex(adjustHSL(baseHsl, { s: -70, l: 20 })),
      },
      "muted-foreground": {
        light: ensureContrast(
          hslToHex(adjustHSL(baseHsl, { s: -20, l: 40 })),
          hslToHex(adjustHSL(baseHsl, { s: -80, l: 95 })),
          4.5
        ),
        dark: ensureContrast(
          hslToHex(adjustHSL(baseHsl, { s: -30, l: 60 })),
          hslToHex(adjustHSL(baseHsl, { s: -70, l: 20 })),
          4.5
        ),
      },
      destructive: {
        light: "#ef4444",
        dark: "#ef4444",
      },
      "destructive-foreground": {
        light: ensureContrast("#ffffff", "#ef4444", 4.5),
        dark: ensureContrast("#ffffff", "#ef4444", 4.5),
      },
      border: {
        light: hslToHex(adjustHSL(baseHsl, { s: -80, l: 92 })),
        dark: "rgba(255, 255, 255, 0.1)",
      },
      input: {
        light: hslToHex(adjustHSL(baseHsl, { s: -80, l: 92 })),
        dark: "rgba(255, 255, 255, 0.15)",
      },
      ring: {
        light: hslToHex(adjustHSL(baseHsl, { s: 60, l: 50 })),
        dark: hslToHex(adjustHSL(baseHsl, { s: 60, l: 40 })),
      },
      // Chart colors
      chart: chartColors.map((hsl) => hslToHex(hsl)),
      // Sidebar-specific colors
      sidebar: {
        light: lightSidebar,
        dark: darkSidebar,
      },
      "sidebar-foreground": {
        light: ensureContrast(lightForeground, lightSidebar, 4.5),
        dark: ensureContrast(darkForeground, darkSidebar, 4.5),
      },
      "sidebar-primary": {
        light: lightPrimary,
        dark: ensureContrast(hslToHex(chartColors[0]), darkSidebar, 4.5),
      },
      "sidebar-primary-foreground": {
        light: ensureContrast("#ffffff", lightPrimary, 4.5),
        dark: ensureContrast("#ffffff", ensureContrast(hslToHex(chartColors[0]), darkSidebar, 4.5), 4.5),
      },
      "sidebar-accent": {
        light: hslToHex(adjustHSL(baseHsl, { s: -60, l: 90 })),
        dark: hslToHex(adjustHSL(baseHsl, { s: -50, l: 20 })),
      },
      "sidebar-accent-foreground": {
        light: ensureContrast(lightForeground, hslToHex(adjustHSL(baseHsl, { s: -60, l: 90 })), 4.5),
        dark: ensureContrast(darkForeground, hslToHex(adjustHSL(baseHsl, { s: -50, l: 20 })), 4.5),
      },
      "sidebar-border": {
        light: hslToHex(adjustHSL(baseHsl, { s: -60, l: 88 })),
        dark: "rgba(255, 255, 255, 0.1)",
      },
      "sidebar-ring": {
        light: hslToHex(adjustHSL(baseHsl, { s: 50, l: 40 })),
        dark: hslToHex(adjustHSL(baseHsl, { s: 50, l: 30 })),
      },
    },
    // Convert all hex colors to OKLCH strings
    oklch: {},
  };

  // Generate OKLCH values for all hex colors
  const oklch: Record<string, object> = {};

  // Process regular colors
  for (const [key, value] of Object.entries(palette.hex)) {
    if (key === "chart") {
      // Handle chart colors array
      oklch[key] = (value as string[]).map((hexColor: string) => hexToOklch(hexColor));
    } else if (typeof value === "object" && !(value instanceof Array)) {
      // Handle light/dark pairs
      oklch[key] = {
        light: hexToOklch(value.light),
        dark: hexToOklch(value.dark),
      };
    }
  }

  palette.oklch = oklch;

  return palette;
}

// Generate CSS variables for a theme
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function generateThemeCSS(palette: any, includeHex = false): string {
  let rootCSS = `:root {\n  --radius: 0.625rem;\n`;
  let darkCSS = `.dark {\n`;

  // Process all keys except chart colors
  for (const key of Object.keys(palette.oklch)) {
    if (key === "chart") continue;

    const lightValue = palette.oklch[key].light;
    const darkValue = palette.oklch[key].dark;

    rootCSS += `  --${key}: ${lightValue};\n`;
    darkCSS += `  --${key}: ${darkValue};\n`;
  }

  // Add chart colors
  for (let i = 0; i < palette.oklch.chart.length; i++) {
    rootCSS += `  --chart-${i + 1}: ${palette.oklch.chart[i]};\n`;
  }

  // Close CSS blocks
  rootCSS += `}\n`;
  darkCSS += `}\n`;

  // Add hex values if requested (useful for debugging)
  if (includeHex) {
    rootCSS += `\n/* Hex values for reference */\n:root {\n`;
    for (const key of Object.keys(palette.hex)) {
      if (key === "chart") continue;
      rootCSS += `  /* --${key}: ${palette.hex[key].light}; */\n`;
    }
    rootCSS += `}\n\n.dark {\n`;
    for (const key of Object.keys(palette.hex)) {
      if (key === "chart") continue;
      rootCSS += `  /* --${key}: ${palette.hex[key].dark}; */\n`;
    }
    rootCSS += `}\n`;
  }

  return rootCSS + darkCSS;
}

// Generate a theme with just one primary color input
export function generateTheme(
  primaryColor: string,
  harmony: ColorHarmony = "analogous",
  outputFormat: "css" | "json" | "both" = "css",
  includeHex = false
) {
  const palette = generateColorPalette(primaryColor, harmony);

  if (outputFormat === "json") {
    return palette;
  } else if (outputFormat === "css") {
    return generateThemeCSS(palette, includeHex);
  } else {
    return {
      css: generateThemeCSS(palette, includeHex),
      palette,
    };
  }
}
