"use client";

import { useScrollAnimation } from "./useScrollAnimation";

export default function Pricing() {
  const ref = useScrollAnimation();

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Less than the cost of a part-time VA — with 10x the output
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            A single customer support hire costs $3,000–$5,000/month. A content
            agency runs $2,000+. Assist replaces both — and handles sales outreach,
            ops, research, and strategy on top of it.
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
                Full operational audit, custom AI agent configuration, and tool integrations
              </p>
            </div>

            <div className="section-divider mb-8" />

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-5xl">$500</span>
                <span className="text-muted text-sm">/month</span>
              </div>
              <p className="text-muted text-sm">
                Ongoing management, optimization, and new capabilities added continuously
              </p>
            </div>

            <div className="section-divider mb-8" />

            <ul className="text-sm text-muted space-y-2 mb-8">
              <li>No long-term contracts. Cancel anytime.</li>
              <li>Pays for itself within the first week for most brands.</li>
              <li>Replaces $5,000–$10,000+/mo in headcount and agency fees.</li>
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
