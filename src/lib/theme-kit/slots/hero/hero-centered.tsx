import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeroCentered(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-24">
      <div className="text-center max-w-3xl mx-auto px-6">
        <span className="bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs inline-block mb-6">
          What&apos;s new — v2.0
        </span>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
          Build your design system in minutes
        </h1>
        <p className="text-muted-foreground text-lg mb-8">
          From a single brief to a polished interface, ship faster with confidence.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg">Get started</Button>
          <Button size="lg" variant="outline">View docs</Button>
        </div>
      </div>
    </section>
  );
}
