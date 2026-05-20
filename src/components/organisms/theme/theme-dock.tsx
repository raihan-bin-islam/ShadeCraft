"use client";
import React from "react";
import { Sparkles, Maximize2, Minimize2, Moon, Sun } from "lucide-react";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { useAtom, useAtomValue } from "jotai";
import { selectedFontAtom, selectedToneAtom, selectedFeelAtom, focusModeAtom } from "@/store/theme";
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
  const { generateSingle, isDark, toggleDarkMode } = useThemeGenerator();
  const font = useAtomValue(selectedFontAtom);
  const tone = useAtomValue(selectedToneAtom);
  const feel = useAtomValue(selectedFeelAtom);
  const [focus, setFocus] = useAtom(focusModeAtom);

  const handleRandomize = () =>
    generateSingle({ feelId: feel ?? undefined, toneId: tone ?? undefined, fontClass: font ?? undefined });

  return (
    <div
      className={cn(
        focus ? "fixed bottom-5 left-1/2 -translate-x-1/2 z-50" : "fixed bottom-12 left-1/2 -translate-x-1/2 z-50",
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
      {focus && (
        <button
          type="button"
          onClick={toggleDarkMode}
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>
      )}
      <button
        type="button"
        onClick={() => setFocus((v) => !v)}
        aria-label={focus ? "Exit focus mode" : "Enter focus mode"}
        title={focus ? "Exit focus mode" : "Focus mode (hide chrome)"}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
      >
        {focus ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </button>
      <DockMoreMenu />
    </div>
  );
}
