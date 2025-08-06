"use client";
import { Logo } from "@/components/icons/Logo";
import { SparklesText } from "@/components/magicui/sparkles-text";
import RotatingText from "@/components/react-bits/RotatingText";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { spaceGrotesk } from "@/config/fonts";
import { roadmapData } from "@/data/roadmap";
import { useThemeGenerator } from "@/hooks/theme-module/use-theme-generator";
import { cn } from "@/lib/utils";
import { ArrowDown, Expand, Moon, Sun } from "lucide-react";

export const Header = () => {
  const { isDark, toggleDarkMode } = useThemeGenerator();

  return (
    <header className="z-50 sticky top-0 backdrop-blur-2xl flex flex-col w-full bg-foreground/3 border-b">
      <div className="flex items-center justify-between container mx-auto md:p-4 p-3">
        <div className="flex items-center gap-3 min-w-48">
          <SparklesText
            className="text-sm"
            sparklesCount={3}
            colors={{ first: "var(--color-primary)", second: "var(--color-secondary)" }}
          >
            <Logo className="size-8 fill-primary" />
          </SparklesText>
          <h2 className={cn("text-2xl text-primary font-bold overflow-visible", spaceGrotesk.className)}>
            Shade<span className="text-secondary">Craft</span>
          </h2>
        </div>
        <div className="hidden md:flex flex-col">
          <RotatingText
            texts={["Stunning shadcn Themes", "Tailwind v4 Ready", "Real-time Preview", "OKLCH Colors!"]}
            mainClassName="px-2 sm:px-2 md:px-3 text-2xl font-bold text-foreground overflow-hidden justify-center rounded-lg"
            staggerFrom={"last"}
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            staggerDuration={0.01}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            rotationInterval={3000}
          />
          <p className="text-sm font-medium text-muted-foreground">
            Create beautiful, accessible themes for your shadcn/ui projects with OKLCH color space
          </p>
        </div>
        <div className="flex items-center gap-3 h-fit">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                Roadmap <Expand />
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
          <Button variant="outline" size="icon" onClick={toggleDarkMode}>
            {isDark ? <Moon /> : <Sun />}
          </Button>
        </div>
      </div>
    </header>
  );
};
