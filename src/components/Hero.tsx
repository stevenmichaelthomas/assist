export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-6">
            Built by CPG founders &middot; Battle-tested on our own brands
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground mb-8">
            Drowning in ops?
            <br />
            AI can fix that.
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-4">
            You don&apos;t need another tool to learn. You need someone who&apos;s
            already figured it out. Two CPG founders who&apos;ve scaled their own
            brands sit down with you, set up the AI, and make sure it
            keeps delivering — so you can get back to growing.
          </p>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-10">
            No black boxes. No learning curve. Just results.
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
