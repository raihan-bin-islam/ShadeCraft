"use client";

import { ComboboxInput, ComboboxItem, GroupedComboboxItem } from "@/components/atoms/combobox-input";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { ThemeEditor } from "@/components/organisms/theme/theme-editor";
import { ThemePreviewer } from "@/components/organisms/theme/theme-previewer";
import ClickSpark from "@/components/react-bits/ClickSpark";
import MailPage from "@/components/templates/mail/page";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FONT_OBJECTS } from "@/config/fonts";
import { THEME_FEELS_V4 } from "@/config/theme-feels";
import { TONES } from "@/config/theme-tones";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { cn } from "@/lib/utils";
import { Code2, Edit, Moon, Sparkles, Sun } from "lucide-react";
import { useState } from "react";

export type ThemeShowcaseProps = {
  theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  themeName?: string;
  selectedFont?: string;
  selectedTone?: string;
  selectedFeel?: string;
  onSelectFont?: (id?: string) => void;
  onSelectTone?: (id?: string) => void;
  onSelectFeel?: (id?: string) => void;
};

export function ThemeShowcase({
  theme,
  themeName,
  selectedFont,
  onSelectFont = () => {},
  selectedTone,
  onSelectTone = () => {},
  selectedFeel,
  onSelectFeel = () => {},
}: ThemeShowcaseProps) {
  const [isDark, setIsDark] = useState(false);
  const { generateSingle } = useThemeGenerator();

  const fontClass = theme?.light?.fontFamily ?? "";
  const toneId = theme?.light?.toneId ?? "";
  const feelId = theme?.light?.feelId ?? "";

  const fontName = Object.values(FONT_OBJECTS).find((item) => item.className === fontClass)?.name ?? "-";
  const toneName = TONES.find((t) => t.id === toneId)?.name ?? "-";
  const feelName = THEME_FEELS_V4.find((f) => f.id === feelId)?.name ?? "-";

  const allFonts = Object.values(FONT_OBJECTS).map((font) => ({
    group: font.group, // "tone-specific" | "brutalist" | "popular-web"
    item: {
      value: font.className,
      label: font.name,
      className: font.className,
    } as ComboboxItem,
  }));

  const groupedFontItems = allFonts.reduce<Record<string, GroupedComboboxItem>>((acc, { group, item }) => {
    if (!acc[group]) {
      const heading = group
        .split("-")
        .map((w) => w[0].toUpperCase() + w.slice(1))
        .join(" ");
      acc[group] = { heading, items: [] };
    }
    acc[group].items.push(item);
    return acc;
  }, {});

  const fontGroups: GroupedComboboxItem[] = Object.values(groupedFontItems);

  console.log({ fontGroups });

  const toneItems: ComboboxItem[] = TONES.map((t) => ({
    value: t.id,
    label: t.name,
  }));

  const feelItems: ComboboxItem[] = THEME_FEELS_V4.map((f) => ({
    value: f.id,
    label: f.name,
  }));

  return (
    <main className="space-y-4 grow flex flex-col overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between gap-5 mb-4">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-semibold">{themeName} Preview</h1>
          <div className="flex items-center gap-2">
            <p className={cn("text-sm", fontClass)}>
              <span className="font-medium text-xs text-muted-foreground">Font:</span> {fontName}
            </p>
            <Separator />
            <p className="text-sm">
              <span className="text-xs text-muted-foreground">Tone:</span> {toneName}
            </p>
            <Separator />
            <p className="text-sm">
              <span className="text-xs text-muted-foreground">Feel:</span> {feelName}
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          <ComboboxInput groupedItems={fontGroups} value={selectedFont ?? ""} onChange={onSelectFont} placeholder="Font" />
          <ComboboxInput items={toneItems} value={selectedTone ?? ""} onChange={onSelectTone} placeholder="Tone" />
          <ComboboxInput items={feelItems} value={selectedFeel ?? ""} onChange={onSelectFeel} placeholder="Feel" />
          <ShinyButton onClick={() => generateSingle({ feelId: selectedFeel, fontClass: selectedFont, toneId: selectedTone })}>
            <Sparkles /> Generate
          </ShinyButton>
          <Separator />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Edit />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Edit theme</SheetTitle>
                <SheetDescription>Make changes to your theme here. Click save when you&apos;re done.</SheetDescription>
              </SheetHeader>
              <ThemeEditor theme={theme} onThemeChange={() => {}} themeName="" />
              <SheetFooter className="grid grid-cols-2">
                <Button type="submit">Save changes</Button>
                <SheetClose asChild>
                  <Button variant="outline">Close</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
          <ClickSpark sparkColor="#9AE600" sparkSize={10} sparkRadius={15} sparkCount={8} duration={400}>
            <Button variant="outline" size="icon" className="active:scale-95">
              <Code2 />
            </Button>
          </ClickSpark>
          <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)}>
            {isDark ? <Moon /> : <Sun />}
          </Button>
        </div>
      </div>

      {/* Preview */}
      <ThemePreviewer theme={theme} isDark={isDark} className="grow overflow-y-auto flex flex-col">
        <div className="relative rounded-xl border grow flex flex-col overflow-y-auto">
          <MailPage />
        </div>
      </ThemePreviewer>
    </main>
  );
}

const Separator = () => <div className="h-4 w-px bg-muted-foreground/30 shrink-0" />;
