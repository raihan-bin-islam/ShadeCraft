"use client";
import React from "react";
import { Sparkles } from "lucide-react";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { useAtomValue } from "jotai";
import { selectedFontAtom, selectedToneAtom, selectedFeelAtom } from "@/store/theme";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { ThemeControlsPopover } from "@/components/molecules/theme-controls-popover";
import { VariationsPopover } from "@/components/molecules/variations-popover";
import { DockMoreMenu } from "@/components/molecules/dock-more-menu";
import { PermalinkButton } from "@/components/molecules/permalink-button";
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
}

export function ThemeDock({ className }: Props) {
  const { generateSingle } = useThemeGenerator();
  const font = useAtomValue(selectedFontAtom);
  const tone = useAtomValue(selectedToneAtom);
  const feel = useAtomValue(selectedFeelAtom);

  const handleRandomize = () =>
    generateSingle({ feelId: feel ?? undefined, toneId: tone ?? undefined, fontClass: font ?? undefined });

  return (
    <div
      className={cn(
        "fixed bottom-5 left-1/2 -translate-x-1/2 z-40",
        "flex items-center gap-1 rounded-full border bg-card/95 backdrop-blur",
        "px-2 py-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.06)]",
        "max-md:left-3 max-md:right-3 max-md:translate-x-0 max-md:justify-between",
        className
      )}
      role="toolbar"
      aria-label="Theme controls dock"
    >
      <ThemeControlsPopover />
      <VariationsPopover />
      <div className="h-6 w-px bg-border mx-1" />
      <ShinyButton onClick={handleRandomize} className="px-5 py-2.5 max-md:flex-1 max-md:justify-center">
        <Sparkles className="mr-2 h-4 w-4" /> Randomize
      </ShinyButton>
      <div className="h-6 w-px bg-border mx-1" />
      <div className="hidden md:block">
        <PermalinkButton className="border-none bg-transparent hover:bg-muted px-3" />
      </div>
      <DockMoreMenu />
    </div>
  );
}
