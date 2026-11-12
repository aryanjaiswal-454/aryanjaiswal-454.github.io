import {
  ArrowUpRight,
  Braces,
  ChefHat,
  Code2,
  Lightbulb,
  Trophy,
  type LucideIcon
} from "lucide-react";
import recognition from "../../data/recognition.js";
import { SectionHeading } from "../ui/SectionHeading";

const achievementIcons: Record<string, LucideIcon> = {
  techsprint: Trophy,
  codigo: Code2,
  hackstorm: Lightbulb,
  dsa: Code2,
  leetcode: Braces,
  codechef: ChefHat
};

export function Recognition() {
  const { awards, achievements } = recognition;
  if (!awards.length && !achievements.length) return null;

  const cards = [
    ...awards.map((item) => ({ ...item, kind: item.kind || "codigo" })),
    ...achievements
  ];

  return (
    <section className="section section-recognition" id="recognition" aria-labelledby="recognition-title">
      <div className="page-container">
        <SectionHeading
          id="recognition-title"
          number="05"
          eyebrow="Recognition"
          title="Results worth sharing."
          description="Highlights from hackathons, coding competitions, and problem-solving practice."
        />
        <div className="recognition-grid">
          {cards.map((item) => {
            const Icon = achievementIcons[item.kind] || Code2;
            return (
              <a
                className="recognition-card"
                href={item.url}
                key={item.title}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.title} — opens in a new tab`}
              >
                <span className={`recognition-card__icon recognition-card__icon--${item.kind}`}>
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="recognition-card__title">{item.title}</span>
                <ArrowUpRight size={17} className="recognition-card__arrow" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
