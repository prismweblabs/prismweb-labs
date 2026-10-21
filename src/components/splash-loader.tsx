"use client";

import { useEffect, useState } from "react";
import "./loader.css";

/** Square loader shown once per visit while the site "loads". */
export function SplashLoader() {
  const [state, setState] = useState<"show" | "fade" | "gone">("show");

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("pw-splash") === "1";
      sessionStorage.setItem("pw-splash", "1");
    } catch {}
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait = seen || reduced ? 0 : 4000;
    const t1 = setTimeout(() => setState("fade"), wait);
    const t2 = setTimeout(() => setState("gone"), wait + 500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (state === "gone") return null;
  return (
    <div
      className="pw-splash fixed inset-0 z-[100] flex flex-col items-center justify-center gap-24 bg-[#090a0f] transition-opacity duration-500"
      style={{ opacity: state === "fade" ? 0 : 1, pointerEvents: state === "fade" ? "none" : "auto" }}
      aria-hidden="true"
    >
      <div className="pw-stars-bg">
        <div className="pw-s1" />
        <div className="pw-s2" />
        <div className="pw-s3" />
      </div>
      <div className="pw-loader">
        <div className="pw-box1" />
        <div className="pw-box2" />
        <div className="pw-box3" />
      </div>
      <p className="text-xs uppercase tracking-[0.4em] text-muted-foreground">PrismWeb Labs</p>
    </div>
  );
}
