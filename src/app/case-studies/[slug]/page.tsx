import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { caseStudies, getCaseStudy } from "../data";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) return {};

  return {
    title: `${cs.title} | Case Study`,
    description: cs.subtitle,
    openGraph: {
      title: `${cs.title} | Assist Case Study`,
      description: cs.subtitle,
    },
  };
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cs = getCaseStudy(slug);
  if (!cs) notFound();

  return (
    <>
      <Nav />
      <main id="main" className="pt-24 pb-24 md:pt-32 md:pb-32">
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 mb-16 md:mb-24">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground transition-colors mb-8"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className="rotate-180"
            >
              <path
                d="M5 12h14m-6-6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            All Case Studies
          </Link>
          <p className="text-sm uppercase tracking-[0.15em] text-accent font-medium mb-4">
            {cs.category}
          </p>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
            {cs.title}
          </h1>
          <p className="text-muted text-xl leading-relaxed max-w-3xl">
            {cs.subtitle}
          </p>
        </section>

        {/* Hero image */}
        {cs.heroImage && (
          <section className="mx-auto max-w-6xl px-6 mb-16 md:mb-24">
            <div className="rounded-2xl bg-surface p-12 md:p-20 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cs.heroImage}
                alt={cs.title}
                className="max-h-32 md:max-h-40 object-contain"
              />
            </div>
          </section>
        )}

        {/* Metrics bar */}
        <section className="mx-auto max-w-6xl px-6 mb-16 md:mb-24">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {cs.results.metrics.map((m) => (
              <div
                key={m.label}
                className="rounded-2xl bg-surface p-6 md:p-8 text-center"
              >
                <p className="font-display text-3xl text-accent mb-1">
                  {m.value}
                </p>
                <p className="text-muted text-sm">{m.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Challenge */}
        <section className="mx-auto max-w-6xl px-6 mb-16 md:mb-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4">
              The Challenge
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-8">
              {cs.challenge.summary}
            </p>
            <ul className="space-y-4">
              {cs.challenge.details.map((detail, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 text-base text-muted"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-foreground/6 flex items-center justify-center mt-0.5">
                    <span className="block w-2 h-2 rounded-full bg-foreground/25" />
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Solution */}
        <section className="mx-auto max-w-6xl px-6 mb-16 md:mb-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4">
              What We Set Up
            </h2>
            <p className="text-muted text-lg leading-relaxed mb-8">
              {cs.solution.summary}
            </p>
            <ul className="space-y-4">
              {cs.solution.details.map((detail, i) => (
                <li
                  key={i}
                  className="flex items-start gap-4 text-base text-foreground"
                >
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/12 flex items-center justify-center mt-0.5">
                    <span className="block w-2 h-2 rounded-full bg-accent" />
                  </span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Results */}
        <section className="mx-auto max-w-6xl px-6 mb-16 md:mb-24">
          <div className="max-w-3xl">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4">
              The Results
            </h2>
            <p className="text-muted text-lg leading-relaxed">
              {cs.results.summary}
            </p>
          </div>
        </section>

        {/* Quote */}
        {cs.quote && (
          <section className="mx-auto max-w-6xl px-6 mb-16 md:mb-24">
            <div className="rounded-2xl bg-surface p-10 md:p-16 max-w-3xl">
              <blockquote className="font-display text-xl md:text-2xl leading-relaxed mb-6 text-foreground">
                &ldquo;{cs.quote.text}&rdquo;
              </blockquote>
              <p className="text-sm text-muted">{cs.quote.attribution}</p>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl bg-foreground text-background p-10 md:p-16 text-center">
            <h2 className="font-display text-2xl md:text-3xl tracking-tight mb-4">
              Facing a similar challenge?
            </h2>
            <p className="text-background/60 text-lg mb-8 max-w-lg mx-auto">
              We&apos;d love to hear about it. Every situation is different,
              and that&apos;s exactly the point.
            </p>
            <a
              href="/#contact"
              className="inline-block rounded-full bg-accent text-white px-8 py-4 text-base font-medium hover:bg-accent-hover transition-colors"
            >
              Book a Consultation
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
