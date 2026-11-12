import { useEffect, useState } from "react";
import { ArrowUpRight, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import site from "../../config/site.js";
import { BuildLog } from "./BuildLog";

const roles = ["AI/ML Engineer", "LLM & RAG Builder", "Agentic AI Builder"];

function SocialIcon({ label }: { label: string }) {
  if (label === "GitHub") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.726-4.043-1.416-4.043-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.304-5.466-1.334-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.524.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 6.004 0c2.291-1.552 3.297-1.23 3.297-1.23.655 1.652.243 2.873.12 3.176.77.84 1.235 1.91 1.235 3.221 0 4.609-2.804 5.624-5.475 5.921.43.372.823 1.102.823 2.222v3.293c0 .32.216.694.825.576C20.565 21.796 24 17.3 24 12c0-6.627-5.373-12-12-12" /></svg>;
  }
  if (label === "LinkedIn") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.35V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>;
  }
  return <Mail size={20} aria-hidden="true" />;
}

interface HeroProps {
  motionEnabled: boolean;
}

export function Hero({ motionEnabled }: HeroProps) {
  const reduceMotion = useReducedMotion();
  const [roleIndex, setRoleIndex] = useState(0);
  const roleMotion = motionEnabled && !reduceMotion;
  const [firstName, ...nameParts] = site.identity.displayName.trim().split(/\s+/);

  useEffect(() => {
    if (!roleMotion) return;
    const interval = window.setInterval(() => {
      setRoleIndex((index) => (index + 1) % roles.length);
    }, 2800);
    return () => window.clearInterval(interval);
  }, [roleMotion]);

  const socialLinks = [
    { href: site.contact.github, label: "GitHub" },
    { href: site.contact.linkedin, label: "LinkedIn" },
    { href: `mailto:${site.contact.email}`, label: "Email" }
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
          {socialLinks.map(({ href, label }) => (
              <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                <SocialIcon label={label} />
                <span>{label}</span>
              </a>
            ))}
          </div>
        </div>

        <BuildLog />

      </div>
    </section>
  );
}
