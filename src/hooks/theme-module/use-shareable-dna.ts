"use client";
import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { currentThemeAtom } from "@/store/theme";
import { encodeDNA, decodeDNA, type ThemeDNA } from "@/lib/theme-kit/dna";
import { useThemeGenerator } from "./use-theme-generator";

const HASH_KEY = "dna";

/**
 * Hook that wires the URL query param to theme state:
 * - On mount, if `?dna=...` is present, decode and apply it as the current theme
 * - When currentTheme changes, write its DNA to the URL (without page reload)
 *
 * Mount this once at the top-level page that owns the generator.
 */
export function useShareableDNA() {
  const theme = useAtomValue(currentThemeAtom);
  const { applyDNA } = useThemeGenerator();
  const restored = useRef(false);

  // Restore from URL on mount (once)
  useEffect(() => {
    if (restored.current) return;
    restored.current = true;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get(HASH_KEY);
    if (!encoded) return;
    const dna = decodeDNA(encoded);
    if (dna) applyDNA(dna);
  }, [applyDNA]);

  // Sync theme to URL whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!theme || theme.seed === undefined) return;
    const dna: ThemeDNA = {
      feel: theme.feel,
      tone: theme.tone?.id ?? "",
      font: theme.cssVars.light.fontFamily ?? "",
      narrative: theme.narrative,
      axes: theme.axes,
      layoutArchetype: theme.layout?.archetype,
      layoutEngine: theme.layout?.engine,
      seed: theme.seed,
      v: 1,
    };
    const encoded = encodeDNA(dna);
    const url = new URL(window.location.href);
    url.searchParams.set(HASH_KEY, encoded);
    window.history.replaceState({}, "", url.toString());
  }, [theme]);
}
