"use client";
import React from "react";
import { useAtom, useAtomValue } from "jotai";
import { previewArchetypeAtom, currentThemeAtom } from "@/store/theme";
import { LAYOUT_ARCHETYPES } from "@/config/layout-archetypes";
import { DESIGN_SYSTEM_DNAS } from "@/config/design-system-dnas";
import { ComboboxInput, GroupedComboboxItem } from "@/components/atoms/combobox-input";

interface ArchetypeSwitcherProps {
  className?: string;
}

/**
 * Select-based switcher for previewing the current theme on any layout
 * archetype or DNA. Selecting one sets previewArchetypeAtom; LayoutPreview
 * re-generates the spec for the override. Selecting the theme's own
 * archetype clears the override.
 */
export function ArchetypeSwitcher({ className }: ArchetypeSwitcherProps) {
  const [override, setOverride] = useAtom(previewArchetypeAtom);
  const theme = useAtomValue(currentThemeAtom);

  if (!theme?.layout) return null;

  const themeArchetype = theme.layout.archetype;
  const value = override ?? themeArchetype;

  const groups: GroupedComboboxItem[] = [
    {
      heading: "Templates",
      items: LAYOUT_ARCHETYPES.map((a) => ({ value: a.id, label: a.name })),
    },
    {
      heading: "DNAs",
      items: DESIGN_SYSTEM_DNAS.map((d) => ({ value: d.id, label: d.name })),
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="text-xs text-muted-foreground shrink-0">Preview as:</span>
      <ComboboxInput
        groupedItems={groups}
        value={value}
        onChange={(v) => setOverride(!v || v === themeArchetype ? null : v)}
        placeholder="archetype"
        className="h-8 min-w-48 text-xs"
      />
    </div>
  );
}
