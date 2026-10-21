// Cloudflare Pages Functions version of the old netlify/functions/api.mts
// Storage: one Workers KV namespace bound as PRISM_KV (free plan, no card needed).
//   meta:<slug>        -> project info (JSON)
//   file:<slug>/<path> -> uploaded site file (binary)
//   msg:<timestamp>    -> contact / buy-request form submissions (JSON)

export interface Env {
  PRISM_KV: KVNamespace;
  ADMIN_PASSWORD?: string;
  WEB3FORMS_KEY?: string; // optional: forward form messages to your email via web3forms.com (free)
}

// Minimal KV typings so we don't need extra packages
interface KVNamespace {
  get(key: string, type: "json"): Promise<any>;
  get(key: string, type: "arrayBuffer"): Promise<ArrayBuffer | null>;
  get(key: string): Promise<string | null>;
  put(key: string, value: string | ArrayBuffer): Promise<void>;
  delete(key: string): Promise<void>;
  list(opts?: { prefix?: string; cursor?: string }): Promise<{ keys: { name: string }[]; list_complete: boolean; cursor?: string }>;
}

const TYPES: Record<string, string> = {
  html: "text/html; charset=utf-8", htm: "text/html; charset=utf-8", css: "text/css; charset=utf-8",
  js: "text/javascript; charset=utf-8", mjs: "text/javascript; charset=utf-8", json: "application/json; charset=utf-8",
  svg: "image/svg+xml", png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg", gif: "image/gif", webp: "image/webp",
  avif: "image/avif", ico: "image/x-icon", woff: "font/woff", woff2: "font/woff2", ttf: "font/ttf", otf: "font/otf",
  mp4: "video/mp4", webm: "video/webm", mp3: "audio/mpeg", txt: "text/plain; charset=utf-8", map: "application/json",
  xml: "application/xml", pdf: "application/pdf",
};
const typeOf = (p: string) => TYPES[p.split(".").pop()!.toLowerCase()] ?? "application/octet-stream";

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", "cache-control": "no-store" } });

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40) || "project";
const cleanPath = (p: string) => p.split("/").filter((x) => x && x !== "." && x !== "..").join("/");

async function listAll(kv: KVNamespace, prefix: string) {
  const names: string[] = [];
  let cursor: string | undefined;
  do {
    const r = await kv.list({ prefix, cursor });
    names.push(...r.keys.map((k) => k.name));
    cursor = r.list_complete ? undefined : r.cursor;
  } while (cursor);
  return names;
}

function authed(req: Request, env: Env) {
  return !!env.ADMIN_PASSWORD && req.headers.get("x-admin-password") === env.ADMIN_PASSWORD;
}

export async function handle(req: Request, env: Env): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname;
  const kv = env.PRISM_KV;
  if (!kv) return json({ error: "KV binding PRISM_KV is not set up in Cloudflare (see CLOUDFLARE.md)." }, 500);

  // ---- public: list projects
  if (path === "/api/projects" && req.method === "GET") {
    const names = await listAll(kv, "meta:");
    const items = (await Promise.all(names.map((n) => kv.get(n, "json")))).filter(Boolean) as any[];
    items.sort((a, b) => b.createdAt - a.createdAt);
    return json(items);
  }

  // ---- public: contact / buy-request forms (replaces Netlify Forms)
  if (path === "/api/contact" && req.method === "POST") {
    const form = await req.formData();
    if (form.get("bot-field")) return Response.redirect(`${url.origin}/thanks.html`, 303); // honeypot: silently drop bots
    const data: Record<string, string> = {};
    form.forEach((v, k) => { if (k !== "bot-field" && typeof v === "string") data[k] = v.slice(0, 5000); });
    const kind = data["form-name"] || "contact";
    await kv.put(`msg:${Date.now()}`, JSON.stringify({ ...data, kind, at: new Date().toISOString() }));
    if (env.WEB3FORMS_KEY) {
      try {
        await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "content-type": "application/json", accept: "application/json" },
          body: JSON.stringify({ access_key: env.WEB3FORMS_KEY, subject: `PrismWeb Labs: new ${kind}`, ...data }),
        });
      } catch {}
    }
    return Response.redirect(`${url.origin}/thanks.html`, 303);
  }

  // ---- public: serve an uploaded site
  if (path.startsWith("/p/")) {
    const rest = path.slice(3);
    const slash = rest.indexOf("/");
    if (slash === -1) return Response.redirect(`${url.origin}/p/${rest}/`, 301);
    const slug = rest.slice(0, slash);
    let file = cleanPath(decodeURIComponent(rest.slice(slash + 1))) || "index.html";
    let buf = await kv.get(`file:${slug}/${file}`, "arrayBuffer");
    if (!buf && !file.includes(".")) {
      file = `${file}/index.html`;
      buf = await kv.get(`file:${slug}/${file}`, "arrayBuffer");
    }
    if (!buf) return new Response("Not found", { status: 404 });
    return new Response(buf, { headers: { "content-type": typeOf(file), "cache-control": "public, max-age=60" } });
  }

  // ---- admin only below
  if (!authed(req, env)) return json({ error: "Wrong password (or ADMIN_PASSWORD is not set in Cloudflare)." }, 401);

  if (path === "/api/admin/check") return json({ ok: true });

  // read form messages sent from the website
  if (path === "/api/admin/messages" && req.method === "GET") {
    const names = (await listAll(kv, "msg:")).sort().reverse().slice(0, 100);
    return json(await Promise.all(names.map((n) => kv.get(n, "json"))));
  }

  // create/update project info
  if (path === "/api/admin/project" && req.method === "POST") {
    const b: any = await req.json();
    const title = String(b.title ?? "").trim();
    if (!title) return json({ error: "Title is required" }, 400);
    const slug = b.slug ? slugify(String(b.slug)) : `${slugify(title)}-${Date.now().toString(36).slice(-4)}`;
    const old = await kv.get(`meta:${slug}`, "json");
    const price = Number(b.price);
    await kv.put(`meta:${slug}`, JSON.stringify({
      slug, title,
      description: String(b.description ?? "").trim(),
      price: Number.isFinite(price) && price > 0 ? price : 0,
      createdAt: old?.createdAt ?? Date.now(),
    }));
    return json({ slug });
  }

  // upload one file: PUT /api/admin/file?slug=..&path=..   (max 25 MB per file on KV)
  if (path === "/api/admin/file" && req.method === "PUT") {
    const slug = slugify(url.searchParams.get("slug") ?? "");
    const p = cleanPath(url.searchParams.get("path") ?? "");
    if (!p) return json({ error: "Missing path" }, 400);
    if (!(await kv.get(`meta:${slug}`))) return json({ error: "Project not found" }, 404);
    await kv.put(`file:${slug}/${p}`, await req.arrayBuffer());
    return json({ ok: true });
  }

  // delete project + its files
  if (path === "/api/admin/project" && req.method === "DELETE") {
    const slug = slugify(url.searchParams.get("slug") ?? "");
    const names = await listAll(kv, `file:${slug}/`);
    await Promise.all(names.map((n) => kv.delete(n)));
    await kv.delete(`meta:${slug}`);
    return json({ ok: true });
  }

  return json({ error: "Not found" }, 404);
}
