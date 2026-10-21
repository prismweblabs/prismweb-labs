"use client";

import { useEffect, useRef } from "react";
import { clamp, easeOutCubic, lerp, pinProgress, range } from "@/lib/math";
import { onFrame } from "@/lib/scroll";

/**
 * Scroll-driven parallax intro adapted from the "Selene / Earthrise" reference.
 * Six image layers are pinned and each moves at its own rate as you scroll.
 */
const STAGE_VH = 320;

type LayerName = "sky" | "earth" | "moonscape" | "frame" | "astronaut" | "ground";
const ORDER: LayerName[] = ["sky", "earth", "moonscape", "frame", "astronaut", "ground"];
const FIT = "absolute inset-0 size-full object-cover object-[58%_50%] md:object-center";

export function LaunchScroll() {
  const rootRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<Partial<Record<LayerName, HTMLDivElement>>>({});
  const titleRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    let lastP = -1;
    const set = (name: LayerName, y: number, scale = 1, opacity = 1) => {
      const el = layerRefs.current[name];
      if (!el) return;
      el.style.transform = `translate3d(0, ${y}vh, 0) scale(${scale})`;
      el.style.opacity = String(opacity);
    };

    return onFrame(() => {
      const root = rootRef.current;
      if (!root) return;
      const { p, rect } = pinProgress(root);
      if (rect.bottom < 0) return;
      if (Math.abs(p - lastP) < 0.00005) return;
      lastP = p;

      const exit = range(p, 0.7, 1);
      const settle = easeOutCubic(range(p, 0, 0.5));
      set("sky", lerp(0, -6, p), lerp(1.14, 1, settle));
      const rise = easeOutCubic(range(p, 0.04, 0.5));
      set("earth", lerp(34, 0, rise) - exit * 12, lerp(0.92, 1, rise));
      set("moonscape", lerp(9, 0, settle) - exit * 26);
      const rim = easeOutCubic(range(p, 0.28, 0.58));
      set("frame", -exit * 44, lerp(1.6, 1, rim), rim);
      const up = easeOutCubic(range(p, 0.36, 0.62));
      set("astronaut", lerp(28, 0, up) - exit * 58, 1, clamp(up * 2));
      const ground = easeOutCubic(range(p, 0.34, 0.6));
      set("ground", lerp(36, 0, ground) - exit * 78);

      const tIn = easeOutCubic(range(p, 0.05, 0.22));
      const tOut = range(p, 0.42, 0.52);
      const title = titleRef.current!;
      title.style.opacity = String(tIn * (1 - tOut));
      title.style.letterSpacing = `${lerp(0.6, 0.24, tIn)}em`;
      title.style.transform = `translate3d(0, ${-p * 6}vh, 0)`;
      title.style.filter = tIn < 0.99 ? `blur(${(1 - tIn) * 10}px)` : "";
      if (hintRef.current) hintRef.current.style.opacity = String(1 - range(p, 0.45, 0.6));
    });
  }, []);

  const layer = (name: LayerName) => (
    <div
      key={name}
      ref={(el) => {
        if (el) layerRefs.current[name] = el;
      }}
      className="absolute inset-0 will-change-transform"
    >
      <picture>
        <source media="(max-width: 767px)" srcSet={`/layers/m/${name}.webp`} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`/layers/d/${name}.webp`} alt="" aria-hidden="true" className={FIT} decoding="async" />
      </picture>
      {name === "ground" && <div className="absolute inset-x-0 top-full h-[110vh] bg-background" />}
    </div>
  );

  return (
    <section ref={rootRef} aria-label="Launch" className="relative" style={{ height: `${STAGE_VH}svh` }}>
      <div
        className="sticky top-0 h-screen overflow-hidden"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, transparent 0, black 22vh)",
          maskImage: "linear-gradient(to bottom, transparent 0, black 22vh)",
        }}
      >
        {ORDER.slice(0, 3).map(layer)}
        <div
          ref={titleRef}
          className="pointer-events-none absolute inset-x-0 top-[24%] px-4 text-center md:top-[28%]"
          style={{ opacity: 0 }}
        >
          <h2 className="text-4xl font-bold uppercase text-white [text-shadow:0_4px_40px_rgb(0_0_0/0.5)] md:text-7xl" style={{ marginRight: "-0.24em" }}>
            Launch
          </h2>
          <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/70">Your idea. A live website.</p>
        </div>
        {ORDER.slice(3).map(layer)}
        <p ref={hintRef} className="pointer-events-none absolute bottom-6 left-0 right-0 text-center text-[0.65rem] uppercase tracking-[0.3em] text-white/50">
          Scroll ↓
        </p>
      </div>
    </section>
  );
}
