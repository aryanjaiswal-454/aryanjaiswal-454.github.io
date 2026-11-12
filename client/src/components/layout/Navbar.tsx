import { useEffect, useRef, useState } from "react";
import { Command, Menu, X } from "lucide-react";
import type { CSSProperties } from "react";
import site from "../../config/site.js";

const links = [
  { label: "Home", id: "home" },
  { label: "Work", id: "work" },
  { label: "Expertise", id: "skills" },
  { label: "Experience", id: "experience" },
  { label: "Recognition", id: "recognition" },
  { label: "Certifications", id: "certifications" },
  { label: "Resume", id: "resume" }
];

const sectionIds = [...links.map(({ id }) => id), "contact"];

interface NavbarProps {
  motionEnabled: boolean;
  onToggleMotion: () => void;
  onOpenPalette: () => void;
}

export function Navbar({ motionEnabled, onToggleMotion, onOpenPalette }: NavbarProps) {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);
    let frame = 0;
    const updateActiveSection = () => {
      frame = 0;
      const activationLine = window.innerHeight * 0.35;
      let current = "home";
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationLine) current = section.id;
        else break;
      }
      setActive(current);
      const nextUrl = `${window.location.pathname}${window.location.search}#${current}`;
      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) {
        window.history.replaceState(null, "", nextUrl);
      }
    };
    const scheduleUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateActiveSection);
    };

    updateActiveSection();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const focusable = navRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = focusable?.[0];
    const last = focusable?.[focusable.length - 1];
    first?.focus();
    const handleMenuKeys = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      } else if (event.key === "Tab" && first && last) {
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleMenuKeys);
    document.body.classList.add("menu-open");
    return () => {
      document.removeEventListener("keydown", handleMenuKeys);
      document.body.classList.remove("menu-open");
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <a className="wordmark" href="/#top" onClick={closeMenu} aria-label={site.ariaLabels.homeLink}>
        <span className="wordmark__symbol"><img src={site.identity.logo} alt="" /></span>
        <span className="wordmark__name">{site.identity.brandName}</span>
      </a>

      <nav ref={navRef} id="primary-navigation" className={`primary-nav${menuOpen ? " is-open" : ""}`} aria-label="Main navigation">
        <div className="mobile-nav-head">
          <span className="eyebrow">Navigation</span>
          <button
            type="button"
            className="icon-button mobile-nav-close"
            onClick={closeMenu}
            aria-label={site.ariaLabels.closeMenu}
          >
            <X size={20} />
          </button>
        </div>
        {links.map((link, index) => (
          <a
            key={link.id}
            href={`/#${link.id}`}
            className={`nav-link${active === link.id ? " is-active" : ""}`}
            aria-current={active === link.id ? "location" : undefined}
            onClick={closeMenu}
            style={{ "--nav-index": index } as CSSProperties}
          >
            {link.label}
          </a>
        ))}
        <div className="mobile-nav-actions">
          <a className="button button--primary" href="/#contact" onClick={closeMenu}>
            Let&apos;s talk <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <div className="header-actions">
        <button
          type="button"
          className="header-tool"
          onClick={onOpenPalette}
          aria-label="Open command palette"
          title="Search (Ctrl + K)"
        >
          <Command size={16} aria-hidden="true" />
        </button>
        <button
          type="button"
          className="motion-toggle"
          onClick={onToggleMotion}
          aria-pressed={motionEnabled}
          aria-label={site.ariaLabels.motionToggle}
          title={motionEnabled ? "Turn motion off" : "Turn motion on"}
        >
          <span className="motion-toggle__track" aria-hidden="true"><span /></span>
          <span className="motion-toggle__label">Motion {motionEnabled ? "on" : "off"}</span>
        </button>
        <a className="button button--small button--outline header-contact" href="/#contact">
          Contact <span aria-hidden="true">↗</span>
        </a>
        <button
          ref={menuToggleRef}
          type="button"
          className="icon-button menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? site.ariaLabels.closeMenu : site.ariaLabels.openMenu}
          aria-expanded={menuOpen}
          aria-controls="primary-navigation"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
      <div className={`nav-backdrop${menuOpen ? " is-open" : ""}`} onClick={closeMenu} />
    </header>
  );
}
