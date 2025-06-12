/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit3, Copy, Download } from "lucide-react";
import type { OKLCHColor } from "@/types/theme";
import { oklchToString, generateCSSVariables } from "@/lib/theme-kit/v2/color-utils";

interface ThemeEditorProps {
  theme: any;
  themeName: string;
  onThemeChange: (theme: any) => void;
}

export function ThemeEditor({ theme, themeName, onThemeChange }: ThemeEditorProps) {
  const [editingTheme, setEditingTheme] = useState(theme);
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");

  useEffect(() => {
    setEditingTheme(theme);
  }, [theme]);

  const updateColor = (mode: "light" | "dark", colorKey: string, newColor: OKLCHColor) => {
    const updatedTheme = {
      ...editingTheme,
      [mode]: {
        ...editingTheme[mode],
        [colorKey]: newColor,
      },
    };
    setEditingTheme(updatedTheme);
    onThemeChange(updatedTheme);
  };

  const ColorEditor = ({
    mode,
    colorKey,
    color,
    label,
  }: {
    mode: "light" | "dark";
    colorKey: string;
    color: OKLCHColor;
    label: string;
  }) => {
    return (
      <div className="space-y-2 p-3 border rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <div className="w-6 h-6 rounded border" style={{ backgroundColor: oklchToString(color) }} />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">L</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={color.l}
              onChange={(e) =>
                updateColor(mode, colorKey, {
                  ...color,
                  l: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">C</Label>
            <Input
              type="number"
              min="0"
              max="1"
              step="0.01"
              value={color.c}
              onChange={(e) =>
                updateColor(mode, colorKey, {
                  ...color,
                  c: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-xs"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">H</Label>
            <Input
              type="number"
              min="0"
              max="360"
              step="1"
              value={Math.round(color.h)}
              onChange={(e) =>
                updateColor(mode, colorKey, {
                  ...color,
                  h: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="h-8 text-xs"
            />
          </div>
        </div>

        <div className="text-xs text-muted-foreground font-mono">{oklchToString(color)}</div>
      </div>
    );
  };

  const exportTheme = () => {
    const cssVariables = `/* ${themeName} Theme */\n:root {\n${generateCSSVariables(
      editingTheme,
      "light"
    )}\n}\n\n.dark {\n${generateCSSVariables(editingTheme, "dark")}\n}`;

    const blob = new Blob([cssVariables], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${themeName.toLowerCase().replace(/\s+/g, "-")}-theme.css`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const copyTheme = () => {
    const cssVariables = `/* ${themeName} Theme */\n:root {\n${generateCSSVariables(
      editingTheme,
      "light"
    )}\n}\n\n.dark {\n${generateCSSVariables(editingTheme, "dark")}\n}`;
    navigator.clipboard.writeText(cssVariables);
  };

  const colorGroups = {
    "Base Colors": ["background", "foreground", "card", "cardForeground", "popover", "popoverForeground"],
    "Brand Colors": ["primary", "primaryForeground", "secondary", "secondaryForeground"],
    "UI Colors": ["muted", "mutedForeground", "accent", "accentForeground", "border", "input", "ring"],
    "Status Colors": ["destructive", "destructiveForeground"],
    "Chart Colors": ["chart1", "chart2", "chart3", "chart4", "chart5"],
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit3 className="h-5 w-5" />
              Theme Editor
            </CardTitle>
            <CardDescription>Fine-tune your theme colors with real-time preview</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyTheme}>
              <Copy className="h-4 w-4 mr-2" />
              Copy CSS
            </Button>
            <Button variant="outline" size="sm" onClick={exportTheme}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as "light" | "dark")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="light">Light Mode</TabsTrigger>
            <TabsTrigger value="dark">Dark Mode</TabsTrigger>
          </TabsList>

          <TabsContent value={activeMode} className="space-y-6 mt-6">
            {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
              <div key={groupName} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{groupName}</h3>
                  <Badge variant="secondary">{colorKeys.length} colors</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {colorKeys.map((colorKey) => {
                    const color = editingTheme[activeMode][colorKey];
                    if (!color) return null;

                    const label = colorKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

                    return <ColorEditor key={colorKey} mode={activeMode} colorKey={colorKey} color={color} label={label} />;
                  })}
                </div>
                {groupName !== "Chart Colors" && <Separator />}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
