"use client";
import { Github } from "@/components/icons/Github";
import { Logo } from "@/components/icons/Logo";
import RotatingText from "@/components/react-bits/RotatingText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { spaceGrotesk } from "@/config/fonts";
import { roadmapData } from "@/data/roadmap";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { focusModeAtom } from "@/store/theme";
import { Expand, Moon, Sun } from "lucide-react";

export const Header = () => {
  const { isDark, toggleDarkMode } = useThemeGenerator();
  const focus = useAtomValue(focusModeAtom);

  if (focus) return null;

  return (
    <header className="z-50 sticky top-0 backdrop-blur-2xl flex w-full bg-foreground/3 border-b">
      <div className="flex items-center justify-between container mx-auto px-4 py-2 gap-4">
        <div className="flex items-center gap-2 shrink-0">
          <Logo className="size-6 fill-primary" />
          <h2 className={cn("text-lg text-primary font-bold", spaceGrotesk.className)}>
            Shade<span className="text-secondary">Craft</span>
          </h2>
        </div>
        <div className="hidden md:flex flex-col items-center min-w-0 flex-1">
          <RotatingText
            texts={["Stunning shadcn Themes", "Tailwind v4 Ready", "Real-time Preview", "OKLCH Colors!"]}
            mainClassName="px-2 text-base font-semibold text-foreground overflow-hidden justify-center rounded-md leading-tight"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            staggerDuration={0.01}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={3000}
          />
          <p className="text-[11px] text-muted-foreground leading-tight">
            Beautiful, accessible shadcn/ui themes in OKLCH
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1.5">
                Roadmap <Expand className="size-3.5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="gap-0 p-0 overflow-hidden">
              <DialogHeader className="bg-muted/40 p-5">
                <DialogTitle>Roadmap</DialogTitle>
              </DialogHeader>
              <div className="px-5 p-5">
                {roadmapData.map((item) => (
                  <div key={item.title}>
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-primary" />
                      <h3 className="text-lg font-bold">{item.title}</h3>
                    </div>
                    <p className="pl-5 text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" size="icon" className="size-8" onClick={toggleDarkMode}>
            {isDark ? <Moon className="size-4" /> : <Sun className="size-4" />}
          </Button>
          <Button asChild variant="ghost" size="icon" className="size-8">
            <a target="_blank" href="https://github.com/raihan-bin-islam/ShadeCraft.git">
              <Github className="size-4" />
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
};
