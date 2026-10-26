"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { site } from "@/data/site";

type Choice = "granted" | "denied" | null;
const KEY = "pw-consent";

/** Cookie banner + Google Analytics (loads only after the visitor accepts). */
export function ConsentAndAnalytics() {
  const [choice, setChoice] = useState<Choice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v === "granted" || v === "denied") setChoice(v);
    } catch {}
    setReady(true);
  }, []);

  function save(v: "granted" | "denied") {
    setChoice(v);
    try { localStorage.setItem(KEY, v); } catch {}
  }

  return (
    <>
      {choice === "granted" && site.gaId && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${site.gaId}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${site.gaId}',{anonymize_ip:true});`}
          </Script>
        </>
      )}
      {ready && choice === null && (
        <div
          role="dialog"
          aria-label="Cookie preferences"
          className="fixed inset-x-4 bottom-20 z-[60] mx-auto max-w-xl rounded-2xl border border-white/10 bg-[#0d1117]/95 p-4 text-sm text-muted-foreground shadow-2xl backdrop-blur md:bottom-4 md:left-4 md:right-auto"
        >
          <p>
            We use optional analytics cookies to understand how the site is used. See our{" "}
            <a href="/privacy" className="text-[#4ade80] underline">Privacy Policy</a>.
          </p>
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={() => save("granted")} className="rounded-full bg-gradient-to-r from-green-400 to-cyan-400 px-5 py-2 text-xs font-bold text-black">
              Accept
            </button>
            <button type="button" onClick={() => save("denied")} className="rounded-full border border-white/20 px-5 py-2 text-xs font-semibold text-white hover:bg-white/5">
              Decline
            </button>
          </div>
        </div>
      )}
    </>
  );
}
