import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeroSplit(_props: SlotComponentProps): React.JSX.Element {
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
        <div className="aspect-video bg-gradient-to-br from-muted to-card rounded-lg border shadow-md w-full" />
      </div>
    </section>
  );
}
