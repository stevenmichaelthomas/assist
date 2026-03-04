"use client";

import { useScrollAnimation } from "./useScrollAnimation";

export default function Difference() {
  const ref = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div ref={ref} className="animate-on-scroll mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8">
            We built a CPG brand. We know what&apos;s costing you.
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-6">
            We founded Super Magic Taste and scaled it from zero — dealing with
            every operational headache that comes with running a CPG business.
            The late-night customer emails. The vendor follow-ups. The content
            treadmill. We lived it.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-6">
            Before that, we were leaders in the growth organization at Shopify,
            helping the most ambitious commerce brands in the world scale
            efficiently. We saw firsthand what separates brands that grow from
            brands that stall — and it&apos;s almost always operational leverage.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-12">
            Assist isn&apos;t a generic SaaS tool. It&apos;s the exact playbook we used
            to grow our own brand — automated, managed, and tailored to yours.
            The result: more revenue, lower costs, and hours back in your day.
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
