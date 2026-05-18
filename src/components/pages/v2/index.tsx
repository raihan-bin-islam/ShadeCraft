"use client";

import { ThemeShowcase } from "@/components/organisms/theme/theme-showcase";
import { ThemeDock } from "@/components/organisms/theme/theme-dock";
import { CommandPalette } from "@/components/organisms/theme/command-palette";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { ShareableDNAEffect } from "@/components/atoms/shareable-dna-effect";

export const LandingPage = () => {
  const { currentTheme } = useThemeGenerator();

  return (
    <>
      <ShareableDNAEffect />
      <div className="grow bg-background flex flex-col overflow-y-auto min-h-0">
        <div className="container mx-auto px-3 py-2 md:px-4 md:py-3 grow flex flex-col overflow-y-auto min-h-0">
          <ThemeShowcase
            theme={{ light: currentTheme?.cssVars?.light, dark: currentTheme?.cssVars?.dark }}
            themeName={currentTheme?.name}
          />
        </div>
      </div>
      <ThemeDock />
      <CommandPalette />
    </>
  );
};
