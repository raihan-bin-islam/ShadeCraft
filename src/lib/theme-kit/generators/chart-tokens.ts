import Color from "colorjs.io";
import { createOklchTint } from "@/lib/theme-kit/core/adjustment";
import { generateOklchChartColors } from "@/lib/theme-kit/palettes/default";

/**
 * Generates flat chart token map for both light and dark modes. Dark-mode
 * tokens are prefixed with "dark-" so they merge cleanly into the master
 * cssVars object.
 */
export function generateChartTokens(primary: Color): Record<string, string> {
  const lightChart = generateOklchChartColors(primary);
  const darkChart = generateOklchChartColors(createOklchTint(primary, 10));

  const tokens: Record<string, string> = { ...lightChart };
  for (const [key, value] of Object.entries(darkChart)) {
    tokens[`dark-${key}`] = value;
  }

  return tokens;
}
