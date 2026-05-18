import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CtaBanner(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="bg-primary text-primary-foreground py-16 px-6">
      <div className="max-w-3xl mx-auto space-y-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold">Ready to get started?</h2>
        <p className="text-lg opacity-90">
          Join thousands of teams shipping faster with confidence.
        </p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Button variant="secondary" size="lg">Get started</Button>
          <Button
            size="lg"
            variant="ghost"
            className="text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
          >
            Talk to sales
          </Button>
        </div>
      </div>
    </section>
  );
}
