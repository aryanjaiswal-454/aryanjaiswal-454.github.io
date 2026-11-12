import { BrainCircuit, Code2, Database, FileBadge, Network, Sparkles, type LucideIcon } from "lucide-react";
import { useState } from "react";
import recognition from "../../data/recognition.js";
import { Reveal } from "../ui/Reveal";
import { SectionHeading } from "../ui/SectionHeading";

interface Certificate {
  title: string;
  issuer: string;
  category: "learning" | "competition";
  detail?: string;
  topics?: string[];
  image?: string;
  credentialId?: string;
}

const certificateIcons: Array<{ matches: string[]; icon: LucideIcon }> = [
  { matches: ["artificial intelligence"], icon: BrainCircuit },
  { matches: ["data science"], icon: Database },
  { matches: ["skills passport"], icon: Sparkles },
  { matches: ["dynamic programming"], icon: Code2 },
  { matches: ["node", "javascript"], icon: Code2 },
  { matches: ["packet tracer"], icon: Network },
  { matches: ["hackathon", "hackstorm", "techsprint", "smart india"], icon: Sparkles }
];

function CertificateBrowser({ certificates, title }: { certificates: Certificate[]; title: string }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  if (!certificates.length) return null;
  const selected = selectedIndex === null ? null : certificates[selectedIndex] ?? null;

  return (
    <div className="certificate-group">
      <h3 className="certificate-group__title">{title}</h3>
      <div className="certificate-browser">
        <nav className="certificate-list" aria-label={title}>
          {certificates.map((certificate, index) => {
            const name = certificate.title.toLowerCase();
            const Icon = certificateIcons.find(({ matches }) => matches.some((match) => name.includes(match)))?.icon || FileBadge;
            const active = index === selectedIndex;
            return (
              <button
                className={`certificate-list__item${active ? " is-active" : ""}`}
                type="button"
                aria-current={active ? "true" : undefined}
                key={certificate.title}
                onFocus={() => setSelectedIndex(index)}
                onClick={() => setSelectedIndex(index)}
              >
                <span className="certification-card__icon"><Icon size={18} aria-hidden="true" /></span>
                <span className="certificate-list__copy">
                  <strong>{certificate.title}</strong>
                  <span>{certificate.issuer}</span>
                </span>
              </button>
            );
          })}
        </nav>
        {selected ? <Reveal className="certificate-viewer" key={selected.title}>
          <div className="certificate-viewer__heading">
            <div>
              <span className="certificate-viewer__eyebrow">{title}</span>
              <h4>{selected.title}</h4>
              <p>{selected.issuer}</p>
            </div>
            {selected.credentialId && (
              <div className="certificate-viewer__id">
                <span>Credential ID</span>
                <strong>{selected.credentialId}</strong>
              </div>
            )}
          </div>
          {selected.image ? (
            <a className="certificate-viewer__image" href={selected.image} target="_blank" rel="noopener noreferrer" aria-label={`Open full-size certificate: ${selected.title}`}>
              <img src={selected.image} alt={`${selected.title} certificate`} loading="lazy" decoding="async" />
            </a>
          ) : (
            <div className="certificate-viewer__empty"><FileBadge size={30} aria-hidden="true" /><span>Certificate image unavailable</span></div>
          )}
          {(selected.detail || selected.topics?.length) && (
            <div className="certificate-viewer__details">
              {selected.detail && <p>{selected.detail}</p>}
              {selected.topics?.length ? <ul>{selected.topics.map((topic) => <li key={topic}>{topic}</li>)}</ul> : null}
            </div>
          )}
        </Reveal> : (
          <div className="certificate-viewer certificate-viewer__empty">
            <FileBadge size={30} aria-hidden="true" />
            <span>Select a certificate to preview it here.</span>
          </div>
        )}
      </div>
    </div>
  );
}

export function Certifications() {
  const certificates = recognition.certificates as Certificate[];
  if (!certificates.length) return null;
  const learningCertificates = certificates.filter((certificate) => certificate.category === "learning");
  const competitionCertificates = certificates.filter((certificate) => certificate.category === "competition");

  return (
    <section className="section section-certifications" id="certifications" aria-labelledby="certifications-title">
      <div className="page-container">
        <SectionHeading
          id="certifications-title"
          number="06"
          eyebrow="Certifications"
          title="Learning and competition."
          description="Professional development, technical training, and selected competition achievements."
        />
        <CertificateBrowser certificates={learningCertificates} title="Courses & Professional Development" />
        <CertificateBrowser certificates={competitionCertificates} title="Competitions & Hackathons" />
      </div>
    </section>
  );
}
