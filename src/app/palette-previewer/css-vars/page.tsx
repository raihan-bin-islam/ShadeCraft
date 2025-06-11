"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function CSSVarsPage() {
  const [cssVars, setCssVars] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize dark mode state based on document class
  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  useEffect(() => {
    // Try to get CSS variables from the theme-style element
    const styleElement = document.getElementById("theme-style");

    if (styleElement && styleElement.textContent) {
      // Extract CSS variables from the style element
      const cssText = styleElement.textContent;
      const rootVarsMatch = cssText.match(/:root\s*{([^}]*)}/s);
      const darkVarsMatch = cssText.match(/\.dark\s*{([^}]*)}/s);

      const vars: string[] = [];

      if (rootVarsMatch && rootVarsMatch[1]) {
        const rootVars = rootVarsMatch[1].match(/--[^:]+:\s*[^;]+;/g) || [];
        vars.push(...rootVars.map((v) => v.trim()));
      }

      if (darkVarsMatch && darkVarsMatch[1]) {
        const darkVars = darkVarsMatch[1].match(/--[^:]+:\s*[^;]+;/g) || [];
        vars.push(...darkVars.map((v) => `[dark] ${v.trim()}`));
      }

      setCssVars(vars);
    } else {
      // Fallback: try to read computed styles from document root
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      const vars: string[] = [];

      // Extract all CSS variables from computed style
      for (let i = 0; i < computedStyle.length; i++) {
        const prop = computedStyle[i];
        if (prop.startsWith("--")) {
          const value = computedStyle.getPropertyValue(prop);
          vars.push(`${prop}: ${value};`);
        }
      }

      setCssVars(vars);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const root = document.documentElement;
    const newDarkMode = !root.classList.contains("dark");

    if (newDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    setIsDarkMode(newDarkMode);
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">CSS Variables</h1>
        <div className="flex gap-4">
          <Button variant="outline" onClick={toggleDarkMode}>
            {isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          </Button>
          <Button variant="outline" onClick={() => window.history.back()}>
            Back to Previewer
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generated CSS Variables</CardTitle>
        </CardHeader>
        <CardContent>
          {cssVars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Light Mode Variables</h3>
                <pre className="p-4 rounded-md bg-muted overflow-auto max-h-[500px]">
                  {cssVars
                    .filter((v) => !v.startsWith("[dark]"))
                    .map((v) => `  ${v}`)
                    .join("\n")}
                </pre>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Dark Mode Variables</h3>
                <pre className="p-4 rounded-md bg-muted overflow-auto max-h-[500px]">
                  {cssVars
                    .filter((v) => v.startsWith("[dark]"))
                    .map((v) => `  ${v.replace("[dark] ", "")}`)
                    .join("\n")}
                </pre>
              </div>
            </div>
          ) : (
            <p>No CSS variables found. Please generate a theme first.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
