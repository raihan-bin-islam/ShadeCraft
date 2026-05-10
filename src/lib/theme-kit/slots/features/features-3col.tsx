import { Zap, Shield, Sparkles } from "lucide-react";
import type { SlotComponentProps } from "../_types";

const features = [
  {
    icon: Zap,
    heading: "Lightning fast",
    description:
      "Built for speed from the ground up. Sub-second response times across the board.",
  },
  {
    icon: Shield,
    heading: "Battle tested",
    description:
      "Trusted by thousands of teams in production. Bulletproof reliability.",
  },
  {
    icon: Sparkles,
    heading: "Beautifully designed",
    description:
      "Every pixel considered. A delight to use, from the first interaction onward.",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Features3col(_props: SlotComponentProps): React.JSX.Element {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.heading}
              className="bg-card border rounded-lg p-6 space-y-4"
            >
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">{feature.heading}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
