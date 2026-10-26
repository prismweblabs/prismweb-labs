"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { site } from "@/data/site";

const field =
  "w-full rounded-xl border border-input bg-background/60 px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-ring";
const bad = "border-red-400/70";

type Errors = { name?: string; email?: string; message?: string };

export function ContactForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "ok" | "fail">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const email = String(fd.get("email") || "").trim();
    const message = String(fd.get("message") || "").trim();
    const next: Errors = {};
    if (!name) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Please enter a valid email address.";
    if (message.length < 10) next.message = "Please tell us a little more (at least 10 characters).";
    setErrors(next);
    if (Object.keys(next).length) { setState("idle"); return; }

    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      if (!res.ok) throw new Error();
      form.reset();
      setState("ok");
    } catch {
      setState("fail");
    }
  }

  return (
    <form name="contact" method="POST" action="/api/contact" onSubmit={onSubmit} noValidate className="min-w-0 space-y-4">
      <input type="hidden" name="form-name" value="contact" />
      <p className="hidden">
        <label>Don&apos;t fill this out: <input name="bot-field" tabIndex={-1} autoComplete="off" /></label>
      </p>
      <div>
        <input name="name" placeholder="Your name" autoComplete="name" aria-invalid={!!errors.name} className={`${field} ${errors.name ? bad : ""}`} />
        {errors.name && <p className="mt-1 text-xs text-red-400" role="alert">{errors.name}</p>}
      </div>
      <div>
        <input name="email" type="email" placeholder="Your email" autoComplete="email" aria-invalid={!!errors.email} className={`${field} ${errors.email ? bad : ""}`} />
        {errors.email && <p className="mt-1 text-xs text-red-400" role="alert">{errors.email}</p>}
      </div>
      <input name="website" placeholder="Your website (link, if you have one)" className={field} />
      <div>
        <textarea name="message" rows={5} placeholder="Tell us about your website: what you need, your idea, timeline" aria-invalid={!!errors.message} className={`${field} ${errors.message ? bad : ""}`} />
        {errors.message && <p className="mt-1 text-xs text-red-400" role="alert">{errors.message}</p>}
      </div>
      <Button type="submit" size="lg" variant="light" disabled={state === "sending"} className="h-12 w-full rounded-full">
        {state === "sending" ? "Sending…" : "Send message"}
      </Button>
      <div aria-live="polite">
        {state === "ok" && <p className="text-sm text-[#4ade80]">Thank you! Your message was sent. We will reply to your email soon.</p>}
        {state === "fail" && (
          <p className="text-sm text-red-400">
            Sorry, your message could not be sent. Please try again, or email us at {site.email}.
          </p>
        )}
      </div>
    </form>
  );
}
