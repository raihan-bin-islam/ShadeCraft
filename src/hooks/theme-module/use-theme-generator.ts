import { useState, useCallback } from "react";
import { generateTailwindV4Theme, generateTailwindV4ThemeCollection } from "@/lib/theme-kit/generators/theme";
import { TailwindV4Theme } from "@/types/theme-kit/theme";

export interface UseThemeGeneratorOptions {
  maxStoredThemes?: number;
  onThemeGenerated?: (theme: TailwindV4Theme) => void;
  onThemeSelected?: (theme: TailwindV4Theme) => void;
}

export function useThemeGenerator(options: UseThemeGeneratorOptions = {}) {
  const { maxStoredThemes = 10, onThemeGenerated, onThemeSelected } = options;

  const [generatedThemes, setGeneratedThemes] = useState<TailwindV4Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useState<TailwindV4Theme | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSingle = useCallback(
    async (delay = 300) => {
      setIsGenerating(true);
      await new Promise((resolve) => setTimeout(resolve, delay));

      const theme = generateTailwindV4Theme();

      setGeneratedThemes((prev) => [theme, ...prev.slice(0, maxStoredThemes - 1)]);
      setCurrentTheme(theme);

      onThemeGenerated?.(theme);
      onThemeSelected?.(theme);

      setIsGenerating(false);
      return theme;
    },
    [maxStoredThemes, onThemeGenerated, onThemeSelected]
  );

  const generateMultiple = useCallback(async (count = 5, delay = 500) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const themes = generateTailwindV4ThemeCollection(count);
    setGeneratedThemes(themes);

    setIsGenerating(false);
    return themes;
  }, []);

  const selectTheme = useCallback(
    (theme: TailwindV4Theme) => {
      setCurrentTheme(theme);
      onThemeSelected?.(theme);
    },
    [onThemeSelected]
  );

  const clearThemes = useCallback(() => {
    setGeneratedThemes([]);
  }, []);

  const removeTheme = useCallback(
    (themeToRemove: TailwindV4Theme) => {
      setGeneratedThemes((prev) => prev.filter((theme) => theme.name !== themeToRemove.name));

      if (currentTheme?.name === themeToRemove.name) {
        setCurrentTheme(undefined);
      }
    },
    [currentTheme]
  );

  return {
    // State
    generatedThemes,
    currentTheme,
    isGenerating,

    // Actions
    generateSingle,
    generateMultiple,
    selectTheme,
    clearThemes,
    removeTheme,

    // Utilities
    hasThemes: generatedThemes.length > 0,
    themeCount: generatedThemes.length,
  };
}
