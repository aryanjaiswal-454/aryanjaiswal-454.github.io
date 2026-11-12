import { useMemo } from "react";
import { ArrowUpRight, BriefcaseBusiness, CalendarDays, FileBadge, Linkedin, MapPin } from "lucide-react";
import timelineFallback from "../../data/timeline";
import { useApiData } from "../../hooks/useApiData";
import type { TimelineItem } from "../../types";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

function dateLabel(item: TimelineItem) {
  const start = item.startDate || "";
  const end = item.endDate || "Present";
  return start ? `${start} — ${end}` : end;
}

const configuredExperience = timelineFallback.filter((item) => item.type === "experience");

export function Timeline() {
  const { data: items } = useApiData<TimelineItem[]>("/experience", timelineFallback);
  const experience = useMemo(() => {
    const apiExperience = items.filter((item) => item.type === "experience");
    const source = apiExperience.length ? apiExperience : configuredExperience;
    return source
      .map((item) => {
        const configured = configuredExperience.find((entry) => entry.title === item.title);
        return {
          ...configured,
          ...item,
          certificateUrl: configured?.certificateUrl || item.certificateUrl,
          postUrl: item.postUrl || configured?.postUrl
        };
      })
      .sort((a, b) => String(b.startDate || b.endDate).localeCompare(String(a.startDate || a.endDate)));
  }, [items, configuredExperience]);

  if (!experience.length) return null;

  return (
    <section className="section section-experience" id="experience" aria-labelledby="experience-title">
      <div className="page-container">
        <SectionHeading
          id="experience-title"
          number="04"
          eyebrow="Experience"
          title="Applied AI, hands-on."
          description="Practical training in machine learning, deep learning, NLP, and generative AI."
        />
        <div className="experience-list">
          {experience.map((item, index) => (
            <Reveal className="experience-card surface-hover" key={`${item.title}-${item.organization}`} delay={index * 0.06}>
              <span className="experience-card__icon"><BriefcaseBusiness size={21} aria-hidden="true" /></span>
              <div className="experience-card__content">
                <div className="experience-card__meta">
                  <span className="eyebrow">AI / ML TRAINING</span>
                  <span><CalendarDays size={14} aria-hidden="true" />{dateLabel(item)}</span>
                </div>
                <h3>{item.title}</h3>
                <p className="experience-card__organization">{item.organization}</p>
                {item.location && <p className="experience-card__location"><MapPin size={14} aria-hidden="true" />{item.location}</p>}
                {item.description && <p className="experience-card__description">{item.description}</p>}
              </div>
              <div className="experience-card__links">
                {item.certificateUrl && (
                  <a href={item.certificateUrl} target="_blank" rel="noopener noreferrer">
                    <FileBadge size={15} aria-hidden="true" /> View certificate <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
                {item.postUrl && (
                  <a href={item.postUrl} target="_blank" rel="noopener noreferrer">
                    <Linkedin size={15} aria-hidden="true" /> LinkedIn post <ArrowUpRight size={14} aria-hidden="true" />
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
