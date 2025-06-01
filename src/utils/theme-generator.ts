export type ColorHarmony = "analogous" | "complementary" | "triadic" | "tetradic" | "monochromatic" | "split-complementary";

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

// Generate chart colors with good visual distinction based on color theory
function generateChartColors(baseHsl: HSL, count: number = 5): HSL[] {
  const colors: HSL[] = [];

  // Start with the primary color
  colors.push({ ...baseHsl });

  // Determine the color scheme based on the number of colors needed
  if (count <= 3) {
    // For 2-3 colors, use a triadic scheme for clear distinction
    const angle = 360 / count;
    for (let i = 1; i < count; i++) {
      const h = (baseHsl.h + angle * i) % 360;
      // Maintain similar saturation but vary lightness for better distinction
      const s = Math.min(90, Math.max(50, baseHsl.s));
      const l = Math.max(40, Math.min(70, baseHsl.l + (i % 2 === 0 ? 10 : -10)));
      colors.push({ h, s, l });
    }
  } else {
    // For 4+ colors, use golden angle for maximum distinction
    // The golden angle (137.5°) provides optimal spacing around the color wheel
    const goldenAngle = 137.5;

    for (let i = 1; i < count; i++) {
      const h = (baseHsl.h + goldenAngle * i) % 360;

      // Apply the 60-30-10 rule to chart colors:
      // - First few colors: more saturated (primary emphasis)
      // - Middle colors: medium saturation (secondary emphasis)
      // - Last colors: lower saturation but distinct (accent emphasis)

      let s, l;

      if (i < count / 3) {
        // Primary emphasis colors (more saturated)
        s = Math.min(95, baseHsl.s + 15);
        l = Math.max(45, Math.min(65, baseHsl.l - 5));
      } else if (i < (2 * count) / 3) {
        // Secondary emphasis colors (medium saturation)
        s = Math.min(85, baseHsl.s);
        l = Math.max(50, Math.min(70, baseHsl.l));
      } else {
        // Accent emphasis colors (lower saturation but distinct)
        s = Math.max(60, baseHsl.s - 10);
        l = Math.max(55, Math.min(75, baseHsl.l + 10));
      }

      colors.push({ h, s, l });
    }
  }

  // Ensure all colors have sufficient contrast with each other
  // by slightly adjusting lightness if colors are too similar
  for (let i = 1; i < colors.length; i++) {
    for (let j = 0; j < i; j++) {
      // If hues are too close, adjust lightness more dramatically
      const hueDiff = Math.abs(colors[i].h - colors[j].h);
      if (hueDiff < 30 || hueDiff > 330) {
        colors[i].l = Math.max(30, Math.min(85, colors[i].l + (i % 2 === 0 ? 15 : -15)));
      }
    }
  }

  return colors;
}

