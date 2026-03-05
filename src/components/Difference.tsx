"use client";

import { useScrollAnimation } from "./useScrollAnimation";

export default function Difference() {
  const ref = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div ref={ref} className="animate-on-scroll mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8">
            We&apos;ve been in your shoes. Now we&apos;re here to help.
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-6">
            We founded Super Magic Taste and scaled it from zero — dealing with
            every operational headache that comes with running a CPG business.
            The late-night customer emails. The vendor follow-ups. The content
            treadmill. We lived it, and we figured out how to use AI to fix it.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-6">
            Before that, we were leaders in the growth organization at Shopify,
            helping the most ambitious commerce brands in the world scale.
            We&apos;ve seen what works and what doesn&apos;t — and we bring that
            experience directly to every brand we work with.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-12">
            Assist isn&apos;t a tool we hand you. It&apos;s a partnership. We work
            side by side with you to set up AI that actually fits your
            business — then we stick around to make sure it keeps delivering.
            More revenue, lower costs, and a team that truly has your back.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-display text-3xl text-accent mb-1">10&ndash;20hrs</p>
              <p className="text-muted text-sm">Saved per week on ops</p>
            </div>
            <div>
              <p className="font-display text-3xl text-accent mb-1">&lt; 7 days</p>
              <p className="text-muted text-sm">To positive ROI</p>
            </div>
            <div>
              <p className="font-display text-3xl text-accent mb-1">$0</p>
              <p className="text-muted text-sm">New hires needed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
