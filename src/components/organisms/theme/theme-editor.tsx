/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hexToOklchCss } from "@/lib/theme-kit/converters/to-css";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { oklchCssToHex } from "@/lib/theme-kit/converters";

interface ThemeEditorProps {
  defaultMode?: "light" | "dark";
  theme: any;
  themeName?: string;
  onThemeChange?: (theme: any) => void;
}

export function ThemeEditor({ theme, defaultMode = "light" }: ThemeEditorProps) {
  const [activeMode, setActiveMode] = useState<"light" | "dark">(defaultMode);
  useEffect(() => setActiveMode(defaultMode), [defaultMode]);

  const colorGroups = {
    "Brand Colors": ["primary", "primary-foreground", "secondary", "secondary-foreground"],
    "Base Colors": ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground"],
    "Sidebar Colors": [
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ],
    "UI Colors": ["muted", "muted-foreground", "accent", "accent-foreground", "border", "input", "ring"],
    "Status Colors": ["destructive", "destructive-foreground"],
    "Chart Colors": ["chart-1", "chart-2", "chart-3", "chart-4", "chart-5"],
  };
  if (!theme[activeMode]) return;

  return (
    <>
      <div className="px-4 flex flex-col overflow-y-auto">
        <Tabs className="overflow-y-auto" value={activeMode} onValueChange={(value) => setActiveMode(value as "light" | "dark")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="light">Light Mode</TabsTrigger>
            <TabsTrigger value="dark">Dark Mode</TabsTrigger>
          </TabsList>

          <TabsContent value={activeMode} className="space-y-4 mt-2 overflow-y-auto">
            {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
              <div key={groupName} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{groupName}</h3>
                  <Badge variant="secondary">{colorKeys.length} colors</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-3">
                  {colorKeys.map((colorKey) => {
                    const color = theme[activeMode][colorKey];
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [hex, setHex] = useState(() => "#000");
  const { updateThemeToken } = useThemeGenerator();

  useEffect(() => {
    try {
      if (cssColor) setHex(oklchCssToHex(cssColor));
    } catch (error) {
      console.log("Error converting color:", error);
    }
  }, [cssColor, colorKey]);

  if (!cssColor)
    return (
      <span className="text-red-500">
        {colorKey}: {cssColor}
      </span>
    );
  const handleUpdateColor = (e: ChangeEvent<HTMLInputElement>) => {
    const rawColor = e.target.value;
    setHex(rawColor);

    try {
      const oklch = hexToOklchCss(rawColor);
      if (!oklch) return;

      updateThemeToken({
        mode,
        value: { [colorKey]: oklch },
      });
    } catch (error) {
      console.log("Error updating color:", error);
    }
  };

  return (
    <div className="space-y-2 py-1 pl-2 pr-1 border h-fit">
      <div className="flex items-center gap-2 justify-between">
        <div className="flex items-center justify-center">
          <div
            className="size-5 shrink-0 border rounded-full"
            onClick={() => inputRef.current?.click()}
            style={{ background: hex }}
          />
          <input
            ref={inputRef}
            className="size-0 shrink-0 border-none outline-0 stroke-0 overflow-hidden"
            type="color"
            value={hex}
            onChange={handleUpdateColor}
          />
        </div>
        <Label className="min-w-40 grow text-sm font-medium">{label}</Label>
        <Input
          type="text"
          min="0"
          max="6"
          value={hex}
          onChange={handleUpdateColor}
          className="h-8 text-xs shrink rounded-none shadow-none w-24"
        />
      </div>
    </div>
  );
};
