"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowUpRight, Layers } from "lucide-react";
import { Galada } from "next/font/google";
import "@/components/hero.css";
import { site } from "@/data/site";

const galada = Galada({ weight: "400", subsets: ["latin"], display: "swap" });

type Variant = "hex" | "prism" | "orb";
type Shape = { layer: "fg" | "bg"; v: Variant; size: number; top: number; left: number; op: number; dur: number };

// size in px, top/left in %
const SHAPES: Shape[] = [
  { layer: "fg", v: "hex", size: 150, top: 24, left: 30, op: 1, dur: 5 },
  { layer: "fg", v: "prism", size: 90, top: 62, left: 42, op: 1, dur: 7 },
  { layer: "fg", v: "orb", size: 170, top: 28, left: 64, op: 1, dur: 6 },
  { layer: "fg", v: "prism", size: 110, top: 14, left: 48, op: 1, dur: 8 },
  { layer: "fg", v: "hex", size: 100, top: 74, left: 22, op: 1, dur: 5.5 },
  { layer: "fg", v: "orb", size: 130, top: 46, left: 74, op: 1, dur: 6.5 },
  { layer: "bg", v: "hex", size: 70, top: 14, left: 40, op: 0.7, dur: 9 },
  { layer: "bg", v: "prism", size: 64, top: 50, left: 55, op: 0.6, dur: 11 },
  { layer: "bg", v: "orb", size: 70, top: 80, left: 35, op: 0.7, dur: 10 },
];

function ShapeSvg({ v }: { v: Variant }) {
  if (v === "hex")
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <polygon points="50,4 91,27 91,73 50,96 9,73 9,27" fill="url(#hxg)" opacity=".9" />
        <polygon points="50,24 73,37 73,63 50,76 27,63 27,37" fill="rgba(255,255,255,.22)" />
      </svg>
    );
  if (v === "prism")
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true">
        <polygon points="50,6 94,88 6,88" fill="url(#hxg)" opacity=".92" />
        <polygon points="50,6 50,88 6,88" fill="rgba(255,255,255,.2)" />
      </svg>
    );
  return (
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="url(#hxg)" opacity=".9" />
      <ellipse cx="36" cy="32" rx="14" ry="9" fill="rgba(255,255,255,.35)" />
    </svg>
  );
}

const CARDS = [
  { id: "green", title: "Ready-made sites", sub: "Live demos to buy", v: "hex" as Variant, href: "/projects", more: "Browse projects" },
  { id: "blue", title: "Custom build", sub: "Designed for you", v: "prism" as Variant, href: "#contact", more: "Get a quote" },
];

