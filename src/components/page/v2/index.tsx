/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { StickyTaskbar } from "@/components/circular-taskbar";
import { BrandColorInput } from "@/components/theme/brand-color-input";
import { ThemeAnalyzer } from "@/components/theme/theme-analyzer";
import { ThemeComparison } from "@/components/theme/theme-comparison";
import { ThemeEditor } from "@/components/theme/theme-editor";
import { ThemePreview } from "@/components/theme/theme-preview";
import { ThemeShowcase } from "@/components/theme/theme-showcase";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskbarItemId, taskbarOptions } from "@/data/tabs";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { ThemeName, themes } from "@/lib/themes";
import { useState } from "react";

export const LandingPage = () => {
  // const [currentTheme, setCurrentTheme] = useState<any>(null);
  // const [currentThemeName, setCurrentThemeName] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [selectedBuiltInTheme, setSelectedBuiltInTheme] = useState<ThemeName>("aurora");
  const [selectedTab, setSelectedTab] = useState<TaskbarItemId>("generator");
  const { currentTheme, selectTheme, generateSingle } = useThemeGenerator();

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto p-4">
          <div className="text-center space-y-2 mb-2">
            <h1 className="text-4xl font-bold tracking-tight">Stunning shadcn Themes</h1>
            <div className="space-y-4">
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Create beautiful, accessible themes for your shadcn/ui projects with OKLCH color space
              </p>
              <div className="flex justify-center gap-2">
                <Badge variant="secondary">Tailwind v4 Ready</Badge>
                <Badge variant="secondary">OKLCH Colors</Badge>
                <Badge variant="secondary">Real-time Preview</Badge>
                <Badge variant="secondary">AI Generated</Badge>
              </div>
            </div>
          </div>

          <Tabs value={selectedTab} defaultValue="generator" className="space-y-6">
            <TabsContent value="generator" className="space-y-6">
              {/* <ThemeGeneratorV4
                onThemeSelect={handleGeneratedThemeSelect}
                currentTheme={
                  currentTheme
                    ? {
                        name: currentThemeName,
                        description: "Custom generated theme",
                        feel: "Custom",
                        cssVars: currentTheme,
                        // oklchVars: currentTheme,
                        previewColors: {
                          primary: "#000",
                          secondary: "#000",
                          accent: "#000",
                          lightBg: "#fff",
                          darkBg: "#000",
                        },
                      }
                    : undefined
                }
              /> */}

              {currentTheme && (
                <ThemeShowcase
                  theme={{ light: currentTheme.cssVars.light, dark: currentTheme.cssVars.dark }}
                  themeName={currentTheme.name}
                />
              )}
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
                  <ThemePreview
                    theme={themes[selectedBuiltInTheme].cssVars}
                    themeName={currentTheme?.name ?? ""}
                    mode={previewMode}
                  />
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
                  <ThemePreview theme={currentTheme} themeName={currentTheme.name} mode={previewMode} />
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
                    <ThemePreview theme={currentTheme} themeName={currentTheme.name} mode={previewMode} />
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
          options={taskbarOptions.map((opt) => ({ ...opt, onClick: opt.id === "generator" ? generateSingle : opt.onClick }))}
          idleTime={1350}
          onClickOption={(opt) => setSelectedTab(opt.id as TaskbarItemId)}
        />
      </div>
    </>
  );
};
