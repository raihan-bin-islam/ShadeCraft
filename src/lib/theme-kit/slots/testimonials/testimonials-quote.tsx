import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { SlotComponentProps } from "../_types";

const testimonial = {
  name: "Riley Kim",
  role: "CTO at Quanta",
  initials: "RK",
  quote: "Beautiful defaults, sensible choices. It just works.",
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TestimonialsQuote(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center space-y-8">
        <blockquote className="text-3xl md:text-4xl font-semibold text-foreground leading-tight tracking-tight">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <div className="flex items-center justify-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback>{testimonial.initials}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-semibold leading-tight">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
