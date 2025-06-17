import type { ThemeConfig } from "@/types/theme";
import { convertThemeToOklch as convertVarsToOklch } from "./converters/oklch-converter";

// Convert HSL theme to OKLCH theme
export function convertThemeToOklch(theme: ThemeConfig): ThemeConfig {
  // Convert light mode variables
  const lightVars = convertVarsToOklch(theme.cssVars.light);

  // Convert dark mode variables
  const darkVars = convertVarsToOklch(theme.cssVars.dark);

  return {
    name: theme.name,
    cssVars: {
      light: lightVars,
      dark: darkVars,
    },
    format: "oklch",
  };
}
