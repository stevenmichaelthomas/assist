export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-6">
            Technology consultants for the modern era
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground mb-8">
            The tools are here.
            <br />
            The hard part is making them work for you.
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-4">
            New technology is transforming how people work — but knowing
            where to start, what to use, and how to set it up is
            overwhelming. We&apos;re a hands-on consultancy that cuts through
            the noise.
          </p>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-10">
            Whether you&apos;re streamlining a business, leveling up your
            team, or just trying to get more done in a day — we&apos;ll get
            you set up and keep you running.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mb-10">
            <a
              href="#contact"
              className="rounded-full bg-accent text-white px-8 py-4 text-base font-medium hover:bg-accent-hover transition-colors text-center"
            >
              Book a Consultation
            </a>
            <a
              href="#how-it-works"
              className="rounded-full border border-foreground/15 px-8 py-4 text-base font-medium text-foreground hover:bg-surface transition-colors text-center"
            >
              See How It Works
            </a>
          </div>
          <p className="text-sm text-muted">
            Most clients are up and running within a week.
          </p>
        </div>
      </div>
    </section>
  );
}
