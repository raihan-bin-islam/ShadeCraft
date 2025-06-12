import type { ThemeConfig } from "@/types/theme";

export const sereneTheme: ThemeConfig = {
  name: "serene",
  format: "oklch",
  cssVars: {
    light: {
      background: "oklch(0.980 0.005 220.0)",
      foreground: "oklch(0.200 0.010 220.0)",
      card: "oklch(0.990 0.003 220.0)",
      "card-foreground": "oklch(0.200 0.010 220.0)",
      popover: "oklch(0.990 0.003 220.0)",
      "popover-foreground": "oklch(0.200 0.010 220.0)",
      primary: "oklch(0.500 0.050 220.0)", // Slate blue
      "primary-foreground": "oklch(0.990 0.003 220.0)",
      secondary: "oklch(0.750 0.030 220.0)", // Light slate
      "secondary-foreground": "oklch(0.200 0.010 220.0)",
      muted: "oklch(0.940 0.010 220.0)",
      "muted-foreground": "oklch(0.550 0.020 220.0)",
      accent: "oklch(0.900 0.015 220.0)", // Very light slate
      "accent-foreground": "oklch(0.200 0.010 220.0)",
      destructive: "oklch(0.650 0.280 30.0)",
      "destructive-foreground": "oklch(0.990 0.003 220.0)",
      border: "oklch(0.900 0.010 220.0)",
      input: "oklch(0.920 0.010 220.0)",
      ring: "oklch(0.500 0.050 220.0)", // Match primary
    },
    dark: {
      background: "oklch(0.120 0.030 220.0)",
      foreground: "oklch(0.950 0.005 220.0)",
      card: "oklch(0.150 0.025 220.0)",
      "card-foreground": "oklch(0.950 0.005 220.0)",
      popover: "oklch(0.150 0.025 220.0)",
      "popover-foreground": "oklch(0.950 0.005 220.0)",
      primary: "oklch(0.550 0.060 220.0)", // Slate blue
      "primary-foreground": "oklch(0.990 0.003 220.0)",
      secondary: "oklch(0.700 0.035 220.0)", // Light slate
      "secondary-foreground": "oklch(0.200 0.010 220.0)",
      muted: "oklch(0.180 0.020 220.0)",
      "muted-foreground": "oklch(0.700 0.020 220.0)",
      accent: "oklch(0.250 0.025 220.0)",
      "accent-foreground": "oklch(0.950 0.005 220.0)",
      destructive: "oklch(0.350 0.150 30.0)",
      "destructive-foreground": "oklch(0.950 0.005 220.0)",
      border: "oklch(0.200 0.020 220.0)",
      input: "oklch(0.200 0.020 220.0)",
      ring: "oklch(0.550 0.060 220.0)", // Match primary
    },
  },
};
