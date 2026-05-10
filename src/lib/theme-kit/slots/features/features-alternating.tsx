import type { SlotComponentProps } from "../_types";

const rows = [
  {
    heading: "Lightning fast",
    description:
      "Built for speed from the ground up. Sub-second response times across the board, no matter the scale or complexity of your workload.",
    reverse: false,
  },
  {
    heading: "Battle tested",
    description:
      "Trusted by thousands of teams in production. Bulletproof reliability backed by a 99.99% uptime SLA and redundant global infrastructure.",
    reverse: true,
  },
  {
    heading: "Beautifully designed",
    description:
      "Every pixel considered. A delight to use, from the first interaction onward. Crafted with care so your team actually enjoys using it.",
    reverse: false,
  },
];

export function FeaturesAlternating(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _props: SlotComponentProps
): React.JSX.Element {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto space-y-24">
        {rows.map((row) => (
          <div
            key={row.heading}
            className={`grid md:grid-cols-2 gap-12 items-center${row.reverse ? " [&>*:first-child]:md:order-2 [&>*:last-child]:md:order-1" : ""}`}
          >
            {/* Image side */}
            <div className="aspect-video bg-gradient-to-br from-muted to-card rounded-lg border shadow-md" />

            {/* Text side */}
            <div className="flex flex-col gap-4">
              <h3 className="text-2xl font-bold tracking-tight">
                {row.heading}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {row.description}
              </p>
              <a
                href="#"
                className="text-primary font-medium hover:underline w-fit"
              >
                Learn more →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
