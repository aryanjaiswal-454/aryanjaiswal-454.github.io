import { Experience } from "../models/Experience.js";
import { Post } from "../models/Post.js";
import { Project } from "../models/Project.js";
import { Skill } from "../models/Skill.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const models = {
  projects: { model: Project, fields: ["title", "slug", "description", "summary", "techStack", "category", "year", "image", "githubUrl", "liveUrl", "demoUrl", "featured", "order"], idField: "slug" },
  skills: { model: Skill, fields: ["group", "items", "order"] },
  experience: { model: Experience, fields: ["type", "title", "qualification", "organization", "institution", "location", "startDate", "endDate", "description", "result", "status"] },
  posts: { model: Post, fields: ["title", "excerpt", "url", "date", "featured", "order"] }
};

function getResource(request) {
  const resource = models[request.params.resource];
  if (!resource) {
    const error = new Error("Unknown content resource.");
    error.status = 404;
    error.publicMessage = "The requested content type was not found.";
    throw error;
  }
  return resource;
}

function cleanPayload(body, allowedFields) {
  const payload = {};
  for (const field of allowedFields) {
    if (Object.hasOwn(body, field)) payload[field] = body[field];
  }
  return payload;
}

function recordKey(data) {
  return [
    data.type,
    data.organization || data.institution || "",
    data.title || data.qualification || ""
  ].join(":").toLowerCase();
}

function adminRecord(doc, resource) {
  const record = doc.toObject({ virtuals: true });
  record.id = resource.idField ? String(doc[resource.idField]) : doc._id.toString();
  return record;
}

export const listAdminRecords = asyncHandler(async (request, response) => {
  const resource = getResource(request);
  const records = await resource.model.find().sort({ order: 1, createdAt: 1 });
  response.json(records.map((record) => adminRecord(record, resource)));
});

export const createAdminRecord = asyncHandler(async (request, response) => {
  const resource = getResource(request);
  const payload = cleanPayload(request.body || {}, resource.fields);
  if (request.params.resource === "experience") payload.recordKey = recordKey(payload);
  const created = await resource.model.create(payload);
  response.status(201).json(adminRecord(created, resource));
});

export const updateAdminRecord = asyncHandler(async (request, response) => {
  const resource = getResource(request);
  const payload = cleanPayload(request.body || {}, resource.fields);
  if (request.params.resource === "experience") {
    const current = await resource.model.findById(request.params.id);
    if (!current) return response.status(404).json({ error: "Record not found." });
    payload.recordKey = recordKey({ ...current.toObject(), ...payload });
  }
  const filter = resource.idField ? { [resource.idField]: request.params.id } : { _id: request.params.id };
  const updated = await resource.model.findOneAndUpdate(filter, payload, {
    new: true,
    runValidators: true
  });
  if (!updated) return response.status(404).json({ error: "Record not found." });
  response.json(adminRecord(updated, resource));
});

export const deleteAdminRecord = asyncHandler(async (request, response) => {
  const resource = getResource(request);
  const filter = resource.idField ? { [resource.idField]: request.params.id } : { _id: request.params.id };
  const deleted = await resource.model.findOneAndDelete(filter);
  if (!deleted) return response.status(404).json({ error: "Record not found." });
  response.status(204).end();
});
