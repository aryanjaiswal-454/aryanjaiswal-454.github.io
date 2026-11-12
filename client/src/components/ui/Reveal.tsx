import { motion, useReducedMotion } from "framer-motion";
import { useState, type FocusEvent, type PropsWithChildren } from "react";
import { useSiteMotion } from "../../hooks/useSiteMotion";

interface RevealProps extends PropsWithChildren {
  className?: string;
  delay?: number;
}

export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const reduceMotion = useReducedMotion();
  const motionEnabled = useSiteMotion();
  const shouldAnimate = motionEnabled && !reduceMotion;
  const [highlighted, setHighlighted] = useState(false);
  const surface = className?.split(/\s+/).includes("surface-hover") ?? false;
  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const target = event.relatedTarget;
    if (!(target instanceof Node) || !event.currentTarget.contains(target)) {
      setHighlighted(false);
    }
  };
  return (
    <motion.div
      className={`${className || ""}${highlighted && surface ? " is-highlighted" : ""}`}
      initial={shouldAnimate ? { opacity: 0, y: 24 } : false}
      whileInView={shouldAnimate ? { opacity: 1, y: 0 } : undefined}
      whileHover={surface && shouldAnimate ? { y: -3 } : undefined}
      whileFocus={surface && shouldAnimate ? { y: -3 } : undefined}
      viewport={{ once: true, amount: 0.14 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => surface && setHighlighted(true)}
      onMouseLeave={() => surface && setHighlighted(false)}
      onFocusCapture={() => surface && setHighlighted(true)}
      onBlurCapture={surface ? handleBlur : undefined}
    >
      {children}
    </motion.div>
  );
}
