"use client";

import { ThemePreviewer } from "@/components/organisms/theme/theme-previewer";
import { LayoutPreview } from "@/components/organisms/theme/layout-preview";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { ThemeIdentityCard } from "@/components/molecules/theme-identity-card";
import { ArchetypeSwitcher } from "@/components/molecules/archetype-switcher";
import { useAtomValue } from "jotai";
import { focusModeAtom } from "@/store/theme";

export type ThemeShowcaseProps = {
  theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  themeName?: string;
};

export function ThemeShowcase({ theme }: ThemeShowcaseProps) {
  const { isDark, currentTheme } = useThemeGenerator();
  const focus = useAtomValue(focusModeAtom);

  return (
    <main className="space-y-2 grow flex flex-col overflow-y-auto pb-20">
      {!focus && <ThemeIdentityCard />}
      {!focus && <ArchetypeSwitcher />}
      <ThemePreviewer theme={theme} isDark={isDark} className="grow overflow-y-auto flex flex-col">
        <div className="relative rounded-xl border grow flex flex-col overflow-y-auto">
          <LayoutPreview spec={currentTheme?.layout} />
        </div>
      </ThemePreviewer>
    </main>
  );
}
