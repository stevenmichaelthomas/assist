"use client";

import { useScrollAnimation } from "./useScrollAnimation";

const audiences = [
  {
    label: "Individuals",
    headline: "Get more done without the learning curve",
    description:
      "You know the tools are out there, but every week there's something new. We help you find and configure the right ones for how you actually work, so you spend less time figuring it out and more time getting things done.",
    examples: [
      "Personal productivity setup",
      "Writing and research workflows",
      "Email and calendar automation",
      "Custom tools for your side project or creative work",
    ],
  },
  {
    label: "Organizations",
    headline: "Deploy the right tools across your team",
    description:
      "Rolling out new technology across a workforce is a project in itself. We help you choose, configure, and deploy the right stack, with training and support so your team actually adopts it.",
    examples: [
      "Company-wide tooling strategy",
      "Team onboarding and training",
      "Workflow automation across departments",
      "Security and compliance guidance",
    ],
  },
  {
    label: "Business Owners",
    headline: "Streamline operations without hiring",
    description:
      "You're wearing every hat. We audit your operations, identify what can be automated or simplified, and set it all up so you can focus on the work that actually grows the business.",
    examples: [
      "Operations audit and automation",
      "Customer communication workflows",
      "Invoicing, scheduling, and admin tasks",
      "Sales and marketing tooling",
    ],
  },
];

export default function Capabilities() {
  const ref = useScrollAnimation();

  return (
    <section id="capabilities" className="py-24 md:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6">
            Who we help
          </h2>
          <p className="text-muted text-lg leading-relaxed">
            The technology is transformational. The challenge is knowing how
            to make it work for your specific situation. That&apos;s where we
            come in.
          </p>
        </div>

        <div ref={ref} className="animate-on-scroll grid grid-cols-1 md:grid-cols-3 gap-6">
          {audiences.map((audience) => (
            <div
              key={audience.label}
              className="group rounded-2xl bg-surface p-8 md:p-10 flex flex-col"
            >
              <p className="text-xs uppercase tracking-[0.15em] text-accent font-medium mb-4">
                {audience.label}
              </p>
              <h3 className="font-display text-xl md:text-2xl mb-4 leading-snug">
                {audience.headline}
              </h3>
              <p className="text-muted text-base leading-relaxed mb-6 flex-1">
                {audience.description}
              </p>
              <ul className="space-y-2">
                {audience.examples.map((example) => (
                  <li key={example} className="flex items-start gap-3 text-sm text-muted">
                    <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-accent mt-1.5" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <a
            href="#contact"
            className="inline-block rounded-full border border-foreground/15 px-8 py-4 text-sm font-medium text-foreground hover:bg-surface transition-colors"
          >
            Tell us what you&apos;re working with
          </a>
        </div>
      </div>
    </section>
  );
}
