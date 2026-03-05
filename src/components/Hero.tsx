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
            We work side by side with you to make AI actually work
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-4">
            AI can grow your revenue and cut your costs — but only if it&apos;s set up
            right. That&apos;s where we come in. We&apos;re founders who&apos;ve built and
            scaled a CPG brand ourselves, and we sit down with you to figure out
            exactly where AI fits into your business.
          </p>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-10">
            No black boxes. No &ldquo;set it and forget it.&rdquo; We walk you through
            every step, build your AI systems together, and stay with you to make
            sure they&apos;re actually driving results. Think of us as your AI
            co-pilots — not another vendor.
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
            Hands-on from day one. Most brands see ROI within the first week.
          </p>
        </div>
      </div>
    </section>
  );
}
