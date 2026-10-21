import type { Metadata } from "next";
import { ProjectsView } from "@/components/sections/projects-view";

export const metadata: Metadata = { title: "Projects | PrismWeb Labs" };

export default function ProjectsPage() {
  return <ProjectsView />;
}
