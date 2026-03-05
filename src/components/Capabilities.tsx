"use client";

import { useScrollAnimation } from "./useScrollAnimation";

const capabilities = [
  {
    icon: "💬",
    title: "Customer Support",
    description:
      "Instant, accurate responses to emails and support tickets — 24/7. Reduce response times from hours to seconds and keep customers buying.",
  },
  {
    icon: "✍️",
    title: "Content & Social",
    description:
      "On-brand social posts, blog content, and newsletters generated daily. The kind of consistent output that drives organic traffic and repeat purchases.",
  },
  {
    icon: "📈",
    title: "Sales Outreach",
    description:
      "Automated lead discovery, personalized outreach, and meeting booking. Fill your pipeline without hiring a sales team.",
  },
  {
    icon: "⚙️",
    title: "Internal Ops",
    description:
      "Scheduling, invoicing, vendor follow-ups — the invisible work that eats your week. Automated, so you can focus on product and growth.",
  },
  {
    icon: "📊",
    title: "Research & Reporting",
    description:
      "Daily market summaries, competitor tracking, and trend analysis delivered to your inbox. Make faster, better-informed decisions.",
  },
  {
    icon: "🚀",
    title: "Growth Strategy",
    description:
      "Pricing optimization, production planning, and wholesale/D2C expansion recommendations backed by real data — not gut feel.",
  },
];

export default function Capabilities() {
  const ref = useScrollAnimation();

  return (
    <section id="capabilities" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            We help you put AI to work where it matters most
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            We&apos;ll figure out together which of these make sense for your
            business — then set them up, explain how they work, and make sure
            they&apos;re delivering real results.
          </p>
        </div>

        <div ref={ref} className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap) => (
            <div
              key={cap.title}
              className="stagger-child group rounded-2xl bg-surface p-8 hover:bg-surface/80 transition-all hover:-translate-y-1"
            >
              <span className="text-3xl mb-4 block">{cap.icon}</span>
              <h3 className="font-display text-xl mb-3">{cap.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{cap.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
