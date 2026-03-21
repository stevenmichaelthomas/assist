import { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { caseStudies } from "./data";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "See how Assist has helped individuals and businesses get set up with the right technology, and the real results they're seeing.",
  openGraph: {
    title: "Case Studies | Assist",
    description:
      "Real stories from individuals and businesses we've helped get set up and running.",
  },
};

export default function CaseStudiesPage() {
  return (
    <>
      <Nav />
      <main id="main" className="pt-24 pb-24 md:pt-32 md:pb-32">
        <div className="mx-auto max-w-6xl px-6">
          <div className="max-w-2xl mb-16">
            <p className="text-sm uppercase tracking-[0.2em] text-accent font-medium mb-6">
              Case Studies
            </p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl tracking-tight mb-6">
              Real people. Real results.
            </h1>
            <p className="text-muted text-lg leading-relaxed">
              Every engagement is different. Here&apos;s a look at how
              we&apos;ve helped people cut through the noise and get
              technology working for them.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {caseStudies.map((cs) => (
              <Link
                key={cs.slug}
                href={`/case-studies/${cs.slug}`}
                className="group rounded-2xl bg-surface p-8 md:p-10 flex flex-col hover:bg-surface/80 transition-all"
              >
                <p className="text-xs uppercase tracking-[0.15em] text-accent font-medium mb-4">
                  {cs.category}
                </p>
                <h2 className="font-display text-2xl md:text-3xl mb-3 group-hover:text-accent transition-colors">
                  {cs.title}
                </h2>
                <p className="text-muted text-base leading-relaxed mb-6 flex-1">
                  {cs.subtitle}
                </p>
                <div className="flex items-center gap-3">
                  <div className="grid grid-cols-3 gap-4 w-full">
                    {cs.results.metrics.map((m) => (
                      <div key={m.label}>
                        <p className="font-display text-lg text-accent">
                          {m.value}
                        </p>
                        <p className="text-xs text-muted">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
