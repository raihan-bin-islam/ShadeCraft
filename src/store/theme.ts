import { atom } from "jotai";
import type { TailwindV4Theme, Theme } from "@/types/theme-kit";
import type { LayoutMode } from "@/lib/theme-kit/generators/layout";
import { FONT_OBJECTS } from "@/config/fonts";

export const currentThemeAtom = atom<TailwindV4Theme>();

export const updateThemeTokenAtom = atom(
  null,
  (get, set, { mode, value }: { mode: keyof TailwindV4Theme["cssVars"] | "both"; value?: Theme }) => {
    set(currentThemeAtom, (prev) => {
      if (!prev) return prev;

      const updated = value ?? {};

      if (mode === "both") {
        return {
          ...prev,
          cssVars: {
            ...prev.cssVars,
            light: { ...prev.cssVars.light, ...updated },
            dark: { ...prev.cssVars.dark, ...updated },
          },
          theme: {
            ...prev.cssVars,
            light: { ...prev.cssVars.light, ...updated },
            dark: { ...prev.cssVars.dark, ...updated },
          },
        };
      }
      return {
        ...prev,
        cssVars: {
          ...prev.cssVars,
          [mode]: { ...prev.cssVars[mode], ...updated },
        },
        theme: {
          ...prev.cssVars,
          [mode]: { ...prev.cssVars[mode], ...updated },
        },
      };
    });
  }
);

export const updateFontAtom = atom(
  (get) => undefined,
  (get, set, font?: string) => {
    const fontObject = Object.values(FONT_OBJECTS).find((item) => item.className === font);
    set(updateThemeTokenAtom, {
      mode: "both",
      value: {
        fontFamily: font as string,
        fontName: `${fontObject?.name}, ${fontObject?.fallback}`,
      },
    });
  }
);

export const isDarkModeAtom = atom(false);

export const layoutModeAtom = atom<LayoutMode>("auto");
