import Color from "colorjs.io";

export interface ThemeTokens {
  primary: Color;
  secondary: Color;
  accent: Color;
  background: Color;
}

export type GenerateThemeOptions = {
  mode?: "dark" | "light";
  baseChroma?: number;
  baseLightness?: number;
};

// Adjustment

export type BackgroundKey = "background" | "card" | "muted" | "border" | "input";

export type Adjustment = {
  lightness: number;
  chromaRatio: number;
  maxChroma?: number;
  lightnessVariance?: number;
};

export type Adjustments = Partial<Record<BackgroundKey, Adjustment>>;
