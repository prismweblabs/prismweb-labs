"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
import Image from "next/image";
import { site, developers as team } from "@/data/site";

type Highlight = { title: string; description: string };

const highlights: Highlight[] = [
  {
    title: "Who we are",
    description:
      "Three B.Tech engineers with strong coding fundamentals, building websites for businesses and creators.",
  },
  {
    title: "What we deliver",
    description:
      "Design, full-stack development and deployment: one team from first idea to live launch.",
  },
  {
    title: "How we work",
    description: "Clear scope, honest timelines, and support after launch so your site keeps working.",
  },
];

const listVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.08 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export function GlassmorphismPortfolioBlock() {
  return (
    <section id="about" className="relative overflow-hidden px-6 py-24 lg:py-32">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-3xl border border-border/50 bg-background/45 p-5 backdrop-blur-2xl sm:p-8 md:p-12"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-foreground/[0.05] via-transparent to-transparent" />

          <div className="relative grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Left column */}
            <div className="min-w-0 space-y-8">
              <Badge
                variant="outline"
                className="inline-flex items-center gap-2 rounded-full border-border/50 bg-background/55 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-foreground/70 backdrop-blur"
              >
                About {site.name}
              </Badge>

              <div className="space-y-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl"
                >
                  A small engineering team that takes your website from idea to launch
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="max-w-xl text-base leading-relaxed text-foreground/70"
                >
                  PrismWeb Labs is a startup of three engineers. We build full-stack websites and web apps for
                  clients and launch them live, so you deal with one team instead of many.
                </motion.p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {highlights.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 * index }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-border/40 bg-background/60 p-5 backdrop-blur transition-all hover:border-border/60 hover:shadow-lg"
                  >
                    <div className="relative space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-foreground/40">
                        {item.title}
                      </p>
                      <p className="text-sm leading-relaxed text-foreground/70">{item.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <Button size="lg" asChild className="h-12 w-full gap-2 rounded-full px-8 text-sm uppercase tracking-[0.25em] sm:w-auto">
                <a href="#contact">
                  Start a project
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
            </div>

            {/* Right column: team card */}
            <div className="relative min-w-0">
              <div className="absolute inset-0 rounded-[32px] bg-gradient-to-b from-primary/15 via-transparent to-transparent blur-3xl" />
              <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-[28px] border border-border/50 bg-background/60 p-5 backdrop-blur-xl sm:p-8">
                <div className="text-center">
                  <h3 className="text-2xl font-semibold tracking-tight text-foreground">Meet the team</h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.35em] text-foreground/45">
                    Founder & Co-Founders
                  </p>
                </div>

                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-80px" }}
                  className="mt-8 flex flex-col gap-3"
                >
                  {team.map((m) => (
                    <motion.a
                      key={m.name}
                      href={`#${m.id}`}
                      variants={itemVariants}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center gap-4 rounded-2xl border border-border/40 bg-background/70 px-4 py-3 transition-colors hover:border-white/30"
                    >
                      <Image
                        src={m.photo}
                        alt={m.name}
                        width={56}
                        height={56}
                        className="h-14 w-14 rounded-full border border-border/40 object-cover object-top"
                      />
                      <div>
                        <p className="text-sm font-semibold text-foreground">{m.name}</p>
                        <p className="text-xs text-foreground/60">{m.role}</p>
                      </div>
                    </motion.a>
                  ))}
                </motion.div>

                <a
                  href={`mailto:${site.email}`}
                  className="group mt-8 flex items-center justify-between rounded-2xl border border-border/40 bg-background/70 px-4 py-3 transition-all hover:-translate-y-0.5 hover:border-border/60"
                >
                  <span className="flex items-center gap-3 text-sm text-foreground/80">
                    <Mail className="h-4 w-4" />
                    {site.email}
                  </span>
                  <ArrowUpRight className="h-4 w-4 text-foreground/40 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
