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
      <div className="md:max-h-[calc(100dvh-129px)] grow bg-background flex flex-col overflow-y-auto">
        <div className="container mx-auto md:p-4 p-3 grow flex flex-col overflow-y-auto">
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
