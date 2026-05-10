"use client";

import { ComboboxInput, ComboboxItem, GroupedComboboxItem } from "@/components/atoms/combobox-input";
import { ShinyButton } from "@/components/magicui/shiny-button";
import { ThemeCode } from "@/components/organisms/theme/theme-code";
import { ThemeEditor } from "@/components/organisms/theme/theme-editor";
import { ThemePreviewer } from "@/components/organisms/theme/theme-previewer";
import { LayoutPreview } from "@/components/organisms/theme/layout-preview";
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
import { Edit, Moon, Sparkles, Sun } from "lucide-react";
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
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { isDark, toggleDarkMode, generateSingle, updateFont, currentTheme } = useThemeGenerator();

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

  console.log("font:", { selectedFont });

  return (
    <main
      className={cn(
        "md:space-y-4 space-y-2 grow flex flex-col overflow-y-auto transition-discrete duration-400 ease-[cubic-bezier(.66,.27,.3,.85)]",
        isEditOpen && "md:pr-66"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between md:gap-5 md:mb-4">
        <div className="flex items-center md:gap-3 w-full md:w-auto">
          <h1 className="text-xl/5 md:text-2xl font-semibold text-center md:text-start">Preview</h1>
          <div className="hidden md:flex items-center gap-2">
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
          <ComboboxInput
            className="hidden md:inline-flex"
            groupedItems={fontGroups}
            value={selectedFont ?? ""}
            onChange={(val) => {
              onSelectFont(val);
              if (val) updateFont(val);
            }}
            placeholder="Font"
          />
          <ComboboxInput
            className="hidden md:inline-flex"
            items={toneItems}
            value={selectedTone ?? ""}
            onChange={onSelectTone}
            placeholder="Tone"
          />
          <ComboboxInput
            className="hidden md:inline-flex"
            items={feelItems}
            value={selectedFeel ?? ""}
            onChange={onSelectFeel}
            placeholder="Feel"
          />
          <div className="hidden md:flex items-center gap-3">
            <ShinyButton onClick={() => generateSingle({ feelId: selectedFeel, fontClass: selectedFont, toneId: selectedTone })}>
              <Sparkles /> Randomize
            </ShinyButton>
            <Separator />
            <EditorModal isDark={isDark} theme={theme} isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} />

            <ThemeCode />
            <Button variant="outline" size="icon" onClick={toggleDarkMode}>
              {isDark ? <Moon /> : <Sun />}
            </Button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <ThemePreviewer theme={theme} isDark={isDark} className="grow overflow-y-auto flex flex-col">
        <div className="relative rounded-xl border grow flex flex-col overflow-y-auto">
          <LayoutPreview spec={currentTheme?.layout} />
        </div>
      </ThemePreviewer>
      <div className="md:hidden flex items-center gap-3">
        <ShinyButton
          className="grow"
          onClick={() => generateSingle({ feelId: selectedFeel, fontClass: selectedFont, toneId: selectedTone })}
        >
          <Sparkles /> Randomize
        </ShinyButton>
        <Separator />
        <EditorModal isDark={isDark} theme={theme} isEditOpen={isEditOpen} setIsEditOpen={setIsEditOpen} />

        <ThemeCode />
        <Button variant="outline" size="icon" onClick={toggleDarkMode}>
          {isDark ? <Moon /> : <Sun />}
        </Button>
      </div>
    </main>
  );
}

const Separator = () => <div className="h-4 w-px bg-muted-foreground/30 shrink-0" />;

const EditorModal = ({
  theme,
  isEditOpen,
  setIsEditOpen,
  isDark,
}: {
  theme?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
  isEditOpen: boolean;
  setIsEditOpen: (val: boolean) => void;
  isDark: boolean;
}) => (
  <Sheet modal={false} open={isEditOpen} onOpenChange={setIsEditOpen}>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon">
        <Edit />
      </Button>
    </SheetTrigger>
    <SheetContent hideOverlay className="md:min-w-md min-w-full" onInteractOutside={(e) => e.preventDefault()}>
      <SheetHeader>
        <SheetTitle>Edit theme</SheetTitle>
        <SheetDescription>Make changes to your theme here. Click save when you&apos;re done.</SheetDescription>
      </SheetHeader>
      <ThemeEditor defaultMode={isDark ? "dark" : "light"} theme={theme} onThemeChange={() => {}} themeName="" />
      <SheetFooter className="grid grid-cols-2">
        <SheetClose asChild>
          <Button>Save changes</Button>
        </SheetClose>
        <SheetClose asChild>
          <Button variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
);
