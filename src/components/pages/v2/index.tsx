"use client";

import { StickyTaskbar } from "@/components/molecules/circular-taskbar";
import { ThemeAnalyzer } from "@/components/organisms/theme/analyzer/theme-analyzer";
import { BrandColorInput } from "@/components/organisms/theme/brand-color-input";
import { ThemeComparison } from "@/components/organisms/theme/theme-comparison";
import { ThemeEditor } from "@/components/organisms/theme/theme-editor";
import { ThemeShowcase } from "@/components/organisms/theme/theme-showcase";
import { ThemeSwitcher } from "@/components/organisms/theme/theme-switcher";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskbarItemId, taskbarOptions } from "@/data/tabs";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { ThemeName } from "@/lib/themes";
import { useState } from "react";

export const LandingPage = () => {
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [selectedBuiltInTheme, setSelectedBuiltInTheme] = useState<ThemeName>("aurora");
  const [selectedFont, setSelectedFont] = useState<string>();
  const [selectedTone, setSelectedTone] = useState<string>();
  const [selectedFeel, setSelectedFeel] = useState<string>();
  const [selectedTab, setSelectedTab] = useState<TaskbarItemId>("generator");
  const { currentTheme, selectTheme, generateSingle } = useThemeGenerator();

  return (
    <>
      <div className="min-h-[calc(100dvh-85px)] bg-background">
        <div className="container mx-auto p-4">
          <Tabs value={selectedTab} defaultValue="generator" className="space-y-6">
            <TabsContent value="generator" className="m-0">
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
            </TabsContent>

            <TabsContent value="themes" className="space-y-6">
              <ThemeSwitcher currentTheme={selectedBuiltInTheme} setCurrentTheme={setSelectedBuiltInTheme} />
              {selectedBuiltInTheme && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as "light" | "dark")}>
                      <TabsList>
                        <TabsTrigger value="light">Light</TabsTrigger>
                        <TabsTrigger value="dark">Dark</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="brand-input" className="space-y-6">
              <BrandColorInput onThemeGenerated={selectTheme} />

              {currentTheme && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Live Preview</h3>
                    <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as "light" | "dark")}>
                      <TabsList>
                        <TabsTrigger value="light">Light</TabsTrigger>
                        <TabsTrigger value="dark">Dark</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="editor">
              {currentTheme ? (
                <div className="space-y-6">
                  <ThemeEditor theme={currentTheme} themeName={currentTheme.name} onThemeChange={selectTheme} />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Live Preview</h3>
                      <Tabs value={previewMode} onValueChange={(value) => setPreviewMode(value as "light" | "dark")}>
                        <TabsList>
                          <TabsTrigger value="light">Light</TabsTrigger>
                          <TabsTrigger value="dark">Dark</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  </div>
                </div>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Theme Selected</CardTitle>
                    <CardDescription>Generate a theme using the Brand Colors or AI Generator tab first</CardDescription>
                  </CardHeader>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="analyzer">
              <ThemeAnalyzer />
            </TabsContent>

            <TabsContent value="comparison">
              <ThemeComparison />
            </TabsContent>
          </Tabs>
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
          onClickOption={(opt) => setSelectedTab(opt.id as TaskbarItemId)}
        />
      </div>
    </>
  );
};
