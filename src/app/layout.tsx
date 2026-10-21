import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "@/components/star-pattern.css";
import { SplashLoader } from "@/components/splash-loader";
import { SmoothScroll } from "@/components/smooth-scroll";

export const metadata: Metadata = {
  title: "PrismWeb Labs | Websites designed, built and launched",
  description:
    "PrismWeb Labs is a startup of three B.Tech engineers building full-stack websites and launching them for clients.",
  icons: { icon: "/logo.jpg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} dark h-full antialiased`}>
      <body className="flex min-h-full flex-col">
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
      </body>
    </html>
  );
}
