import { useCallback, useEffect, useState } from "react";
import site from "../config/site.js";

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useMotionPreference() {
  const storageKey = site.localStorageKeys.motionPreference;
  const [enabled, setEnabled] = useState(() => {
    const stored = window.localStorage.getItem(storageKey);
    return stored === null ? !prefersReducedMotion() : stored === "true";
  });

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateDefault = () => {
      if (window.localStorage.getItem(storageKey) === null) {
        setEnabled(!query.matches);
      }
    };
    query.addEventListener("change", updateDefault);
    return () => query.removeEventListener("change", updateDefault);
  }, [storageKey]);

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      window.localStorage.setItem(storageKey, String(next));
      return next;
    });
  }, [storageKey]);

  return { enabled, toggle };
}
