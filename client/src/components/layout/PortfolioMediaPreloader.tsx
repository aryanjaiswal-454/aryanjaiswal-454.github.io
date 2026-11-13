import { useEffect } from "react";
import site from "../../config/site.js";
import projects from "../../data/projects.js";
import recognition from "../../data/recognition.js";

const mediaUrls = [...new Set([
  site.identity.logo,
  "/assets/portrait.png",
  ...projects.map((project) => project.image),
  ...recognition.certificates.map((certificate) => certificate.image)
].filter((url): url is string => typeof url === "string" && url.trim().length > 0))];

export function PortfolioMediaPreloader() {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      for (const url of mediaUrls) {
        const image = new Image();
        image.decoding = "async";
        image.fetchPriority = "low";
        image.src = url;
      }
    }, 250);

    return () => window.clearTimeout(timer);
  }, []);

  return null;
}
