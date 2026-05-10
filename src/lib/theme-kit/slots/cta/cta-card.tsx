import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CtaCard(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <div className="bg-gradient-to-br from-card to-muted rounded-xl border shadow-md p-12 text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-bold">
          Ready to get started?
        </h2>
        <p className="text-lg text-muted-foreground">
          Generate your first theme in under a minute.
        </p>
        <Button>Get started</Button>
      </div>
    </div>
  );
}
