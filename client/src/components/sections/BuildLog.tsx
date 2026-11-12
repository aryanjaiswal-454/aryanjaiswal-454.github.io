import { useEffect, useState } from "react";
import site from "../../config/site.js";
import { useSiteMotion } from "../../hooks/useSiteMotion";

const agentLines = [
  "Quorum: source-grounded research",
  "Network Security: FastAPI + MLOps",
  "DevTinder: JWT + MongoDB-backed flows"
];

export function BuildLog() {
  const motionEnabled = useSiteMotion();
  const [logText, setLogText] = useState(agentLines[0]);

  useEffect(() => {
    if (!motionEnabled) return;
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
  }, [motionEnabled]);

  return (
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
  );
}
