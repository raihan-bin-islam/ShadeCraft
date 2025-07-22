/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { OKLCH } from "@/types/theme-kit/color-space";
import { oklchToCss } from "@/lib/theme-kit/converters/to-css";
// import { generateCSSVariables } from "@/lib/theme-kit/generators/css";
import { cssToOklch, hexToOklch, oklchToRgb, rgbToHex } from "@/lib/theme-kit/converters";
import Color from "colorjs.io";

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

  const updateColor = (mode: "light" | "dark", colorKey: string, newColor: OKLCH) => {
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
    cssColor,
    label,
  }: {
    mode: "light" | "dark";
    colorKey: string;
    cssColor: string;
    label: string;
  }) => {
    console.log({ colorKey, cssColor });
    return;
    const color = cssToOklch(cssColor);
    const oklch = new Color("oklch", [color.l, color.c, color.h]);
    const srgbColor = oklch?.to("srgb"); // Converts to sRGB color space

    const hex = srgbColor.toString({ format: "hex" });

    console.log({ colorKey, cssColor, hex });

    return;

    return (
      <div className="space-y-2 p-3 border rounded-lg">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">{label}</Label>
          <input
            className="w-6 h-6"
            type="color"
            value={hex}
            onChange={(e) => {
              console.log({ oklchOnChange: hexToOklch(e.target.value) });

              return;
              updateColor(mode, colorKey, hexToOklch(e.target.value));
            }}
          />
          {/* <div onClick={inputRef.current?.click} style={{ backgroundColor: hex }} /> */}
        </div>

        <div className="grid gap-2 space-y-1">
          <Label className="text-xs text-muted-foreground">L</Label>
          <Input
            type="text"
            min="0"
            max="6"
            value={hex}
            onChange={(e) => updateColor(mode, colorKey, hexToOklch(e.target.value))}
            className="h-8 text-xs"
          />
        </div>

        <div className="text-xs text-muted-foreground font-mono">{oklchToCss(oklch)}</div>
      </div>
    );
  };

  // const exportTheme = () => {
  //   const cssVariables = `/* ${themeName} Theme */\n:root {\n${generateCSSVariables(
  //     editingTheme,
  //     "light"
  //   )}\n}\n\n.dark {\n${generateCSSVariables(editingTheme, "dark")}\n}`;

  //   const blob = new Blob([cssVariables], { type: "text/css" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   a.href = url;
  //   a.download = `${themeName.toLowerCase().replace(/\s+/g, "-")}-theme.css`;
  //   a.click();
  //   URL.revokeObjectURL(url);
  // };

  // const copyTheme = () => {
  //   const cssVariables = `/* ${themeName} Theme */\n:root {\n${generateCSSVariables(
  //     editingTheme,
  //     "light"
  //   )}\n}\n\n.dark {\n${generateCSSVariables(editingTheme, "dark")}\n}`;
  //   navigator.clipboard.writeText(cssVariables);
  // };

  const colorGroups = {
    "Base Colors": ["background", "foreground", "card", "cardForeground", "popover", "popoverForeground"],
    "Brand Colors": ["primary", "primaryForeground", "secondary", "secondaryForeground"],
    "UI Colors": ["muted", "mutedForeground", "accent", "accentForeground", "border", "input", "ring"],
    "Status Colors": ["destructive", "destructiveForeground"],
    "Chart Colors": ["chart1", "chart2", "chart3", "chart4", "chart5"],
  };

  return (
    <>
      <div className="px-4">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {colorKeys.map((colorKey) => {
                    const color = editingTheme[activeMode][colorKey];
                    if (!color) return null;

                    const label = colorKey.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase());

                    return <ColorEditor key={colorKey} mode={activeMode} colorKey={colorKey} cssColor={color} label={label} />;
                  })}
                </div>
                {groupName !== "Chart Colors" && <Separator />}
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
