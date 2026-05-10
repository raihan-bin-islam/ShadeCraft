"use client";
import React from "react";
import type { TailwindV4Theme } from "@/types/theme-kit/theme";

interface DnaBadgeProps {
  theme: TailwindV4Theme;
  className?: string;
}

interface Chip {
  label: string;
  value: string;
  colorClass: string;
}

/**
 * Five small color-coded chips representing the theme's DNA across all
 * dimensions: feel, tone, narrative, axes, and layout. Hover each chip
 * to see its value via the title attribute.
 */
export function DnaBadge({ theme, className }: DnaBadgeProps) {
  const chips: Chip[] = [
    { label: "Feel", value: theme.feel, colorClass: "bg-primary" },
    { label: "Tone", value: theme.tone?.name ?? "—", colorClass: "bg-secondary" },
    { label: "Narrative", value: theme.narrative ?? "—", colorClass: "bg-accent" },
    {
      label: "Axes",
      value: theme.axes
        ? `${theme.axes.shadow} · ${theme.axes.border} · ${theme.axes.surface} · ${theme.axes.component}`
        : "—",
      colorClass: "bg-muted-foreground",
    },
    {
      label: "Layout",
      value: theme.layout ? `${theme.layout.engine}: ${theme.layout.archetype}` : "—",
      colorClass: "bg-foreground",
    },
  ];

  return (
    <div className={`flex items-center gap-1.5 ${className ?? ""}`} aria-label="Theme DNA">
      {chips.map((chip) => (
        <span
          key={chip.label}
          title={`${chip.label}: ${chip.value}`}
          className={`inline-block h-3 w-3 rounded-sm ${chip.colorClass} ring-1 ring-border/50`}
        />
      ))}
    </div>
  );
}
