"use client";
import { SidebarPreview } from "@/components/blocks/sidebar-16/preview/dashboard/page";
import { ThemePreviewer } from "@/components/theme/theme-previewer";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

type ThemeShowcaseProps = {
  theme: { light: Record<string, string>; dark: Record<string, string> };
  themeName: string;
};

export const ThemeShowcase = ({ theme, themeName }: ThemeShowcaseProps) => {
  const [isDark, setIsDark] = useState(false);

  return (
    <main className="space-y-4">
      <div className="flex items-center justify-between gap-5">
        <h1 className="text-2xl font-semibold mb-4">{themeName} Preview</h1>
        <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)}>
          {isDark ? <Moon /> : <Sun />}
        </Button>
      </div>
      <ThemePreviewer theme={theme} isDark={isDark}>
        <div className="relative overflow-hidden rounded-xl border">
          <SidebarPreview />
        </div>
      </ThemePreviewer>
    </main>
  );
};
