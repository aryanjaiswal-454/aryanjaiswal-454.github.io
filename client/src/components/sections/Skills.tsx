import { useMemo } from "react";
import { BrainCircuit, Cloud, Code2, Cpu, Database, Network } from "lucide-react";
import skillsFallback from "../../data/skills.js";
import { useApiData } from "../../hooks/useApiData";
import type { SkillGroup } from "../../types";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const groupIcons = [BrainCircuit, Cpu, Code2, Database, Cloud, Network];
const groupAliases: Record<string, string> = {
  "AI & LLM Engineering": "AI/LLM Engineering",
  "Programming Languages": "Languages",
  "Cloud & Developer Tools": "Cloud & Tools",
  "Computer Science": "Core CS"
};

export function Skills() {
  const { data: apiGroups } = useApiData<SkillGroup[]>("/skills", skillsFallback);
  const groups = useMemo(() => {
    const apiGroupsByName = new Map(
      apiGroups.map((group) => [groupAliases[group.group] || group.group, group])
    );
    const dataMatchesConfiguration = skillsFallback.every((canonical) => {
      const apiGroup = apiGroupsByName.get(canonical.group);
      return apiGroup
        && apiGroup.items.length === canonical.items.length
        && canonical.items.every((item) => apiGroup.items.includes(item));
    });

    if (!dataMatchesConfiguration) return skillsFallback;

    return skillsFallback.map((canonical) => {
      const apiGroup = apiGroupsByName.get(canonical.group);
      return apiGroup ? { ...apiGroup, group: canonical.group } : canonical;
    });
  }, [apiGroups]);

  return (
    <section className="section section-skills" id="skills" aria-labelledby="skills-title">
      <div className="page-container">
        <SectionHeading
          id="skills-title"
          number="03"
          eyebrow="Technical expertise"
          title="A toolkit shaped by the work."
          description="A precise snapshot of the languages, AI methods, frameworks, and systems foundations I work with."
        />
        <div className="expertise-grid">
          {groups.map((group, index) => {
            const Icon = groupIcons[index % groupIcons.length] || BrainCircuit;
            return (
              <Reveal className="expertise-card surface-hover" key={group.group} delay={index * 0.04}>
                <div className="expertise-card__heading">
                  <span className="expertise-card__icon"><Icon size={20} aria-hidden="true" /></span>
                  <div>
                    <h3>{group.group}</h3>
                  </div>
                </div>
                <ul className="expertise-chips" aria-label={`${group.group} skills`}>
                  {group.items.map((skill) => <li className="skill-chip" key={skill}>{skill}</li>)}
                </ul>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
