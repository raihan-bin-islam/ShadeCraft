import { atom } from "jotai";
import type { TailwindV4Theme } from "@/types/theme-kit";

export const currentThemeAtom = atom<TailwindV4Theme>();

type TokenKey = keyof TailwindV4Theme["cssVars"]["light"];
export const updateTokenAtom = atom(null, (get, set, { token, value }: { token: TokenKey; value?: string }) => {
  set(currentThemeAtom, (prev) => {
    if (!prev) return prev;

    const updated = value ? { [token]: value } : {};

    return {
      ...prev,
      cssVars: {
        ...prev.cssVars,
        light: { ...prev.cssVars.light, ...updated },
        dark: { ...prev.cssVars.dark, ...updated },
      },
      theme: {
        ...prev.theme,
        light: { ...prev.theme.light, ...updated },
        dark: { ...prev.theme.dark, ...updated },
      },
    };
  });
});

export const updateFontAtom = atom(
  (get) => get(currentThemeAtom)?.cssVars?.light?.fontFamily,
  (get, set, font?: string) => {
    set(updateTokenAtom, {
      token: "fontFamily",
      value: font,
    });
  }
);