// Generate harmony colors based on color theory principles
function generateHarmonyColors(baseHsl: HSL, harmony: ColorHarmony, apply6030Rule: boolean = true): HSL[] {
  // Conditionally apply the 60-30-10 rule by adjusting saturation and lightness
  // Primary color (60%) - baseHsl is already defined and will be used as is
  // Secondary color (30%) - First harmony color with slightly reduced saturation
  // Accent color (10%) - Second harmony color with more vibrant properties

  switch (harmony) {
    case "analogous":
      // Colors adjacent to each other on the color wheel (30° apart)
      // Creates a harmonious and smooth feel
      if (apply6030Rule) {
        return [
          // Secondary - slightly less saturated (30%)
          { h: (baseHsl.h + 30) % 360, s: Math.max(30, baseHsl.s - 10), l: Math.min(65, baseHsl.l + 5) },
          // Accent - more vibrant (10%)
          { h: (baseHsl.h - 30 + 360) % 360, s: Math.min(90, baseHsl.s + 15), l: Math.max(45, baseHsl.l - 5) },
        ];
      } else {
        // Simple analogous colors without 60-30-10 rule adjustments
        return [
          { h: (baseHsl.h + 30) % 360, s: baseHsl.s, l: baseHsl.l },
          { h: (baseHsl.h - 30 + 360) % 360, s: baseHsl.s, l: baseHsl.l },
        ];
      }
    case "complementary":
      // Colors opposite each other on the color wheel (180° apart)
      // Creates high contrast and vibrant look
      if (apply6030Rule) {
        return [
          // For complementary, we use a more vibrant opposite color (30%)
          // and add a third color that's a muted version of the primary (10%)
          { h: (baseHsl.h + 180) % 360, s: Math.min(85, baseHsl.s + 10), l: Math.min(60, Math.max(40, baseHsl.l)) },
          // Additional muted variant of primary for better balance
          { ...baseHsl, s: Math.max(30, baseHsl.s - 30), l: Math.min(80, baseHsl.l + 15) },
        ];
      } else {
        // Simple complementary color without 60-30-10 rule adjustments
        return [{ h: (baseHsl.h + 180) % 360, s: baseHsl.s, l: baseHsl.l }];
      }
    case "triadic":
      // Three colors equally spaced (120° apart) around the color wheel
      // Creates a dynamic and balanced combination
      if (apply6030Rule) {
        return [
          // Secondary - slightly muted (30%)
          { h: (baseHsl.h + 120) % 360, s: Math.max(40, baseHsl.s - 5), l: Math.min(65, baseHsl.l + 5) },
          // Accent - more vibrant (10%)
          { h: (baseHsl.h + 240) % 360, s: Math.min(85, baseHsl.s + 10), l: Math.max(45, baseHsl.l - 5) },
        ];
      } else {
        // Simple triadic colors without 60-30-10 rule adjustments
        return [
          { h: (baseHsl.h + 120) % 360, s: baseHsl.s, l: baseHsl.l },
          { h: (baseHsl.h + 240) % 360, s: baseHsl.s, l: baseHsl.l },
        ];
      }
    case "tetradic":
      // Four colors forming a rectangle on the color wheel
      // Offers a balanced and vibrant palette with two complementary pairs
      if (apply6030Rule) {
        return [
          // Secondary - first complementary pair (20%)
          { h: (baseHsl.h + 90) % 360, s: Math.max(40, baseHsl.s - 5), l: Math.min(65, baseHsl.l + 5) },
          // Tertiary - complementary to primary (10%)
          { h: (baseHsl.h + 180) % 360, s: Math.min(80, baseHsl.s), l: Math.max(45, baseHsl.l - 5) },
          // Accent - complementary to secondary (10%)
          { h: (baseHsl.h + 270) % 360, s: Math.min(85, baseHsl.s + 10), l: Math.max(40, baseHsl.l - 10) },
        ];
      } else {
        // Simple tetradic colors without 60-30-10 rule adjustments
        return [
          { h: (baseHsl.h + 90) % 360, s: baseHsl.s, l: baseHsl.l },
          { h: (baseHsl.h + 180) % 360, s: baseHsl.s, l: baseHsl.l },
          { h: (baseHsl.h + 270) % 360, s: baseHsl.s, l: baseHsl.l },
        ];
      }
    case "split-complementary":
      // A color and two colors adjacent to its complement
      // Offers high contrast with more variety than complementary
      if (apply6030Rule) {
        return [
          // Secondary - first split complement (30%)
          { h: (baseHsl.h + 150) % 360, s: Math.min(80, baseHsl.s + 5), l: Math.min(60, Math.max(40, baseHsl.l)) },
          // Accent - second split complement (10%)
          { h: (baseHsl.h + 210) % 360, s: Math.min(85, baseHsl.s + 10), l: Math.max(45, baseHsl.l - 5) },
        ];
      } else {
        // Simple split-complementary colors without 60-30-10 rule adjustments
        return [
          { h: (baseHsl.h + 150) % 360, s: baseHsl.s, l: baseHsl.l },
          { h: (baseHsl.h + 210) % 360, s: baseHsl.s, l: baseHsl.l },
        ];
      }
    case "monochromatic":
      // Different shades and tints of a single color
      // Creates a cohesive and subtle look
      if (apply6030Rule) {
        return [
          // Secondary - lighter shade (30%)
          { ...baseHsl, s: Math.max(30, baseHsl.s - 20), l: Math.min(75, baseHsl.l + 15) },
          // Accent - darker shade (10%)
          { ...baseHsl, s: Math.min(90, baseHsl.s + 10), l: Math.max(30, baseHsl.l - 15) },
        ];
      } else {
        // Simple monochromatic colors without 60-30-10 rule adjustments
        return [
          { ...baseHsl, s: baseHsl.s, l: Math.min(80, baseHsl.l + 20) },
          { ...baseHsl, s: baseHsl.s, l: Math.max(20, baseHsl.l - 20) },
        ];
      }
    default:
      return [];
  }
}

