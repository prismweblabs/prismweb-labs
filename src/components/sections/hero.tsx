"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Check, Layers } from "lucide-react";
import { Galada } from "next/font/google";
import "@/components/hero.css";
import { site } from "@/data/site";

const galada = Galada({ weight: "400", subsets: ["latin"], display: "swap" });

function HexIcon() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,4 91,27 91,73 50,96 9,73 9,27" fill="url(#hxg)" opacity=".9" />
      <polygon points="50,24 73,37 73,63 50,76 27,63 27,37" fill="rgba(255,255,255,.22)" />
    </svg>
  );
}
function PrismIcon() {
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <polygon points="50,6 94,88 6,88" fill="url(#hxg)" opacity=".92" />
      <polygon points="50,6 50,88 6,88" fill="rgba(255,255,255,.2)" />
    </svg>
  );
}

const pillBtn =
  "group relative isolate z-10 flex w-fit items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-gray-50 bg-gray-50 px-4 py-2 text-lg text-gray-900 shadow-xl backdrop-blur-md transition-colors duration-500 before:absolute before:-left-full before:-z-10 before:aspect-square before:w-full before:rounded-full before:bg-emerald-500 before:transition-all before:duration-700 hover:text-gray-50 hover:before:left-0 hover:before:scale-150 lg:font-semibold";
const pillArrow =
  "h-8 w-8 rotate-45 justify-end rounded-full border border-gray-700 p-2 text-gray-50 duration-300 ease-linear group-hover:rotate-90 group-hover:border-none group-hover:bg-gray-50";
const ARROW_PATH =
  "M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z";

function PillArrow() {
  return (
    <svg className={pillArrow} viewBox="0 0 16 19" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d={ARROW_PATH} className="fill-gray-800 group-hover:fill-gray-800" />
    </svg>
  );
}

export function Hero() {
  const [panel, setPanel] = useState<"ready" | "custom">("ready");
  const root = useRef<HTMLElement>(null);
  const planetCanvas = useRef<HTMLCanvasElement>(null);
  const [planet, setPlanet] = useState<"loading" | "on" | "off">("loading");

  // WebGL planet behind the hero (skipped for reduced motion; falls back to the star background)
  useEffect(() => {
    const canvas = planetCanvas.current;
    const host = root.current;
    if (!canvas || !host || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPlanet("off");
      return;
    }
    let stop: (() => void) | undefined;
    let cancelled = false;
    import("@/components/planet-scene")
      .then(({ mountPlanet }) => {
        if (cancelled) return;
        stop = mountPlanet(
          canvas,
          host,
          () => {
            const r = host.getBoundingClientRect();
            return Math.min(1, Math.max(0, -r.top / Math.max(1, r.height))) * 0.35;
          },
          () => setPlanet("on"),
          () => setPlanet("off")
        );
      })
      .catch(() => setPlanet("off"));
    return () => { cancelled = true; stop?.(); };
  }, []);

  return (
    <section id="home" ref={root} className="hx">
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <linearGradient id="hxg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: "var(--hx-a)" }} />
            <stop offset="100%" style={{ stopColor: "var(--hx-b)" }} />
          </linearGradient>
        </defs>
      </svg>
      {planet !== "off" && <canvas ref={planetCanvas} className={`hx-planet ${planet === "on" ? "on" : ""}`} aria-hidden="true" />}
      <div className="hx-glow" aria-hidden="true" />

      <div className="hx-center" aria-hidden="true">
        <div className="hx-logo">
          <div className="hx-hex">
            <div>
              <Image src="/logo.webp" alt="" width={260} height={260} priority />
            </div>
          </div>
        </div>
      </div>

      <div className="hx-content">
        <div className="hx-left">
          <h1 className={`hx-title hx-title-sm ${galada.className}`}>
            <span>Web</span>
            <br />
            <span>Building</span>
            <br />
            <span className="gr">Agency</span>
          </h1>
          <p className="hx-desc">
            {site.tagline} Three B.Tech engineers, one team, from the first sketch to the live website.
          </p>
          <div className="hx-cta">
            <a href="#services" className="hx-btn primary">
              Our services <ArrowUpRight className="h-4 w-4" />
            </a>
            <a href="#contact" className="hx-btn ghost">
              Contact us <span className="hx-plus">+</span>
            </a>
          </div>
          <div className="hx-award">
            <i><Layers className="h-5 w-5" /></i>
            <div>
              <small>FULL-STACK TEAM</small>
              <b>DESIGN · BUILD · LAUNCH</b>
            </div>
          </div>
        </div>

        <div className="hx-right">
          <div className="hx-carousel">
            <div className="hx-cards">
              <button
                type="button"
                className={`hx-card ${panel === "ready" ? "active" : ""}`}
                onClick={() => setPanel("ready")}
                aria-pressed={panel === "ready"}
              >
                <span className="ic"><HexIcon /></span>
                <span>Ready-made sites</span>
                <span>Live demos to buy</span>
              </button>
              <button
                type="button"
                className={`hx-card ${panel === "custom" ? "active" : ""}`}
                onClick={() => setPanel("custom")}
                aria-pressed={panel === "custom"}
              >
                <span className="ic"><PrismIcon /></span>
                <span>Custom build</span>
                <span>Made for you</span>
              </button>
            </div>

            {panel === "ready" ? (
              <a href="/projects" className={`${pillBtn} hx-led`}>
                <span className="hx-led-dot" aria-hidden="true" />
                Browse projects
                <PillArrow />
              </a>
            ) : (
              <div className="hx-custom" role="region" aria-label="Custom websites">
                <h3>Need something custom?</h3>
                <p>
                  On request, we build websites to your needs too. Tell us what you want, change anything you like,
                  and choose how many days you need. We take care of everything, fast.
                </p>
                <ul>
                  <li><Check className="h-4 w-4" /> Built around your idea</li>
                  <li><Check className="h-4 w-4" /> Changes made the way you want</li>
                  <li><Check className="h-4 w-4" /> You choose the number of days</li>
                  <li><Check className="h-4 w-4" /> We handle everything, fast</li>
                </ul>
                <a href="#contact" className={pillBtn}>
                  Get a quote
                  <PillArrow />
                </a>
              </div>
            )}
          </div>
          <h2 className={`hx-title ${galada.className}`}>
            <span>Clean</span>
            <br />
            <span className="gr">Code</span>
          </h2>
        </div>
      </div>
    </section>
  );
}
