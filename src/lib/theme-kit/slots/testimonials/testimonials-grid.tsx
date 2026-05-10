import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import type { SlotComponentProps } from "../_types";

const testimonials = [
  {
    name: "Jordan Lee",
    role: "Frontend Lead at Atlas",
    initials: "JL",
    quote: "Cut our design system build from months to days. The variations alone make it worth it.",
  },
  {
    name: "Sam Chen",
    role: "Designer at Helix",
    initials: "SC",
    quote: "Finally, a generator that produces themes I'd actually use in production.",
  },
  {
    name: "Avery Rivera",
    role: "Eng Manager at Stark",
    initials: "AR",
    quote: "Saved us hundreds of hours on the redesign. Highly recommend.",
  },
  {
    name: "Morgan Patel",
    role: "Product Designer at Nova",
    initials: "MP",
    quote: "The variety is incredible. Each shuffle feels intentional.",
  },
  {
    name: "Riley Kim",
    role: "CTO at Quanta",
    initials: "RK",
    quote: "Beautiful defaults, sensible choices. It just works.",
  },
  {
    name: "Casey Morgan",
    role: "Founder at Forge",
    initials: "CM",
    quote: "Indistinguishable from a hand-built design system.",
  },
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function TestimonialsGrid(_props: SlotComponentProps): React.JSX.Element {
  return (
    <section className="py-20 px-6">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="text-3xl font-bold tracking-tight">Loved by developers</h2>
        <p className="mt-4 text-muted-foreground">
          Join thousands of teams building beautiful design systems with our generator.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {testimonials.map((testimonial) => (
          <Card key={testimonial.name} className="bg-card">
            <CardContent className="pt-6">
              <p className="text-muted-foreground italic mb-4">{testimonial.quote}</p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>{testimonial.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
