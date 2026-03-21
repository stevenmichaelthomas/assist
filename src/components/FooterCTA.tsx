"use client";

import { useState, FormEvent } from "react";
import { useScrollAnimation } from "./useScrollAnimation";

export default function FooterCTA() {
  const ref = useScrollAnimation();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          brand: data.get("brand"),
          message: data.get("message"),
        }),
      });

      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-24 md:py-32">
      <div ref={ref} className="animate-on-scroll mx-auto max-w-6xl px-6">
        <div className="rounded-3xl bg-foreground text-background p-12 md:p-20 text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Ready to talk?
          </h2>
          <p className="text-background/60 text-lg mb-10 max-w-xl mx-auto">
            No pitch deck. No pressure. Tell us what you&apos;re working on
            and we&apos;ll get back to you personally within 24 hours.
          </p>

          {status === "success" ? (
            <div className="max-w-md mx-auto py-12">
              <p className="text-2xl font-display mb-3">Thank you!</p>
              <p className="text-background/60 text-sm">
                We&apos;ll be in touch within 24 hours to talk about how we
                can help.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
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
                placeholder="Company or role (optional)"
                className="w-full rounded-full bg-background/10 border border-background/20 px-6 py-3.5 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-accent transition-colors"
              />
              <textarea
                name="message"
                placeholder="What are you looking to accomplish?"
                rows={3}
                className="w-full rounded-2xl bg-background/10 border border-background/20 px-6 py-3.5 text-background placeholder:text-background/40 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
              />
              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full rounded-full bg-accent text-white px-8 py-4 text-base font-medium hover:bg-accent-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "submitting" ? "Sending..." : "Book a Consultation"}
              </button>
              {status === "error" && (
                <p className="text-red-400 text-sm">
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}
          {status !== "success" && (
            <p className="text-background/40 text-xs">
              We&apos;ll respond within 24 hours.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
