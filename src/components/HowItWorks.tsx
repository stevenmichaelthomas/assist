"use client";

import { useScrollAnimation } from "./useScrollAnimation";

const steps = [
  {
    number: "01",
    title: "A real conversation",
    description:
      "Not a sales pitch. Not a questionnaire. A conversation about what you're trying to accomplish, what's getting in the way, and where technology can actually help. Usually takes 30 minutes.",
    detail: "Most people have 3–5 high-impact opportunities hiding in plain sight.",
  },
  {
    number: "02",
    title: "Custom setup, not a template",
    description:
      "We configure the right tools for your specific workflow — connected to each other, set up for how you actually work, and ready to go. No generic recommendations, no one-size-fits-all.",
    detail: "Up and running within 1–2 weeks. No technical knowledge required.",
  },
  {
    number: "03",
    title: "Ongoing partnership",
    description:
      "This isn't a handoff. Technology moves fast, and your needs will evolve. We stay with you — optimizing what's working, adjusting what isn't, and rolling out new capabilities as they become available.",
    detail: "Regular check-ins. Direct access. Always a message away.",
  },
];

export default function HowItWorks() {
  const ref = useScrollAnimation();

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-20">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Here&apos;s how it works
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            No onboarding maze. No ticket queues. You get real people who
            understand both the technology and your situation.
          </p>
        </div>

        <div ref={ref} className="animate-on-scroll">
          <div className="space-y-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className="group grid grid-cols-1 md:grid-cols-[5rem,1fr] gap-6 md:gap-10"
              >
                {/* Step number */}
                <div className="flex md:flex-col items-center md:items-start gap-4 md:gap-0">
                  <span className="font-display text-6xl md:text-7xl text-accent/15 leading-none">
                    {step.number}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block w-px h-full min-h-[2rem] bg-foreground/8 ml-8 mt-4" />
                  )}
                </div>

                {/* Content */}
                <div className="rounded-2xl bg-surface p-8 md:p-10">
                  <h3 className="font-display text-xl md:text-2xl mb-4">
                    {step.title}
                  </h3>
                  <p className="text-muted text-base leading-relaxed mb-4 max-w-xl">
                    {step.description}
                  </p>
                  <p className="text-sm text-accent font-medium">
                    {step.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
