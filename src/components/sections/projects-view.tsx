"use client";

import { useCallback, useEffect, useState } from "react";
import "@/components/projects.css";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AdminPanel } from "@/components/sections/admin-panel";

type Project = { slug: string; title: string; description: string; price: number; createdAt: number };

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export function ProjectsView() {
  const [items, setItems] = useState<Project[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [buying, setBuying] = useState<Project | null>(null);
  const [owner, setOwner] = useState(false);
  const [buyMsg, setBuyMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(() => {
    fetch("/api/projects")
      .then((r) => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setItems)
      .catch(() => setFailed(true));
  }, []);
  useEffect(() => { load(); }, [load]);
  useEffect(() => { setBuyMsg(null); setSending(false); }, [buying]);

  async function submitBuy(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setBuyMsg({ ok: false, t: "Please enter a valid email address." });
    setSending(true); setBuyMsg(null);
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      setBuyMsg({ ok: true, t: "Thank you! Your buy request was sent. We will contact you soon." });
      form.reset();
      setTimeout(() => setBuying(null), 3000);
    } catch {
      setBuyMsg({ ok: false, t: "Sorry, it could not be sent. Please try again in a moment." });
    }
    setSending(false);
  }

  return (
    <div className="pw-pg">
      <div className="top">
        <a href="/" className="pw-back">← Back to portfolio</a>
        <a href="/" className="pw-logo-text" aria-label="PrismWeb Labs">
          &nbsp;PrismWeb&nbsp;
          <span aria-hidden="true" className="hover-text">&nbsp;PrismWeb&nbsp;</span>
        </a>
      </div>

      <Breadcrumbs items={[{ name: "Projects", href: "/projects" }]} />
      <h1>Our <span className="text-gradient">Projects</span></h1>
      <p className="lead">Live websites made by our team. Open a demo in a new tab to try it, then buy the one you want.</p>

      {failed && <div className="pw-msg">Projects could not be loaded right now. Please try again later.</div>}
      {!failed && items === null && <div className="pw-msg">Loading…</div>}
      {items && items.length === 0 && <div className="pw-msg">New projects are coming soon.</div>}

      {items && items.length > 0 && (
        <div className="pw-grid">
          {items.map((p) => (
            <article key={p.slug} className="pw-pcard">
              <h3>{p.title}</h3>
              <p>{p.description || "A ready-made website by PrismWeb Labs."}</p>
              <div className="pw-price">{p.price ? inr(p.price) : "Ask for price"}</div>
              <div className="pw-row">
                <a href={`/p/${p.slug}/`} target="_blank" rel="noopener noreferrer" className="pw-rip"><i /><i />Open live demo ↗</a>
              </div>
              <div className="pw-row">
                <button type="button" className="pw-buy" onClick={() => setBuying(p)}>
                  <span data-t="Buy now">Buy now</span>
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <div style={{ maxWidth: 1040, margin: "48px auto 0", textAlign: "center" }}>
        <button type="button" className="pw-rip" onClick={() => setOwner((o) => !o)}>
          <i /><i />{owner ? "Close owner tools" : "Owner login"}
        </button>
      </div>
      {owner && (
        <div className="pw-pcard" style={{ maxWidth: 760, margin: "16px auto 0" }}>
          <h3>Owner tools</h3>
          <p>Only you can add projects and change prices. Visitors can only view.</p>
          <AdminPanel onChanged={load} />
        </div>
      )}

      {buying && (
        <div className="pw-modal" onClick={() => setBuying(null)}>
          <div className="box" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <h2>Buy “{buying.title}”</h2>
            <p className="sub">Price: {buying.price ? inr(buying.price) : "to be discussed"}. Leave your Gmail and we will contact you.</p>
            <form name="buy-request" method="POST" action="/api/contact" onSubmit={submitBuy} noValidate>
              <input type="hidden" name="form-name" value="buy-request" />
              <input type="hidden" name="project" value={buying.title} />
              <input type="hidden" name="price" value={buying.price ? inr(buying.price) : "not set"} />
              <p hidden><label>Do not fill: <input name="bot-field" /></label></p>
              <label className="pw-field">Your name
                <input name="name" required autoComplete="name" />
              </label>
              <label className="pw-field">Your Gmail
                <input name="email" type="email" required autoComplete="email" placeholder="you@gmail.com" />
              </label>
              <label className="pw-field">Message (optional)
                <textarea name="message" rows={3} />
              </label>
              <div className="pw-actions">
                <button type="button" className="pw-ghost" onClick={() => setBuying(null)}>Cancel</button>
                <button type="submit" className="pw-go" disabled={sending}>{sending ? "Sending…" : "Send buy request"}</button>
              </div>
              {buyMsg && <p className={buyMsg.ok ? "pw-ok" : "pw-err"} role="alert">{buyMsg.t}</p>}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
