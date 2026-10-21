"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import "@/components/projects.css";

type Item = { path: string; file: File };
type Project = { slug: string; title: string; description: string; price: number };

function readEntry(entry: any, base = ""): Promise<Item[]> {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file((file: File) => resolve([{ path: base + entry.name, file }]), () => resolve([]));
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const all: any[] = [];
      const next = () =>
        reader.readEntries(async (batch: any[]) => {
          if (batch.length) { all.push(...batch); next(); return; }
          const nested = await Promise.all(all.map((e) => readEntry(e, base + entry.name + "/")));
          resolve(nested.flat());
        }, () => resolve([]));
      next();
    } else resolve([]);
  });
}

// Remove a shared top folder (my-site/index.html -> index.html) and make sure there is an index.html
function normalise(items: Item[]): Item[] {
  items = items.filter((i) => !/(^|\/)(\.DS_Store|Thumbs\.db|node_modules)(\/|$)/.test(i.path));
  if (items.length && items.every((i) => i.path.includes("/"))) {
    const top = items[0].path.split("/")[0];
    if (items.every((i) => i.path.startsWith(top + "/"))) items = items.map((i) => ({ ...i, path: i.path.slice(top.length + 1) }));
  }
  if (!items.some((i) => i.path === "index.html")) {
    const htmls = items.filter((i) => /\.html?$/i.test(i.path) && !i.path.includes("/"));
    if (htmls.length === 1) items = items.map((i) => (i === htmls[0] ? { ...i, path: "index.html" } : i));
  }
  return items;
}

