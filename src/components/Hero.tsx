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
            We&apos;ll build an AI agent that does it 24/7.
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-4">
            You describe the work that&apos;s eating your time — forecasting,
            reorders, creative briefs, customer replies, whatever it is.
            Our team configures a custom AI agent that handles it around
            the clock, so you never have to think about it again.
          </p>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-10">
            No templates. No DIY setup. Just a working agent, built for your business.
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
