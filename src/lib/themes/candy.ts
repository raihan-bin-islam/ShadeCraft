import type { ThemeConfig } from "@/types/theme";

export const candyTheme: ThemeConfig = {
  name: "candy",
  format: "oklch",
  cssVars: {
    light: {
      background: "oklch(0.980 0.010 320.0)",
      foreground: "oklch(0.200 0.020 320.0)",
      card: "oklch(0.990 0.008 320.0)",
      "card-foreground": "oklch(0.200 0.020 320.0)",
      popover: "oklch(0.990 0.008 320.0)",
      "popover-foreground": "oklch(0.200 0.020 320.0)",
      primary: "oklch(0.700 0.250 330.0)", // Pink
      "primary-foreground": "oklch(0.990 0.008 320.0)",
      secondary: "oklch(0.760 0.180 280.0)", // Lavender
      "secondary-foreground": "oklch(0.200 0.020 320.0)",
      muted: "oklch(0.940 0.015 320.0)",
      "muted-foreground": "oklch(0.550 0.020 320.0)",
      accent: "oklch(0.790 0.150 240.0)", // Light blue
      "accent-foreground": "oklch(0.200 0.020 320.0)",
      destructive: "oklch(0.650 0.280 30.0)",
      "destructive-foreground": "oklch(0.990 0.008 320.0)",
      border: "oklch(0.880 0.015 320.0)",
      input: "oklch(0.920 0.015 320.0)",
      ring: "oklch(0.700 0.250 330.0)", // Match primary
    },
    dark: {
      background: "oklch(0.100 0.040 320.0)",
      foreground: "oklch(0.950 0.010 320.0)",
      card: "oklch(0.130 0.035 320.0)",
      "card-foreground": "oklch(0.950 0.010 320.0)",
      popover: "oklch(0.130 0.035 320.0)",
      "popover-foreground": "oklch(0.950 0.010 320.0)",
      primary: "oklch(0.730 0.260 330.0)", // Pink
      "primary-foreground": "oklch(0.100 0.040 320.0)",
      secondary: "oklch(0.790 0.190 280.0)", // Lavender
      "secondary-foreground": "oklch(0.100 0.040 320.0)",
      muted: "oklch(0.150 0.030 320.0)",
      "muted-foreground": "oklch(0.700 0.020 320.0)",
      accent: "oklch(0.820 0.160 240.0)", // Light blue
      "accent-foreground": "oklch(0.100 0.040 320.0)",
      destructive: "oklch(0.350 0.150 30.0)",
      "destructive-foreground": "oklch(0.950 0.010 320.0)",
      border: "oklch(0.180 0.030 320.0)",
      input: "oklch(0.180 0.030 320.0)",
      ring: "oklch(0.730 0.260 330.0)", // Match primary
    },
  },
};
