"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/** Mobile-only floating call-to-action. Hidden on admin and while the contact form is on screen. */
export function StickyCta() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [atContact, setAtContact] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 400);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("contact");
    if (!el) { setAtContact(false); return; }
    const io = new IntersectionObserver(([e]) => setAtContact(e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, [path]);

  if (path?.startsWith("/admin") || !scrolled || atContact) return null;
  return (
    <a
      href={path === "/" ? "#contact" : "/#contact"}
      className="fixed inset-x-4 bottom-4 z-50 flex h-12 items-center justify-center rounded-full bg-gradient-to-r from-green-400 to-cyan-400 text-sm font-bold text-black shadow-[0_0_30px_-4px_rgba(74,222,128,0.6)] md:hidden"
    >
      Get a quote
    </a>
  );
}
