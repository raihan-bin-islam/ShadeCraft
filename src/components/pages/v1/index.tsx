/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrandColorInput } from "@/components/organisms/theme/brand-color-input";
import { ThemeEditor } from "@/components/organisms/theme/theme-editor";
import { ThemePreview } from "@/components/theme/theme-preview";
import { ThemeSwitcher } from "@/components/organisms/theme/theme-switcher";
import { ThemeAnalyzer } from "@/components/organisms/theme/analyzer/theme-analyzer";
import { ThemeComparison } from "@/components/organisms/theme/theme-comparison";
import {
  Palette,
  Wand2,
  Edit3,
  Eye,
  Search,
  GitCompare,
  HomeIcon,
  Mail,
  User,
  Heart,
  Plus,
  Download,
  Settings,
} from "lucide-react";
import { ThemeGeneratorV4 } from "@/components/organisms/theme/theme-generator";
import { TailwindV4Theme } from "@/lib/theme-kit/generators/theme";
import { ThemeName, themes } from "@/lib/themes";
import { ThemeShowcase } from "@/components/organisms/theme/theme-showcase";
import { StickyTaskbar } from "@/components/common/sticky-taskbar";

const taskbarOptions = [
  {
    icon: HomeIcon,
    label: "Home",
    color: "bg-blue-500 hover:bg-blue-600",
    onClick: () => alert("Home clicked!"),
  },
  {
    icon: Search,
    label: "Search",
    color: "bg-green-500 hover:bg-green-600",
    onClick: () => alert("Search clicked!"),
  },
  {
    icon: Mail,
    label: "Messages",
    color: "bg-purple-500 hover:bg-purple-600",
    onClick: () => alert("Messages clicked!"),
  },
  {
    icon: User,
    label: "Profile",
    color: "bg-orange-500 hover:bg-orange-600",
    onClick: () => alert("Profile clicked!"),
  },
  {
    icon: Heart,
    label: "Favorites",
    color: "bg-red-500 hover:bg-red-600",
    onClick: () => alert("Favorites clicked!"),
  },
  {
    icon: Plus,
    label: "Add New",
    color: "bg-teal-500 hover:bg-teal-600",
    onClick: () => alert("Add New clicked!"),
  },
  {
    icon: Download,
    label: "Downloads",
    color: "bg-indigo-500 hover:bg-indigo-600",
    onClick: () => alert("Downloads clicked!"),
  },
  {
    icon: Settings,
    label: "Settings",
    color: "bg-gray-500 hover:bg-gray-600",
    onClick: () => alert("Settings clicked!"),
  },
];

export default function Home() {
  const [currentTheme, setCurrentTheme] = useState<any>(null);
  const [currentThemeName, setCurrentThemeName] = useState<string>("");
  const [previewMode, setPreviewMode] = useState<"light" | "dark">("light");
  const [selectedBuiltInTheme, setSelectedBuiltInTheme] = useState<ThemeName>("aurora");

  console.log({ currentTheme, selectedBuiltInTheme });

  const handleThemeGenerated = (theme: any, name: string) => {
    setCurrentTheme(theme);
    setCurrentThemeName(name);
  };

  const handleGeneratedThemeSelect = (theme: TailwindV4Theme) => {
    // Convert GeneratedTheme to the format expected by ThemeEditor
    const convertedTheme = {
      light: theme.cssVars.light,
      dark: theme.cssVars.dark,
    };
    setCurrentTheme(convertedTheme);
    setCurrentThemeName(theme.name);
  };

  const handleThemeChange = (theme: any) => {
    setCurrentTheme(theme);
  };

  return (
    <>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-8 px-4">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Stunning shadcn Themes</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create beautiful, accessible themes for your shadcn/ui projects with OKLCH color space
            </p>
            <div className="flex justify-center gap-2">
              <Badge variant="secondary">Tailwind v4 Ready</Badge>
              <Badge variant="secondary">OKLCH Colors</Badge>
              <Badge variant="secondary">Real-time Preview</Badge>
              <Badge variant="secondary">AI Generated</Badge>
            </div>
          </div>

          <Tabs defaultValue="generator" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="generator" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Generator
              </TabsTrigger>
              <TabsTrigger value="themes" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Themes
              </TabsTrigger>
              <TabsTrigger value="brand-input" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Brand Colors
              </TabsTrigger>
              <TabsTrigger value="editor" className="flex items-center gap-2" disabled={!currentTheme}>
                <Edit3 className="h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="analyzer" className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                Analyzer
              </TabsTrigger>
              <TabsTrigger value="comparison" className="flex items-center gap-2">
                <GitCompare className="h-4 w-4" />
                HSL vs OKLCH
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="space-y-6">
              <ThemeGeneratorV4
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
              />

              {currentTheme && <ThemeShowcase theme={currentTheme} themeName={currentThemeName} />}
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
                  <ThemePreview theme={themes[selectedBuiltInTheme].cssVars} themeName={currentThemeName} mode={previewMode} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="brand-input" className="space-y-6">
              <BrandColorInput onThemeGenerated={handleThemeGenerated} />

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
                  <ThemePreview theme={currentTheme} themeName={currentThemeName} mode={previewMode} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="editor">
              {currentTheme ? (
                <div className="space-y-6">
                  <ThemeEditor theme={currentTheme} themeName={currentThemeName} onThemeChange={handleThemeChange} />

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
                    <ThemePreview theme={currentTheme} themeName={currentThemeName} mode={previewMode} />
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
        <StickyTaskbar options={taskbarOptions} idleTime={350} />
      </div>
    </>
  );
}
