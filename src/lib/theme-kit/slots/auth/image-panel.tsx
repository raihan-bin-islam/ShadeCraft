import { Sparkles } from "lucide-react";
import type { SlotComponentProps } from "../_types";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ImagePanel(_props: SlotComponentProps): React.JSX.Element {
  return (
    <div className="hidden flex-1 items-center justify-center bg-gradient-to-br from-primary to-accent text-primary-foreground p-12 relative overflow-hidden md:flex">
      {/* Decorative blur circles */}
      <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl -top-20 -left-20" />
      <div className="absolute h-64 w-64 rounded-full bg-white/10 blur-3xl -bottom-20 -right-20" />

      {/* Centered content block */}
      <div className="max-w-md text-center space-y-6 relative z-10">
        <Sparkles className="h-12 w-12 mx-auto" />
        <h2 className="text-3xl font-bold">Design systems, simplified</h2>
        <p className="text-lg opacity-90">
          Generate production-ready themes in seconds. No design background
          required.
        </p>
      </div>
    </div>
  );
}
