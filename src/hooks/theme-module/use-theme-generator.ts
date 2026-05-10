"use client";
import { useState, useCallback, useMemo, useEffect } from "react";
import { generateTailwindV4Theme, generateTailwindV4ThemeCollection } from "@/lib/theme-kit/generators/theme";
import { TailwindV4Theme } from "@/types/theme-kit/theme";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { FONT_OBJECTS } from "@/config/fonts";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { currentThemeAtom, isDarkModeAtom, layoutModeAtom, lockedDimensionsAtom, updateFontAtom, updateThemeTokenAtom } from "@/store/theme";
import { NARRATIVES } from "@/config/theme-narratives";
import { debounce } from "lodash";
import { exportThemeToCss, generateCssVars } from "@/lib/theme-kit/generators/css";
import { type ThemeDNA } from "@/lib/theme-kit/dna";

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
  const locks = useAtomValue(lockedDimensionsAtom);

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

      const baseParams = { feel, tone, font };

      const lockedParams: Partial<Parameters<typeof generateTailwindV4Theme>[0]> = {};
      if (currentTheme) {
        if (locks.feel) {
          lockedParams.feel = THEME_FEELS_V4.find((f) => f.name === currentTheme.feel);
        }
        if (locks.tone) {
          lockedParams.tone = currentTheme.tone;
        }
        if (locks.font && currentFont) {
          lockedParams.font = Object.values(FONT_OBJECTS).find((f) => f.className === currentFont);
        }
        if (locks.narrative && currentTheme.narrative) {
          lockedParams.narrative = NARRATIVES.find((n) => n.id === currentTheme.narrative);
        }
        if (locks.axes && currentTheme.axes) {
          lockedParams.axes = currentTheme.axes;
        }
        if (locks.layout && currentTheme.layout) {
          lockedParams.layout = currentTheme.layout;
        }
      }

      const theme = generateTailwindV4Theme({ ...baseParams, ...lockedParams, mode: layoutMode });

      setGeneratedThemes((prev) => [theme, ...prev.slice(0, maxStoredThemes - 1)]);
      setCurrentTheme(theme);

      onThemeGenerated?.(theme);
      onThemeSelected?.(theme);

      setIsGenerating(false);
      return theme;
    },
    [maxStoredThemes, onThemeGenerated, onThemeSelected, setCurrentTheme, layoutMode, locks, currentTheme, currentFont]
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

  const applyDNA = useCallback(
    (dna: ThemeDNA) => {
      const feel = THEME_FEELS_V4.find((f) => f.id === dna.feel);
      const tone = TONES.find((t) => t.id === dna.tone);
      const font = Object.values(FONT_OBJECTS).find((f) => f.className === dna.font);
      const narrative = dna.narrative ? NARRATIVES.find((n) => n.id === dna.narrative) : undefined;
      const theme = generateTailwindV4Theme({
        feel,
        tone,
        font,
        narrative,
        axes: dna.axes,
        seed: dna.seed,
        mode: dna.layoutEngine,
      });
      setCurrentTheme(theme);
    },
    [setCurrentTheme]
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
    applyDNA,

    updateFont: setCurrentFont,
    selectedFont: currentFont,

    updateThemeToken: debouncedUpdateThemeToken,

    // Utilities
    hasThemes: generatedThemes.length > 0,
    themeCount: generatedThemes.length,
  };
}
