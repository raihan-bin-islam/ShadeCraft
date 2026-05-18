import type { SlotComponentProps } from "../_types";

const logos = ["Stark", "Atlas", "Helix", "Nova", "Quanta", "Forge"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LogoCloudMarquee(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-16">
      <div className="text-center mb-10 px-6">
        <h2 className="text-muted-foreground text-sm uppercase tracking-wider">
          Trusted by leading teams
        </h2>
      </div>
      <div
        className="relative overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 10%, black 90%, transparent)",
        }}
      >
        <div className="flex w-max gap-16 animate-[marquee_30s_linear_infinite] opacity-70">
          {[...logos, ...logos].map((name, i) => (
            <div
              key={`${name}-${i}`}
              className="flex shrink-0 items-center text-xl font-bold tracking-tight text-muted-foreground"
            >
              {name}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
