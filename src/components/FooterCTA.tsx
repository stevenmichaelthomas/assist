"use client";

import { useScrollAnimation } from "./useScrollAnimation";

export default function FooterCTA() {
  const ref = useScrollAnimation();

  return (
    <section id="contact" className="py-24 md:py-32">
      <div ref={ref} className="animate-on-scroll mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-foreground text-background p-12 md:p-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Stop spending on headcount.
            <br className="hidden md:block" /> Start growing with AI.
          </h2>
          <p className="text-background/60 text-lg mb-10 max-w-xl mx-auto">
            Most brands recoup their setup cost within the first month. Tell us
            about your business and we&apos;ll show you exactly where Assist
            can drive revenue and cut costs.
          </p>

          {/* Contact Form */}
          <form
            action="https://formspree.io/f/placeholder"
            method="POST"
            className="max-w-md mx-auto space-y-4 mb-6"
          >
            <input
              type="text"
              name="name"
              placeholder="Your name"
              required
              className="w-full rounded-full bg-background/10 border border-background/20 px-6 py-3.5 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <input
              type="email"
              name="email"
              placeholder="Your email"
              required
              className="w-full rounded-full bg-background/10 border border-background/20 px-6 py-3.5 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <input
              type="text"
              name="brand"
              placeholder="Your brand name"
              className="w-full rounded-full bg-background/10 border border-background/20 px-6 py-3.5 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-accent transition-colors"
            />
            <textarea
              name="message"
              placeholder="Tell us about your business..."
              rows={3}
              className="w-full rounded-2xl bg-background/10 border border-background/20 px-6 py-3.5 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
            />
            <button
              type="submit"
              className="w-full rounded-full bg-accent text-white px-8 py-4 text-base font-medium hover:bg-accent-hover transition-colors"
            >
              Get Started
            </button>
          </form>
          <p className="text-background/40 text-xs">
            We&apos;ll respond within 24 hours.
          </p>
        </div>
      </div>
    </section>
  );
}
