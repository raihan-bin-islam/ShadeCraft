/**
 * Splits a flat theme token object into light/dark groups. Tokens prefixed
 * with "dark-" go into the dark group with the prefix removed; everything
 * else goes into the light group.
 */
export function groupThemeTokens(theme: Record<string, string>): {
  light: Record<string, string>;
  dark: Record<string, string>;
} {
  const light: Record<string, string> = {};
  const dark: Record<string, string> = {};

  for (const [key, value] of Object.entries(theme)) {
    if (key.startsWith("dark-")) {
      dark[key.replace(/^dark-/, "")] = value;
    } else {
      light[key] = value;
    }
  }

  return { light, dark };
}
