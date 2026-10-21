import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black/70 px-6 py-10 text-center text-sm text-muted-foreground backdrop-blur-sm">
      © {new Date().getFullYear()} {site.name}. All rights reserved.
    </footer>
  );
}
