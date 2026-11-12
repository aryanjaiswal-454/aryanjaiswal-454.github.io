import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import site from "../../config/site.js";
import { useSiteMotion } from "../../hooks/useSiteMotion";

export function PageIntro() {
  const reduceMotion = useReducedMotion();
  const motionEnabled = useSiteMotion();
  const [visible, setVisible] = useState(() => {
    return window.sessionStorage.getItem("aryan-portfolio-intro-seen") !== "true";
  });

  useEffect(() => {
    if (!visible) return;
    if (reduceMotion || !motionEnabled) {
      setVisible(false);
      window.sessionStorage.setItem("aryan-portfolio-intro-seen", "true");
      return;
    }

    const timer = window.setTimeout(() => {
      setVisible(false);
      window.sessionStorage.setItem("aryan-portfolio-intro-seen", "true");
    }, 850);
    return () => window.clearTimeout(timer);
  }, [motionEnabled, reduceMotion, visible]);

  if (!visible || reduceMotion || !motionEnabled) return null;
  return (
    <motion.div
      className="page-intro"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 0.45, duration: 0.4 }}
      aria-hidden="true"
    >
      <div className="page-intro__brand">
        <img src={site.identity.logo} alt="" />
        <span>{site.identity.brandName}</span>
      </div>
      <i />
    </motion.div>
  );
}
