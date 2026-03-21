"use client";

import { useScrollAnimation } from "./useScrollAnimation";

export default function Difference() {
  const ref = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div ref={ref} className="animate-on-scroll mx-auto max-w-6xl px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-8">
            We don&apos;t just recommend tools.
            <br />
            We set them up and make them work.
          </h2>
          <p className="text-muted text-lg leading-relaxed mb-6">
            Most consultants hand you a slide deck and wish you luck. We
            sit down with you, get our hands dirty, and build the thing.
            Configuration, integrations, training. The whole picture, not
            just the advice.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-6">
            The landscape moves fast. New tools appear every week, and
            what worked six months ago might already be outdated. We stay
            on top of it so you don&apos;t have to, and we only recommend
            what we&apos;ve tested ourselves.
          </p>
          <p className="text-muted text-lg leading-relaxed mb-12">
            Our job is to make the technology disappear into your workflow
            so you can focus on what you do best.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            <div>
              <p className="font-display text-3xl text-accent mb-1">10&ndash;20hrs</p>
              <p className="text-muted text-sm">Saved per week, on average</p>
            </div>
            <div>
              <p className="font-display text-3xl text-accent mb-1">&lt; 7 days</p>
              <p className="text-muted text-sm">To see real results</p>
            </div>
            <div>
              <p className="font-display text-3xl text-accent mb-1">100%</p>
              <p className="text-muted text-sm">Hands-on. We do the setup.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
