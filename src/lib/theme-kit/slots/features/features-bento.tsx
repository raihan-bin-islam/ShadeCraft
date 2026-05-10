import { Zap, Shield, Sparkles } from "lucide-react";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FeaturesBento(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-20 px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight">
          Everything you need
        </h2>
        <p className="mt-4 text-muted-foreground">
          All the tools you need to build faster, ship confidently, and delight
          your users.
        </p>
      </div>

      <div className="grid grid-cols-3 grid-rows-2 gap-4 max-w-6xl mx-auto">
        {/* Large card — spans 2 columns */}
        <div className="col-span-2 bg-card border rounded-lg p-6 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Lightning fast</h3>
          <p className="text-muted-foreground">
            Built for speed from the ground up. Sub-second response times across
            the board, no matter the scale.
          </p>
          <div className="aspect-video bg-gradient-to-br from-muted to-card rounded mt-auto" />
        </div>

        {/* Tall card — spans 2 rows */}
        <div className="row-span-2 bg-card border rounded-lg p-6 flex flex-col gap-4">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Battle tested</h3>
          <p className="text-muted-foreground">
            Trusted by thousands of teams in production. Bulletproof
            reliability.
          </p>
          <div className="flex-1 bg-gradient-to-br from-muted to-card rounded" />
        </div>

        {/* Small card */}
        <div className="bg-card border rounded-lg p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Beautifully designed</h3>
          <p className="text-muted-foreground text-sm">
            Every pixel considered. A delight to use, from the first interaction
            onward.
          </p>
        </div>

        {/* Small card */}
        <div className="bg-card border rounded-lg p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl font-semibold">Always on</h3>
          <p className="text-muted-foreground text-sm">
            99.99% uptime SLA. Redundant infrastructure built for the most
            demanding workloads.
          </p>
        </div>
      </div>
    </section>
  );
}
