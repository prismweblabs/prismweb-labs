import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { site } from "@/data/site";
import { gmailLink } from "@/lib/mail";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How PrismWeb Labs collects, uses and protects your information.",
  alternates: { canonical: "/privacy" },
  openGraph: { title: "Privacy Policy | PrismWeb Labs", url: "/privacy" },
};

const h2 = "mt-10 text-xl font-semibold text-foreground";

export default function Privacy() {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-24 text-muted-foreground">
      <Breadcrumbs items={[{ name: "Privacy Policy", href: "/privacy" }]} />
      <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
      <p className="mt-2 text-sm">Last updated: October 2026</p>

      <p className="mt-6">
        {site.name} (&quot;we&quot;, &quot;us&quot;) respects your privacy. This page explains what information we collect on this website and how we use it.
      </p>

      <h2 className={h2}>Information we collect</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6">
        <li><b>Contact and buy-request forms:</b> your name, email address, website link (optional) and message, and the project you want to buy.</li>
        <li><b>Analytics (only if you accept cookies):</b> anonymous usage data such as pages viewed, device type and approximate location, collected with Google Analytics.</li>
        <li><b>Technical data:</b> our hosting provider may log basic request data (such as IP address and browser type) for security and reliability.</li>
      </ul>

      <h2 className={h2}>How we use it</h2>
      <ul className="mt-3 list-disc space-y-2 pl-6">
        <li>To reply to your messages, send quotes and handle purchase requests.</li>
        <li>To understand how the site is used and improve it.</li>
        <li>To keep the site secure and prevent spam.</li>
      </ul>
      <p className="mt-3">We do not sell your personal information.</p>

      <h2 className={h2}>Cookies</h2>
      <p className="mt-3">
        Essential storage keeps the site working and remembers your cookie choice. Analytics cookies are used only if you click Accept on the cookie banner. You can decline, and you can clear your browser data at any time to reset your choice.
      </p>

      <h2 className={h2}>Services we use</h2>
      <p className="mt-3">
        Your form messages are stored with Cloudflare (our hosting and storage provider) and may be emailed to us through Resend. If you accept analytics, Google Analytics processes usage data. These providers have their own privacy policies.
      </p>

      <h2 className={h2}>How long we keep data</h2>
      <p className="mt-3">We keep messages for as long as needed to respond to you and to keep business records, then delete them.</p>

      <h2 className={h2}>Your choices</h2>
      <p className="mt-3">
        You can ask us to see, correct or delete the information we hold about you by emailing{" "}
        <a href={gmailLink(site.email)} target="_blank" rel="noopener noreferrer" className="text-[#4ade80] underline">{site.email}</a>.
      </p>

      <h2 className={h2}>Changes</h2>
      <p className="mt-3">We may update this policy from time to time. The date at the top shows when it last changed.</p>

      <p className="mt-10">
        <a href="/" className="rounded-full bg-gradient-to-r from-green-400 to-cyan-400 px-6 py-3 text-sm font-bold text-black">Back to home</a>
      </p>
    </main>
  );
}
