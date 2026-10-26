import type { Metadata } from "next";
import { ProjectsView } from "@/components/sections/projects-view";

export const metadata: Metadata = {
  title: "Ready-made Websites & Projects",
  description: "Browse live demos of websites built by PrismWeb Labs and buy the one you like.",
  alternates: { canonical: "/projects" },
  openGraph: { title: "Ready-made Websites & Projects | PrismWeb Labs", url: "/projects" },
};

export default function ProjectsPage() {
  return <ProjectsView />;
}
