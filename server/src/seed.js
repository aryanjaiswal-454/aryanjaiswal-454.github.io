import bcrypt from "bcryptjs";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import mongoose from "mongoose";
import { parse } from "yaml";
import { connectDatabase } from "./config/database.js";
import "./config/env.js";
import { Experience } from "./models/Experience.js";
import { Post } from "./models/Post.js";
import { Project } from "./models/Project.js";
import { Skill } from "./models/Skill.js";
import { User } from "./models/User.js";

function timelineRecordKey(item, type) {
  return [
    type,
    item.organization || item.institution || "",
    item.title || item.qualification || ""
  ].join(":").toLowerCase();
}

async function upsertMany(Model, items, keyFor) {
  if (!items.length) return;
  const operations = items.map((item, index) => {
    const data = { ...item, order: item.order ?? index };
    const key = keyFor(data);
    return {
      updateOne: {
        filter: key.filter,
        update: { $set: key.document(data) },
        upsert: true
      }
    };
  });
  await Model.bulkWrite(operations, { ordered: true });
}

async function seed() {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set before seeding.");
  }
  await connectDatabase();
  const root = resolve(fileURLToPath(new URL("../../", import.meta.url)));
  const config = parse(await readFile(resolve(root, "portfolio-config.yaml"), "utf8"));
  const portfolio = config.portfolio;

  await upsertMany(Project, portfolio.projects, (project) => ({
    filter: { slug: project.slug },
    document: (data) => data
  }));
  await upsertMany(Skill, portfolio.skills, (skill) => ({
    filter: { group: skill.group },
    document: (data) => data
  }));
  const timeline = [
    ...portfolio.experience.map((item) => ({ ...item, type: "experience" })),
    ...portfolio.education.map((item) => ({ ...item, type: "education" }))
  ];
  await upsertMany(Experience, timeline, (item) => ({
    filter: { recordKey: timelineRecordKey(item, item.type) },
    document: (data) => ({ ...data, recordKey: timelineRecordKey(data, data.type) })
  }));
  await upsertMany(Post, config.writing?.posts || [], (post) => ({
    filter: { url: post.url },
    document: (data) => data
  }));

  const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
  const existingAdmin = await User.findOne({ email });
  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    await User.create({ email, passwordHash, role: "admin" });
  }
  console.info("Portfolio content seeded; existing administrator credentials were not modified.");
}

seed()
  .catch((error) => {
    console.error("Portfolio seed failed", { name: error?.name || "Error" });
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
