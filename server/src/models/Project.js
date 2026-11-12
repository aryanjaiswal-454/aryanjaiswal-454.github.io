import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  description: { type: String, required: true, trim: true, maxlength: 5000 },
  summary: { type: String, required: true, trim: true, maxlength: 300 },
  techStack: { type: [String], default: [] },
  category: { type: String, required: true, trim: true, maxlength: 80 },
  year: { type: Number, min: 1900, max: 2200 },
  image: { type: String, default: null },
  githubUrl: { type: String, required: true, trim: true },
  liveUrl: { type: String, default: null, trim: true },
  demoUrl: { type: String, default: null, trim: true },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 0 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

projectSchema.virtual("id").get(function getId() { return this.slug; });

export const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
