import type { ThemeConfig } from "@/types/theme";

export const midnightTheme: ThemeConfig = {
  name: "midnight",
  format: "oklch",
  cssVars: {
    light: {
      background: "oklch(0.970 0.005 235.0)",
      foreground: "oklch(0.150 0.020 235.0)",
      card: "oklch(0.990 0.003 235.0)",
      "card-foreground": "oklch(0.150 0.020 235.0)",
      popover: "oklch(0.990 0.003 235.0)",
      "popover-foreground": "oklch(0.150 0.020 235.0)",
      primary: "oklch(0.650 0.270 260.0)", // Indigo
      "primary-foreground": "oklch(0.990 0.003 235.0)",
      secondary: "oklch(0.650 0.280 280.0)", // Purple
      "secondary-foreground": "oklch(0.990 0.003 235.0)",
      muted: "oklch(0.950 0.010 235.0)",
      "muted-foreground": "oklch(0.550 0.020 235.0)",
      accent: "oklch(0.650 0.250 330.0)", // Pink
      "accent-foreground": "oklch(0.990 0.003 235.0)",
      destructive: "oklch(0.650 0.280 30.0)",
      "destructive-foreground": "oklch(0.990 0.003 235.0)",
      border: "oklch(0.900 0.010 235.0)",
      input: "oklch(0.920 0.010 235.0)",
      ring: "oklch(0.650 0.270 260.0)", // Match primary
    },
    dark: {
      background: "oklch(0.080 0.050 235.0)",
      foreground: "oklch(0.950 0.005 235.0)",
      card: "oklch(0.120 0.040 235.0)",
      "card-foreground": "oklch(0.950 0.005 235.0)",
      popover: "oklch(0.120 0.040 235.0)",
      "popover-foreground": "oklch(0.950 0.005 235.0)",
      primary: "oklch(0.700 0.280 260.0)", // Indigo
      "primary-foreground": "oklch(0.080 0.050 235.0)",
      secondary: "oklch(0.700 0.290 280.0)", // Purple
      "secondary-foreground": "oklch(0.080 0.050 235.0)",
      muted: "oklch(0.150 0.030 235.0)",
      "muted-foreground": "oklch(0.700 0.020 235.0)",
      accent: "oklch(0.680 0.260 330.0)", // Pink
      "accent-foreground": "oklch(0.080 0.050 235.0)",
      destructive: "oklch(0.350 0.150 30.0)",
      "destructive-foreground": "oklch(0.950 0.005 235.0)",
      border: "oklch(0.170 0.030 235.0)",
      input: "oklch(0.170 0.030 235.0)",
      ring: "oklch(0.700 0.280 260.0)", // Match primary
    },
  },
};
