import type { SlotComponentProps } from "../_types";

const logos = [
  { name: "Stark", style: "font-bold" },
  { name: "Atlas", style: "font-light italic" },
  { name: "Helix", style: "font-mono" },
  { name: "Nova", style: "font-semibold" },
  { name: "Quanta", style: "font-bold" },
  { name: "Forge", style: "font-light italic" },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LogoCloudMarquee(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-muted-foreground text-sm uppercase tracking-wider">
          Trusted by leading teams
        </h2>
      </div>
      <div className="overflow-hidden">
        <div className="flex gap-12 justify-around items-center">
          {logos.map((logo) => (
            <div
              key={logo.name}
              className={`h-8 flex items-center justify-center ${logo.style} text-muted-foreground text-lg font-semibold whitespace-nowrap`}
            >
              {logo.name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
