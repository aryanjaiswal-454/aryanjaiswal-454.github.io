import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const sourcePath = resolve(root, "portfolio-config.yaml");
const config = parse(await readFile(sourcePath, "utf8"));
const dataDirectory = resolve(root, "client/src/data");
const configDirectory = resolve(root, "client/src/config");

await Promise.all([
  mkdir(dataDirectory, { recursive: true }),
  mkdir(configDirectory, { recursive: true })
]);

const publicSite = {
  websiteUrl: config.websiteUrl,
  identity: config.identity,
  contact: config.contact,
  appearance: config.appearance,
  metadata: config.metadata,
  localStorageKeys: config.localStorageKeys,
  ariaLabels: config.ariaLabels,
  preferences: config.preferences
};

const moduleSource = (name, value) =>
  `export const ${name} = ${JSON.stringify(value, null, 2)};\nexport default ${name};\n`;

const timeline = [
  ...config.portfolio.experience.map((item) => ({
    ...item,
    type: "experience"
  })),
  ...config.portfolio.education.map((item) => ({
    ...item,
    type: "education"
  }))
].sort((a, b) => String(a.startDate || a.endDate).localeCompare(String(b.startDate || b.endDate)));
const timelineModule = [
  'import type { TimelineItem } from "../types";',
  `export const timeline = ${JSON.stringify(timeline, null, 2)} satisfies TimelineItem[];`,
  "export default timeline;",
  ""
].join("\n");

const generated = [
  [resolve(configDirectory, "site.js"), moduleSource("site", publicSite)],
  [resolve(dataDirectory, "projects.js"), moduleSource("projects", config.portfolio.projects)],
  [resolve(dataDirectory, "skills.js"), moduleSource("skills", config.portfolio.skills)],
  [resolve(dataDirectory, "tools.js"), moduleSource("tools", config.portfolio.tools)],
  [resolve(dataDirectory, "timeline.ts"), timelineModule],
  [
    resolve(dataDirectory, "recognition.js"),
    moduleSource("recognition", {
      awards: config.portfolio.awards,
      achievements: config.portfolio.achievements,
      certificates: config.portfolio.certificates,
      metrics: config.portfolio.metrics
    })
  ],
  [
    resolve(dataDirectory, "github-fallback.js"),
    moduleSource(
      "githubFallback",
      config.portfolio.projects
        .filter((project) => project.githubUrl)
        .map((project) => {
          const [owner, repository] = new URL(project.githubUrl).pathname.split("/").filter(Boolean);
          const repoName = repository || project.githubUrl.split("/").filter(Boolean).at(-1);
          return {
            name: repoName,
            full_name: `${owner}/${repoName}`,
            html_url: project.githubUrl,
            description: project.summary,
            language: null,
            stargazers_count: null
          };
        })
    )
  ]
];

await Promise.all(
  generated.map(([path, content]) => writeFile(path, content, "utf8"))
);

console.log(`Generated ${generated.length} client data modules from portfolio-config.yaml.`);
