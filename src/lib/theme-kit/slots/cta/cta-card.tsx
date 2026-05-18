import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function CtaCard(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="max-w-3xl mx-auto py-20 px-6">
      <Card className="p-12 gap-6 text-center items-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
          Ready to get started?
        </h2>
        <p className="text-lg text-muted-foreground max-w-md">
          Generate your first theme in under a minute.
        </p>
        <Button size="lg">Get started</Button>
      </Card>
    </div>
  );
}
