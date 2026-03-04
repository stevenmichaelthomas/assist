"use client";

import { useState } from "react";
import { useScrollAnimation } from "./useScrollAnimation";

const faqs = [
  {
    question: "What kind of businesses is this for?",
    answer:
      "Assist is built specifically for CPG brands — whether you're a startup finding product-market fit or an established brand looking to scale without scaling headcount. If you sell physical products and want to grow revenue while keeping costs down, we're built for you.",
  },
  {
    question: "How fast will I see results?",
    answer:
      "Most brands are fully set up within 1–2 weeks, and see measurable time savings and cost reduction within the first few days of going live. The AI agents start handling tasks immediately — support responses, content drafts, outreach — so the impact is almost instant.",
  },
  {
    question: "What tools do you integrate with?",
    answer:
      "Shopify, Gmail, Slack, Instagram, TikTok, accounting platforms, and more. If your business runs on it, we can connect to it. We handle all the integration work during setup.",
  },
  {
    question: "How is this different from hiring a VA or agency?",
    answer:
      "A VA handles one role during business hours. An agency handles one function at a premium. Assist covers support, content, outreach, ops, research, and strategy — 24/7 — for a fraction of the cost. And it gets better every day, not every quarter.",
  },
  {
    question: "Is my data secure?",
    answer:
      "Yes. We use enterprise-grade encryption, and your data is never shared or used to train models. We're CPG founders too — we take brand and customer data as seriously as you do.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const ref = useScrollAnimation();

  return (
    <section className="py-24 md:py-32 bg-surface">
      <div className="mx-auto max-w-3xl px-6">
        <h2 className="font-display text-3xl md:text-4xl tracking-tight text-center mb-12">
          Frequently asked questions
        </h2>

        <div ref={ref} className="animate-on-scroll space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="stagger-child">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full text-left p-6 rounded-2xl bg-background hover:bg-background/80 transition-colors"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-medium">{faq.question}</span>
                  <span className={`text-muted text-xl transition-transform ${openIndex === i ? "rotate-45" : ""}`}>
                    +
                  </span>
                </div>
                {openIndex === i && (
                  <p className="mt-4 text-muted text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
