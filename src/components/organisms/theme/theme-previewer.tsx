"use client";

import React, { useEffect } from "react";
import { cn } from "@/lib/utils";

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
  const mergedVars = isDark ? theme?.dark ?? theme?.light : theme?.light;

  useEffect(() => {
    const cssMapping: Record<string, string> = {};
    for (const [key, value] of Object?.entries(mergedVars ?? {})) {
      cssMapping[`--${key}`] = value;
    }
    const root = document.documentElement;
    const fontClass = cssMapping["--fontFamily"];
    if (fontClass) root.setAttribute("class", fontClass);
    for (const [key, value] of Object?.entries(cssMapping ?? {})) {
      root.style.setProperty(key, value);
    }
  }, [mergedVars]);

  return <div className="space-y-4 grow flex flex-col overflow-y-auto font-display">{children}</div>;
};
