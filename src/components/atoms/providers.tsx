"use client";
import React, { ReactNode, useEffect } from "react";
import { Provider, useAtomValue } from "jotai";
import { currentThemeAtom } from "@/store/theme";

type Props = { children: ReactNode };

function ThemeAxesEffect() {
  const theme = useAtomValue(currentThemeAtom);

  useEffect(() => {
    const root = document.documentElement;
    if (!theme?.axes) {
      root.removeAttribute("data-shadow");
      root.removeAttribute("data-border");
      root.removeAttribute("data-surface");
      root.removeAttribute("data-personality");
      return;
    }
    root.setAttribute("data-shadow", theme.axes.shadow);
    root.setAttribute("data-border", theme.axes.border);
    root.setAttribute("data-surface", theme.axes.surface);
    root.setAttribute("data-personality", theme.axes.component);
  }, [theme?.axes]);

  return null;
}

export const Providers = (props: Props) => {
  return (
    <Provider>
      <ThemeAxesEffect />
      {props.children}
    </Provider>
  );
};
