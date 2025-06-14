"use client";
import { ThemePreviewer } from "@/components/theme/theme-previewer";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type ThemeShowcaseProps = {
  theme: { light: Record<string, string>; dark: Record<string, string> };
  themeName: string;
};

export const ThemeShowcase = ({ theme, themeName }: ThemeShowcaseProps) => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isDark, setIsDark] = useState(false);

  return (
    <main className="">
      <h1 className="text-2xl font-semibold mb-4">{themeName} Preview</h1>
      <Button variant="outline" onClick={() => setIsDark(!isDark)}>
        Toggle {isDark ? "Light" : "Dark"} Mode
      </Button>
      <ThemePreviewer theme={theme}>
        <div className="bg-background p-5">
          <div className="grid grid-cols-5 gap-4">
            <Card className="h-fit">
              <CardContent className="space-y-4">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="you@example.com" className="bg-background" />
                <Button>Submit</Button>
              </CardContent>
            </Card>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border shadow-sm text-foreground min-h-86"
              captionLayout="dropdown"
            />
          </div>
        </div>
      </ThemePreviewer>
    </main>
  );
};
