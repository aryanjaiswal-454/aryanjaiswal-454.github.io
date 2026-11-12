import { Experience } from "../models/Experience.js";
import { Post } from "../models/Post.js";
import { Project } from "../models/Project.js";
import { Skill } from "../models/Skill.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { fetchGithubRepositories } from "../utils/github.js";

export const listProjects = asyncHandler(async (_request, response) => {
  const projects = await Project.find().sort({ featured: -1, order: 1, title: 1 }).lean();
  response.json(projects.map((project) => ({ ...project, id: project.slug })));
});

export const listSkills = asyncHandler(async (_request, response) => {
  const groups = await Skill.find().sort({ order: 1, group: 1 }).lean();
  response.json(groups.map((group) => ({ ...group, id: String(group._id) })));
});

export const listExperience = asyncHandler(async (_request, response) => {
  const items = await Experience.find().sort({ startDate: -1, endDate: -1 }).lean();
  response.json(items.map((item) => ({ ...item, id: String(item._id) })));
});

export const listPosts = asyncHandler(async (_request, response) => {
  const posts = await Post.find({ featured: true }).sort({ order: 1, date: -1 }).lean();
  response.json(posts.map((post) => ({ ...post, id: String(post._id) })));
});

export const listGithubRepositories = asyncHandler(async (_request, response) => {
  try {
    const [repositories, projects] = await Promise.all([
      fetchGithubRepositories(),
      Project.find({ githubUrl: { $exists: true, $ne: "" } }).select("githubUrl").lean()
    ]);
    const allowedNames = new Set(
      projects
        .map((project) => project.githubUrl.split("/").filter(Boolean).at(-1)?.toLowerCase())
        .filter(Boolean)
    );
    response.json(repositories.filter((repo) => allowedNames.has(repo.name.toLowerCase())));
  } catch {
    response.status(503).json({ error: "GitHub repository data is temporarily unavailable." });
  }
});

