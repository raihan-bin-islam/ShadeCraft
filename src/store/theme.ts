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

export type LockableDimension = "feel" | "tone" | "font" | "narrative" | "axes" | "layout";

export const lockedDimensionsAtom = atom<Record<LockableDimension, boolean>>({
  feel: false,
  tone: false,
  font: false,
  narrative: false,
  axes: false,
  layout: false,
});

/**
 * Optional override for the layout archetype shown in the preview area.
 * When set, LayoutPreview renders the current theme on the chosen archetype
 * instead of the one the generator picked. Doesn't mutate the underlying
 * theme — purely cosmetic for the preview surface.
 */
export const previewArchetypeAtom = atom<string | null>(null);

/**
 * User's currently selected narrative ID. When set, generateSingle uses it as
 * a one-shot pin (the next regeneration uses this narrative). LockIcon makes
 * the pin persistent across shuffles. null means "let the generator pick".
 */
export const selectedNarrativeAtom = atom<string | null>(null);

/**
 * User's currently selected layout id (archetype OR DNA). When set,
 * generateSingle pre-resolves it and forces generateLayout to use that
 * specific archetype/DNA. LockIcon makes the pin persistent across shuffles.
 * null means "let the generator pick based on mode".
 */
export const selectedLayoutAtom = atom<string | null>(null);

/** User's currently chosen font className. null = "let randomizer pick". */
export const selectedFontAtom = atom<string | null>(null);

/** User's currently chosen tone id. null = "let randomizer pick". */
export const selectedToneAtom = atom<string | null>(null);

/** User's currently chosen feel id. null = "let randomizer pick". */
export const selectedFeelAtom = atom<string | null>(null);

/** Whether the ⌘K command palette is open. */
export const commandPaletteOpenAtom = atom<boolean>(false);

/**
 * Focus mode: hides the global header, footer, identity card, and archetype
 * strip so the preview canvas takes nearly the full viewport. Toggled from
 * the dock.
 */
export const focusModeAtom = atom<boolean>(false);
