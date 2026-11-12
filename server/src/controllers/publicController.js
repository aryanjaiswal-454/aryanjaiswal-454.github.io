import nodemailer from "nodemailer";
import { Experience } from "../models/Experience.js";
import { Message } from "../models/Message.js";
import { Post } from "../models/Post.js";
import { Project } from "../models/Project.js";
import { Skill } from "../models/Skill.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { contactPayloadErrors, escapeHtml, normalizeContactPayload } from "../utils/contact.js";
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

export const createContactMessage = asyncHandler(async (request, response) => {
  const payload = normalizeContactPayload(request.body || {});
  const errors = contactPayloadErrors(payload);
  if (errors.length) {
    return response.status(400).json({ error: "Please check your message and try again.", details: [...new Set(errors)] });
  }

  const message = await Message.create(payload);
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPassword = process.env.SMTP_PASSWORD;
  const contactTo = process.env.CONTACT_TO || process.env.ADMIN_EMAIL;
  if (!smtpHost || !smtpUser || !smtpPassword || !contactTo) {
    return response.status(503).json({
      error: "Your message was saved, but email delivery is not configured. Please use the direct email link."
    });
  }

  try {
    const port = Number(process.env.SMTP_PORT || 587);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      return response.status(503).json({
        error: "Your message was saved, but email delivery is not configured correctly. Please use the direct email link."
      });
    }
    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port,
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: smtpUser, pass: smtpPassword }
    });
    await transporter.sendMail({
      from: `"Portfolio contact" <${smtpUser}>`,
      to: contactTo,
      replyTo: payload.email,
      subject: `Portfolio contact: ${payload.subject}`,
      text: `From: ${payload.name} <${payload.email}>\n\n${payload.message}`,
      html: `<p><strong>From:</strong> ${escapeHtml(payload.name)} &lt;${escapeHtml(payload.email)}&gt;</p><p><strong>Subject:</strong> ${escapeHtml(payload.subject)}</p><p>${escapeHtml(payload.message).replace(/\n/g, "<br>")}</p>`
    });
    message.emailSentAt = new Date();
    await message.save();
    return response.status(201).json({ message: "Your message was sent successfully." });
  } catch (error) {
    console.error("Contact email delivery failed", { name: error?.name || "Error" });
    return response.status(502).json({
      error: "Your message was saved, but email delivery could not be confirmed. Please use the direct email link."
    });
  }
});
