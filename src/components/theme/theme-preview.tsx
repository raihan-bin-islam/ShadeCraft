"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { generateCSSVariables } from "@/lib/theme-kit/v2/color-utils";
import { useEffect } from "react";

interface ThemePreviewProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme: any;
  themeName: string;
  mode: "light" | "dark";
}

export function ThemePreview({ theme, themeName, mode }: ThemePreviewProps) {
  useEffect(() => {
    // Apply theme variables to preview container
    const previewElement = document.getElementById("theme-preview");
    if (previewElement && theme) {
      const cssVariables = generateCSSVariables(theme, mode);
      const styleElement = document.createElement("style");
      styleElement.textContent = `
      #theme-preview {
        ${cssVariables}
      }
    `;
      document.head.appendChild(styleElement);

      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [theme, mode]);

  return (
    <div
      id="theme-preview"
      className={`w-full p-6 rounded-lg border transition-colors ${mode === "dark" ? "dark" : ""}`}
      style={{
        backgroundColor: "var(--background)",
        color: "var(--foreground)",
        borderColor: "var(--border)",
      }}
    >
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold">{themeName} Preview</h2>
          <p className="text-muted-foreground">See how your theme looks in {mode} mode</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <CardHeader>
              <CardTitle style={{ color: "var(--card-foreground)" }}>Sample Card</CardTitle>
              <CardDescription style={{ color: "var(--muted-foreground)" }}>
                This is how cards will look with your theme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button style={{ backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}>Primary</Button>
                <Button variant="secondary" style={{ backgroundColor: "var(--secondary)", color: "var(--secondary-foreground)" }}>
                  Secondary
                </Button>
              </div>

              <Input
                placeholder="Sample input"
                style={{
                  backgroundColor: "var(--background)",
                  borderColor: "var(--input)",
                  color: "var(--foreground)",
                }}
              />

              <div className="flex gap-2">
                <Badge style={{ backgroundColor: "var(--accent)", color: "var(--accent-foreground)" }}>Accent</Badge>
                <Badge
                  variant="destructive"
                  style={{ backgroundColor: "var(--destructive)", color: "var(--destructive-foreground)" }}
                >
                  Destructive
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card style={{ backgroundColor: "var(--card)", borderColor: "var(--border)" }}>
            <CardHeader>
              <CardTitle style={{ color: "var(--card-foreground)" }}>Progress & Charts</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm" style={{ color: "var(--muted-foreground)" }}>
                  Chart Color 1
                </div>
                <Progress value={75} className="h-2" style={{ backgroundColor: "var(--muted)" }} />
              </div>

              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-8 rounded" style={{ backgroundColor: `var(--chart-${i})` }} />
                ))}
              </div>

              <div className="text-xs text-center" style={{ color: "var(--muted-foreground)" }}>
                Chart Colors Preview
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
