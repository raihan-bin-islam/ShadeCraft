"use client";
import React from "react";
import { useAtom } from "jotai";
import { Layers, Wand2, Shuffle } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { layoutModeAtom } from "@/store/theme";
import type { LayoutMode } from "@/lib/theme-kit/generators/layout";

interface LayoutModeToggleProps {
  className?: string;
}

/**
 * Segmented control that lets the user pick the layout engine mode.
 * - template: always use Engine A (curated archetypes)
 * - procedural: always use Engine B (DNA-driven composition)
 * - auto (default): 70/30 weighted choice between the two
 *
 * The choice is persisted in layoutModeAtom and read by the theme generator.
 */
export function LayoutModeToggle({ className }: LayoutModeToggleProps) {
  const [mode, setMode] = useAtom(layoutModeAtom);

  return (
    <div className={className}>
      <ToggleGroup
        type="single"
        value={mode}
        onValueChange={(value) => {
          if (value) setMode(value as LayoutMode);
        }}
        aria-label="Layout engine mode"
      >
        <ToggleGroupItem value="template" aria-label="Template mode" title="Curated archetypes (safe)">
          <Layers className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Template</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="procedural" aria-label="Procedural mode" title="DNA-driven composition (bold)">
          <Wand2 className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Procedural</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="auto" aria-label="Auto mode" title="Mix (70% template, 30% procedural)">
          <Shuffle className="h-4 w-4" />
          <span className="ml-2 hidden sm:inline">Auto</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
