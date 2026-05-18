"use client";

import { ThemePreviewer } from "@/components/organisms/theme/theme-previewer";
import { LayoutPreview } from "@/components/organisms/theme/layout-preview";
import { FONT_OBJECTS } from "@/config/fonts";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { ThemeIdentityCard } from "@/components/molecules/theme-identity-card";
import { ArchetypeSwitcher } from "@/components/molecules/archetype-switcher";
import { cn } from "@/lib/utils";

export type ThemeShowcaseProps = {
  theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  themeName?: string;
};

export function ThemeShowcase({ theme }: ThemeShowcaseProps) {
  const { isDark, currentTheme } = useThemeGenerator();

  const fontClass = theme?.light?.fontFamily ?? "";
  const toneId = theme?.light?.toneId ?? "";
  const feelId = theme?.light?.feelId ?? "";

  const fontName = Object.values(FONT_OBJECTS).find((i) => i.className === fontClass)?.name ?? "-";
  const toneName = TONES.find((t) => t.id === toneId)?.name ?? "-";
  const feelName = THEME_FEELS_V4.find((f) => f.id === feelId)?.name ?? "-";

  return (
    <main className="md:space-y-4 space-y-2 grow flex flex-col overflow-y-auto pb-28">
      <div className="flex items-center md:gap-3 w-full md:mb-2">
        <h1 className="text-xl/5 md:text-2xl font-semibold">Preview</h1>
        <div className="hidden md:flex items-center gap-2">
          <Separator />
          <p className={cn("text-sm", fontClass)}>
            <span className="text-xs text-muted-foreground">Font:</span> {fontName}
          </p>
          <Separator />
          <p className="text-sm"><span className="text-xs text-muted-foreground">Tone:</span> {toneName}</p>
          <Separator />
          <p className="text-sm"><span className="text-xs text-muted-foreground">Feel:</span> {feelName}</p>
        </div>
      </div>

      <ThemeIdentityCard className="mb-2" />

      <ArchetypeSwitcher className="mb-2" />

      <ThemePreviewer theme={theme} isDark={isDark} className="grow overflow-y-auto flex flex-col">
        <div className="relative rounded-xl border grow flex flex-col overflow-y-auto">
          <LayoutPreview spec={currentTheme?.layout} />
        </div>
      </ThemePreviewer>
    </main>
  );
}

const Separator = () => <div className="h-4 w-px bg-muted-foreground/30 shrink-0" />;
