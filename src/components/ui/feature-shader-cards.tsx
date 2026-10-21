"use client";

import type React from "react";
import { Warp } from "@paper-design/shaders-react";
import { ChevronRight, Cloud, Code2, LifeBuoy, Palette, Rocket, ShoppingCart } from "lucide-react";

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const icon = "h-12 w-12 text-white";

const features: Feature[] = [
  {
    title: "Website Design",
    description: "Clean, modern, mobile-first designs that match your brand and make visitors take action.",
    icon: <Palette className={icon} />,
  },
  {
    title: "Full-Stack Development",
    description: "Frontend, backend, database and APIs built by one team, so everything works together.",
    icon: <Code2 className={icon} />,
  },
  {
    title: "E-commerce",
    description: "Online stores with product pages, carts and payments so you can start selling online.",
    icon: <ShoppingCart className={icon} />,
  },
  {
    title: "Hosting & Launch",
    description: "We deploy your site to fast, secure hosting with HTTPS and take it live for you.",
    icon: <Cloud className={icon} />,
  },
  {
    title: "Fast Launch",
    description: "Optimized, responsive sites that load quickly on every device and are ready for search engines.",
    icon: <Rocket className={icon} />,
  },
  {
    title: "Maintenance & Support",
    description: "Updates, fixes and improvements after launch, so your site stays secure and up to date.",
    icon: <LifeBuoy className={icon} />,
  },
];

const configs = [
  { proportion: 0.3, softness: 0.8, distortion: 0.15, swirl: 0.6, swirlIterations: 8, shape: "checks" as const, shapeScale: 0.08, colors: ["hsl(280, 100%, 30%)", "hsl(320, 100%, 60%)", "hsl(340, 90%, 40%)", "hsl(300, 100%, 70%)"] },
  { proportion: 0.4, softness: 1.2, distortion: 0.2, swirl: 0.9, swirlIterations: 12, shape: "stripes" as const, shapeScale: 0.12, colors: ["hsl(200, 100%, 25%)", "hsl(180, 100%, 65%)", "hsl(160, 90%, 35%)", "hsl(190, 100%, 75%)"] },
  { proportion: 0.35, softness: 0.9, distortion: 0.18, swirl: 0.7, swirlIterations: 10, shape: "checks" as const, shapeScale: 0.1, colors: ["hsl(120, 100%, 25%)", "hsl(140, 100%, 60%)", "hsl(100, 90%, 30%)", "hsl(130, 100%, 70%)"] },
  { proportion: 0.45, softness: 1.1, distortion: 0.22, swirl: 0.8, swirlIterations: 15, shape: "stripes" as const, shapeScale: 0.09, colors: ["hsl(30, 100%, 35%)", "hsl(50, 100%, 65%)", "hsl(40, 90%, 40%)", "hsl(45, 100%, 75%)"] },
  { proportion: 0.38, softness: 0.95, distortion: 0.16, swirl: 0.85, swirlIterations: 11, shape: "checks" as const, shapeScale: 0.11, colors: ["hsl(250, 100%, 30%)", "hsl(270, 100%, 65%)", "hsl(260, 90%, 35%)", "hsl(265, 100%, 70%)"] },
  { proportion: 0.42, softness: 1.0, distortion: 0.19, swirl: 0.75, swirlIterations: 9, shape: "stripes" as const, shapeScale: 0.13, colors: ["hsl(330, 100%, 30%)", "hsl(350, 100%, 60%)", "hsl(340, 90%, 35%)", "hsl(345, 100%, 75%)"] },
];

export default function FeaturesCards() {
  return (
    <section id="services" className="px-4 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-light text-white md:text-5xl">
            What we <span className="text-gradient font-semibold">build for you</span>
          </h2>
          <p className="mx-auto max-w-3xl text-xl leading-relaxed text-gray-300">
            Everything you need to get a professional website online, from design and development to launch.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const c = configs[index % configs.length];
            return (
              <div key={feature.title} className="relative h-80">
                <div className="absolute inset-0 overflow-hidden rounded-3xl">
                  <Warp
                    style={{ height: "100%", width: "100%" }}
                    proportion={c.proportion}
                    softness={c.softness}
                    distortion={c.distortion}
                    swirl={c.swirl}
                    swirlIterations={c.swirlIterations}
                    shape={c.shape}
                    shapeScale={c.shapeScale}
                    scale={1}
                    rotation={0}
                    speed={0.8}
                    colors={c.colors}
                  />
                </div>
                <div className="relative z-10 flex h-full flex-col rounded-3xl border border-white/10 bg-black/80 p-8">
                  <div className="mb-6 drop-shadow-lg">{feature.icon}</div>
                  <h3 className="mb-4 text-2xl font-bold text-white">{feature.title}</h3>
                  <p className="flex-grow font-medium leading-relaxed text-gray-100">{feature.description}</p>
                  <a href="#contact" className="mt-6 flex items-center text-sm font-bold text-gray-200 hover:text-white">
                    <span className="mr-2">Get a quote</span>
                    <ChevronRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
