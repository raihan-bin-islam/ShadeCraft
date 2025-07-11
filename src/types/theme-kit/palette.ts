import { OKLCH } from "@/types/theme-kit/color-space";

export interface ThemeTokens {
  primary: OKLCH;
  secondary: OKLCH;
  accent: OKLCH;
  background: OKLCH;
}

export type GenerateThemeOptions = {
  mode?: "dark" | "light";
  baseChroma?: number;
  baseLightness?: number;
};
