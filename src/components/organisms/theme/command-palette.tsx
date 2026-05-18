"use client";
import React from "react";
import { useAtom, useAtomValue } from "jotai";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useCommandPalette } from "@/hooks/use-command-palette";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import {
  lockedDimensionsAtom,
  selectedNarrativeAtom,
  selectedLayoutAtom,
  selectedFontAtom,
  selectedToneAtom,
  selectedFeelAtom,
} from "@/store/theme";
import { Lock } from "lucide-react";

export function CommandPalette() {
  const { open, setOpen } = useCommandPalette();
  const { toggleDarkMode, generateSingle, currentTheme } = useThemeGenerator();
  const [locks, setLocks] = useAtom(lockedDimensionsAtom);
  const font = useAtomValue(selectedFontAtom);
  const tone = useAtomValue(selectedToneAtom);
  const feel = useAtomValue(selectedFeelAtom);
  const narrative = useAtomValue(selectedNarrativeAtom);
  const layout = useAtomValue(selectedLayoutAtom);

  const close = () => setOpen(false);
  const run = (fn: () => void) => { fn(); close(); };

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Search themes, controls, actions…" />
      <CommandList>
        <CommandEmpty>No results.</CommandEmpty>
        <CommandGroup heading="Theme dimensions">
          <DimensionItem label="Tone" value={tone ?? currentTheme?.tone?.name ?? "auto"} locked={locks.tone} onToggleLock={() => setLocks({ ...locks, tone: !locks.tone })} />
          <DimensionItem label="Feel" value={feel ?? currentTheme?.feel ?? "auto"} locked={locks.feel} onToggleLock={() => setLocks({ ...locks, feel: !locks.feel })} />
          <DimensionItem label="Font" value={font ?? "auto"} locked={locks.font} onToggleLock={() => setLocks({ ...locks, font: !locks.font })} />
          <DimensionItem label="Narrative" value={narrative ?? currentTheme?.narrative ?? "auto"} locked={locks.narrative} onToggleLock={() => setLocks({ ...locks, narrative: !locks.narrative })} />
          <DimensionItem label="Layout" value={layout ?? currentTheme?.layout?.archetype ?? "auto"} locked={locks.layout} onToggleLock={() => setLocks({ ...locks, layout: !locks.layout })} />
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => run(() => generateSingle({ feelId: feel ?? undefined, toneId: tone ?? undefined, fontClass: font ?? undefined }))}>
            Randomize <span className="ml-auto text-xs text-muted-foreground">R</span>
          </CommandItem>
          <CommandItem onSelect={() => run(toggleDarkMode)}>
            Toggle dark mode <span className="ml-auto text-xs text-muted-foreground">D</span>
          </CommandItem>
          <CommandItem onSelect={() => run(() => { navigator.clipboard.writeText(window.location.href).catch(() => {}); })}>
            Copy permalink
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}

function DimensionItem({ label, value, locked, onToggleLock }: { label: string; value: string; locked: boolean; onToggleLock: () => void }) {
  return (
    <CommandItem onSelect={onToggleLock}>
      <span className="font-medium">{label}</span>
      <span className="ml-2 text-xs text-muted-foreground">· {value}</span>
      <Lock className={`ml-auto h-3.5 w-3.5 ${locked ? "text-foreground" : "text-muted-foreground/40"}`} />
    </CommandItem>
  );
}
