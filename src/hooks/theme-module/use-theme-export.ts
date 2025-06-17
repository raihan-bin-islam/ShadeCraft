import { TailwindV4Theme } from "@/types/theme-kit/theme";
import { useState, useCallback } from "react";

export type ThemeFormat = "oklch" | "hsl" extends string ? string : never;

export interface UseThemeExportOptions {
  onCopySuccess?: (theme: TailwindV4Theme, format: ThemeFormat) => void;
  onCopyError?: (error: Error) => void;
  onDownloadSuccess?: (theme: TailwindV4Theme) => void;
  onDownloadError?: (error: Error) => void;
}

export function useThemeExport(options: UseThemeExportOptions = {}) {
  const { onCopySuccess, onCopyError, onDownloadSuccess, onDownloadError } = options;

  const [copiedTheme, setCopiedTheme] = useState<string | null>(null);

  const generateThemeCSS = useCallback((theme: TailwindV4Theme, format: ThemeFormat = "oklch"): string => {
    const vars = format === "oklch" ? theme.cssVars : theme.hslVars || theme.cssVars;

    if (format === "oklch") {
      const lightVars = Object.entries(vars)
        .filter(([key]) => !key.startsWith("dark-"))
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      const darkVars = Object.entries(vars)
        .filter(([key]) => key.startsWith("dark-"))
        .map(([key, value]) => `  --${key.replace("dark-", "")}: ${value};`)
        .join("\n");

      return `/* ${theme.name} Theme - ${theme.description} */
/* Tailwind CSS v4 with OKLCH Color Space */

@theme {
  --radius: 0.5rem;
${lightVars}
}

@media (prefers-color-scheme: dark) {
  @theme {
${darkVars}
  }
}

/* Alternative: Manual dark mode toggle */
.dark {
${darkVars.replace(/^ {2}/gm, "  ")}
}`;
    } else {
      const lightVars = Object.entries(vars)
        .filter(([key]) => !key.startsWith("dark-"))
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      const darkVars = Object.entries(vars)
        .filter(([key]) => key.startsWith("dark-"))
        .map(([key, value]) => `  --${key.replace("dark-", "")}: ${value};`)
        .join("\n");

      return `/* ${theme.name} Theme - ${theme.description} */
/* Tailwind CSS v3 HSL Format (Backward Compatibility) */

:root {
${lightVars}
}

.dark {
${darkVars}
}`;
    }
  }, []);

  const copyThemeCSS = useCallback(
    async (theme: TailwindV4Theme, format: ThemeFormat = "oklch") => {
      try {
        const css = generateThemeCSS(theme, format);
        await navigator.clipboard.writeText(css);

        const themeKey = `${theme.name}-${format}`;
        setCopiedTheme(themeKey);
        setTimeout(() => setCopiedTheme(null), 2000);

        onCopySuccess?.(theme, format);
        return css;
      } catch (error) {
        onCopyError?.(error as Error);
        throw error;
      }
    },
    [generateThemeCSS, onCopySuccess, onCopyError]
  );

  const downloadThemeJSON = useCallback(
    (theme: TailwindV4Theme) => {
      try {
        const json = JSON.stringify(theme, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `${theme.name.toLowerCase().replace(/\s+/g, "-")}-theme-v4.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        onDownloadSuccess?.(theme);
      } catch (error) {
        onDownloadError?.(error as Error);
        throw error;
      }
    },
    [onDownloadSuccess, onDownloadError]
  );

  const downloadThemeCSS = useCallback(
    (theme: TailwindV4Theme, format: ThemeFormat = "oklch") => {
      try {
        const css = generateThemeCSS(theme, format);
        const blob = new Blob([css], { type: "text/css" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = `${theme.name.toLowerCase().replace(/\s+/g, "-")}-theme-v4.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        onDownloadSuccess?.(theme);
        return css;
      } catch (error) {
        onDownloadError?.(error as Error);
        throw error;
      }
    },
    [generateThemeCSS, onDownloadSuccess, onDownloadError]
  );

  const isCopied = useCallback(
    (theme: TailwindV4Theme, format: ThemeFormat) => {
      return copiedTheme === `${theme.name}-${format}`;
    },
    [copiedTheme]
  );

  return {
    // State
    copiedTheme,

    // Actions
    copyThemeCSS,
    downloadThemeJSON,
    downloadThemeCSS,
    generateThemeCSS,

    // Utilities
    isCopied,
  };
}
