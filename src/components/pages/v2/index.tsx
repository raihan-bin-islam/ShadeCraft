"use client";

import { StickyTaskbar } from "@/components/molecules/circular-taskbar";
import { ThemeShowcase } from "@/components/organisms/theme/theme-showcase";
import { TaskbarItemId, taskbarOptions } from "@/data/tabs";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { useState } from "react";

export const LandingPage = () => {
  const [selectedFont, setSelectedFont] = useState<string>();
  const [selectedTone, setSelectedTone] = useState<string>();
  const [selectedFeel, setSelectedFeel] = useState<string>();
  const [selectedTab, setSelectedTab] = useState<TaskbarItemId>("generator");
  const { currentTheme, generateSingle } = useThemeGenerator();

  console.log({ theme: currentTheme?.theme });

  return (
    <>
      <div className="h-[calc(100dvh-85px)] bg-background grow flex flex-col overflow-y-auto">
        <div className="container mx-auto p-4 grow flex flex-col overflow-y-auto">
          <ThemeShowcase
            theme={{ light: currentTheme?.cssVars?.light, dark: currentTheme?.cssVars?.dark }}
            themeName={currentTheme?.name}
            selectedFont={selectedFont}
            selectedTone={selectedTone}
            selectedFeel={selectedFeel}
            onSelectFont={setSelectedFont}
            onSelectTone={setSelectedTone}
            onSelectFeel={setSelectedFeel}
          />
        </div>
        <StickyTaskbar
          options={taskbarOptions.map((opt) => ({
            ...opt,
            onClick:
              opt.id === "generator"
                ? () => generateSingle({ feelId: selectedFeel, toneId: selectedTone, fontClass: selectedFont })
                : opt.onClick,
          }))}
          idleTime={1350}
          // onClickOption={(opt) => setSelectedTab(opt.id as TaskbarItemId)}
        />
      </div>
    </>
  );
};
