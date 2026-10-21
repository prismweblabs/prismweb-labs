"use client";

import "@/components/developer-card.css";
import Image from "next/image";
import { motion } from "framer-motion";
import { Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SocialCard } from "@/components/social-card";
import { developers, type Developer } from "@/data/site";

function whatsappLink(phone: string) {
  return `https://wa.me/${phone.replace(/\D/g, "")}`;
}

function DeveloperSection({ dev, index }: { dev: Developer; index: number }) {
  const flip = index % 2 === 1;
  return (
    <motion.article
      id={dev.id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="pw-dcard scroll-mt-28 grid grid-cols-1 items-center gap-8 rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-10 lg:grid-cols-[360px_1fr]"
    >
      <div className="pw-deco pw-ray" aria-hidden="true" />
      <div className="pw-deco pw-dot" aria-hidden="true" />
      <div className={flip ? "lg:order-2" : ""}>
        <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-3xl border border-border">
          <Image
            src={dev.photo}
            alt={dev.name}
            fill
            sizes="(min-width: 1024px) 360px, 90vw"
            className="object-cover object-top"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      </div>

      <div className="min-w-0 space-y-6">
        <div>
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[0.65rem] uppercase tracking-[0.3em] text-muted-foreground">
            Developer {String(index + 1).padStart(2, "0")}
          </Badge>
          <h3 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">{dev.name}</h3>
          <p className="mt-1 text-sm uppercase tracking-[0.2em] text-muted-foreground">{dev.role}</p>
          <p className="mt-4 max-w-xl text-muted-foreground">{dev.bio}</p>
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/40">Skills</p>
          {dev.skills.map((g) => (
            <div key={g.group} className="flex flex-wrap items-center gap-2">
              <span className="w-full text-xs text-muted-foreground sm:w-20 sm:shrink-0">{g.group}</span>
              {g.items.map((s) => (
                <span key={s} className="rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-foreground/85">
                  {s}
                </span>
              ))}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <a href={`mailto:${dev.email}`} className="flex min-w-0 items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm transition-colors hover:border-white/30">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{dev.email}</span>
          </a>
          <a href={`tel:${dev.phone}`} className="flex items-center gap-3 rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm transition-colors hover:border-white/30">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{dev.phone}</span>
          </a>
        </div>

        <SocialCard
          name={dev.name}
          instagram={dev.instagram}
          linkedin={dev.linkedin}
          github={dev.github}
          whatsapp={whatsappLink(dev.phone)}
        />
      </div>
    </motion.article>
  );
}

export function Developers() {
  return (
    <section id="developers" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-light md:text-5xl">
            Meet the <span className="text-gradient font-semibold">developers</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            The three engineers behind PrismWeb Labs: their skills, and how to reach each of them directly.
          </p>
        </div>
        <div className="space-y-8">
          {developers.map((d, i) => (
            <DeveloperSection key={d.id} dev={d} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
