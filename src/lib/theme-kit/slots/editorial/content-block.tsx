import { SlotComponent } from "../_types";

export const ContentBlock: SlotComponent = () => {
  return (
    <article className="mx-auto max-w-2xl py-12 px-6 space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">5 min read &middot; May 10, 2026</p>
        <h1 className="text-4xl font-bold tracking-tight mt-4">
          The case for narrative-driven design systems
        </h1>
        <p className="text-xl text-muted-foreground mt-2">
          Why color alone isn&apos;t enough, and what to do instead.
        </p>
      </div>

      <p className="text-lg leading-relaxed">
        Design systems have become the backbone of modern digital products, yet most treat color as a cosmetic layer applied at the end. They&apos;re built around technical constraints (tokens, spacing scales, type hierarchies) but they neglect the deeper story that makes those choices coherent and memorable. A truly mature design system isn&apos;t just about consistency; it&apos;s about narrative. It&apos;s about conveying intent, emotion, and meaning through every visual choice.
      </p>

      <p className="text-base leading-relaxed text-foreground">
        The problem isn&apos;t that designers don&apos;t understand color theory or typography. The problem is that most design systems are authored in isolation, crafted by specialized teams who optimize for technical efficiency without considering how those choices will land in the hands of diverse product teams across an organization. The result is a toolbox without a philosophy. Teams use the system, yes, but they use it mechanically, without understanding why certain combinations feel right or wrong.
      </p>

      <p className="text-base leading-relaxed text-foreground">
        When you introduce narrative into a design system, everything changes. Suddenly, every color choice has a reason. Every typographic scale serves a purpose beyond readability. The system becomes a shared language, not just a shared library. Teams internalize the principles, and that internalization becomes a multiplier. Decisions made downstream are better because they&apos;re grounded in a deeper understanding of the system&apos;s intent.
      </p>

      <h2 className="text-2xl font-semibold mt-8">Where most generators fall short</h2>

      <p className="text-base leading-relaxed text-foreground">
        Current theme generators approach the problem from the wrong angle. They ask &quot;What color palette do you want?&quot; and &quot;How much whitespace?&quot; as if design were purely parametric. But design systems have personality. They have values. A fintech application shouldn&apos;t feel the same as a creative tool, even if both use the same grid system. The visual language should communicate something about the product&apos;s nature, not just its functional requirements.
      </p>

      <p className="text-base leading-relaxed text-foreground">
        Existing tools excel at the mechanics: they can generate perfectly proportioned scales and accessible color combinations. But they miss the human layer. They don&apos;t ask about your product&apos;s voice, your brand&apos;s evolution, or the emotional journey your users should experience. They treat theme generation as a cosmetic exercise rather than a strategic one. The result is a thousand digital products that look competent but interchangeable.
      </p>

      <figure className="my-8 rounded-lg bg-muted/60 p-8 text-center">
        <blockquote className="text-xl italic text-foreground">
          A design system without narrative is just a paint set.
        </blockquote>
      </figure>

      <h3 className="text-xl font-semibold mt-6">What narrative actually means</h3>

      <p className="text-base leading-relaxed text-foreground">
        Narrative in a design system means establishing why decisions were made, not just what they are. It means documenting the philosophy behind your color choices, the emotional intent of your typography, the spatial relationships that support your information hierarchy. It&apos;s the difference between a Pantone swatch and a color that makes sense in context, that communicates trust, innovation, or playfulness depending on your brand&apos;s story.
      </p>

      <p className="text-base leading-relaxed text-foreground">
        When a product team understands the narrative, they become stewards of the system rather than passive consumers. They know why the primary color is a certain shade of blue (because it needs to feel reliable and modern simultaneously). They understand the type hierarchy not as arbitrary sizes, but as a vocal register that guides attention and creates cognitive landmarks. This understanding multiplies their decision-making power.
      </p>

      <p className="text-base leading-relaxed text-foreground">
        Building narrative into a design system means being intentional from the start. It means asking hard questions about brand values, user perception, and emotional goals. It means documenting not just the rules, but the reasoning. And it means creating tools that help teams apply those rules with understanding, not just compliance. That&apos;s the difference between a system and a shortcut, and it&apos;s the future of design system evolution.
      </p>
    </article>
  );
};