// Generate a complete color palette including OKLCH values
export function generateColorPalette(baseColor: string, harmony: ColorHarmony = "analogous", apply6030Rule: boolean = true) {
  const baseHsl = hexToHsl(baseColor);

  // Generate harmony colors based on color theory principles
  const harmonyColors = generateHarmonyColors(baseHsl, harmony, apply6030Rule);

  // Generate chart colors for data visualization
  const chartColors = generateChartColors(baseHsl);

  // Apply the 60-30-10 rule:
  // - Primary color (60%): Main brand color (baseHsl)
  // - Secondary color (30%): First harmony color
  // - Accent color (10%): Second harmony color or a vibrant variant

  // Create base palette with perceptually appropriate backgrounds
  // Light mode: very light background with subtle hue
  const lightBackground = hslToHex({ h: baseHsl.h, s: 5, l: 98 });
  // Dark mode: very dark background with subtle hue
  const darkBackground = hslToHex({ h: baseHsl.h, s: 15, l: 8 });

  // Text colors with good contrast
  const lightForeground = hslToHex({ h: baseHsl.h, s: 10, l: 10 });
  const darkForeground = hslToHex({ h: baseHsl.h, s: 5, l: 98 });

  // Primary color (60% of the design)
  // Ensure contrast for primary colors against backgrounds
  const lightPrimary = ensureContrast(baseColor, lightBackground, 4.5);
  const darkPrimary = ensureContrast(
    hslToHex(adjustHSL(baseHsl, { s: Math.min(15, baseHsl.s), l: Math.max(55, baseHsl.l) })),
    darkBackground,
    4.5
  );

  // Secondary color (30% of the design)
  // Use the first harmony color or fallback to a 30° shift if no harmony colors
  const secondaryHsl = harmonyColors[0] || adjustHSL(baseHsl, { h: 30 });
  const lightSecondary = ensureContrast(
    hslToHex(secondaryHsl), // Use the harmony-generated secondary directly
    lightBackground,
    4.5
  );
  const darkSecondary = ensureContrast(
    hslToHex(adjustHSL(secondaryHsl, { l: Math.max(60, secondaryHsl.l) })), // Ensure visibility in dark mode
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
        // Accent color (10% of the design)
        // Use the second harmony color or create a vibrant variant of the primary
        light: ensureContrast(
          harmonyColors[1]
            ? hslToHex(harmonyColors[1])
            : hslToHex(adjustHSL(baseHsl, { s: Math.min(90, baseHsl.s + 10), l: Math.min(90, Math.max(65, baseHsl.l + 10)) })),
          lightBackground,
          3
        ),
        dark: ensureContrast(
          harmonyColors[1]
            ? hslToHex(adjustHSL(harmonyColors[1], { l: Math.max(40, harmonyColors[1].l) }))
            : hslToHex(adjustHSL(baseHsl, { s: Math.min(90, baseHsl.s + 15), l: Math.max(40, baseHsl.l - 5) })),
          darkBackground,
          3
        ),
      },
      "accent-foreground": {
        light: ensureContrast(
          lightForeground,
          harmonyColors[1]
            ? hslToHex(harmonyColors[1])
            : hslToHex(adjustHSL(baseHsl, { s: Math.min(90, baseHsl.s + 10), l: Math.min(90, Math.max(65, baseHsl.l + 10)) })),
          4.5
        ),
        dark: ensureContrast(
          darkForeground,
          harmonyColors[1]
            ? hslToHex(adjustHSL(harmonyColors[1], { l: Math.max(40, harmonyColors[1].l) }))
            : hslToHex(adjustHSL(baseHsl, { s: Math.min(90, baseHsl.s + 15), l: Math.max(40, baseHsl.l - 5) })),
          4.5
        ),
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

  // Map of our keys to shadcn UI expected CSS variable names
  const cssVarMap: Record<string, string> = {
    background: "background",
    foreground: "foreground",
    card: "card",
    "card-foreground": "card-foreground",
    popover: "popover",
    "popover-foreground": "popover-foreground",
    primary: "primary",
    "primary-foreground": "primary-foreground",
    secondary: "secondary",
    "secondary-foreground": "secondary-foreground",
    muted: "muted",
    "muted-foreground": "muted-foreground",
    accent: "accent",
    "accent-foreground": "accent-foreground",
    destructive: "destructive",
    "destructive-foreground": "destructive-foreground",
    border: "border",
    input: "input",
    ring: "ring",
    sidebar: "sidebar",
    "sidebar-foreground": "sidebar-foreground",
    "sidebar-primary": "sidebar-primary",
    "sidebar-primary-foreground": "sidebar-primary-foreground",
    "sidebar-accent": "sidebar-accent",
    "sidebar-accent-foreground": "sidebar-accent-foreground",
    "sidebar-border": "sidebar-border",
    "sidebar-ring": "sidebar-ring",
  };

  // Process all keys except chart colors
  for (const key of Object.keys(palette.oklch)) {
    if (key === "chart") continue;

    const lightValue = palette.oklch[key].light;
    const darkValue = palette.oklch[key].dark;

    // Use the mapped variable name or the original key if not in the map
    const varName = cssVarMap[key] || key;

    rootCSS += `  --${varName}: ${lightValue};\n`;
    darkCSS += `  --${varName}: ${darkValue};\n`;
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
      rootCSS += `  /* --${cssVarMap[key] || key}: ${palette.hex[key].light}; */\n`;
    }
    rootCSS += `}\n\n.dark {\n`;
    for (const key of Object.keys(palette.hex)) {
      if (key === "chart") continue;
      rootCSS += `  /* --${cssVarMap[key] || key}: ${palette.hex[key].dark}; */\n`;
    }
    rootCSS += `}\n`;
  }

  return rootCSS + darkCSS;
}

