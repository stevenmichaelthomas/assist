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
    default: "Assist | AI Setup for Individuals, Businesses, and Organizations",
    template: "%s | Assist",
  },
  description:
    "Hands-on AI setup and implementation consulting for individuals, businesses, and organizations. We get you running with the right tools and keep everything working.",
  keywords: [
    "AI consulting",
    "productivity consulting",
    "workflow automation",
    "business automation",
    "technology setup",
    "digital transformation",
    "operations consulting",
    "small business technology",
    "team productivity",
    "modern tools consulting",
  ],
  authors: [{ name: "Assist" }],
  creator: "Assist",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Assist",
    title: "Assist — AI Setup for Individuals, Businesses, and Organizations",
    description:
      "Hands-on AI setup and implementation consulting for individuals, businesses, and organizations.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assist — AI Setup for Individuals, Businesses, and Organizations",
    description:
      "Hands-on AI setup and implementation consulting for individuals, businesses, and organizations.",
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
      "Hands-on AI setup and implementation consulting for individuals, businesses, and organizations.",
    email: "steve@supermagicapps.com",
    foundingDate: "2024",
    sameAs: [],
  };

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Assist — Technology Consulting",
    provider: {
      "@type": "Organization",
      name: "Assist",
    },
    description:
      "Hands-on AI setup and implementation consulting. We assess your needs, configure the right tools, and provide ongoing support.",
    offers: [
      {
        "@type": "Offer",
        name: "Setup",
        price: "2000",
        priceCurrency: "USD",
        description:
          "Full assessment, tool configuration, workflow setup, and training",
      },
      {
        "@type": "Offer",
        name: "Monthly Support",
        price: "500",
        priceCurrency: "USD",
        description:
          "Ongoing optimization, support, and new capabilities",
      },
    ],
    areaServed: "US",
    serviceType: "Technology Consulting",
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
