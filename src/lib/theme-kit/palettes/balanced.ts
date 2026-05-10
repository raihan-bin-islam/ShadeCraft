import { ThemeTokens } from "@/types/theme-kit/palette";
import Color from "colorjs.io";
import { rng } from "@/lib/theme-kit/rng";

function rand(min: number, max: number): number {
  return rng() * (max - min) + min;
}

function clampHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

export function generateBalancedTheme(seedHue: number): ThemeTokens {
  const baseHue = clampHue(seedHue);
  const bgLightness = 0.1 + rand(0, 0.05);
  const accentDelta = rand(100, 140) * (rng() > 0.5 ? 1 : -1);

  const primary = new Color("oklch", [0.65 + rand(-0.45, 0.45), 0.52 + rand(-0.12, 0.23), baseHue]);

  const secondary = new Color("oklch", [0.4 + rand(-0.13, 0.03), 0.05 + rand(-0.03, 0.03), clampHue(baseHue + rand(-35, 35))]);

  const accent = new Color("oklch", [0.25 + rand(-0.15, 0.15), 0.15 + rand(-0.03, 0.06), clampHue(baseHue + accentDelta)]);

  const background = new Color("oklch", [bgLightness, 0.02 + rand(0, 0.02), clampHue(baseHue + rand(-20, 20))]);

  return {
    primary: primary,
    secondary: secondary,
    accent: accent,
    background: background,
  };
}
