import type { Project } from "../../types";
import { ProjectArtwork } from "./ProjectArtwork";

interface ProjectTileProps {
  project: Project;
  index: number;
  position: "previous" | "active" | "next";
  onSelect: () => void;
}

export function ProjectTile({ project, index, position, onSelect }: ProjectTileProps) {
  const active = position === "active";
  return (
    <button
      className={`project-tile project-tile--${position}`}
      type="button"
      aria-label={`${active ? "Selected: " : "Show "}${project.title}`}
      aria-pressed={active}
      onClick={onSelect}
    >
      <ProjectArtwork project={project} index={index} eager={index < 2} />
      <span className="project-tile__scrim" />
      <span className="project-tile__caption">
        <span className="project-tile__category">{project.category}</span>
        <strong>{project.title}</strong>
        <span>{project.summary}</span>
      </span>
    </button>
  );
}
