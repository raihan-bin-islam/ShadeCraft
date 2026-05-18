"use client";
import React, { useState } from "react";
import { MoreHorizontal, Edit, Code2, Link2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ThemeEditor } from "@/components/organisms/theme/theme-editor";
import { ThemeCode } from "@/components/organisms/theme/theme-code";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { useAtomValue } from "jotai";
import { currentThemeAtom } from "@/store/theme";

export function DockMoreMenu() {
  const [editorOpen, setEditorOpen] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);
  const { isDark } = useThemeGenerator();
  const theme = useAtomValue(currentThemeAtom);

  const handlePermalink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button type="button" aria-label="More actions" className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" side="top" sideOffset={12}>
          <DropdownMenuItem onClick={() => setEditorOpen(true)}>
            <Edit className="mr-2 h-4 w-4" /> Open editor
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setCodeOpen(true)}>
            <Code2 className="mr-2 h-4 w-4" /> Export code
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handlePermalink}>
            <Link2 className="mr-2 h-4 w-4" /> Copy permalink
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Sheet modal={false} open={editorOpen} onOpenChange={setEditorOpen}>
        <SheetContent hideOverlay className="md:min-w-md min-w-full" onInteractOutside={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Edit theme</SheetTitle>
            <SheetDescription>Make changes to your theme. Click save when done.</SheetDescription>
          </SheetHeader>
          <ThemeEditor
            defaultMode={isDark ? "dark" : "light"}
            theme={{ light: theme?.cssVars?.light, dark: theme?.cssVars?.dark }}
            onThemeChange={() => {}}
            themeName=""
          />
          <SheetFooter className="grid grid-cols-2">
            <SheetClose asChild><Button>Save changes</Button></SheetClose>
            <SheetClose asChild><Button variant="outline">Close</Button></SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {codeOpen && <CodeOpener onClose={() => setCodeOpen(false)} />}
    </>
  );
}

function CodeOpener({ onClose }: { onClose: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const btn = ref.current?.querySelector("button");
    btn?.click();
    const t = setTimeout(onClose, 100);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div ref={ref} className="hidden"><ThemeCode /></div>;
}
