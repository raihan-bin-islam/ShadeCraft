"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "./custom-theme-provider";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";
import { ThemeName } from "@/lib/themes";

const themes = [
  {
    id: "aurora",
    name: "Aurora",
    description: "Vibrant colors inspired by the northern lights",
    lightBg: "bg-[#FDFCFF]", // Very light purple tint
    darkBg: "bg-[#1A0D2E]", // Deep purple
    primaryColor: "bg-[oklch(0.627_0.265_303.9)]", // OKLCH purple
    secondaryColor: "bg-[oklch(0.750_0.223_160.0)]", // OKLCH green
    accentColor: "bg-[oklch(0.650_0.280_240.0)]", // OKLCH blue
  },
  {
    id: "serene",
    name: "Serene",
    description: "Minimalist theme with subtle accents",
    lightBg: "bg-[#FBFCFD]", // Soft blue-gray
    darkBg: "bg-[#1A1D23]", // Deep sophisticated dark
    primaryColor: "bg-[oklch(0.500_0.050_220.0)]", // OKLCH slate
    secondaryColor: "bg-[oklch(0.750_0.030_220.0)]", // OKLCH light slate
    accentColor: "bg-[oklch(0.900_0.015_220.0)]", // OKLCH very light slate
  },
  {
    id: "tropical",
    name: "Tropical",
    description: "Warm colors inspired by tropical sunsets",
    lightBg: "bg-[#FFFCF7]", // Warm cream
    darkBg: "bg-[#1F1611]", // Deep warm brown
    primaryColor: "bg-[oklch(0.750_0.200_80.0)]", // OKLCH amber
    secondaryColor: "bg-[oklch(0.650_0.250_330.0)]", // OKLCH pink
    accentColor: "bg-[oklch(0.700_0.250_190.0)]", // OKLCH cyan
  },
  {
    id: "midnight",
    name: "Midnight",
    description: "Elegant dark theme with rich colors",
    lightBg: "bg-[#F8F9FB]", // Cool light background
    darkBg: "bg-[#0F1419]", // Rich midnight blue
    primaryColor: "bg-[oklch(0.650_0.270_260.0)]", // OKLCH indigo
    secondaryColor: "bg-[oklch(0.650_0.280_280.0)]", // OKLCH purple
    accentColor: "bg-[oklch(0.650_0.250_330.0)]", // OKLCH pink
  },
  {
    id: "candy",
    name: "Candy",
    description: "Playful theme with pastel colors",
    lightBg: "bg-[#FEFBFC]", // Soft pink-tinted
    darkBg: "bg-[#1F0D18]", // Deep plum
    primaryColor: "bg-[oklch(0.700_0.250_330.0)]", // OKLCH pink
    secondaryColor: "bg-[oklch(0.760_0.180_280.0)]", // OKLCH lavender
    accentColor: "bg-[oklch(0.790_0.150_240.0)]", // OKLCH light blue
  },
];

interface ThemeSwitcherProps {
  currentTheme: string;
  setCurrentTheme: (theme: ThemeName) => void;
}

export function ThemeSwitcher({ currentTheme, setCurrentTheme }: ThemeSwitcherProps) {
  const { setTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleThemeChange = (theme: ThemeName) => {
    setCurrentTheme(theme);
    setTheme(theme);
    // Apply dark mode class if needed
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    if (!isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        <Button variant="outline" size="sm" onClick={toggleDarkMode} className="flex items-center gap-2">
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {isDarkMode ? "Light Mode" : "Dark Mode"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            className={cn("cursor-pointer transition-all hover:scale-105", currentTheme === theme.id && "ring-2 ring-primary")}
            onClick={() => handleThemeChange(theme.id as ThemeName)}
          >
            <CardContent className="p-4 space-y-3">
              {/* Background preview */}
              <div className="flex gap-1 h-8 rounded-md overflow-hidden border">
                <div className={`${isDarkMode ? theme.darkBg : theme.lightBg} flex-1`} />
                <div className="w-8 bg-card border-l" />
              </div>

              {/* Color dots */}
              <div className="flex gap-2">
                <div className={`${theme.primaryColor} h-4 w-4 rounded-full`} />
                <div className={`${theme.secondaryColor} h-4 w-4 rounded-full`} />
                <div className={`${theme.accentColor} h-4 w-4 rounded-full`} />
              </div>

              <div>
                <h3 className="font-medium">{theme.name}</h3>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
