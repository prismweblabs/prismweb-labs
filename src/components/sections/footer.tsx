import { site } from "@/data/site";
import { gmailLink } from "@/lib/mail";

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/#services" },
  { label: "Projects", href: "/projects" },
  { label: "Developers", href: "/#developers" },
  { label: "Contact", href: "/#contact" },
  { label: "Privacy Policy", href: "/privacy" },
];

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/70 px-6 pb-24 pt-10 text-center text-sm text-muted-foreground backdrop-blur-sm md:pb-10">
      <nav aria-label="Footer" className="mb-4 flex flex-wrap justify-center gap-x-6 gap-y-2">
        {links.map((l) => (
          <a key={l.href} href={l.href} className="hover:text-foreground">{l.label}</a>
        ))}
        <a href={gmailLink(site.email)} target="_blank" rel="noopener noreferrer" className="hover:text-foreground">{site.email}</a>
      </nav>
      © {new Date().getFullYear()} {site.name}. All rights reserved.
    </footer>
  );
}
