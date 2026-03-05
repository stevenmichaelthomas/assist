# Assist

Marketing site and (eventually) product platform for Assist — AI tools built by CPG founders, made available to other brands through hands-on partnership.

**Live:** [assist-one.vercel.app](https://assist-one.vercel.app)

## What's live now

A single-page marketing site with:

- Landing page with hero, before/after capabilities, how-it-works steps, founder story, pricing, and contact form
- Contact form that saves submissions to Neon Postgres and sends email notifications via Resend
- SEO setup: Open Graph image, favicons, structured data (JSON-LD), sitemap, robots.txt
- Scroll animations, responsive design, accessibility (skip-to-content, reduced motion support)
- Auto-deploys from `main` via Vercel + GitHub integration

## Tech stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Neon Serverless Postgres (via Vercel integration)
- **Email:** Resend
- **Hosting:** Vercel
- **Fonts:** Playfair Display + DM Sans (Google Fonts)

## Getting started

```bash
npm install
npm run dev
```

### Environment variables

Set these in Vercel (or `.env.local` for local dev):

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon Postgres connection string (auto-set by Vercel Neon integration) |
| `RESEND_API_KEY` | API key from [resend.com](https://resend.com) |
| `NOTIFICATION_EMAIL` | Email address to receive contact form notifications |

The contact form saves to Postgres regardless of whether Resend is configured. Email notifications are additive.

## Project structure

```
src/
├── app/
│   ├── api/contact/    # POST endpoint for contact form submissions
│   ├── layout.tsx      # Root layout, fonts, SEO metadata, JSON-LD
│   ├── page.tsx        # Home page (assembles all sections)
│   ├── globals.css     # Base styles, scroll animations, grain texture
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── opengraph-image.tsx
│   ├── icon.tsx
│   └── apple-icon.tsx
└── components/
    ├── Nav.tsx             # Fixed nav with mobile hamburger menu
    ├── Hero.tsx            # Hero section
    ├── Capabilities.tsx    # Before/after comparison rows
    ├── HowItWorks.tsx      # 3-step process cards
    ├── Difference.tsx      # Founder story + stats
    ├── Pricing.tsx         # Pricing card
    ├── FooterCTA.tsx       # Contact form
    ├── Footer.tsx
    └── useScrollAnimation.ts   # Intersection Observer scroll hook
```

## Where it's going

### Near-term
- Custom domain ([#1](https://github.com/stevenmichaelthomas/assist/issues/1))
- Calendly integration for Book a Call CTA ([#3](https://github.com/stevenmichaelthomas/assist/issues/3))

### Phase 2 — Product platform
The site will evolve from a marketing page into the actual product platform for Assist clients:

- **Management dashboard** — client-facing portal to see what AI agents are doing ([#6](https://github.com/stevenmichaelthomas/assist/issues/6))
- **Shopify integration** — connect client stores for AI-powered support and ops ([#7](https://github.com/stevenmichaelthomas/assist/issues/7))
- **Gmail integration** — AI email handling and drafting ([#8](https://github.com/stevenmichaelthomas/assist/issues/8))
- **AI agent framework** — orchestration layer for running and managing agents ([#9](https://github.com/stevenmichaelthomas/assist/issues/9))
- **Task management** — daily todos and task tracking for agent workflows ([#10](https://github.com/stevenmichaelthomas/assist/issues/10))
