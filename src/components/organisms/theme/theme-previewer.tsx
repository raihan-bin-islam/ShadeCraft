"use client";

import React from "react";
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
  const cssMapping: Record<string, string> = {};
  for (const [key, value] of Object?.entries(mergedVars ?? {})) {
    cssMapping[`--${key}`] = value;
  }

  const fontClass = cssMapping["--fontFamily"];

  return (
    <div className="space-y-4 grow flex flex-col overflow-y-auto">
      <div
        className={cn("transition-colors duration-300", isDark && "dark", fontClass, className)}
        style={cssMapping as React.CSSProperties}
        data-theme="preview"
      >
        {children}
      </div>
    </div>
  );
};
