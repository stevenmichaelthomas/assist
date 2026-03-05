"use client";

import { useScrollAnimation } from "./useScrollAnimation";

const steps = [
  {
    number: "01",
    title: "We Sit Down Together",
    description:
      "We start with a real conversation about your business — your workflows, your pain points, your goals. No questionnaires. We work with you to map where AI can have the biggest impact.",
  },
  {
    number: "02",
    title: "We Build It With You",
    description:
      "We set up your AI agents together — connected to your Shopify, email, social, and ops tools. You're involved every step so you understand what's running and why. Live within 1–2 weeks.",
  },
  {
    number: "03",
    title: "We Stay By Your Side",
    description:
      "This isn't a handoff. We keep working with you — optimizing, adding new capabilities, and making sure AI is actually delivering results. You always have a founder in your corner.",
  },
];

export default function HowItWorks() {
  const ref = useScrollAnimation();

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            A hands-on process from start to finish
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            We don&apos;t send you a login and disappear. We work alongside you
            to make sense of AI for your business — setting it up, explaining
            what it does, and making sure it&apos;s actually working.
          </p>
        </div>

        <div ref={ref} className="animate-on-scroll grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {steps.map((step, i) => (
            <div key={step.number} className="stagger-child relative">
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] right-[calc(-50%+2rem)] h-px bg-foreground/10" />
              )}
              <div className="text-center">
                <span className="inline-block font-display text-5xl text-accent/20 mb-4">
                  {step.number}
                </span>
                <h3 className="font-display text-xl md:text-2xl mb-3">{step.title}</h3>
                <p className="text-muted text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
