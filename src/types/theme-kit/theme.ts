import { TONES } from "@/config/theme-tones";
import { HSL, OKLCH, RGB } from "@/types/theme-kit/color-space";

export type Theme = Record<string, string>;
export interface ThemeConfig {
  name: string;
  cssVars: {
    light: Theme;
    dark: Theme;
  };
  format: "hsl" | "oklch";
}

export interface TailwindV4Theme {
  name: string;
  description: string;
  feel: string;
  narrative?: string;
  tone?: (typeof TONES)[0];
  cssVars: { light: Theme; dark: Theme };
  theme: { light: Theme; dark: Theme };
  hslVars?: Theme;
  previewColors: {
    primary: string;
    secondary: string;
    accent: string;
    lightBg: string;
    darkBg: string;
  };
}

export interface ColorComparison {
  name: string;
  hsl: {
    value: HSL;
    css: string;
    rgb: RGB;
  };
  oklch: {
    value: OKLCH;
    css: string;
    rgb: RGB;
  };
  difference: {
    deltaE: number;
    perceptualDifference: "identical" | "minimal" | "noticeable" | "significant";
    gamutExpansion: boolean;
  };
}
