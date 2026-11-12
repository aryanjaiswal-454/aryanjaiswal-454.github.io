const CACHE_TTL_MS = 10 * 60 * 1000;
let cached = null;
let cachedAt = 0;
let inFlight = null;

export async function fetchGithubRepositories() {
  if (cached && Date.now() - cachedAt < CACHE_TTL_MS) return cached;
  if (inFlight) return inFlight;

  const username = process.env.GITHUB_USERNAME;
  if (!username || !/^[A-Za-z0-9-]{1,39}$/.test(username)) {
    throw new Error("GITHUB_USERNAME is missing or invalid.");
  }

  const headers = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-github-repository-feed"
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  inFlight = fetch(
    `https://api.github.com/users/${encodeURIComponent(username)}/repos?sort=updated&per_page=100&type=owner`,
    { headers, signal: AbortSignal.timeout(8000) }
  )
    .then(async (response) => {
      if (!response.ok) throw new Error(`GitHub returned status ${response.status}.`);
      const body = await response.json();
      if (!Array.isArray(body)) throw new Error("GitHub returned an unexpected response.");
      cached = body.map((repo) => ({
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        language: repo.language,
        stargazers_count: repo.stargazers_count
      }));
      cachedAt = Date.now();
      return cached;
    })
    .finally(() => { inFlight = null; });

  return inFlight;
}

export function clearGithubCache() {
  cached = null;
  cachedAt = 0;
  inFlight = null;
}
