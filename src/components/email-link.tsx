"use client";

import { useEffect, useState } from "react";
import { gmailLink } from "@/lib/mail";

/**
 * Email link that does the right thing per device:
 * - phones/tablets: a normal mailto: link, which opens the email app (Gmail app compose screen)
 * - computers: opens Gmail in the browser, since most computers have no email app set up
 */
export function EmailLink({ email, className, children }: { email: string; className?: string; children: React.ReactNode }) {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const mobile =
      /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) || window.matchMedia("(pointer: coarse)").matches;
    setDesktop(!mobile);
  }, []);

  if (desktop) {
    return (
      <a href={gmailLink(email)} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <a href={`mailto:${email}`} className={className}>
      {children}
    </a>
  );
}
