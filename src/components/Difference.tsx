"use client";

import { useScrollAnimation } from "./useScrollAnimation";


export default function Difference() {
  const ref = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div ref={ref} className="animate-on-scroll mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8">
            Built on our own brands first.
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-6">
            Late-night customer emails. Vendor follow-ups that slip through
            the cracks. The never-ending content treadmill. Sound familiar?
            That was our life too. So we fixed it.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-6">
            These are the same AI systems running our own CPG operations
            right now. They&apos;re not theoretical — they&apos;re tested on real
            revenue, real customers, and real deadlines. They saved us
            thousands per month and freed up hours every week.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-12">
            Now they&apos;re available to your brand through Assist.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-display text-3xl text-accent mb-1">10&ndash;20hrs</p>
              <p className="text-muted text-sm">Saved per week</p>
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
