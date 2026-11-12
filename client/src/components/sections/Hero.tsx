import { useEffect, useState } from "react";
import { ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import site from "../../config/site.js";

const roles = ["AI/ML Engineer", "LLM & RAG Builder", "Agentic AI Builder"];
const agentLines = [
  "Quorum: source-grounded research",
  "Network Security: FastAPI + MLOps",
  "DevTinder: JWT + MongoDB-backed flows"
];

interface HeroProps {
  motionEnabled: boolean;
}

export function Hero({ motionEnabled }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const [logText, setLogText] = useState("");
  const roleMotion = motionEnabled && !reduceMotion;
  const [firstName, ...nameParts] = site.identity.displayName.trim().split(/\s+/);

  useEffect(() => {
    if (!roleMotion) return;
    const interval = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [roleMotion]);

  useEffect(() => {
    if (!roleMotion) {
      setLogText(agentLines[0]);
      return;
    }

    let lineIndex = 0;
    let charIndex = 0;
    let deleting = false;
    const interval = window.setInterval(() => {
      const current = agentLines[lineIndex];
      charIndex += deleting ? -1 : 1;
      setLogText(current.slice(0, Math.max(0, charIndex)));
      if (!deleting && charIndex >= current.length) {
        deleting = true;
      } else if (deleting && charIndex <= 0) {
        deleting = false;
        lineIndex = (lineIndex + 1) % agentLines.length;
      }
    }, 54);
    return () => window.clearInterval(interval);
  }, [roleMotion]);

  const socialLinks = [
    { href: site.contact.github, label: "GitHub", icon: Github },
    { href: site.contact.linkedin, label: "LinkedIn", icon: Linkedin },
    { href: `mailto:${site.contact.email}`, label: "Email", icon: Mail }
  ].filter((link) => Boolean(link.href));

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-content page-container">
        <div className="hero-copy">
          <p className="hero-kicker">
            <span className="status-dot" />
            {site.identity.profession}
            <span className="hero-kicker__divider">/</span>
            <span>{site.identity.availability}</span>
          </p>
          <h1 id="hero-title">
            <span className="hero-name">{firstName?.toUpperCase()}</span>
            <span className="hero-name hero-name--last">{nameParts.join(" ").toUpperCase()}<span className="hero-period">.</span></span>
          </h1>
          <div className="hero-role" aria-live="polite">
            <span className="hero-role__slash">/</span>
            <motion.span
              key={roleIndex}
              initial={roleMotion ? { opacity: 0, y: 8 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {roles[roleIndex]}
            </motion.span>
          </div>
          <p className="hero-intro">{site.identity.intro}</p>
          <div className="hero-actions">
            <a className="button button--primary button--large magnetic" href="#work">
              View selected work <ArrowUpRight size={17} aria-hidden="true" />
            </a>
            <a className="button button--ghost button--large" href={site.identity.resume} download>
              Download resume <span className="button-arrow" aria-hidden="true">↓</span>
            </a>
            <a className="button button--text button--large" href="#contact">
              Contact
            </a>
          </div>
          <div className="hero-socials" aria-label="Social profiles">
            {socialLinks.map(({ href, label, icon: Icon }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                <Icon size={17} aria-hidden="true" />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>

        <aside className="agent-panel" aria-label="Live project log">
          <div className="agent-panel__top">
            <span className="agent-panel__lights" aria-hidden="true"><i /><i /><i /></span>
            <span>BUILD LOG / LIVE</span>
            <span className="agent-panel__live"><span /> ACTIVE</span>
          </div>
          <div className="agent-panel__body">
            <p className="agent-panel__path">~/aryan/portfolio <span>main</span></p>
            <p><b>01</b><span className="terminal-green">system ready</span></p>
            <p><b>02</b><span>focus: {site.identity.roleLine2}</span></p>
            <p><b>03</b><span className="terminal-red">&gt; {logText}<i className="terminal-cursor" /></span></p>
          </div>
          <div className="agent-panel__bottom"><span>PYTHON</span><span>LLM SYSTEMS</span><span>SHIP / LEARN / REPEAT</span></div>
        </aside>

      </div>
    </section>
  );
}
