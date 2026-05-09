import Color from "colorjs.io";
import { adjustOklch, createOklchTint } from "@/lib/theme-kit/core/adjustment";
import { generateOklchForeground, generateOklchSidebarColors } from "@/lib/theme-kit/palettes/default";
import { weightedChoice } from "@/lib/utils";

interface BackgroundLayers {
  background: Color;
  border: Color;
}

interface ForegroundCandidates {
  primary: Color;
  secondary: Color;
  accent: Color;
}

/**
 * Generates flat sidebar token map for both light and dark modes. Picks the
 * sidebar background from a weighted set of candidate bases (heavily biased
 * toward the main background) and emits dark-mode tokens with a "dark-"
 * prefix so they merge cleanly into the master cssVars object.
 */
export function generateSidebarTokens(params: {
  light: BackgroundLayers;
  dark: BackgroundLayers;
  primary: Color;
  accent: Color;
  lightForegroundCandidates: ForegroundCandidates;
  darkBackgroundCandidates: ForegroundCandidates;
}): Record<string, string> {
  const lightSidebarBase = [
    params.light.background,
    params.lightForegroundCandidates.accent,
    params.lightForegroundCandidates.secondary,
    params.lightForegroundCandidates.primary,
  ];
  const darkSidebarBase = [
    params.dark.background,
    params.darkBackgroundCandidates.accent,
    params.darkBackgroundCandidates.secondary,
    params.darkBackgroundCandidates.primary,
  ];

  const totalWeight = 100;
  const mostDesiredBgWeight = 80;
  const indicesWithWeight = lightSidebarBase.map((_, item, arr) => ({
    item,
    weight: item === 0 ? mostDesiredBgWeight : (totalWeight - mostDesiredBgWeight) / arr.length,
  }));

  const chosenIndex = weightedChoice(indicesWithWeight);

  const lightSidebarBg = adjustOklch(lightSidebarBase[chosenIndex], { lightness: -0.02 });
  const lightTokens = generateOklchSidebarColors(
    lightSidebarBg,
    generateOklchForeground(lightSidebarBg),
    params.primary,
    params.accent,
    adjustOklch(params.light.border, { lightness: -0.01 })
  );

  const darkSidebarBg = adjustOklch(darkSidebarBase[chosenIndex], { lightness: 0.1 });
  const darkTokens = generateOklchSidebarColors(
    darkSidebarBg,
    generateOklchForeground(darkSidebarBg),
    createOklchTint(params.primary, 10),
    createOklchTint(params.accent, 15),
    adjustOklch(params.dark.border, { lightness: 0.02 })
  );

  const tokens: Record<string, string> = { ...lightTokens };
  for (const [key, value] of Object.entries(darkTokens)) {
    tokens[`dark-${key}`] = value;
  }

  return tokens;
}
