"use client";
import React, { useMemo } from "react";
import { useAtom } from "jotai";
import { currentThemeAtom } from "@/store/theme";
import { generateTailwindV4Theme } from "@/lib/theme-kit/generators/theme";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { NARRATIVES } from "@/config/theme-narratives";
import { randomChoice } from "@/lib/utils";
import type { TailwindV4Theme } from "@/types/theme-kit/theme";

interface VariationsPanelProps {
  className?: string;
}

interface Variation {
  label: string;
  theme: TailwindV4Theme;
}

/**
 * Renders 4 sibling-theme cards. Each variation re-runs the generator with
 * the current theme's dimensions but ONE swapped (different layout, different
 * narrative, different axes, different feel). Clicking a card applies it as
 * the new current theme.
 */
export function VariationsPanel({ className }: VariationsPanelProps) {
  const [currentTheme, setCurrentTheme] = useAtom(currentThemeAtom);

  const variations = useMemo<Variation[]>(() => {
    if (!currentTheme) return [];

    const feel = THEME_FEELS_V4.find((f) => f.name === currentTheme.feel);
    const tone = currentTheme.tone;
    if (!feel || !tone) return [];

    const narrative = currentTheme.narrative ? NARRATIVES.find((n) => n.id === currentTheme.narrative) : undefined;
    const axes = currentTheme.axes;
    const layout = currentTheme.layout;

    const out: Variation[] = [];

    // Variation 1: same feel/tone/narrative/axes, NEW layout
    out.push({
      label: "Different layout",
      theme: generateTailwindV4Theme({ feel, tone, narrative, axes }),
    });

    // Variation 2: same feel/tone/axes/layout, NEW narrative
    const otherNarratives = NARRATIVES.filter((n) => n.id !== currentTheme.narrative);
    out.push({
      label: "Calmer narrative",
      theme: generateTailwindV4Theme({ feel, tone, narrative: randomChoice(otherNarratives), axes, layout }),
    });

    // Variation 3: same feel/tone/narrative/layout, NEW axes
    out.push({
      label: "Sharper components",
      theme: generateTailwindV4Theme({ feel, tone, narrative, layout }),
    });

    // Variation 4: same tone/narrative/axes/layout, NEW feel
    const otherFeels = THEME_FEELS_V4.filter((f) => f.name !== currentTheme.feel);
    out.push({
      label: "Different palette",
      theme: generateTailwindV4Theme({ feel: randomChoice(otherFeels), tone, narrative, axes, layout }),
    });

    return out;
  }, [currentTheme]);

  if (variations.length === 0) return null;

  return (
    <div className={`space-y-3 ${className ?? ""}`}>
      <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Variations</h4>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {variations.map((variation, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentTheme(variation.theme)}
            className="group flex flex-col gap-2 rounded-lg border bg-card p-3 text-left text-card-foreground hover:border-primary"
          >
            <div className="flex h-12 gap-1.5">
              <div className="flex-1 rounded-sm" style={{ background: variation.theme.previewColors.primary }} />
              <div className="flex-1 rounded-sm" style={{ background: variation.theme.previewColors.secondary }} />
              <div className="flex-1 rounded-sm" style={{ background: variation.theme.previewColors.accent }} />
              <div className="flex-1 rounded-sm" style={{ background: variation.theme.previewColors.lightBg }} />
            </div>
            <span className="text-xs font-medium">{variation.label}</span>
            <span className="truncate text-xs text-muted-foreground">{variation.theme.identity?.name ?? variation.theme.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
