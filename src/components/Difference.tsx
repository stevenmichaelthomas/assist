"use client";

import { useScrollAnimation } from "./useScrollAnimation";


export default function Difference() {
  const ref = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div ref={ref} className="animate-on-scroll mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8">
            We built these tools for ourselves first.
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-6">
            We&apos;ve built and scaled CPG businesses of our own — dealing with
            every operational headache along the way. The late-night customer
            emails. The vendor follow-ups. The content treadmill. We lived it
            all, and we spent years finding the AI tools that actually fix it.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-6">
            These aren&apos;t theoretical solutions. They&apos;re the same systems
            we use to run our own brands — the ones that cut our costs,
            freed up our time, and let us focus on growth instead of
            busywork. They work because we&apos;ve pressure-tested them
            on real revenue and real operations.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-12">
            Assist is how we make those tools available to you. Not as
            a product we hand off — as a partnership where we work side
            by side with you to set everything up, make sure it fits your
            business, and keep it delivering results.
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
