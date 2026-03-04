import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Capabilities from "@/components/Capabilities";
import HowItWorks from "@/components/HowItWorks";
import Difference from "@/components/Difference";
import Pricing from "@/components/Pricing";
import FAQ from "@/components/FAQ";
import FooterCTA from "@/components/FooterCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-full">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <div className="section-divider" />
        <Capabilities />
        <div className="section-divider" />
        <HowItWorks />
        <Difference />
        <div className="section-divider" />
        <Pricing />
        <FAQ />
        <FooterCTA />
      </main>
      <Footer />
    </>
  );
}
