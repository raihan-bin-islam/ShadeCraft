import { ThemeFormat } from "@/hooks/theme-module/use-theme-export";
import { useState, useCallback } from "react";

export function useThemeFormat(defaultFormat: ThemeFormat = "oklch") {
  const [activeFormat, setActiveFormat] = useState<ThemeFormat>(defaultFormat);

  const switchToOklch = useCallback(() => setActiveFormat("oklch"), []);
  const switchToHsl = useCallback(() => setActiveFormat("hsl"), []);
  const toggleFormat = useCallback(() => {
    setActiveFormat((prev) => (prev === "oklch" ? "hsl" : "oklch"));
  }, []);

  return {
    activeFormat,
    setActiveFormat,
    switchToOklch,
    switchToHsl,
    toggleFormat,
    isOklch: activeFormat === "oklch",
    isHsl: activeFormat === "hsl",
  };
}
