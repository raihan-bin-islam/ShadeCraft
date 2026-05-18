import { Layers, Shield, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function HeroBento(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-20 px-6">
      <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-4">
            Compose, refine, ship
          </h1>
          <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
            Every primitive you need to build distinctive interfaces, designed to work together out of the box.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button size="lg">Browse components</Button>
            <Button size="lg" variant="outline">View on GitHub</Button>
          </div>
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-3 min-h-[20rem] md:min-h-[24rem]">
          <Card className="row-span-2 gap-2 p-5 justify-center">
            <Zap className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">Speed</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Blazing fast builds every time.
            </p>
          </Card>
          <Card className="gap-2 p-5 justify-center">
            <Shield className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">Reliability</span>
            <p className="text-sm text-muted-foreground">99.99% uptime SLA.</p>
          </Card>
          <Card className="col-span-1 gap-2 p-5 justify-center">
            <Layers className="h-5 w-5 text-primary" />
            <span className="text-base font-semibold">Scale</span>
            <p className="text-sm text-muted-foreground">From zero to ten million.</p>
          </Card>
          <Card className="col-span-2 gap-2 p-5">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="text-base font-semibold">Insights</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built-in analytics surface what matters, automatically.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
}
