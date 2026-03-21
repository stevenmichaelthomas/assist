"use client";

import { useScrollAnimation } from "./useScrollAnimation";

export default function Pricing() {
  const ref = useScrollAnimation();

  return (
    <section id="pricing" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Simple pricing. No surprises.
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            Whether you&apos;re on your own or running a business, we have
            a straightforward plan that gets you up and running fast.
          </p>
        </div>

        <div ref={ref} className="animate-on-scroll grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Individuals & Businesses */}
          <div className="rounded-3xl bg-surface border border-foreground/5 p-10 md:p-12 flex flex-col">
            <p className="text-xs uppercase tracking-[0.15em] text-accent font-medium mb-6">
              For Individuals &amp; Businesses
            </p>

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-5xl">$2,000</span>
                <span className="text-muted text-sm">one-time setup</span>
              </div>
              <p className="text-muted text-sm">
                We assess your situation, design the right setup, and build
                it with you. Tools configured, workflows connected, and
                everything ready to go.
              </p>
            </div>

            <div className="section-divider mb-8" />

            <div className="mb-8">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="font-display text-5xl">$500</span>
                <span className="text-muted text-sm">/month</span>
              </div>
              <p className="text-muted text-sm">
                Ongoing optimization, support, and new capabilities as the
                technology evolves. We stay in your corner.
              </p>
            </div>

            <div className="section-divider mb-8" />

            <ul className="text-sm text-muted space-y-2 mb-8 flex-1">
              <li>No long-term contracts. Cancel anytime.</li>
              <li>Most clients see results within the first week.</li>
              <li>Replaces months of trial-and-error on your own.</li>
            </ul>

            <a
              href="#contact"
              className="block w-full rounded-full bg-accent text-white px-8 py-4 text-base font-medium hover:bg-accent-hover transition-colors text-center"
            >
              Get Started
            </a>
          </div>

          {/* Organizations */}
          <div className="rounded-3xl bg-surface border border-foreground/5 p-10 md:p-12 flex flex-col">
            <p className="text-xs uppercase tracking-[0.15em] text-accent font-medium mb-6">
              For Organizations
            </p>

            <div className="mb-8">
              <span className="font-display text-4xl">Custom</span>
              <p className="text-muted text-sm mt-2">
                Deploying across a team or workforce is a different kind of
                project. We&apos;ll scope it together based on your team
                size, tooling needs, and rollout plan.
              </p>
            </div>

            <div className="section-divider mb-8" />

            <ul className="text-sm text-muted space-y-2 mb-8 flex-1">
              <li>Company-wide tooling strategy and deployment</li>
              <li>Team onboarding and hands-on training</li>
              <li>Workflow automation across departments</li>
              <li>Ongoing support and optimization</li>
              <li>Security and compliance guidance</li>
            </ul>

            <a
              href="#contact"
              className="block w-full rounded-full border border-foreground/15 px-8 py-4 text-base font-medium text-foreground hover:bg-foreground hover:text-background transition-colors text-center"
            >
              Contact Us for Pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
