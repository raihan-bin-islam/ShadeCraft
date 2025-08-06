import { TailwindV4Theme } from "@/types/theme-kit";
import beautify from "js-beautify";

const filterKeys = ["toneId", "feelId", "fontFamily"];
export function formatAndGroupCSS(css: string) {
  const beautified = beautify.css(css, {
    indent_size: 2,
    preserve_newlines: true,
  });

  // Add extra newline between font and radius vars
  const grouped = beautified.replace(
    /(--font-[^\n]+;\s*\n)(--radius-[^\n]+;)/g,
    (_, fontLine, radiusLine) => `${fontLine}\n${radiusLine}`
  );

  return grouped;
}

const renameKey = (obj: Record<string, string>, oldKey: string, newKey: string) => {
  if (oldKey !== newKey && obj.hasOwnProperty(oldKey)) {
    obj[newKey] = obj[oldKey];
    delete obj[oldKey];
  }
  return obj;
};

/**
 * Converts a flat key-value theme object into CSS custom properties.
 */
function generateCssVars(vars: TailwindV4Theme["cssVars"]["light"]): string {
  renameKey(vars, "fontName", "font-display");

  const normalKeys = Object.keys(vars).filter((k) => !filterKeys.includes(k) && k !== "radius" && !k.startsWith("font-"));
  const fontKeys = Object.keys(vars).filter((k) => !filterKeys.includes(k) && k.startsWith("font-"));
  const radiusKeys = Object.keys(vars).filter((k) => !filterKeys.includes(k) && k === "radius");

  const lines: string[] = [];

  // Normal keys first
  normalKeys.forEach((key) => {
    lines.push(`  --${key}: ${vars[key]};`);
  });

  // Font keys second last
  fontKeys.forEach((key) => {
    lines.push(`\n  --${key}: ${vars[key]};`);
  });

  // Radius keys at the bottom
  radiusKeys.forEach((key) => {
    lines.push(` --${key}: ${vars[key]};`);
  });

  return lines.join("\n");
}

/**
 * Converts color and utility keys into `@theme inline` format.
 */
function generateInlineTheme(vars: TailwindV4Theme["cssVars"]["light"]): string {
  const lines: string[] = [];

  renameKey(vars, "fontName", "font-display");

  const normalKeys = Object.keys(vars).filter((k) => !filterKeys.includes(k) && k !== "radius" && !k.startsWith("font-"));
  const fontKeys = Object.keys(vars).filter((k) => !filterKeys.includes(k) && k.startsWith("font-"));
  const radiusKeys = Object.keys(vars).filter((k) => !filterKeys.includes(k) && k === "radius");

  // Normal keys first
  for (const key of normalKeys) {
    if (key.startsWith("shadow-")) {
      lines.push(`  --${key}: var(--${key});`);
    } else if (key === "tracking-normal" || key === "spacing") {
      lines.push(`  --${key}: var(--${key});`);
    } else {
      lines.push(`  --color-${key}: var(--${key});`);
    }
  }

  // Font keys second last
  for (const key of fontKeys) {
    lines.push(`\n  --${key}: var(--${key});`);
  }

  // Radius keys at the bottom
  for (const key of radiusKeys) {
    lines.push(`\n  --radius-sm: calc(var(--radius) - 4px);`);
    lines.push(`  --radius-md: calc(var(--radius) - 2px);`);
    lines.push(`  --radius-lg: var(--radius);`);
    lines.push(`  --radius-xl: calc(var(--radius) + 4px);`);
  }

  return lines.join("\n");
}

/**
 * Generates the final CSS string from a Shadcn theme object.
 */
export function exportThemeToCss(theme: TailwindV4Theme["cssVars"]): string {
  const rootVars = generateCssVars(theme.light);
  const darkVars = generateCssVars(theme.dark);
  const inlineVars = generateInlineTheme(theme.light);

  const css = `
:root {
${rootVars}
}

.dark {
${darkVars}
}

@theme inline {
${inlineVars}
}
`.trim();

  return formatAndGroupCSS(css);
}
