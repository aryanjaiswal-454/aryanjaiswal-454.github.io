import { ArrowUpRight, Braces, Code2, GraduationCap, MapPin, type LucideIcon } from "lucide-react";
import site from "../../config/site.js";
import recognition from "../../data/recognition.js";
import timeline from "../../data/timeline";
import { SectionHeading } from "../ui/SectionHeading";
import { Reveal } from "../ui/Reveal";

const metricIcons: Record<string, LucideIcon> = {
  "DSA problems solved": Code2,
  "LeetCode contest rating": Braces,
  "CodeChef contest rating": Code2
};

const education = timeline.find((item) => item.type === "education" && item.qualification?.startsWith("B.Tech."));
const schoolRecords = [
  ...timeline.filter((item) => item.type === "education" && item.qualification === "Class XII"),
  ...timeline.filter((item) => item.type === "education" && item.qualification === "Class X")
];
const cgpa = recognition.metrics.find((item) => item.label === "B.Tech. CGPA")?.value;
const profileMetrics = recognition.metrics
  .filter((item) => item.label !== "B.Tech. CGPA")
  .map((item) => ({ ...item, icon: metricIcons[item.label] || Code2 }));

export function Home() {
  return (
    <section className="section section-home" id="home" aria-labelledby="home-title">
      <div className="page-container">
        <SectionHeading
          id="home-title"
          number="01"
          eyebrow="Home"
          title="Engineering fundamentals. Intelligent products."
          description="CSE at MMMUT, Gorakhpur, focused on AI/ML, Agentic AI, full-stack development, and software engineering."
        />
        <div className="home-grid">
          <Reveal className="home-intro surface-hover">
            <img className="home-intro__portrait" src="/assets/portrait.png" alt="Aryan Jaiswal" />
            <span className="eyebrow">HOW I WORK</span>
            <h3>Learn the fundamentals. Build beyond the demo.</h3>
            <p>{site.identity.about}</p>
            <div className="home-focus" aria-label="Professional focus">
              <span>AI / ML</span>
              <span>Agentic AI</span>
              <span>Full-stack</span>
              <span>Software engineering</span>
            </div>
            <a className="text-link" href="#work">
              Explore selected projects <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </Reveal>

          {education && (
            <Reveal className="home-education surface-hover" delay={0.06}>
              <div className="home-education__top">
                <span className="eyebrow">EDUCATION</span>
                <GraduationCap size={20} aria-hidden="true" />
              </div>
              <h3>{education.institution}</h3>
              <p>{education.qualification}</p>
              <span className="home-education__dates">{education.startDate}–{education.endDate}</span>
              <div className="home-education__footer">
                <span><MapPin size={14} aria-hidden="true" />{education.location || site.identity.location}</span>
                {cgpa && <strong>CGPA {cgpa}</strong>}
              </div>
            </Reveal>
          )}

          <div className="home-stats" aria-label="Competitive programming and academic highlights">
            {profileMetrics.map(({ icon: Icon, label, value }, index) => (
              <Reveal className="home-stat surface-hover" key={label} delay={0.1 + index * 0.04}>
                <Icon size={18} aria-hidden="true" />
                <strong>{value}</strong>
                <span>{label}</span>
              </Reveal>
            ))}
          </div>
          <div className="home-schooling" aria-label="School education">
            {schoolRecords.map((record) => (
              <article className="home-school-card surface-hover" key={record.qualification || record.institution}>
                <div className="home-school-card__top">
                  <span className="eyebrow">{record.qualification} · {record.endDate}</span>
                  <strong>{record.result}</strong>
                </div>
                <h4>{record.institution}</h4>
                <p>{record.location}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
