import { Zap, Shield, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function FeaturesBento(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-20 px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Everything you need</h2>
        <p className="mt-4 text-muted-foreground">
          All the tools you need to build faster, ship confidently, and delight your users.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 md:grid-rows-2 gap-4 max-w-6xl mx-auto">
        {/* Large card */}
        <Card className="sm:col-span-2 md:col-span-2 gap-4 p-6">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Lightning fast</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Built for speed from the ground up. Sub-second response times across
            the board, no matter the scale.
          </p>
          <div className="aspect-video bg-primary/5 rounded mt-auto" />
        </Card>

        {/* Tall card */}
        <Card className="md:row-span-2 gap-4 p-6">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Battle tested</h3>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Trusted by thousands of teams in production. Bulletproof reliability you can count on.
          </p>
          <div className="flex-1 bg-primary/5 rounded" />
        </Card>

        {/* Small cards */}
        <Card className="gap-3 p-6">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Beautifully designed</h3>
          <p className="text-muted-foreground text-sm">
            Every pixel considered. A delight to use, from the first interaction onward.
          </p>
        </Card>

        <Card className="gap-3 p-6">
          <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold">Always on</h3>
          <p className="text-muted-foreground text-sm">
            99.99% uptime SLA. Redundant infrastructure built for demanding workloads.
          </p>
        </Card>
      </div>
    </section>
  );
}
