"use client";

import { ThemePreviewer } from "@/components/organisms/theme/theme-previewer";
import { LayoutPreview } from "@/components/organisms/theme/layout-preview";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { ThemeIdentityCard } from "@/components/molecules/theme-identity-card";
import { ArchetypeSwitcher } from "@/components/molecules/archetype-switcher";
import { Button } from "@/components/ui/button";
import { useAtomValue } from "jotai";
import { focusModeAtom } from "@/store/theme";
import { Moon, Sun } from "lucide-react";

export type ThemeShowcaseProps = {
  theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  themeName?: string;
};

export function ThemeShowcase({ theme }: ThemeShowcaseProps) {
  const { isDark, toggleDarkMode, currentTheme } = useThemeGenerator();
  const focus = useAtomValue(focusModeAtom);

  return (
    <main className="space-y-2 grow flex flex-col overflow-y-auto pb-20">
      {!focus && (
        <div className="flex items-center justify-between gap-3">
          <ThemeIdentityCard className="min-w-0 flex-1" />
          <div className="flex items-center gap-2 shrink-0">
            <ArchetypeSwitcher />
            <Button variant="ghost" size="icon" className="size-8" onClick={toggleDarkMode}>
              {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
            </Button>
          </div>
        </div>
      )}
      <ThemePreviewer theme={theme} isDark={isDark} className="grow overflow-y-auto flex flex-col">
        <div className="relative rounded-xl border grow flex flex-col overflow-y-auto">
          <LayoutPreview spec={currentTheme?.layout} />
        </div>
      </ThemePreviewer>
    </main>
  );
}
