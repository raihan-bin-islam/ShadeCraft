import { Sparkles, Shield, Zap, Layers, Compass, Box } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BentoGrid(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="mx-auto max-w-7xl py-20 px-6 space-y-8">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Everything you need, beautifully crafted
        </h2>
        <p className="text-lg text-muted-foreground mt-3">
          A complete toolkit for modern design systems.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 md:grid-rows-3 gap-4">
        <Card className="sm:col-span-2 md:col-span-2 md:row-span-2 gap-6 p-8 justify-between">
          <div className="space-y-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h3 className="text-xl font-semibold">Designed for delight</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every interaction considered. Every pixel placed with purpose. Built by designers, for designers.
            </p>
          </div>
          <div className="aspect-video bg-primary/10 rounded-lg" />
        </Card>

        <Card className="md:col-span-1 md:row-span-2 gap-3 p-6">
          <Shield className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Battle tested</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Trusted by thousands of teams in production environments worldwide.
          </p>
        </Card>

        <Card className="gap-2 p-6">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Lightning fast</h3>
          <p className="text-sm text-muted-foreground">Sub-second response times.</p>
        </Card>

        <Card className="md:col-span-2 gap-2 p-6">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Composable by design</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Mix and match patterns to build any layout. Each component plays well with the others.
          </p>
        </Card>

        <Card className="gap-2 p-6">
          <Compass className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Guided</h3>
          <p className="text-sm text-muted-foreground">Sensible defaults out of the box.</p>
        </Card>

        <Card className="gap-2 p-6">
          <Box className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Modular</h3>
          <p className="text-sm text-muted-foreground">Use what you need, ignore the rest.</p>
        </Card>
      </div>
    </section>
  );
}
