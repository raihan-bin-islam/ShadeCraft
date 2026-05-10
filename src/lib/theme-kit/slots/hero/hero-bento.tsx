import { Layers, Shield, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeroBento(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-20 px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            Build your design system in minutes
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            From a single brief to a polished interface, ship faster with confidence.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Get started</Button>
            <Button size="lg" variant="outline">View docs</Button>
          </div>
        </div>
        {/* Asymmetric bento: 2 cols × 2 rows, card A spans row-span-2, card D spans col-span-2 */}
        <div className="grid grid-cols-2 grid-rows-2 gap-4 h-72">
          {/* Card A: row-span-2 — tall left card */}
          <div className="bg-card border rounded-lg p-4 row-span-2 flex flex-col gap-2 justify-center">
            <Zap className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Speed</span>
            <p className="text-xs text-muted-foreground">Blazing fast builds every time.</p>
          </div>
          {/* Card B: top-right */}
          <div className="bg-card border rounded-lg p-4 flex flex-col gap-2 justify-center">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Reliability</span>
          </div>
          {/* Cards C + D share the bottom-right cell via nested grid — D spans col-span-2 instead */}
          {/* Card C: col-span-2 wide bottom card */}
          <div className="bg-card border rounded-lg p-4 col-span-2 flex items-center gap-4">
            <div className="flex flex-col gap-1">
              <Layers className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Scale</span>
            </div>
            <div className="h-full w-px bg-border" />
            <div className="flex flex-col gap-1">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-semibold text-foreground">Insights</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
