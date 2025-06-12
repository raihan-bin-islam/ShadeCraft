export interface ThemeConfig {
  name: string;
  cssVars: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  format: "hsl" | "oklch";
}

export interface OKLCHColor {
  l: number; // Lightness (0-1)
  c: number; // Chroma (0-0.4+)
  h: number; // Hue (0-360)
  a?: number; // Alpha (0-1)
}

export interface HSLColor {
  h: number; // Hue (0-360)
  s: number; // Saturation (0-100)
  l: number; // Lightness (0-100)
}

// Add RGB interface, which is used in several places:
export interface RGB {
  r: number; // 0-255
  g: number; // 0-255
  b: number; // 0-255
}

export interface ThemeColors {
  light: Record<string, OKLCHColor>;
  dark: Record<string, OKLCHColor>;
}

export interface CustomTheme {
  name: string;
  description: string;
  colors: ThemeColors;
}
