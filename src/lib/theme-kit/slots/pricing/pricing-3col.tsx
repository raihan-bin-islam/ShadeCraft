import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { SlotComponentProps } from "../_types";

interface Tier {
  name: string;
  price: string;
  numeric: boolean;
  description: string;
  features: string[];
  cta: string;
  recommended?: boolean;
}

const tiers: Tier[] = [
  {
    name: "Free",
    price: "$0",
    numeric: false,
    description: "Perfect for trying things out",
    features: ["Up to 3 themes", "Basic export", "Community support"],
    cta: "Get started",
  },
  {
    name: "Pro",
    price: "$29",
    numeric: true,
    description: "For growing teams",
    features: [
      "Unlimited themes",
      "Premium exports",
      "Priority support",
      "Team collaboration",
      "Custom branding",
    ],
    cta: "Start free trial",
    recommended: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    numeric: false,
    description: "For organizations at scale",
    features: [
      "Everything in Pro",
      "SSO + SAML",
      "Dedicated support",
      "Custom contracts",
      "SLA",
    ],
    cta: "Contact sales",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function Pricing3col(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-20 px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Choose your plan</h2>
        <p className="mt-4 text-muted-foreground">
          Start for free, scale when you need it. No hidden fees.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`bg-card rounded-lg p-8 space-y-6 flex flex-col ${
              tier.recommended
                ? "border-2 border-primary shadow-md"
                : "border border-border"
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-semibold">{tier.name}</h3>
              {tier.recommended && (
                <Badge className="bg-primary text-primary-foreground shrink-0">
                  Recommended
                </Badge>
              )}
            </div>
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold">{tier.price}</span>
                {tier.numeric && (
                  <span className="text-sm text-muted-foreground font-normal">
                    / mo
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {tier.description}
              </p>
            </div>
            <ul className="space-y-3 flex-1">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-auto">
              <Button
                className="w-full"
                variant={tier.recommended ? "default" : "outline"}
              >
                {tier.cta}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
