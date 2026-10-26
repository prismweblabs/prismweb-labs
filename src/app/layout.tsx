import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "@/components/star-pattern.css";
import { SplashLoader } from "@/components/splash-loader";
import { SmoothScroll } from "@/components/smooth-scroll";
import { ConsentAndAnalytics } from "@/components/consent";
import { StickyCta } from "@/components/sticky-cta";
import { site, developers } from "@/data/site";

const description =
  "PrismWeb Labs is a startup of three B.Tech engineers building full-stack websites and launching them for clients.";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: "PrismWeb Labs | Websites designed, built and launched", template: "%s | PrismWeb Labs" },
  description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    siteName: site.name,
    url: "/",
    title: "PrismWeb Labs | Websites designed, built and launched",
    description,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PrismWeb Labs" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PrismWeb Labs | Websites designed, built and launched",
    description,
    images: ["/og-image.png"],
  },
  ...(site.searchConsole ? { verification: { google: site.searchConsole } } : {}),
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#07090d" };

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: site.name,
  url: site.url,
  logo: `${site.url}/icon-512.png`,
  email: site.email,
  description,
  founder: developers.map((d) => ({
    "@type": "Person",
    name: d.name,
    jobTitle: d.role,
    sameAs: [d.instagram, d.linkedin, d.github],
  })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <noscript>
          <style>{`.pw-splash{display:none!important}`}</style>
        </noscript>
        <div className="pw-stars-bg" aria-hidden="true">
          <div className="pw-s1" />
          <div className="pw-s2" />
          <div className="pw-s3" />
        </div>
        <SplashLoader />
        <SmoothScroll />
        {children}
        <StickyCta />
        <ConsentAndAnalytics />
      </body>
    </html>
  );
}
