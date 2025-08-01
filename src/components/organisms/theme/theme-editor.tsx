/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hexToOklchCss } from "@/lib/theme-kit/converters/to-css";
import { ChangeEvent, useState } from "react";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { oklchCssToHex } from "@/lib/theme-kit/converters";

interface ThemeEditorProps {
  theme: any;
  themeName: string;
  onThemeChange: (theme: any) => void;
}

export function ThemeEditor({ theme }: ThemeEditorProps) {
  const [activeMode, setActiveMode] = useState<"light" | "dark">("light");

  const colorGroups = {
    "Base Colors": ["background", "foreground", "card", "card-foreground", "popover", "popover-foreground"],
    "Brand Colors": ["primary", "primary-foreground", "secondary", "secondary-foreground"],
    "UI Colors": ["muted", "muted-foreground", "accent", "accent-foreground", "border", "input", "ring"],
    "Status Colors": ["destructive", "destructive-foreground"],
    "Chart Colors": ["chart1", "chart2", "chart3", "chart4", "chart5"],
  };

  return (
    <>
      <div className="px-4 flex flex-col overflow-y-auto">
        <Tabs className="overflow-y-auto" value={activeMode} onValueChange={(value) => setActiveMode(value as "light" | "dark")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="light">Light Mode</TabsTrigger>
            <TabsTrigger value="dark">Dark Mode</TabsTrigger>
          </TabsList>

          <TabsContent value={activeMode} className="space-y-6 mt-6 overflow-y-auto">
            {Object.entries(colorGroups).map(([groupName, colorKeys]) => (
              <div key={groupName} className="space-y-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{groupName}</h3>
                  <Badge variant="secondary">{colorKeys.length} colors</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
  const hex = oklchCssToHex(cssColor);
  const { updateThemeToken } = useThemeGenerator();

  const handleUpdateColor = (e: ChangeEvent<HTMLInputElement>) => {
    const rawColor = e.target.value;
    const oklch = hexToOklchCss(rawColor);
    console.log({ rawColor, oklch });
    // return;

    updateThemeToken({
      mode,
      token: colorKey,
      value: oklch,
    });
  };

  return (
    <div className="space-y-2 p-3 border rounded-lg">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">{label}</Label>
        <input className="w-6 h-6" type="color" value={hex} onChange={handleUpdateColor} />
      </div>

      <div className="grid gap-2 space-y-1">
        <Label className="text-xs text-muted-foreground">L</Label>
        <Input type="text" min="0" max="6" value={hex} onChange={handleUpdateColor} className="h-8 text-xs" />
      </div>
    </div>
  );
};
