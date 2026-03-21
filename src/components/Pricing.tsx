"use client";

import { useScrollAnimation } from "./useScrollAnimation";

export default function Pricing() {
  const ref = useScrollAnimation();

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Simple pricing. No surprises.
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Hiring a full-time person to figure this out would cost ten
            times more — and take ten times longer. We get you running
            in days.
          </p>
        </div>

        <div ref={ref} className="animate-on-scroll max-w-lg mx-auto">
          <div className="rounded-3xl bg-surface border border-foreground/5 p-10 md:p-12">
            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-5xl">$2,000</span>
                <span className="text-muted text-sm">one-time setup</span>
              </div>
              <p className="text-muted text-sm">
                We assess your situation, design the right setup, and build
                it with you — tools configured, workflows connected, team
                trained
              </p>
            </div>

            <div className="section-divider mb-8" />

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-5xl">$500</span>
                <span className="text-muted text-sm">/month</span>
              </div>
              <p className="text-muted text-sm">
                Ongoing optimization, support, and new capabilities as the
                technology evolves — we stay in your corner
              </p>
            </div>

            <div className="section-divider mb-8" />

            <ul className="text-sm text-muted space-y-2 mb-8">
              <li>No long-term contracts. Cancel anytime.</li>
              <li>Most clients see results within the first week.</li>
              <li>Replaces months of trial-and-error on your own.</li>
            </ul>

            <a
              href="#contact"
              className="block w-full rounded-full bg-accent text-white px-8 py-4 text-base font-medium hover:bg-accent-hover transition-colors text-center"
            >
              Get Started
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
