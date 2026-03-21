"use client";

import Link from "next/link";
import { useScrollAnimation } from "./useScrollAnimation";

const studies = [
  {
    slug: "super-magic-taste",
    category: "Business Owner",
    title: "Super Magic Taste",
    subtitle:
      "From drowning in emails to running wholesale operations on autopilot",
    metric: "15+ hrs saved/week",
  },
  {
    slug: "engineering-manager",
    category: "Individual",
    title: "Engineering Manager",
    subtitle:
      "From overwhelmed by context to leading with clarity",
    metric: "3x more strategic time",
  },
];

export default function CaseStudies() {
  const ref = useScrollAnimation();

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            See it in action
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Every engagement is different. Here are a couple of examples.
          </p>
        </div>

        <div ref={ref} className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {studies.map((s) => (
            <Link
              key={s.slug}
              href={`/case-studies/${s.slug}`}
              className="group rounded-2xl bg-surface p-8 md:p-10 flex flex-col hover:bg-surface/80 transition-all"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-accent font-medium mb-4">
                {s.category}
              </p>
              <h3 className="font-display text-xl md:text-2xl mb-3 group-hover:text-accent transition-colors">
                {s.title}
              </h3>
              <p className="text-muted text-base leading-relaxed mb-6 flex-1">
                {s.subtitle}
              </p>
              <p className="text-sm font-medium text-accent">
                {s.metric}
              </p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/case-studies"
            className="inline-block rounded-full border border-foreground/15 px-8 py-4 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            View all case studies
          </Link>
        </div>
      </div>
    </section>
  );
}
