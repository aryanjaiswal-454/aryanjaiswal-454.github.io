import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Github, Play } from "lucide-react";
import { useState } from "react";
import projectsFallback from "../../data/projects.js";
import { useApiData } from "../../hooks/useApiData";
import type { Project } from "../../types";
import { ProjectTile } from "../projects/ProjectTile";
import { SectionHeading } from "../ui/SectionHeading";

const excludedProjectNames = ["verityai", "agnidrishti"];
const categoryAliases: Record<string, string> = {
  "Full-Stack Application": "Full-Stack Development",
  "MERN Stack": "Full-Stack Development",
  "Machine Learning": "Machine Learning / AI",
  "Machine Learning & MLOps": "Machine Learning / AI"
};

function normalizeProject(project: Project): Project | null {
  const projectNames = [project.id, project.slug, project.title]
    .map((value) => value.toLowerCase().replace(/[^a-z0-9]/g, ""));
  if (projectNames.some((name) => excludedProjectNames.some((excluded) => name.includes(excluded)))) {
    return null;
  }

  const category = categoryAliases[project.category] || project.category;
  const techStack = project.techStack.filter((technology) => !/\breact(?:\.js)?\b/i.test(technology));
  const description = project.description.replace(/\bMERN\b/gi, "full-stack");

  return { ...project, category, description, techStack };
}

export function Projects() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const { data: apiProjects } = useApiData<Project[]>("/projects", projectsFallback);
  const projects = apiProjects.length > 0
    ? [
      ...apiProjects.map((project) => {
        const fallback = projectsFallback.find((entry) => entry.id === project.id || entry.slug === project.slug);
        return fallback
          ? {
            ...fallback,
            ...project,
            image: fallback.image ?? project.image,
            githubUrl: fallback.id === "weather-agent" ? fallback.githubUrl : project.githubUrl ?? fallback.githubUrl,
            liveUrl: fallback.id === "weather-agent" ? fallback.liveUrl : project.liveUrl ?? fallback.liveUrl,
            demoUrl: fallback.demoUrl ?? project.demoUrl
          }
          : project;
      }),
      ...projectsFallback.filter((fallback) => !apiProjects.some((project) => project.id === fallback.id || project.slug === fallback.slug))
    ]
    : projectsFallback;

  const orderedProjects = projects
    .map(normalizeProject)
    .filter((project): project is Project => project !== null)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order);

  return (
    <section className="section section-work" id="work" aria-labelledby="work-title">
      <div className="page-container">
        <SectionHeading
          id="work-title"
          number="02"
          eyebrow="Selected work"
          title="Built to solve, not just to show."
          description="A focused set of applications and AI systems, each with its purpose, stack, and available links."
        />
        {orderedProjects.length > 0 && (() => {
          const active = orderedProjects[activeIndex % orderedProjects.length];
          const previousIndex = (activeIndex - 1 + orderedProjects.length) % orderedProjects.length;
          const nextIndex = (activeIndex + 1) % orderedProjects.length;
          const select = (index: number, step: number) => {
            setDirection(step);
            setActiveIndex((index + orderedProjects.length) % orderedProjects.length);
          };
          const change = (step: number) => select(activeIndex + step, step);
          const beltMotion = {
            enter: (step: number) => ({ x: step * 90, opacity: 0 }),
            center: { x: 0, opacity: 1 },
            exit: (step: number) => ({ x: step * -90, opacity: 0 })
          };
          return (
            <div className="project-carousel" aria-label="Selected projects">
              <div className="project-belt">
                {orderedProjects.length > 1 && <button className="project-belt__arrow project-belt__arrow--left" type="button" onClick={() => change(-1)} aria-label="Previous project"><ArrowLeft size={19} aria-hidden="true" /></button>}
                {orderedProjects.length > 1 && <button className="project-belt__arrow project-belt__arrow--right" type="button" onClick={() => change(1)} aria-label="Next project"><ArrowLeft size={19} aria-hidden="true" /></button>}
                <div className="project-belt__stage">
                  <AnimatePresence initial={false} custom={direction} mode="sync">
                    <motion.div
                      className="project-belt__track"
                      key={active.id}
                      custom={direction}
                      variants={beltMotion}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {orderedProjects.length > 1 && <ProjectTile project={orderedProjects[previousIndex]} index={previousIndex} position="previous" onSelect={() => select(previousIndex, -1)} />}
                      <ProjectTile project={active} index={activeIndex} position="active" onSelect={() => undefined} />
                      {orderedProjects.length > 1 && <ProjectTile project={orderedProjects[nextIndex]} index={nextIndex} position="next" onSelect={() => select(nextIndex, 1)} />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
              <article className="project-detail-card" key={active.id} aria-live="polite">
                <div className="project-detail-card__heading">
                  <div><span>{active.category}</span><h3>{active.title}</h3></div>
                  <span className="project-detail-card__count">{String(activeIndex + 1).padStart(2, "0")} / {String(orderedProjects.length).padStart(2, "0")}</span>
                </div>
                <p>{active.description}</p>
                <div className="project-detail-card__stack" aria-label={`${active.title} technology stack`}>
                  {active.techStack.map((technology) => <span key={technology}>{technology}</span>)}
                </div>
                <div className="project-detail-card__links">
                  {active.githubUrl && <a href={active.githubUrl} target="_blank" rel="noopener noreferrer"><Github size={15} aria-hidden="true" /> GitHub</a>}
                  {active.liveUrl && <a href={active.liveUrl} target="_blank" rel="noopener noreferrer"><ArrowUpRight size={15} aria-hidden="true" /> Live project</a>}
                  {active.demoUrl && <a href={active.demoUrl} target="_blank" rel="noopener noreferrer"><Play size={14} aria-hidden="true" /> Demo</a>}
                </div>
              </article>
            </div>
          );
        })()}
      </div>
    </section>
  );
}
