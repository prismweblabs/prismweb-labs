import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TextHoverEffect } from "@/components/ui/text-hover-effect";
import { site } from "@/data/site";

export function Hero() {
  return (
    <section id="home" className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-28 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ maskImage: "linear-gradient(to bottom, #000 45%, transparent 92%)", WebkitMaskImage: "linear-gradient(to bottom, #000 45%, transparent 92%)" }}
      >
        <div className="absolute left-1/2 top-1/3 h-[480px] w-[720px] max-w-full -translate-x-1/2 rounded-full bg-gradient-to-r from-green-500/20 to-blue-500/20 blur-3xl" />
      </div>
      <div className="relative z-10 flex flex-col items-center">
        <Image src="/logo.jpg" alt={`${site.name} logo`} width={96} height={96} priority className="mb-6 h-24 w-24 rounded-3xl bg-white object-contain p-1" />
        <Badge variant="outline" className="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Web agency · Full-stack
        </Badge>
        <div className="h-40 w-full max-w-4xl md:h-64">
          <TextHoverEffect text="PRISMWEB" duration={0.2} />
        </div>
        <h1 className="max-w-2xl text-3xl font-semibold tracking-tight md:text-5xl">
          {site.tagline.replace(".", "")} <span className="text-gradient">end to end.</span>
        </h1>
        <p className="mt-5 max-w-xl text-muted-foreground">
          Design, full-stack development and launch, handled by three engineers who care about your result.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#services"
            className="group inline-flex h-12 min-w-[200px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-green-400 to-cyan-400 px-8 text-sm font-semibold text-black shadow-[0_0_30px_-4px_rgba(74,222,128,0.55)] transition hover:brightness-110"
          >
            Our services <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 min-w-[200px] items-center justify-center rounded-full border border-green-400/40 bg-white/5 px-8 text-sm font-semibold text-white backdrop-blur transition hover:bg-green-400/10"
          >
            Contact us
          </a>
        </div>
      </div>
    </section>
  );
}
