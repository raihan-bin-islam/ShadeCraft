import type { ThemeConfig } from "@/types/theme-kit/theme";

export const auroraTheme: ThemeConfig = {
  name: "aurora",
  format: "oklch",
  cssVars: {
    light: {
      background: "oklch(0.985 0.003 280.0)",
      foreground: "oklch(0.150 0.020 280.0)",
      card: "oklch(0.990 0.002 280.0)",
      "card-foreground": "oklch(0.150 0.020 280.0)",
      popover: "oklch(0.990 0.002 280.0)",
      "popover-foreground": "oklch(0.150 0.020 280.0)",
      primary: "oklch(0.627 0.265 303.9)", // Vibrant purple
      "primary-foreground": "oklch(0.985 0.003 280.0)",
      secondary: "oklch(0.750 0.223 160.0)", // Emerald green
      "secondary-foreground": "oklch(0.985 0.003 280.0)",
      muted: "oklch(0.950 0.020 280.0)",
      "muted-foreground": "oklch(0.550 0.048 280.0)",
      accent: "oklch(0.650 0.280 240.0)", // Bright blue
      "accent-foreground": "oklch(0.985 0.003 280.0)",
      destructive: "oklch(0.650 0.280 30.0)", // Red
      "destructive-foreground": "oklch(0.985 0.003 280.0)",
      border: "oklch(0.900 0.020 280.0)",
      input: "oklch(0.920 0.015 280.0)",
      ring: "oklch(0.627 0.265 303.9)", // Match primary
    },
    dark: {
      background: "oklch(0.120 0.050 280.0)",
      foreground: "oklch(0.950 0.010 280.0)",
      card: "oklch(0.150 0.040 280.0)",
      "card-foreground": "oklch(0.950 0.010 280.0)",
      popover: "oklch(0.150 0.040 280.0)",
      "popover-foreground": "oklch(0.950 0.010 280.0)",
      primary: "oklch(0.677 0.285 303.9)", // Brighter purple for dark mode
      "primary-foreground": "oklch(0.120 0.050 280.0)",
      secondary: "oklch(0.780 0.233 160.0)", // Brighter green for dark mode
      "secondary-foreground": "oklch(0.120 0.050 280.0)",
      muted: "oklch(0.180 0.030 280.0)",
      "muted-foreground": "oklch(0.700 0.030 280.0)",
      accent: "oklch(0.700 0.290 240.0)", // Brighter blue for dark mode
      "accent-foreground": "oklch(0.120 0.050 280.0)",
      destructive: "oklch(0.700 0.290 30.0)", // Brighter red for dark mode
      "destructive-foreground": "oklch(0.120 0.050 280.0)",
      border: "oklch(0.200 0.030 280.0)",
      input: "oklch(0.200 0.030 280.0)",
      ring: "oklch(0.677 0.285 303.9)", // Match primary
    },
  },
};
