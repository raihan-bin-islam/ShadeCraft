import { atom } from "jotai";
import type { TailwindV4Theme } from "@/types/theme-kit";

export const currentThemeAtom = atom<TailwindV4Theme>();

type TokenKey = keyof TailwindV4Theme["cssVars"]["light"];
export const updateThemeTokenAtom = atom(
  null,
  (get, set, { mode, token, value }: { mode: keyof TailwindV4Theme["cssVars"]; token: TokenKey; value?: string }) => {
    set(currentThemeAtom, (prev) => {
      if (!prev) return prev;

      const updated = value ? { [token]: value } : {};

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
  (get) => get(currentThemeAtom)?.cssVars?.light?.fontFamily,
  (get, set, font?: string) => {
    set(updateThemeTokenAtom, {
      mode: "light",
      token: "fontFamily",
      value: font,
    });
  }
);
