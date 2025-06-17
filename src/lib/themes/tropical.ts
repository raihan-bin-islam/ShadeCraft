import type { ThemeConfig } from "@/types/theme-kit/theme";

export const tropicalTheme: ThemeConfig = {
  name: "tropical",
  format: "oklch",
  cssVars: {
    light: {
      background: "oklch(0.970 0.010 40.0)",
      foreground: "oklch(0.150 0.030 40.0)",
      card: "oklch(0.980 0.015 40.0)",
      "card-foreground": "oklch(0.150 0.030 40.0)",
      popover: "oklch(0.980 0.015 40.0)",
      "popover-foreground": "oklch(0.150 0.030 40.0)",
      primary: "oklch(0.750 0.200 80.0)", // Amber/orange
      "primary-foreground": "oklch(0.980 0.015 40.0)",
      secondary: "oklch(0.650 0.250 330.0)", // Pink
      "secondary-foreground": "oklch(0.980 0.015 40.0)",
      muted: "oklch(0.920 0.020 40.0)",
      "muted-foreground": "oklch(0.500 0.040 40.0)",
      accent: "oklch(0.700 0.250 190.0)", // Cyan
      "accent-foreground": "oklch(0.980 0.015 40.0)",
      destructive: "oklch(0.650 0.280 30.0)",
      "destructive-foreground": "oklch(0.980 0.015 40.0)",
      border: "oklch(0.850 0.030 40.0)",
      input: "oklch(0.900 0.025 40.0)",
      ring: "oklch(0.750 0.200 80.0)", // Match primary
    },
    dark: {
      background: "oklch(0.100 0.040 40.0)",
      foreground: "oklch(0.950 0.010 40.0)",
      card: "oklch(0.130 0.035 40.0)",
      "card-foreground": "oklch(0.950 0.010 40.0)",
      popover: "oklch(0.130 0.035 40.0)",
      "popover-foreground": "oklch(0.950 0.010 40.0)",
      primary: "oklch(0.780 0.210 80.0)", // Amber/orange
      "primary-foreground": "oklch(0.100 0.040 40.0)",
      secondary: "oklch(0.680 0.260 330.0)", // Pink
      "secondary-foreground": "oklch(0.100 0.040 40.0)",
      muted: "oklch(0.150 0.030 40.0)",
      "muted-foreground": "oklch(0.650 0.030 40.0)",
      accent: "oklch(0.730 0.260 190.0)", // Cyan
      "accent-foreground": "oklch(0.100 0.040 40.0)",
      destructive: "oklch(0.350 0.150 30.0)",
      "destructive-foreground": "oklch(0.950 0.010 40.0)",
      border: "oklch(0.180 0.030 40.0)",
      input: "oklch(0.180 0.030 40.0)",
      ring: "oklch(0.780 0.210 80.0)", // Match primary
    },
  },
};
