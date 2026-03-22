export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20">
      <div className="relative mx-auto max-w-6xl px-6 py-20">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-6">
            AI setup &middot; For people, businesses &amp; teams
          </p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-foreground mb-8">
            AI is transformational.
            <br />
            Setting it up right is the hard part.
          </h1>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-4">
            The potential is massive, but the landscape is overwhelming.
            New tools every week, endless configuration, and no clear
            starting point. We&apos;re a hands-on consultancy that gets you
            set up with the right AI for how you actually work.
          </p>
          <p className="text-lg md:text-xl text-muted leading-relaxed max-w-2xl mb-10">
            Whether you&apos;re an individual looking to boost your
            productivity, a business owner trying to streamline operations,
            or an organization deploying tooling across your
            workforce, we handle the setup so you get the results.
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
