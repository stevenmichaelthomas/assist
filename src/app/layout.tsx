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

const siteUrl = "https://assist-one.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Assist — AI-Powered Operations for CPG Brands",
    template: "%s | Assist",
  },
  description:
    "Grow revenue and cut costs with AI tools built by CPG founders and battle-tested on our own brands. We work side by side with you to set up AI that actually works for your business.",
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
    title: "Assist — AI Tools Built by CPG Founders, Made for Yours",
    description:
      "AI tools built and battle-tested on our own CPG brands. We work side by side with you to cut costs and grow revenue.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assist — AI-Powered Operations for CPG Brands",
    description:
      "AI tools built by CPG founders, battle-tested on our own brands. We work with you to grow revenue and cut costs.",
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
      "AI tools built by CPG founders and battle-tested on our own brands. Now available to yours through hands-on partnership.",
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
