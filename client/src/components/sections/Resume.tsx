import { ArrowDownToLine, ArrowUpRight, FileText } from "lucide-react";
import site from "../../config/site.js";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

const resumeLinks = [
  { href: "https://wa.me/917068618234", label: "Phone", rect: [89.072, 52.376, 168.64, 66.664] },
  { href: "mailto:aryanjaiswal0045@gmail.com", label: "Email", rect: [176.951, 52.376, 316.61, 66.664] },
  { href: "https://www.linkedin.com/in/aryan5178/", label: "LinkedIn", rect: [324.92, 52.376, 369.186, 66.664] },
  { href: "https://aryanjaiswal-454.github.io/", label: "Portfolio", rect: [377.496, 52.376, 420.883, 66.664] },
  { href: "https://github.com/aryanjaiswal-454", label: "GitHub", rect: [429.193, 52.376, 467.322, 66.664] },
  { href: "https://leetcode.com/u/leetcode_aryan/", label: "LeetCode", rect: [475.633, 52.376, 522.928, 66.664] },
  { href: "https://github.com/aryanjaiswal-454/Multi-Agent-AI-Research-System", label: "Multi-Agent AI Research System on GitHub", rect: [60.644, 233.496, 95.638, 245.452] },
  { href: "https://quorum-ai-research-system.streamlit.app/", label: "Quorum AI Research System demo", rect: [103.055, 233.496, 152.093, 245.452] },
  { href: "https://github.com/aryanjaiswal-454/Network-Security", label: "Network Security project on GitHub", rect: [60.644, 324.968, 95.638, 336.924] },
  { href: "https://youtu.be/tjDm-z14DZU", label: "Network Security project video", rect: [103.055, 324.968, 158.873, 336.924] },
  { href: "https://github.com/aryanjaiswal-454/DevTinder", label: "DevTinder on GitHub", rect: [60.644, 427.953, 95.638, 439.908] },
  { href: "https://dev-tinder-five-rho.vercel.app", label: "DevTinder live site", rect: [103.055, 427.953, 152.093, 439.908] },
  { href: "https://drive.google.com/file/d/1CnCg38Z5NQ0rVm4-CUOwBT6J5o6yeUv0/view?usp=sharing", label: "Resume project certificate", rect: [327.949, 524.963, 374.878, 539.254] },
] as const;

export function Resume() {
  const resumeUrl = site.identity.resume;

  return (
    <section className="section section-resume" id="resume" aria-labelledby="resume-title">
      <div className="page-container">
        <SectionHeading
          id="resume-title"
          number="07"
          eyebrow="Resume"
          title="My experience, at a glance."
          description="A concise overview of my education, technical experience, and selected projects."
        />
        <Reveal className="resume-viewer surface-hover">
          <div className="resume-viewer__preview">
            <div className="resume-viewer__page">
              <img
                className="resume-viewer__image"
                src="/assets/resume-preview.png"
                alt="Preview of Aryan Jaiswal resume page"
                loading="lazy"
              />
              {resumeLinks.map(({ href, label, rect: [x0, y0, x1, y1] }) => (
                <a
                  key={href}
                  className="resume-viewer__link"
                  href={href}
                  aria-label={label}
                  title={label}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                  style={{
                    left: `${(x0 / 612) * 100}%`,
                    top: `${(y0 / 792) * 100}%`,
                    width: `${((x1 - x0) / 612) * 100}%`,
                    height: `${((y1 - y0) / 792) * 100}%`,
                  }}
                />
              ))}
            </div>
          </div>
          <aside className="resume-viewer__panel">
            <div className="resume-viewer__label">
              <span className="resume-viewer__icon"><FileText size={19} aria-hidden="true" /></span>
              <div>
                <strong>Aryan Jaiswal</strong>
                <span>Resume PDF</span>
              </div>
            </div>
            <h3 className="resume-viewer__title">A closer look at my work.</h3>
            <p className="resume-viewer__description">View the complete resume in a new tab or save a PDF copy.</p>
            <div className="resume-viewer__actions">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Open PDF <ArrowUpRight size={15} aria-hidden="true" />
              </a>
              <a href={resumeUrl} download="Aryan-Jaiswal-Resume.pdf">
                Download PDF <ArrowDownToLine size={15} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </Reveal>
      </div>
    </section>
  );
}