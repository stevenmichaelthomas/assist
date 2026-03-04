"use client";

import { useScrollAnimation } from "./useScrollAnimation";

const steps = [
  {
    number: "01",
    title: "We Learn Your Business",
    description:
      "We audit your operations, tools, and workflows. We map where you're losing time and money — and where AI can have the biggest impact on revenue.",
  },
  {
    number: "02",
    title: "We Build Your AI Team",
    description:
      "Custom agents connected to your Shopify, email, social, and ops tools. Configured for your brand voice, your processes, your goals. Live within 1–2 weeks.",
  },
  {
    number: "03",
    title: "It Gets Smarter Daily",
    description:
      "We actively manage and optimize your AI agents. New capabilities roll out continuously. Performance compounds — your costs go down as your output goes up.",
  },
];

export default function HowItWorks() {
  const ref = useScrollAnimation();

  return (
    <section id="how-it-works" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Up and running in days, paying for itself in a week
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            No six-month implementation. No learning curve. We handle the
            technical work so you stay focused on what you do best — building
            a great product and growing your brand.
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
