"use client";

import { useState } from "react";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/data/site";

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <div className="relative w-full max-w-4xl">
        <nav className="flex items-center justify-between gap-4 rounded-full border border-border bg-background/70 py-2 pl-3 pr-2 backdrop-blur-xl">
          <a href="#home" className="flex items-center gap-2" aria-label={site.name}>
            <Image src="/logo.jpg" alt={`${site.name} logo`} width={36} height={36} className="h-9 w-9 rounded-full bg-white object-contain p-0.5" />
            <span className="hidden text-sm font-semibold sm:block">{site.name}</span>
          </a>
          <ul className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            {nav.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="transition-colors hover:text-foreground">{n.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href="#contact" className="sweep-btn">
              <span>Get a quote</span>
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground md:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
        {open && (
          <ul className="absolute inset-x-0 top-full mt-2 overflow-hidden rounded-3xl border border-border bg-background/95 p-2 backdrop-blur-xl md:hidden">
            {nav.map((n) => (
              <li key={n.href}>
                <a
                  href={n.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm text-foreground/90 hover:bg-white/5"
                >
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </header>
  );
}
