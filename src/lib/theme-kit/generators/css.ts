import { oklchToCss } from "@/lib/theme-kit/converters/to-css";
import { TailwindV4Theme } from "@/types/theme-kit";
import { OKLCH } from "@/types/theme-kit/color-space";

export function generateCSSVariables(theme: TailwindV4Theme["theme"], mode: "light" | "dark"): string {
  const colors = theme[mode];
  return Object.entries(colors)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, "-$1").toLowerCase();

      if (!value) return ""; //! added this line for type-safety if creates an error remove later
      // Check if the value is an OKLCH object or a string
      const cssValue = typeof value === "object" && "l" in value ? oklchToCss(value as OKLCH) : value;

      return `  --${cssKey}: ${cssValue};`;
    })
    .join("\n");
}
