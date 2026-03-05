"use client";

import { useScrollAnimation } from "./useScrollAnimation";


const steps = [
  {
    number: "01",
    title: "We Sit Down Together",
    description:
      "A real conversation about your business — your workflows, pain points, and goals. We map out where AI can make the biggest difference, and we do it with you, not for you.",
    detail: "Most brands have 3-5 high-impact opportunities we can identify in the first call.",
  },
  {
    number: "02",
    title: "We Build It With You",
    description:
      "We set up your AI agents together — connected to your Shopify, email, social, and ops tools. You're involved at every step so you understand exactly what's running and why.",
    detail: "Live within 1-2 weeks. No technical knowledge required on your end.",
  },
  {
    number: "03",
    title: "We Stay By Your Side",
    description:
      "This isn't a handoff. We keep working with you — optimizing, adding new capabilities, and making sure AI is actually delivering results. You always have a founder in your corner.",
    detail: "Weekly check-ins. Slack access. We're a message away whenever you need us.",
  },
];

export default function HowItWorks() {
  const ref = useScrollAnimation();

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-20">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            A hands-on process from{" "}
            <span className="text-accent">start to finish</span>
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            We don&apos;t send you a login and disappear. We work alongside you
            to make sense of AI for your business — setting it up, explaining
            what it does, and making sure it&apos;s actually working.
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
