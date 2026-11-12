import type { Project } from "../../types";

interface ProjectArtworkProps {
  project: Project;
  index: number;
  eager?: boolean;
}

export function ProjectArtwork({ project, index, eager = false }: ProjectArtworkProps) {
  if (project.image) {
    return (
      <div className="project-artwork project-artwork--image">
        <img
          src={project.image}
          alt={`${project.title} project visual`}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
        />
        <span className="project-artwork__index">{String(index + 1).padStart(2, "0")}</span>
      </div>
    );
  }

  const variant = index % 4;
  return (
    <div className={`project-artwork project-artwork--generated project-artwork--variant-${variant}`} aria-hidden="true">
      <div className="project-artwork__orbit project-artwork__orbit--one" />
      <div className="project-artwork__orbit project-artwork__orbit--two" />
      <div className="project-artwork__mesh">
        {Array.from({ length: 9 }, (_, node) => <i key={node} />)}
      </div>
      <div className="project-artwork__signature">
        <span>{project.category.toUpperCase()}</span>
        <strong>{project.title.split(/[ —-]/)[0]}</strong>
      </div>
      <span className="project-artwork__index">{String(index + 1).padStart(2, "0")}</span>
    </div>
  );
}
