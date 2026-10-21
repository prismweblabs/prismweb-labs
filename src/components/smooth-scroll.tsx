"use client";

import { useEffect } from "react";
import { startScroll } from "@/lib/scroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Starts the smooth-scroll + per-frame loop used by scroll-driven sections. */
export function SmoothScroll() {
  const reduced = useReducedMotion();
  useEffect(() => startScroll(reduced), [reduced]);
  return null;
}