/**
 * Generate a theme with just one primary color input
 *
 * This function creates a complete theme based on color theory principles:
 *
 * 1. Color Harmonies:
 *    - Analogous: Colors adjacent on the color wheel, creating a harmonious feel
 *    - Complementary: Colors opposite on the color wheel, creating high contrast
 *    - Triadic: Three colors equally spaced around the color wheel, creating balance
 *    - Tetradic: Four colors forming a rectangle on the color wheel, offering variety
 *    - Monochromatic: Different shades of a single color, creating cohesion
 *    - Split-complementary: A color and two colors adjacent to its complement
 *
 * 2. 60-30-10 Rule:
 *    - Primary color (60%): Main brand color used for primary elements
 *    - Secondary color (30%): Complementary or harmony-based color for secondary elements
 *    - Accent color (10%): Vibrant color for highlights and calls to action
 *
 * 3. Perceptual Uniformity:
 *    - Uses OKLCH color space for better perceptual representation
 *    - Ensures proper contrast ratios for accessibility
 *    - Maintains color harmony across light and dark modes
 */
export function generateTheme(
  primaryColor: string,
  harmony: ColorHarmony = "analogous",
  outputFormat: "css" | "json" | "both" = "css",
  includeHex = false,
  apply6030Rule = true // Whether to apply the 60-30-10 rule in the theme
) {
  // Generate the color palette based on color theory principles
  const palette = generateColorPalette(primaryColor, harmony, apply6030Rule);

  // Return the palette in the requested format
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
