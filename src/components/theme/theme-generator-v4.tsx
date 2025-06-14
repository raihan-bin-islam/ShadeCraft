"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shuffle, Download, Copy, Check } from "lucide-react";
import {
  generateTailwindV4Theme,
  generateTailwindV4ThemeCollection,
  type TailwindV4Theme,
} from "@/lib/theme-kit/v2/theme-generator-v4";
import { cn } from "@/lib/utils";

interface ThemeGeneratorV4Props {
  onThemeSelect: (theme: TailwindV4Theme) => void;
  currentTheme?: TailwindV4Theme;
}

export function ThemeGeneratorV4({ onThemeSelect, currentTheme }: ThemeGeneratorV4Props) {
  const [generatedThemes, setGeneratedThemes] = useState<TailwindV4Theme[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedTheme, setCopiedTheme] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("oklch");

  const generateSingleTheme = async () => {
    setIsGenerating(true);
    // Add a small delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    const theme = generateTailwindV4Theme();
    setGeneratedThemes((prev) => [theme, ...prev.slice(0, 9)]); // Keep last 10 themes
    onThemeSelect(theme);
    setIsGenerating(false);
  };

  const generateMultipleThemes = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    const themes = generateTailwindV4ThemeCollection(5);
    setGeneratedThemes(themes);
    setIsGenerating(false);
  };

  const copyThemeCSS = async (theme: TailwindV4Theme, format: "oklch" | "hsl" = "oklch") => {
    const css = generateThemeCSS(theme, format);
    await navigator.clipboard.writeText(css);
    setCopiedTheme(`${theme.name}-${format}`);
    setTimeout(() => setCopiedTheme(null), 2000);
  };

  const downloadThemeJSON = (theme: TailwindV4Theme) => {
    const json = JSON.stringify(theme, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${theme.name.toLowerCase().replace(/\s+/g, "-")}-theme-v4.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateThemeCSS = (theme: TailwindV4Theme, format: "oklch" | "hsl" = "oklch"): string => {
    const vars = format === "oklch" ? theme.cssVars : theme.hslVars || theme.cssVars;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const themeId = theme.name.toLowerCase().replace(/\s+/g, "-");

    if (format === "oklch") {
      // Tailwind v4 format with OKLCH
      const lightVars = Object.entries(vars)
        .filter(([key]) => !key.startsWith("dark-"))
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      const darkVars = Object.entries(vars)
        .filter(([key]) => key.startsWith("dark-"))
        .map(([key, value]) => `  --${key.replace("dark-", "")}: ${value};`)
        .join("\n");

      return `/* ${theme.name} Theme - ${theme.description} */
/* Tailwind CSS v4 with OKLCH Color Space */

@theme {
  --radius: 0.5rem;
${lightVars}
}

@media (prefers-color-scheme: dark) {
  @theme {
${darkVars}
  }
}

/* Alternative: Manual dark mode toggle */
.dark {
${darkVars.replace(/^ {2}/gm, "  ")}
}`;
    } else {
      // Backward compatibility HSL format
      const lightVars = Object.entries(vars)
        .filter(([key]) => !key.startsWith("dark-"))
        .map(([key, value]) => `  --${key}: ${value};`)
        .join("\n");

      const darkVars = Object.entries(vars)
        .filter(([key]) => key.startsWith("dark-"))
        .map(([key, value]) => `  --${key.replace("dark-", "")}: ${value};`)
        .join("\n");

      return `/* ${theme.name} Theme - ${theme.description} */
/* Tailwind CSS v3 HSL Format (Backward Compatibility) */

:root {
${lightVars}
}

.dark {
${darkVars}
}`;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shuffle className="h-5 w-5" />
            Theme Generator (Tailwind v4)
          </CardTitle>
          <CardDescription>
            Generate beautiful themes optimized for Tailwind CSS v4 with OKLCH color space for better perceptual uniformity and
            wider color gamut support.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={generateSingleTheme} disabled={isGenerating} className="flex items-center gap-2">
              <Shuffle className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Generate Random Theme"}
            </Button>
            <Button variant="outline" onClick={generateMultipleThemes} disabled={isGenerating}>
              Generate Collection (5)
            </Button>
          </div>

          {currentTheme && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium">{currentTheme.name}</h4>
                  <p className="text-sm text-muted-foreground">{currentTheme.description}</p>
                </div>
                <Badge variant="secondary">{currentTheme.feel}</Badge>
              </div>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="oklch">OKLCH (Tailwind v4)</TabsTrigger>
                  <TabsTrigger value="hsl">HSL (Legacy)</TabsTrigger>
                </TabsList>

                <TabsContent value="oklch" className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyThemeCSS(currentTheme, "oklch")}
                      className="flex items-center gap-1"
                    >
                      {copiedTheme === `${currentTheme.name}-oklch` ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                      {copiedTheme === `${currentTheme.name}-oklch` ? "Copied!" : "Copy OKLCH CSS"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadThemeJSON(currentTheme)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download JSON
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>✅ Optimized for Tailwind CSS v4</p>
                    <p>✅ OKLCH color space for better perceptual uniformity</p>
                    <p>✅ Wider color gamut support (P3, Rec2020)</p>
                    <p>✅ Better color interpolation and gradients</p>
                  </div>
                </TabsContent>

                <TabsContent value="hsl" className="space-y-2">
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyThemeCSS(currentTheme, "hsl")}
                      className="flex items-center gap-1"
                    >
                      {copiedTheme === `${currentTheme.name}-hsl` ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                      {copiedTheme === `${currentTheme.name}-hsl` ? "Copied!" : "Copy HSL CSS"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadThemeJSON(currentTheme)}
                      className="flex items-center gap-1"
                    >
                      <Download className="h-3 w-3" />
                      Download JSON
                    </Button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <p>⚠️ Legacy format for backward compatibility with Tailwind v3</p>
                    <p>Limited color gamut compared to OKLCH</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </CardContent>
      </Card>

      {generatedThemes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Themes (Tailwind v4)</CardTitle>
            <CardDescription>Click on any theme to apply it. All themes use OKLCH color space.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {generatedThemes.map((theme, index) => (
                <Card
                  key={`${theme.name}-${index}`}
                  className={cn(
                    "cursor-pointer transition-all hover:scale-105",
                    currentTheme?.name === theme.name && "ring-2 ring-primary"
                  )}
                  onClick={() => onThemeSelect(theme)}
                >
                  <CardContent className="p-4 space-y-3">
                    {/* Background preview */}
                    <div className="flex gap-1 h-8 rounded-md overflow-hidden border">
                      <div className="flex-1" style={{ backgroundColor: theme.previewColors.lightBg }} />
                      <div className="flex-1" style={{ backgroundColor: theme.previewColors.darkBg }} />
                    </div>

                    {/* Color dots */}
                    <div className="flex gap-2">
                      <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: theme.previewColors.primary }} />
                      <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: theme.previewColors.secondary }} />
                      <div className="h-4 w-4 rounded-full border" style={{ backgroundColor: theme.previewColors.accent }} />
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm">{theme.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {theme.feel}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{theme.description}</p>
                    </div>

                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyThemeCSS(theme, activeTab as "oklch" | "hsl");
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        {copiedTheme === `${theme.name}-${activeTab}` ? (
                          <Check className="h-3 w-3" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={(e) => {
                          e.stopPropagation();
                          downloadThemeJSON(theme);
                        }}
                        className="h-6 px-2 text-xs"
                      >
                        <Download className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
