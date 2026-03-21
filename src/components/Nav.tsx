"use client";

import { useState } from "react";

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <a href="#" className="font-display text-2xl font-bold tracking-tight text-foreground">
          assist
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" className="text-sm text-muted hover:text-foreground transition-colors">
            How It Works
          </a>
          <a href="#capabilities" className="text-sm text-muted hover:text-foreground transition-colors">
            Who We Help
          </a>
          <a href="#pricing" className="text-sm text-muted hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="/case-studies" className="text-sm text-muted hover:text-foreground transition-colors">
            Case Studies
          </a>
          <a
            href="#contact"
            className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:bg-foreground/90 transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-opacity ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block h-0.5 w-5 bg-foreground transition-transform ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-surface px-6 py-6 flex flex-col gap-4 bg-background">
          <a href="#how-it-works" onClick={() => setMenuOpen(false)} className="text-sm text-muted hover:text-foreground">
            How It Works
          </a>
          <a href="#capabilities" onClick={() => setMenuOpen(false)} className="text-sm text-muted hover:text-foreground">
            Who We Help
          </a>
          <a href="#pricing" onClick={() => setMenuOpen(false)} className="text-sm text-muted hover:text-foreground">
            Pricing
          </a>
          <a href="/case-studies" onClick={() => setMenuOpen(false)} className="text-sm text-muted hover:text-foreground">
            Case Studies
          </a>
          <a
            href="#contact"
            onClick={() => setMenuOpen(false)}
            className="rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium text-center"
          >
            Get Started
          </a>
        </div>
      )}
    </nav>
  );
}
