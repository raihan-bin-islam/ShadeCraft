"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette, Wand2 } from "lucide-react";
import { generateThemeFromBrandColors } from "@/lib/theme-kit/generators/theme";

interface BrandColorInputProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onThemeGenerated: (theme: any, name: string) => void;
}

export function BrandColorInput({ onThemeGenerated }: BrandColorInputProps) {
  const [primaryColor, setPrimaryColor] = useState("#3b82f6");
  const [secondaryColor, setSecondaryColor] = useState("");
  const [accentColor, setAccentColor] = useState("");
  const [themeName, setThemeName] = useState("");

  const handleGenerateTheme = () => {
    const theme = generateThemeFromBrandColors(primaryColor, secondaryColor, accentColor);

    const name = themeName || `Brand Theme ${Date.now()}`;
    onThemeGenerated(theme, name);
  };

  const handleRandomColors = () => {
    const randomHue1 = Math.floor(Math.random() * 360);
    const randomHue2 = (randomHue1 + 120) % 360;
    const randomHue3 = (randomHue1 + 240) % 360;

    setPrimaryColor(`hsl(${randomHue1}, 70%, 50%)`);
    setSecondaryColor(`hsl(${randomHue2}, 60%, 45%)`);
    setAccentColor(`hsl(${randomHue3}, 80%, 55%)`);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Brand Color Input
        </CardTitle>
        <CardDescription>Input your brand colors to generate a complete theme</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="theme-name">Theme Name</Label>
            <Input
              id="theme-name"
              placeholder="My Brand Theme"
              value={themeName}
              onChange={(e) => setThemeName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color *</Label>
              <div className="flex gap-2">
                <Input
                  id="primary-color"
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  placeholder="#3b82f6"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="secondary-color">Secondary Color</Label>
              <div className="flex gap-2">
                <Input
                  id="secondary-color"
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  placeholder="Auto-generated"
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accent-color">Accent Color</Label>
              <div className="flex gap-2">
                <Input
                  id="accent-color"
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  placeholder="Auto-generated"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleGenerateTheme} className="flex-1">
            <Palette className="h-4 w-4 mr-2" />
            Generate Theme
          </Button>
          <Button variant="outline" onClick={handleRandomColors}>
            <Wand2 className="h-4 w-4 mr-2" />
            Random
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p>* Primary color is required. Secondary and accent colors will be auto-generated if not provided.</p>
        </div>
      </CardContent>
    </Card>
  );
}
