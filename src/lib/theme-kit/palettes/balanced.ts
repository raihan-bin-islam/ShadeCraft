import { OKLCH } from "@/types/theme-kit";
import { ThemeTokens } from "@/types/theme-kit/palette";
import Color from "colorjs.io";

function rand(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

function clampHue(h: number): number {
  return ((h % 360) + 360) % 360;
}

function extractOKLCH(color: Color): OKLCH {
  const [l, c, h] = color.oklch;
  return {
    l: +l.toFixed(4),
    c: +c.toFixed(4),
    h: +clampHue(h).toFixed(2),
  };
}

export function generateBalancedTheme(seedHue: number): ThemeTokens {
  const baseHue = clampHue(seedHue);
  const bgLightness = 0.1 + rand(0, 0.05);
  const accentDelta = rand(100, 140) * (Math.random() > 0.5 ? 1 : -1);

  const primary = new Color("oklch", [0.65 + rand(-0.45, 0.45), 0.52 + rand(-0.12, 0.23), baseHue]);

  const secondary = new Color("oklch", [0.4 + rand(-0.13, 0.03), 0.05 + rand(-0.03, 0.03), clampHue(baseHue + rand(-35, 35))]);

  const accent = new Color("oklch", [0.25 + rand(-0.15, 0.15), 0.15 + rand(-0.03, 0.06), clampHue(baseHue + accentDelta)]);

  const background = new Color("oklch", [bgLightness, 0.02 + rand(0, 0.02), clampHue(baseHue + rand(-20, 20))]);

  return {
    primary: extractOKLCH(primary),
    secondary: extractOKLCH(secondary),
    accent: extractOKLCH(accent),
    background: extractOKLCH(background),
  };
}