export function Hero() {
  const [theme, setTheme] = useState<"green" | "blue">("green");
  const [bubbles, setBubbles] = useState<{ left: number; size: number; dur: number; delay: number; o: number }[]>([]);
  const root = useRef<HTMLElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  const bg = useRef<HTMLDivElement>(null);
  const logo = useRef<HTMLDivElement>(null);
  const shapeEls = useRef<(HTMLDivElement | null)[]>([]);
  const switchRef = useRef<(() => void) | null>(null);
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

  useEffect(() => {
    setBubbles(
      Array.from({ length: 16 }, () => ({
        left: Math.random() * 100,
        size: 10 + Math.random() * 20,
        dur: 8 + Math.random() * 8,
        delay: -Math.random() * 14,
        o: 0.25 + Math.random() * 0.35,
      }))
    );
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const mouse = { x: 0, y: 0, px: -9999, py: -9999 };
    const cur = { x: 0, y: 0 };
    const spin = { v: 0, target: 0 };
    let switching = false;
    let visible = true;
    let raf = 0;

    const st = SHAPES.map(() => ({
      rx: 0, ry: 0, angle: Math.random() * 360,
      bx: 0, by: 0, s: 1, o: 1, tbx: 0, tby: 0, ts: 1, to: 1,
    }));

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX / window.innerWidth - 0.5;
      mouse.y = e.clientY / window.innerHeight - 0.5;
      mouse.px = e.clientX;
      mouse.py = e.clientY;
    };
    window.addEventListener("pointermove", onMove);

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; });
    if (root.current) io.observe(root.current);

    switchRef.current = () => {
      if (switching || reduce) return;
      switching = true;
      spin.target += 720;
      const host = root.current;
      const hr = host?.getBoundingClientRect();
      st.forEach((s, i) => {
        const el = shapeEls.current[i];
        if (!el || !hr) return;
        // implode toward the center of the hero
        s.tbx = hr.width / 2 - el.offsetLeft - el.offsetWidth / 2;
        s.tby = hr.height / 2 - el.offsetTop - el.offsetHeight / 2;
        s.ts = 0.1; s.to = 0;
      });
      setTimeout(() => {
        st.forEach((s, i) => {
          s.tbx = (Math.random() - 0.5) * 200;
          s.tby = (Math.random() - 0.5) * 200;
          s.ts = 1; s.to = SHAPES[i].op;
        });
      }, 800);
      setTimeout(() => { switching = false; }, 1700);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (!visible || reduce) return;
      const t = Date.now() * 0.001;
      cur.x += (mouse.x - cur.x) * 0.05;
      cur.y += (mouse.y - cur.y) * 0.05;
      spin.v += (spin.target - spin.v) * 0.045;
      const blur = Math.min(12, Math.abs(spin.target - spin.v) / 40);

      if (logo.current) {
        logo.current.style.transform = `rotateY(${cur.x * 40 + spin.v}deg) rotateX(${-cur.y * 24}deg)`;
        logo.current.style.filter = blur > 0.3 ? `blur(${blur}px)` : "none";
      }
      if (fg.current) fg.current.style.transform = `translate(${cur.x * 60}px, ${cur.y * 60}px)`;
      if (bg.current) bg.current.style.transform = `translate(${cur.x * -30}px, ${cur.y * -30}px)`;

      shapeEls.current.forEach((el, i) => {
        if (!el) return;
        const s = st[i];
        const r = el.getBoundingClientRect();
        const dx = mouse.px - (r.left + r.width / 2);
        const dy = mouse.py - (r.top + r.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        let trx = 0, try_ = 0, mult = 1;
        if (!switching && dist < 400) {
          const force = (400 - dist) / 400;
          trx = (dx / dist) * force * -80;
          try_ = (dy / dist) * force * -80;
          mult = 1 + force * 5;
        }
        s.rx += (trx - s.rx) * 0.1;
        s.ry += (try_ - s.ry) * 0.1;
        s.angle += 0.2 * mult;
        s.bx += (s.tbx - s.bx) * 0.09;
        s.by += (s.tby - s.by) * 0.09;
        s.s += (s.ts - s.s) * 0.09;
        s.o += (s.to - s.o) * 0.09;
        const phase = (t + i * 0.7) * ((Math.PI * 2) / SHAPES[i].dur);
        const fy = Math.sin(phase) * 15;
        const fa = Math.cos(phase) * 6;
        el.style.transform = `translate(${s.rx + s.bx}px, ${s.ry + s.by + fy}px) rotate(${s.angle + fa}deg) scale(${s.s})`;
        el.style.opacity = String(Math.max(0, s.o));
      });
    };
    st.forEach((s, i) => { s.o = SHAPES[i].op; s.to = SHAPES[i].op; });
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  const active = CARDS.find((c) => c.id === theme)!;
  const pick = (id: "green" | "blue") => {
    if (id === theme) return;
    setTheme(id);
    switchRef.current?.();
  };

  const renderShapes = (layer: "fg" | "bg") =>
    SHAPES.map((s, i) =>
      s.layer !== layer ? null : (
        <div
          key={i}
          ref={(el) => { shapeEls.current[i] = el; }}
          className="hx-shape"
          style={{ width: s.size, height: s.size, top: `${s.top}%`, left: `${s.left}%`, opacity: s.op }}
        >
          <ShapeSvg v={s.v} />
        </div>
      )
    );

  return (
    <section id="home" ref={root} data-theme={theme} className="hx">
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
      <div className="hx-bubbles" aria-hidden="true">
        {bubbles.map((b, i) => (
          <span
            key={i}
            className="hx-bubble"
            style={{ left: `${b.left}%`, width: b.size, height: b.size, animationDuration: `${b.dur}s`, animationDelay: `${b.delay}s`, "--o": b.o } as React.CSSProperties}
          />
        ))}
      </div>

      <div ref={bg} className="hx-layer bg" aria-hidden="true">{renderShapes("bg")}</div>

      <div className="hx-center" aria-hidden="true">
        <div className="hx-bob">
          <div ref={logo} className="hx-logo">
            <div className="hx-hex">
              <div>
                <Image src="/logo.webp" alt="" width={260} height={260} priority />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="hx-content">
        <div className="hx-left">
          <h1 className={`hx-title ${galada.className}`}>
            <span>Design</span>
            <br />
            <span className="gr">Launch</span>
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
              {CARDS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className={`hx-card ${theme === c.id ? "active" : ""}`}
                  onClick={() => pick(c.id as "green" | "blue")}
                  aria-pressed={theme === c.id}
                >
                  <span className="ic"><ShapeSvg v={c.v} /></span>
                  <span>{c.title}</span>
                  <span>{c.sub}</span>
                </button>
              ))}
            </div>
            <a href={active.href} className="hx-more">{active.more} →</a>
          </div>
          <h2 className={`hx-title ${galada.className}`}>
            <span>Clean</span>
            <br />
            <span className="gr">Code</span>
          </h2>
        </div>
      </div>

      <div ref={fg} className="hx-layer fg" aria-hidden="true">{renderShapes("fg")}</div>
    </section>
  );
}
