export interface CaseStudy {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  heroImage?: string;
  challenge: {
    summary: string;
    details: string[];
  };
  solution: {
    summary: string;
    details: string[];
  };
  results: {
    summary: string;
    metrics: { label: string; value: string }[];
  };
  quote?: {
    text: string;
    attribution: string;
  };
}

export const caseStudies: CaseStudy[] = [
  {
    slug: "super-magic-taste",
    title: "Super Magic Taste",
    subtitle:
      "From drowning in emails to running wholesale operations on autopilot",
    category: "Business Owner",
    heroImage: "https://supermagictaste.com/cdn/shop/files/super-magic-taste-logo.png",
    challenge: {
      summary:
        "A growing specialty food brand buried under the operational weight of wholesale.",
      details: [
        "Hundreds of emails per week across ordering, production scheduling, fulfillment, and wholesale customer communication",
        "Orders slipping through the cracks — no single view of what needed to happen each day",
        "Hours spent manually entering wholesale orders into Shopify",
        "No time to analyze sales trends or explore growth opportunities",
        "The founder was spending more time on operations than on the product",
      ],
    },
    solution: {
      summary:
        "We set up a system that turns daily chaos into a clear, actionable workflow.",
      details: [
        "Crystal clear daily briefings — every morning starts with a summary of what needs attention: open orders, pending responses, production deadlines, and fulfillment status",
        "Drafted email responses ready for review — incoming wholesale inquiries, order confirmations, and vendor follow-ups are pre-written and waiting for a quick review before sending",
        "One-click wholesale order submission — verified orders go straight into Shopify without manual data entry",
        "Automated email responses — routine communications handled instantly after simple approval",
        "Sales intelligence — ongoing analysis of sales data and trends to surface new growth opportunities, seasonal patterns, and underperforming products",
      ],
    },
    results: {
      summary:
        "The founder went from reactive firefighting to proactive business building.",
      metrics: [
        { label: "Hours saved per week", value: "15+" },
        { label: "Order processing time", value: "90% faster" },
        { label: "Missed communications", value: "Near zero" },
      ],
    },
    quote: {
      text: "I went from dreading my inbox to actually having time to think about growing the business. The daily briefing alone changed everything.",
      attribution: "Founder, Super Magic Taste",
    },
  },
  {
    slug: "engineering-manager",
    title: "Engineering Manager",
    subtitle:
      "From overwhelmed by context to leading with clarity",
    category: "Individual",
    challenge: {
      summary:
        "An engineering manager with a team of 12, struggling to stay on top of everything.",
      details: [
        "Twelve direct reports meant a constant stream of 1:1s — each requiring context on different projects, blockers, and team dynamics",
        "Drowning in context — pull requests, Slack threads, standups, sprint boards, and incident reports across multiple workstreams",
        "No time for the strategic work that actually mattered — architectural decisions, team growth, and cross-functional planning kept getting pushed",
        "1:1s felt reactive instead of valuable — often scrambling to remember what each person was working on",
      ],
    },
    solution: {
      summary:
        "We consulted on and set up a personal workflow that brought clarity to every interaction.",
      details: [
        "Pre-built 1:1 briefs — before every meeting, a clear summary of what each report has been working on, recent contributions, open blockers, and relevant team context",
        "Actionable feedback ready to go — specific, evidence-based talking points so every 1:1 is productive and meaningful",
        "Team pulse at a glance — a daily digest of what's happening across all 12 reports without needing to read every Slack thread or PR",
        "Time reclaimed for strategy — with the operational overhead reduced, the manager could focus on broader investments, architecture decisions, and setting the team up for long-term success",
      ],
    },
    results: {
      summary:
        "Better 1:1s, better strategy, and a team that felt more supported.",
      metrics: [
        { label: "1:1 prep time", value: "10 min → 2 min" },
        { label: "Strategic work time", value: "3x increase" },
        { label: "Team satisfaction", value: "Measurably improved" },
      ],
    },
    quote: {
      text: "I finally feel like I know what's going on. My 1:1s are better, my decisions are better, and I have time to actually think about where the team is headed.",
      attribution: "Engineering Manager, Series B startup",
    },
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