export function AdminPanel({ onChanged }: { onChanged?: () => void }) {
  const [pw, setPw] = useState("");
  const [authed, setAuthed] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [desc, setDesc] = useState("");
  const [over, setOver] = useState(false);
  const [status, setStatus] = useState<{ t: string; err?: boolean } | null>(null);
  const [busy, setBusy] = useState(false);
  const [list, setList] = useState<Project[]>([]);
  const folderRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const call = useCallback(
    (url: string, init: RequestInit = {}, password = pw) =>
      fetch(url, { ...init, headers: { ...(init.headers || {}), "x-admin-password": password } }),
    [pw]
  );

  const refresh = useCallback(() => {
    fetch("/api/projects").then((r) => r.json()).then(setList).catch(() => {});
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("pw-admin");
      if (saved) { setPw(saved); call("/api/admin/check", {}, saved).then((r) => { if (r.ok) { setAuthed(true); refresh(); } }); }
    } catch {}
  }, [call, refresh]);

  async function login(e: React.FormEvent) {
    e.preventDefault();
    const r = await call("/api/admin/check");
    if (r.ok) { setAuthed(true); try { sessionStorage.setItem("pw-admin", pw); } catch {} refresh(); onChanged?.(); setStatus(null); }
    else setStatus({ t: (await r.json().catch(() => ({ error: "Could not reach the server" }))).error, err: true });
  }

  async function onDrop(e: React.DragEvent) {
    e.preventDefault(); setOver(false);
    const entries = Array.from(e.dataTransfer.items).map((i) => (i as any).webkitGetAsEntry?.()).filter(Boolean);
    const found = (await Promise.all(entries.map((en: any) => readEntry(en)))).flat();
    setItems(normalise(found));
  }
  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const found = Array.from(e.target.files || []).map((f) => ({ path: (f as any).webkitRelativePath || f.name, file: f }));
    setItems(normalise(found));
    e.target.value = "";
  }

  async function publish() {
    if (!title.trim()) return setStatus({ t: "Please type a project title.", err: true });
    if (!items.some((i) => i.path === "index.html")) return setStatus({ t: "No index.html found. The main page must be named index.html.", err: true });
    setBusy(true); setStatus({ t: "Creating project…" });
    try {
      const r = await call("/api/admin/project", { method: "POST", body: JSON.stringify({ title, price, description: desc }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed");
      for (let i = 0; i < items.length; i++) {
        const it = items[i];
        setStatus({ t: `Uploading ${i + 1} / ${items.length}: ${it.path}` });
        const u = await call(`/api/admin/file?slug=${encodeURIComponent(d.slug)}&path=${encodeURIComponent(it.path)}`, { method: "PUT", body: it.file });
        if (!u.ok) throw new Error(`Could not upload ${it.path} (files must be under about 5 MB each)`);
      }
      setStatus({ t: "Done! Your project is live on the Projects page." });
      setItems([]); setTitle(""); setPrice(""); setDesc(""); refresh(); onChanged?.();
    } catch (err: any) { setStatus({ t: err.message || "Upload failed", err: true }); }
    setBusy(false);
  }

  async function remove(p: Project) {
    if (!confirm(`Delete “${p.title}”?`)) return;
    await call(`/api/admin/project?slug=${encodeURIComponent(p.slug)}`, { method: "DELETE" });
    refresh(); onChanged?.();
  }

  async function savePrice(p: Project, v: string) {
    const n = Number(v.replace(/[^0-9]/g, ""));
    const r = await call("/api/admin/project", { method: "POST", body: JSON.stringify({ slug: p.slug, title: p.title, description: p.description, price: n }) });
    setStatus(r.ok ? { t: `Price updated for “${p.title}”.` } : { t: "Could not update price", err: true });
    refresh(); onChanged?.();
  }

  return (
    <div>
      {!authed ? (
        <form onSubmit={login} style={{ maxWidth: 420, margin: "0 auto" }}>
          <label className="pw-field">Admin password
            <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
          </label>
          <button className="pw-go" type="submit">Log in</button>
          {status && <p className={status.err ? "pw-err" : "pw-ok"}>{status.t}</p>}
        </form>
      ) : (
        <div style={{ maxWidth: 720, margin: "0 auto", textAlign: "left" }}>
          <label className="pw-field">Project title
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Coffee Shop Website" />
          </label>
          <label className="pw-field">Price in ₹ (leave empty for “Ask for price”)
            <input value={price} onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" placeholder="4999" />
          </label>
          <label className="pw-field">Short description
            <textarea rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} />
          </label>

          <div className={`pw-drop ${over ? "over" : ""}`} onDragOver={(e) => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)} onDrop={onDrop}>
            <div>Drag and drop your website <b>folder</b> or <b>.html file</b> here</div>
            <div className="btns">
              <button type="button" className="pw-addfile" onClick={() => folderRef.current?.click()}>
                <svg viewBox="0 0 256 256" height="22" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M74.34 85.66a8 8 0 0 1 11.32-11.32L120 108.69V24a8 8 0 0 1 16 0v84.69l34.34-34.35a8 8 0 0 1 11.32 11.32l-48 48a8 8 0 0 1-11.32 0ZM240 136v64a16 16 0 0 1-16 16H32a16 16 0 0 1-16-16v-64a16 16 0 0 1 16-16h52.4a4 4 0 0 1 2.83 1.17L111 145a24 24 0 0 0 34 0l23.8-23.8a4 4 0 0 1 2.8-1.2H224a16 16 0 0 1 16 16m-40 32a12 12 0 1 0-12 12a12 12 0 0 0 12-12" fill="currentColor" /></svg>
                Choose folder
              </button>
              <button type="button" className="pw-addfile" onClick={() => fileRef.current?.click()}>Choose .html file</button>
            </div>
            <input ref={folderRef} type="file" hidden multiple onChange={onPick} {...({ webkitdirectory: "" } as any)} />
            <input ref={fileRef} type="file" hidden accept=".html,.htm" onChange={onPick} />
            {items.length > 0 && <p className="pw-ok">{items.length} file(s) ready</p>}
          </div>

          <div className="pw-actions" style={{ marginTop: 16 }}>
            <button className="pw-go" disabled={busy} onClick={publish}>{busy ? "Uploading…" : "Publish project"}</button>
          </div>
          {status && <p className={status.err ? "pw-err" : "pw-ok"}>{status.t}</p>}

          <h2 style={{ marginTop: 40 }}>Your projects</h2>
          <div className="pw-adm-list">
            {list.length === 0 && <div className="pw-msg">No projects yet.</div>}
            {list.map((p) => (
              <div key={p.slug} className="pw-adm-item">
                <div><b>{p.title}</b> · {p.price ? "₹" + p.price.toLocaleString("en-IN") : "no price"} · <a href={`/p/${p.slug}/`} target="_blank" rel="noopener noreferrer">open</a></div>
                <span className="pw-row">
                  <input className="pw-priceinp" defaultValue={p.price || ""} placeholder="₹ price" inputMode="numeric" onBlur={(e) => { if (e.target.value !== String(p.price || "")) savePrice(p, e.target.value); }} />
                  <button type="button" aria-label={`Delete ${p.title}`} title="Delete" onClick={() => remove(p)} className="group relative flex h-14 w-14 flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-red-800 bg-red-400 hover:bg-red-600">
                    <svg viewBox="0 0 1.625 1.625" className="absolute -top-7 fill-white delay-100 group-hover:top-6 group-hover:animate-[spin_1.4s] group-hover:duration-1000" height={15} width={15}>
                      <path d="M.471 1.024v-.52a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099h-.39c-.107 0-.195 0-.195-.195" />
                      <path d="M1.219.601h-.163A.1.1 0 0 1 .959.504V.341A.033.033 0 0 0 .926.309h-.26a.1.1 0 0 0-.098.098v.618c0 .054.044.098.098.098h.487a.1.1 0 0 0 .098-.099v-.39a.033.033 0 0 0-.032-.033" />
                      <path d="m1.245.465-.15-.15a.02.02 0 0 0-.016-.006.023.023 0 0 0-.023.022v.108c0 .036.029.065.065.065h.107a.023.023 0 0 0 .023-.023.02.02 0 0 0-.007-.016" />
                    </svg>
                    <svg width={16} fill="none" viewBox="0 0 39 7" className="origin-right duration-500 group-hover:rotate-90">
                      <line strokeWidth={4} stroke="white" y2={5} x2={39} y1={5} />
                      <line strokeWidth={3} stroke="white" y2="1.5" x2="26.0357" y1="1.5" x1={12} />
                    </svg>
                    <svg width={16} fill="none" viewBox="0 0 33 39">
                      <mask fill="white" id="pw-bin-mask">
                        <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
                      </mask>
                      <path mask="url(#pw-bin-mask)" fill="white" d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z" />
                      <path strokeWidth={4} stroke="white" d="M12 6L12 29" />
                      <path strokeWidth={4} stroke="white" d="M21 6V29" />
                    </svg>
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
