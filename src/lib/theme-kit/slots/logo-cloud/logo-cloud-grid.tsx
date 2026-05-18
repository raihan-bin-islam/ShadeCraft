import type { SlotComponentProps } from "../_types";

const logos = ["Stark", "Atlas", "Helix", "Nova", "Quanta", "Forge"];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function LogoCloudGrid(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-16 px-6">
      <div className="text-center mb-12">
        <h2 className="text-muted-foreground text-sm uppercase tracking-wider">
          Trusted by leading teams
        </h2>
      </div>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-x-12 gap-y-6 items-center max-w-5xl mx-auto opacity-70">
        {logos.map((name) => (
          <div
            key={name}
            className="flex items-center justify-center text-xl font-bold tracking-tight text-muted-foreground"
          >
            {name}
          </div>
        ))}
      </div>
    </section>
  );
}
