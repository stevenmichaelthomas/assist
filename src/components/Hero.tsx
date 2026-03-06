export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-6">
            Built by CPG founders &middot; Battle-tested on our own brands
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground mb-8">
            Tell us the job.
            <br />
            We&apos;ll build AI agents that do it 24/7.
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-4">
            Customer support, sales outreach, reorders, invoicing —
            every job that&apos;s eating your time gets its own dedicated AI agent.
            Our team configures each one, connects them to your tools,
            and keeps them delivering so you never think about it again.
          </p>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-10">
            Software in the age of AI is personal. No templates, no one-size-fits-all —
            just a team of agents custom-tailored to your business, your tools, and your way of working.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="#contact"
              className="rounded-full bg-accent text-white px-8 py-4 text-base font-medium hover:bg-accent-hover transition-colors text-center"
            >
              Book a Call
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-foreground/15 px-8 py-4 text-base font-medium text-foreground hover:bg-surface transition-colors text-center"
            >
              See How It Works
            </a>
          </div>
          <p className="text-sm text-muted">
            Most brands see ROI within the first week.
          </p>
        </div>
      </div>
    </section>
  );
}
