import { ArrowDownToLine, ArrowUpRight, FileText } from "lucide-react";
import site from "../../config/site.js";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

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
            <iframe
              className="resume-viewer__frame"
              src={`${resumeUrl}#view=FitH`}
              title="Aryan Jaiswal resume PDF preview"
              loading="lazy"
            />
            <p className="resume-viewer__fallback">If the preview is unavailable, open or download the PDF.</p>
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
