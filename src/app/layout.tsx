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
    default: "Assist — Technology Consultants for the Modern Era",
    template: "%s | Assist",
  },
  description:
    "Hands-on technology consulting for individuals, teams, and businesses. We help you cut through the noise, set up the right tools, and keep everything running.",
  keywords: [
    "technology consulting",
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
    title: "Assist — Technology Consultants for the Modern Era",
    description:
      "Hands-on technology consulting for individuals, teams, and businesses. We set up the right tools and keep everything running.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Assist — Technology Consultants for the Modern Era",
    description:
      "Hands-on technology consulting for individuals, teams, and businesses. We set up the right tools and keep everything running.",
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
      "Hands-on technology consulting for individuals, teams, and businesses. We help you set up the right tools and keep everything running.",
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
      "Hands-on technology consulting — we assess your needs, configure the right tools, and provide ongoing support to keep you productive.",
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
