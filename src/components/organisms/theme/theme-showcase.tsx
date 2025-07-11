"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, Moon, Sun } from "lucide-react";
import { FONT_OBJECTS } from "@/config/fonts";
import { TONES } from "@/config/theme-tones";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { cn } from "@/lib/utils";
import { ComboboxInput, ComboboxItem, GroupedComboboxItem } from "@/components/atoms/combobox-input";
import { ThemePreviewer } from "@/components/organisms/theme/theme-previewer";
import { SidebarPreview } from "@/components/templates/preview-components/sidebar";

export type ThemeShowcaseProps = {
  theme: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
  themeName: string;
  selectedFont?: string;
  selectedTone?: string;
  selectedFeel?: string;
  onSelectFont?: (id?: string) => void;
  onSelectTone?: (id?: string) => void;
  onSelectFeel?: (id?: string) => void;
};

export function ThemeShowcase({
  theme,
  themeName,
  selectedFont,
  onSelectFont = () => {},
  selectedTone,
  onSelectTone = () => {},
  selectedFeel,
  onSelectFeel = () => {},
}: ThemeShowcaseProps) {
  const [isDark, setIsDark] = useState(false);

  const fontClass = selectedFont ?? theme.light.fontFamily ?? "";
  const toneId = selectedTone ?? theme.light.toneId ?? "";
  const feelId = selectedFeel ?? theme.light.feelId ?? "";

  const fontName = Object.values(FONT_OBJECTS).find((item) => item.className === fontClass)?.name ?? "-";
  const toneName = TONES.find((t) => t.id === toneId)?.name ?? "-";
  const feelName = THEME_FEELS_V4.find((f) => f.id === feelId)?.name ?? "-";

  const allFonts = Object.values(FONT_OBJECTS).map((font) => ({
    group: font.group, // "tone-specific" | "brutalist" | "popular-web"
    item: {
      value: font.className,
      label: font.name,
      className: font.className,
    } as ComboboxItem,
  }));

  const groupedFontItems = allFonts.reduce<Record<string, GroupedComboboxItem>>((acc, { group, item }) => {
    if (!acc[group]) {
      const heading = group
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");
      acc[group] = { heading, items: [] };
    }
    acc[group].items.push(item);
    return acc;
  }, {});

  const fontGroups: GroupedComboboxItem[] = Object.values(groupedFontItems);

  console.log({ fontGroups });

  const toneItems: ComboboxItem[] = TONES.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const feelItems: ComboboxItem[] = THEME_FEELS_V4.map((f) => ({
    value: f.id,
    label: f.name,
  }));

  return (
    <main className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-5 mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{themeName} Preview</h1>
          <div className="flex items-center gap-2">
            <p className={cn("text-sm", fontClass)}>
              <span className="font-medium text-xs text-muted-foreground">Font:</span> {fontName}
            </p>
            <div className="h-2 w-2 bg-border rounded-full" />
            <p className="text-sm">
              <span className="text-xs text-muted-foreground">Tone:</span> {toneName}
            </p>
            <div className="h-2 w-2 bg-border rounded-full" />
            <p className="text-sm">
              <span className="text-xs text-muted-foreground">Feel:</span> {feelName}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <ComboboxInput groupedItems={fontGroups} value={fontClass} onChange={onSelectFont} placeholder="Font" />
          <ComboboxInput items={toneItems} value={toneId} onChange={onSelectTone} placeholder="Tone" />
          <ComboboxInput items={feelItems} value={feelId} onChange={onSelectFeel} placeholder="Feel" />
          <Button variant="outline" size="icon">
            <Code />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)}>
            {isDark ? <Moon /> : <Sun />}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <ThemePreviewer theme={theme} isDark={isDark}>
        <div className="relative overflow-hidden rounded-xl border">
          <SidebarPreview />
        </div>
      </ThemePreviewer>
    </main>
  );
}
