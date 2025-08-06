import { Logo } from "@/components/icons/Logo";
import { SparklesText } from "@/components/magicui/sparkles-text";
import RotatingText from "@/components/react-bits/RotatingText";
import { spaceGrotesk } from "@/config/fonts";
import { cn } from "@/lib/utils";

export const Header = () => {
  return (
    <header className="flex flex-col relative w-full h-full bg-background border-b">
      <div className="flex items-center justify-between container mx-auto p-4">
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
        <div className="flex flex-col">
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
        <div className="min-w-48"></div>
      </div>
    </header>
  );
};
