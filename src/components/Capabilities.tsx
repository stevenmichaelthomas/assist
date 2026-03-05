"use client";

import { useScrollAnimation } from "./useScrollAnimation";


const painPoints = [
  {
    before: "Hours buried in customer emails",
    after: "AI handles support 24/7 — you review a daily summary",
  },
  {
    before: "Scrambling to post content consistently",
    after: "On-brand posts, blogs, and newsletters created daily",
  },
  {
    before: "Cold outreach falling through the cracks",
    after: "Leads discovered, messaged, and followed up automatically",
  },
  {
    before: "Vendor follow-ups, invoicing, scheduling",
    after: "Back-office ops running without you touching them",
  },
  {
    before: "No time to research competitors or trends",
    after: "Market intel and reports delivered to your inbox",
  },
  {
    before: "Growth decisions based on gut feel",
    after: "Data-backed pricing, expansion, and strategy recommendations",
  },
];

export default function Capabilities() {
  const ref = useScrollAnimation();

  return (
    <section id="capabilities" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Your week, before and after Assist
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            We sit down with you to find the work that&apos;s eating your time
            and costing you money — then we set up AI to handle it, together.
            Here&apos;s what changes.
          </p>
        </div>

        {/* Column labels — desktop only */}
        <div className="hidden md:grid grid-cols-[1fr,4rem,1fr] items-center mb-4 px-10">
          <p className="text-xs uppercase tracking-[0.15em] text-muted font-medium">Today</p>
          <div />
          <p className="text-xs uppercase tracking-[0.15em] text-accent font-medium">With Assist</p>
        </div>

        <div ref={ref} className="animate-on-scroll space-y-3">
          {painPoints.map((point, i) => (
            <div
              key={i}
              className="group grid grid-cols-1 md:grid-cols-[1fr,4rem,1fr] items-center gap-5 md:gap-0 rounded-2xl bg-surface p-7 md:px-10 md:py-8 hover:bg-surface/80 transition-all"
            >
              {/* Before */}
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-foreground/6 flex items-center justify-center">
                  <span className="block w-2.5 h-2.5 rounded-full bg-foreground/25" />
                </span>
                <p className="text-muted text-base md:text-lg leading-snug">
                  {point.before}
                </p>
              </div>

              {/* Arrow — desktop */}
              <div className="hidden md:flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-accent">
                  <path d="M5 12h14m-6-6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              {/* Arrow — mobile */}
              <div className="md:hidden flex items-center gap-2 pl-12">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-accent">
                  <path d="M12 5v14m-6-6l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              {/* After */}
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/12 flex items-center justify-center">
                  <span className="block w-2.5 h-2.5 rounded-full bg-accent" />
                </span>
                <p className="text-foreground text-base md:text-lg leading-snug font-medium">
                  {point.after}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="text-muted text-sm mb-6">
            Every setup is different because every business is different.
            We figure out what matters most for yours.
          </p>
          <a
            href="#contact"
            className="inline-block rounded-full border border-foreground/15 px-8 py-4 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            Tell us what&apos;s eating your time
          </a>
        </div>
      </div>
    </section>
  );
}
