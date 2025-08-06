"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { exportThemeToCss } from "@/lib/theme-kit/generators/css";

type ThemeObject = Record<string, string>;

interface ThemePreviewerProps {
  theme?: {
    light?: ThemeObject;
    dark?: ThemeObject;
  };
  isDark?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const ThemePreviewer = ({ theme, isDark, children, className }: ThemePreviewerProps) => {
  const { currentTheme } = useThemeGenerator();
  useEffect(() => {
    if (!currentTheme) return;

    const css = exportThemeToCss(currentTheme.cssVars);
    const style = document.createElement("style");
    style.innerHTML = css;
    document.head.appendChild(style);
  }, [currentTheme]);

  return <div className="space-y-4 grow flex flex-col overflow-y-auto font-display">{children}</div>;
};
