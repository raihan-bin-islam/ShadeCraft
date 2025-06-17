import { rgbToHsl } from "@/lib/theme-kit/converters";
import { Theme } from "@/types/theme-kit";
import { HSL, OKLCH } from "@/types/theme-kit/color-space";

export function parseOklchString(oklchString: string): OKLCH | null {
  try {
    const match = oklchString.match(/oklch$$([^)]+)$$/);
    if (!match) return null;

    const values = match[1].split(/[\s,]+/).filter(Boolean);
    if (values.length < 3) return null;

    const l = Number.parseFloat(values[0]);
    const c = Number.parseFloat(values[1]);
    const h = Number.parseFloat(values[2]);

    let a: number | undefined;
    if (values.length > 3 && values[3].includes("/")) {
      const alphaPart = values[3].split("/")[1];
      a = Number.parseFloat(alphaPart.replace("%", "")) / 100;
    }

    return { l, c, h, a };
  } catch {
    return null;
  }
}

export function parseHslString(hslString: string): HSL | null {
  try {
    const parts = hslString.trim().split(/\s+/);
    if (parts.length >= 3) {
      return {
        h: Number.parseFloat(parts[0]),
        s: Number.parseFloat(parts[1].replace("%", "")),
        l: Number.parseFloat(parts[2].replace("%", "")),
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Parse CSS theme variables
export function parseThemeCSS(css: string): Theme {
  const variables: Theme = {};

  // Match CSS custom properties
  const variableRegex = /--([^:]+):\s*([^;]+);/g;
  let match;

  while ((match = variableRegex.exec(css)) !== null) {
    const [, name, value] = match;
    variables[name.trim()] = value.trim();
  }

  return variables;
}

// Convert various color formats to HSL
export function parseColorToHsl(colorValue: string): HSL | null {
  try {
    // Handle HSL format: "217.2 32.6% 17.5%"
    if (colorValue.includes("%")) {
      const parts = colorValue.split(/\s+/);
      if (parts.length >= 3) {
        return {
          h: Number.parseFloat(parts[0]),
          s: Number.parseFloat(parts[1].replace("%", "")),
          l: Number.parseFloat(parts[2].replace("%", "")),
        };
      }
    }

    // Handle OKLCH format: "oklch(0.627 0.265 303.9)"
    if (colorValue.includes("oklch")) {
      const match = colorValue.match(/oklch$$([^)]+)$$/);
      if (match) {
        const parts = match[1].split(/\s+/);
        if (parts.length >= 3) {
          // Approximate conversion from OKLCH to HSL
          const l = Number.parseFloat(parts[0]) * 100;
          const c = Number.parseFloat(parts[1]);
          const h = Number.parseFloat(parts[2]);
          const s = Math.min(100, c * 200); // Rough approximation

          return { h, s, l };
        }
      }
    }

    // Handle RGB format
    if (colorValue.includes("rgb")) {
      const match = colorValue.match(/rgb$$([^)]+)$$/);
      if (match) {
        const parts = match[1].split(",").map((p) => Number.parseFloat(p.trim()));
        if (parts.length >= 3) {
          return rgbToHsl({ r: parts[0], g: parts[1], b: parts[2] });
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}
