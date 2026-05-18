"use client";
import React from "react";
import { useAtom } from "jotai";
import { Settings2 } from "lucide-react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ComboboxInput, ComboboxItem, GroupedComboboxItem } from "@/components/atoms/combobox-input";
import { LockIcon } from "@/components/molecules/lock-icon";
import { LayoutModeToggle } from "@/components/molecules/layout-mode-toggle";
import { FONT_OBJECTS } from "@/config/fonts";
import { TONES } from "@/config/theme-tones";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { NARRATIVES } from "@/config/theme-narratives";
import { LAYOUT_ARCHETYPES } from "@/config/layout-archetypes";
import { DESIGN_SYSTEM_DNAS } from "@/config/design-system-dnas";
import {
  selectedFontAtom,
  selectedToneAtom,
  selectedFeelAtom,
  selectedNarrativeAtom,
  selectedLayoutAtom,
} from "@/store/theme";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";

interface Props {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ThemeControlsPopover({ trigger, open, onOpenChange }: Props) {
  const [font, setFont] = useAtom(selectedFontAtom);
  const [tone, setTone] = useAtom(selectedToneAtom);
  const [feel, setFeel] = useAtom(selectedFeelAtom);
  const [narrative, setNarrative] = useAtom(selectedNarrativeAtom);
  const [layout, setLayout] = useAtom(selectedLayoutAtom);
  const { updateFont } = useThemeGenerator();

  const fontGroups: GroupedComboboxItem[] = Object.values(
    Object.values(FONT_OBJECTS).reduce<Record<string, GroupedComboboxItem>>((acc, f) => {
      const heading = f.group.split("-").map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
      acc[f.group] ??= { heading, items: [] };
      acc[f.group].items.push({ value: f.className, label: f.name, className: f.className });
      return acc;
    }, {})
  );

  const toneItems: ComboboxItem[] = TONES.map((t) => ({ value: t.id, label: t.name }));
  const feelItems: ComboboxItem[] = THEME_FEELS_V4.map((f) => ({ value: f.id, label: f.name }));
  const narrativeItems: ComboboxItem[] = NARRATIVES.map((n) => ({ value: n.id, label: n.name }));
  const layoutGroups: GroupedComboboxItem[] = [
    { heading: "Templates", items: LAYOUT_ARCHETYPES.map((a) => ({ value: a.id, label: a.name })) },
    { heading: "DNAs", items: DESIGN_SYSTEM_DNAS.map((d) => ({ value: d.id, label: d.name })) },
  ];

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        {trigger ?? (
          <button type="button" aria-label="Theme controls" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
            <Settings2 className="h-4 w-4" />
          </button>
        )}
      </PopoverTrigger>
      <PopoverContent align="center" side="top" sideOffset={12} className="w-[320px] p-4">
        <div className="space-y-3">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Theme</h3>
          <Row label="Font">
            <ComboboxInput
              groupedItems={fontGroups}
              value={font ?? ""}
              onChange={(v) => { setFont(v ?? null); if (v) updateFont(v); }}
              placeholder="Font"
              className="w-full"
            />
            <LockIcon dimension="font" />
          </Row>
          <Row label="Tone">
            <ComboboxInput items={toneItems} value={tone ?? ""} onChange={(v) => setTone(v ?? null)} placeholder="Tone" className="w-full" />
            <LockIcon dimension="tone" />
          </Row>
          <Row label="Feel">
            <ComboboxInput items={feelItems} value={feel ?? ""} onChange={(v) => setFeel(v ?? null)} placeholder="Feel" className="w-full" />
            <LockIcon dimension="feel" />
          </Row>
          <Row label="Narrative">
            <ComboboxInput items={narrativeItems} value={narrative ?? ""} onChange={(v) => setNarrative(v ?? null)} placeholder="Narrative" className="w-full" />
            <LockIcon dimension="narrative" />
          </Row>
          <Row label="Layout">
            <ComboboxInput groupedItems={layoutGroups} value={layout ?? ""} onChange={(v) => setLayout(v ?? null)} placeholder="Layout" className="w-full" />
            <LockIcon dimension="layout" />
          </Row>

          <div className="pt-2 border-t">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Engine</h3>
            <LayoutModeToggle />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-muted-foreground">{label}</label>
      <div className="flex items-center gap-1">{children}</div>
    </div>
  );
}
