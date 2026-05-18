import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeroSplit(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-20 px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div>
          <p className="text-sm font-medium text-primary mb-3 uppercase tracking-wider">
            Design system, automated
          </p>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            From brief to interface, in one shuffle
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Generate complete, themeable interfaces with a single click. Every variation production-ready.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Try it free</Button>
            <Button size="lg" variant="outline">Watch demo</Button>
          </div>
        </div>
        <div className="aspect-square rounded-2xl border bg-primary/5 relative overflow-hidden">
          <div className="absolute inset-8 rounded-xl bg-card border shadow-sm" />
          <div className="absolute inset-16 rounded-lg bg-primary/15" />
        </div>
      </div>
    </section>
  );
}
