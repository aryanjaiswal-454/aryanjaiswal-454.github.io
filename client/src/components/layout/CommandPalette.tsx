import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Command, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";

const commands = [
  { label: "Home", target: "#home", keywords: "profile education" },
  { label: "Technical expertise", target: "#skills", keywords: "skills stack technology" },
  { label: "Selected work", target: "#work", keywords: "projects portfolio" },
  { label: "Experience", target: "#experience", keywords: "training certificate" },
  { label: "Achievements", target: "#recognition", keywords: "awards certificates" },
  { label: "Certifications", target: "#certifications", keywords: "credentials courses" },
  { label: "Resume", target: "#resume", keywords: "cv pdf download" },
  { label: "Contact", target: "#contact", keywords: "email message" },
  { label: "Admin dashboard", target: "/admin", keywords: "manage content" }
];

interface CommandPaletteProps {
  onClose: () => void;
}

export function CommandPalette({ onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const matches = commands.filter((command) =>
    `${command.label} ${command.keywords}`.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    inputRef.current?.focus();
    const previous = document.activeElement as HTMLElement | null;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      previous?.focus();
    };
  }, [onClose]);

  useEffect(() => setActive(0), [query]);

  const run = (target: string) => {
    onClose();
    if (target.startsWith("/")) {
      navigate(target);
      return;
    }
    window.requestAnimationFrame(() => {
      document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => (current + 1) % Math.max(matches.length, 1));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => (current - 1 + matches.length) % Math.max(matches.length, 1));
    }
    if (event.key === "Enter" && matches[active]) run(matches[active].target);
  };

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>("input, button:not([disabled])");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <div
      className="command-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="command-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Command palette"
        onKeyDown={handleDialogKeyDown}
      >
        <div className="command-search">
          <Search size={19} aria-hidden="true" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search sections and actions…"
            aria-label="Search commands"
          />
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close palette">
            <X size={18} />
          </button>
        </div>
        <div className="command-results" role="listbox" aria-label="Available commands">
          {matches.length ? (
            matches.map((command, index) => (
              <button
                type="button"
                role="option"
                aria-selected={active === index}
                className={`command-option${active === index ? " is-active" : ""}`}
                key={command.target}
                onMouseEnter={() => setActive(index)}
                onClick={() => run(command.target)}
              >
                <span>{command.label}</span>
                <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            ))
          ) : (
            <p className="command-empty">No matching commands.</p>
          )}
        </div>
        <div className="command-footer">
          <span><Command size={13} aria-hidden="true" /> Navigate</span>
          <span>Enter to select</span>
        </div>
      </section>
    </div>
  );
}
