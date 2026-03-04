import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = "https://getassist.ai"; // Update when domain is finalized

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Assist — AI-Powered Operations for CPG Brands",
    template: "%s | Assist",
  },
  description:
    "Grow revenue and cut costs with managed AI agents for your CPG brand. Customer support, content, sales outreach, and operations — handled 24/7. From the founders of Super Magic Taste and former Shopify growth leaders.",
  keywords: [
    "CPG AI",
    "AI operations",
    "CPG automation",
    "AI agents for ecommerce",
    "Shopify AI",
    "CPG brand operations",
    "AI customer support",
    "managed AI service",
    "ecommerce automation",
    "CPG growth",
  ],
  authors: [{ name: "Assist" }],
  creator: "Assist",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Assist",
    title: "Assist — AI That Grows Your Revenue and Cuts Your Costs",
    description:
      "Managed AI agents for CPG brands. Customer support, content, sales, and ops — handled 24/7 for $500/mo. From the founders of Super Magic Taste.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assist — AI-Powered Operations for CPG Brands",
    description:
      "Managed AI agents for CPG brands. Grow revenue, cut costs, save 10-20 hours/week. Pays for itself in days.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
};

function JsonLd() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Assist",
    url: siteUrl,
    description:
      "Managed AI operations for CPG brands. Built by the founders of Super Magic Taste and former Shopify growth leaders.",
    email: "steve@supermagicapps.com",
    foundingDate: "2024",
    sameAs: [],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Assist — Managed AI Operations",
    provider: {
      "@type": "Organization",
      name: "Assist",
    },
    description:
      "Custom AI agents that handle customer support, content creation, sales outreach, internal ops, research, and growth strategy for CPG brands.",
    offers: [
      {
        "@type": "Offer",
        name: "Setup",
        price: "2000",
        priceCurrency: "USD",
        description:
          "Full operational audit, custom AI agent configuration, and tool integrations",
      },
      {
        "@type": "Offer",
        name: "Monthly Management",
        price: "500",
        priceCurrency: "USD",
        description:
          "Ongoing management, optimization, and new capabilities",
      },
    ],
    areaServed: "US",
    serviceType: "AI Operations Management",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
    </>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
