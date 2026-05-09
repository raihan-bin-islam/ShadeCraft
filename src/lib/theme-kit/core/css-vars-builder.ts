/**
 * Chainable builder for assembling a flat CSS-vars map where dark-mode
 * tokens are prefixed with "dark-". Use:
 *
 *   const vars = createCssVarsBuilder()
 *     .light({ background: "...", foreground: "..." })
 *     .dark({ background: "...", foreground: "..." })
 *     .both({ toneId: "minimalist" })          // same value for light + dark
 *     .merge({ "chart-1": "...", "dark-chart-1": "..." })  // pre-prefixed tokens
 *     .build();
 */
export interface CssVarsBuilder {
  light(tokens: Record<string, string>): CssVarsBuilder;
  dark(tokens: Record<string, string>): CssVarsBuilder;
  both(tokens: Record<string, string>): CssVarsBuilder;
  merge(prefixedTokens: Record<string, string>): CssVarsBuilder;
  build(): Record<string, string>;
}

export function createCssVarsBuilder(): CssVarsBuilder {
  const vars: Record<string, string> = {};

  const builder: CssVarsBuilder = {
    light(tokens) {
      Object.assign(vars, tokens);
      return builder;
    },
    dark(tokens) {
      for (const [key, value] of Object.entries(tokens)) {
        vars[`dark-${key}`] = value;
      }
      return builder;
    },
    both(tokens) {
      for (const [key, value] of Object.entries(tokens)) {
        vars[key] = value;
        vars[`dark-${key}`] = value;
      }
      return builder;
    },
    merge(prefixedTokens) {
      Object.assign(vars, prefixedTokens);
      return builder;
    },
    build() {
      return { ...vars };
    },
  };

  return builder;
}
