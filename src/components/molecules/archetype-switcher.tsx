"use client";
import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { previewArchetypeAtom, currentThemeAtom } from "@/store/theme";
import { LAYOUT_ARCHETYPES } from "@/config/layout-archetypes";
import { DESIGN_SYSTEM_DNAS } from "@/config/design-system-dnas";

interface ArchetypeSwitcherProps {
  className?: string;
}

/**
 * Tab strip that lets the user preview the current theme on any layout
 * archetype (or DNA). Selecting one sets previewArchetypeAtom; LayoutPreview
 * re-generates the spec for the override and renders. Selecting the active
 * theme's own archetype clears the override.
 */
export function ArchetypeSwitcher({ className }: ArchetypeSwitcherProps) {
  const [override, setOverride] = useAtom(previewArchetypeAtom);
  const theme = useAtomValue(currentThemeAtom);

  if (!theme?.layout) return null;

  const themeArchetype = theme.layout.archetype;
  const allOptions = [
    ...LAYOUT_ARCHETYPES.map((a) => ({ id: a.id, label: a.name })),
    ...DESIGN_SYSTEM_DNAS.map((d) => ({ id: d.id, label: d.name })),
  ];

  return (
    <div className={`flex items-center gap-1 overflow-x-auto ${className ?? ""}`} role="tablist">
      <span className="text-xs text-muted-foreground mr-2 shrink-0">Preview as:</span>
      {allOptions.map((opt) => {
        const isActive = (override ?? themeArchetype) === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => setOverride(opt.id === themeArchetype ? null : opt.id)}
            className={`shrink-0 rounded-md px-3 py-1 text-xs ${
              isActive
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
