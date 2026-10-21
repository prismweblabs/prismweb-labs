import { Navbar } from "@/components/sections/navbar";
import { Hero } from "@/components/sections/hero";
import FeaturesCards from "@/components/ui/feature-shader-cards";
import { GlassmorphismPortfolioBlock } from "@/components/ui/glassmorphism-portfolio-block-shadcnui";
import { LaunchScroll } from "@/components/sections/launch-scroll";
import { Developers } from "@/components/sections/developers";
import { Contact } from "@/components/sections/contact";
import { HowWeWork } from "@/components/sections/how-we-work";
import { ProjectsTeaser } from "@/components/sections/projects-teaser";
import { Footer } from "@/components/sections/footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <LaunchScroll />
      <div aria-hidden="true" className="-mt-px h-48 bg-gradient-to-b from-background to-transparent" />
      <FeaturesCards />
      <HowWeWork />
      <ProjectsTeaser />
      <GlassmorphismPortfolioBlock />
      <Developers />
      <Contact />
      <Footer />
    </main>
  );
}
