import {
  Sparkles,
  Shield,
  Zap,
  Layers,
  Compass,
  Box,
} from "lucide-react";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BentoGrid(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="mx-auto max-w-7xl py-20 px-6 space-y-8">
      {/* Section header */}
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Everything you need, beautifully crafted
        </h2>
        <p className="text-lg text-muted-foreground mt-3">
          A complete toolkit for modern design systems.
        </p>
      </div>

      {/* Grid: 4 columns x 3 rows */}
      <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-3 gap-4">
        {/* Card 1: Hero card (col-span-2 row-span-2) */}
        <div className="md:col-span-2 md:row-span-2 bg-card border rounded-xl p-8 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <Sparkles className="h-8 w-8 text-primary" />
            <h3 className="text-2xl font-semibold">Designed for delight</h3>
            <p className="text-muted-foreground">
              Every interaction considered. Every pixel placed with purpose.
              Built by designers, for designers.
            </p>
          </div>
          {/* Placeholder visualization */}
          <div className="aspect-video bg-gradient-to-br from-primary/20 via-muted to-accent/20 rounded-lg" />
        </div>

        {/* Card 2: Tall card (col-span-1 row-span-2) */}
        <div className="md:col-span-1 md:row-span-2 bg-card border rounded-xl p-6 space-y-3">
          <Shield className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold">Battle tested</h3>
          <p className="text-sm text-muted-foreground">
            Trusted by thousands of teams in production environments worldwide.
            Reliability you can count on.
          </p>
        </div>

        {/* Card 3: Small card (col-span-1) */}
        <div className="md:col-span-1 bg-card border rounded-xl p-6 space-y-2">
          <Zap className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Lightning fast</h3>
          <p className="text-xs text-muted-foreground">Sub-second response times.</p>
        </div>

        {/* Card 4: Wide card (col-span-2) */}
        <div className="md:col-span-2 bg-card border rounded-xl p-6 space-y-2">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Composable by design</h3>
          <p className="text-sm text-muted-foreground">
            Mix and match patterns to build any layout. Each component plays well
            with the others.
          </p>
        </div>

        {/* Card 5: Small card (col-span-1) */}
        <div className="md:col-span-1 bg-card border rounded-xl p-6 space-y-2">
          <Compass className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Guided</h3>
          <p className="text-xs text-muted-foreground">
            Sensible defaults out of the box.
          </p>
        </div>

        {/* Card 6: Small card (col-span-1) */}
        <div className="md:col-span-1 bg-card border rounded-xl p-6 space-y-2">
          <Box className="h-5 w-5 text-primary" />
          <h3 className="text-base font-semibold">Modular</h3>
          <p className="text-xs text-muted-foreground">
            Use what you need, ignore the rest.
          </p>
        </div>
      </div>
    </section>
  );
}
