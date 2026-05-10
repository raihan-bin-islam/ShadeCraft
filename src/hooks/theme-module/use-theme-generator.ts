"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { generateTailwindV4Theme, generateTailwindV4ThemeCollection } from "@/lib/theme-kit/generators/theme";
import { TailwindV4Theme } from "@/types/theme-kit/theme";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { FONT_OBJECTS } from "@/config/fonts";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentThemeAtom, isDarkModeAtom, layoutModeAtom, updateFontAtom, updateThemeTokenAtom } from "@/store/theme";
import { debounce } from "lodash";
import { exportThemeToCss, generateCssVars } from "@/lib/theme-kit/generators/css";

export interface UseThemeGeneratorOptions {
  maxStoredThemes?: number;
  onThemeGenerated?: (theme: TailwindV4Theme) => void;
  onThemeSelected?: (theme: TailwindV4Theme) => void;
}

interface GenerateSingleParams {
  feelId?: string;
  toneId?: string;
  fontClass?: string;
  delay?: number;
}

export function useThemeGenerator(options: UseThemeGeneratorOptions = {}) {
  const { maxStoredThemes = 10, onThemeGenerated, onThemeSelected } = options;
  const [generatedThemes, setGeneratedThemes] = useState<TailwindV4Theme[]>([]);
  const [currentTheme, setCurrentTheme] = useAtom<TailwindV4Theme | undefined>(currentThemeAtom);
  const [currentFont, setCurrentFont] = useAtom(updateFontAtom);
  const updateThemeToken = useSetAtom(updateThemeTokenAtom);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDark, setIsDark] = useAtom(isDarkModeAtom);
  const layoutMode = useAtomValue(layoutModeAtom);

  const toggleDarkMode = useCallback(() => {
    setIsDark((prev) => !prev);
  }, [setIsDark]);

  const generateSingle = useCallback(
    async (params?: GenerateSingleParams) => {
      const feelId = params?.feelId;
      const toneId = params?.toneId;
      const fontClass = params?.fontClass;
      const delay = params?.delay ?? 200;

      setIsGenerating(true);
      await new Promise((resolve) => setTimeout(resolve, delay));

      const feel = THEME_FEELS_V4.find((item) => item.id === feelId);
      const tone = TONES.find((item) => item.id === toneId);
      const font = Object.values(FONT_OBJECTS).find((item) => item.className === fontClass);

      const theme = generateTailwindV4Theme({ feel, tone, font, mode: layoutMode });

      setGeneratedThemes((prev) => [theme, ...prev.slice(0, maxStoredThemes - 1)]);
      setCurrentTheme(theme);

      onThemeGenerated?.(theme);
      onThemeSelected?.(theme);

      setIsGenerating(false);
      return theme;
    },
    [maxStoredThemes, onThemeGenerated, onThemeSelected, setCurrentTheme, layoutMode]
  );

  const generateMultiple = useCallback(async (count = 5, delay = 500) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, delay));

    const themes = generateTailwindV4ThemeCollection(count, layoutMode);
    setGeneratedThemes(themes);

    setIsGenerating(false);
    return themes;
  }, [layoutMode]);

  // Memoize the debounced version
  const debouncedUpdateThemeToken = useMemo(() => {
    return debounce(
      (update: Parameters<typeof updateThemeToken>[0]) => {
        updateThemeToken(update);
      },
      250 // debounce delay
    );
  }, [updateThemeToken]);

  const selectTheme = useCallback(
    (theme: TailwindV4Theme) => {
      setCurrentTheme(theme);
      onThemeSelected?.(theme);
    },
    [onThemeSelected, setCurrentTheme]
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

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  return {
    isDark,
    setIsDark,
    toggleDarkMode,
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

    updateFont: setCurrentFont,
    selectedFont: currentFont,

    updateThemeToken: debouncedUpdateThemeToken,

    // Utilities
    hasThemes: generatedThemes.length > 0,
    themeCount: generatedThemes.length,
  };
}
