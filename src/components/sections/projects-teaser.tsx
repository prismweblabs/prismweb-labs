import "@/components/projects.css";

export function ProjectsTeaser() {
  return (
    <section id="projects" className="px-5 pb-24 pt-4 text-center">
      <h2 className="mb-2 text-3xl font-bold sm:text-4xl">Ready-made websites</h2>
      <p className="mx-auto mb-8 max-w-xl text-sm text-muted-foreground">
        Browse the sites we have built. Open a live demo and buy the one you like.
      </p>
      <a href="/projects" className="pw-pbtn">
        <div className="wrap">
          <p><span>✧</span><span>✦</span>Our Projects</p>
        </div>
      </a>
    </section>
  );
}
