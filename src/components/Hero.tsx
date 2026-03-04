export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      {/* Floating decorative shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-[15%] w-64 h-64 rounded-full bg-accent/5 animate-float" />
        <div className="absolute bottom-32 left-[10%] w-48 h-48 rounded-full bg-sage/5 animate-float [animation-delay:2s]" />
        <div className="absolute top-1/2 right-[8%] w-32 h-32 rounded-full bg-surface animate-float [animation-delay:4s]" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-6">
            From the founders of Super Magic Taste &middot; Former Shopify Growth Leaders
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground mb-8">
            AI that grows your revenue and cuts your costs
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-4">
            Most CPG founders spend 60% of their time on operations that don&apos;t
            directly grow the business. Assist changes that. We deploy custom AI
            agents that handle your support, outreach, content, and ops — so every
            hour goes back to building your brand.
          </p>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-10">
            These are the same systems we used to scale Super Magic Taste, and the
            same growth playbooks we ran at Shopify. Our team sets everything up and
            manages it — you just watch the numbers move.
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
