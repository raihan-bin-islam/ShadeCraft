import { Quote } from "lucide-react";
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
        <Quote className="h-10 w-10 text-primary mx-auto" />
        <blockquote className="text-2xl md:text-3xl text-foreground leading-relaxed">
          &ldquo;{testimonial.quote}&rdquo;
        </blockquote>
        <div className="flex flex-col items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback>{testimonial.initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{testimonial.name}</p>
            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
