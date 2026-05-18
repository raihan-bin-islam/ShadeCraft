import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeroFullbleed(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="relative py-32 px-6 text-center bg-primary text-primary-foreground overflow-hidden">
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, var(--accent) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--secondary) 0%, transparent 40%)",
        }}
      />
      <div className="max-w-3xl mx-auto relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
          Design at the speed of thought
        </h1>
        <p className="text-lg md:text-xl opacity-90 mb-10 max-w-2xl mx-auto">
          Stop fiddling with tokens. Generate complete, on-brand interfaces in seconds.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button size="lg" variant="secondary">Get started</Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent border-primary-foreground/40 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            View docs
          </Button>
        </div>
      </div>
    </section>
  );
}
