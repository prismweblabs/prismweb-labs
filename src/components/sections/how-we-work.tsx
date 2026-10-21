"use client";

import { useState } from "react";
import "@/components/how-we-work.css";

const steps = [
  { n: "01", t: "Discuss", d: "We learn about your business, your goals and what you want your website to do.", l: ["Understand your goals", "Agree on pages and features"] },
  { n: "02", t: "Design", d: "We plan the layout and look so the site matches your brand.", l: ["Layout for phone and laptop", "Colours and style that fit you"] },
  { n: "03", t: "Develop", d: "We build the full site: the pages people see and the server behind them.", l: ["Frontend and backend", "Forms and database if needed"] },
  { n: "04", t: "Launch", d: "We test it, put it live on fast hosting, and stay available for updates.", l: ["Tested on phone and laptop", "Live with HTTPS"] },
];

export function HowWeWork() {
  const [show, setShow] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const s = sel === null ? null : steps[sel];

  return (
    <section id="how-we-work" className="pw-hww">
      <h2>How we work</h2>
      <p className="sub">Four simple steps from idea to launch.</p>
      <button
        type="button"
        className="pw-toggle"
        aria-expanded={show}
        aria-controls="pw-hww-body"
        onClick={() => { setShow((v) => !v); if (show) setSel(null); }}
      >
        <span className="t">{show ? "hide it" : "let's go!"}</span>
        <span className="i">
          <svg width="16" height="19" viewBox="0 0 16 19" fill="none" aria-hidden="true">
            {[[1.6,1.6],[5.7,1.6],[5.7,5.6],[9.9,5.6],[9.9,9.5],[14,9.5],[5.7,13.4],[9.9,13.4],[1.6,17.4],[5.7,17.4]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="1.5" fill="black" />
            ))}
          </svg>
        </span>
      </button>

      <div id="pw-hww-body" className={`pw-reveal ${show ? "show" : ""}`} aria-hidden={!show}>
        <div>
          <div className="pw-stage">
            <div className="pw-folder-wrap pw-open">
              <div className="pw-file">
                <div className="pw-w5" />
                {steps.map((st, i) => (
                  <div
                    key={st.n}
                    className={`pw-paper pw-p${i + 1} ${sel === i ? "active" : ""}`}
                    role="button"
                    tabIndex={show ? 0 : -1}
                    onClick={() => setSel(i)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSel(i); } }}
                  >
                    <span>{st.n}</span>{st.t}
                  </div>
                ))}
                <div className="pw-w1">How we work</div>
              </div>
              <div className="pw-hint">Click a file</div>
            </div>
            <div className="pw-panel">
              {s ? (
                <div className="pw-card" key={s.n}>
                  <div className="c">
                    <div className="n">STEP {s.n}</div>
                    <div className="tt">{s.t}</div>
                    <div className="d">{s.d}</div>
                    <ul><li>{s.l[0]}</li><li>{s.l[1]}</li></ul>
                  </div>
                </div>
              ) : (
                <div className="pw-empty">Click one of the four files to see that step here.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
