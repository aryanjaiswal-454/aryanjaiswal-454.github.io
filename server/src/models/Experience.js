import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema({
  type: { type: String, enum: ["experience", "education"], required: true },
  title: { type: String, trim: true, maxlength: 150 },
  qualification: { type: String, trim: true, maxlength: 150 },
  organization: { type: String, trim: true, maxlength: 180 },
  institution: { type: String, trim: true, maxlength: 180 },
  location: { type: String, trim: true, maxlength: 150 },
  startDate: { type: String, trim: true, maxlength: 30 },
  endDate: { type: String, trim: true, maxlength: 30 },
  description: { type: String, trim: true, maxlength: 5000 },
  result: { type: String, trim: true, maxlength: 500 },
  status: { type: String, trim: true, maxlength: 80 },
  recordKey: { type: String, required: true, unique: true }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

experienceSchema.virtual("id").get(function getId() { return this._id.toString(); });

export const Experience = mongoose.models.Experience || mongoose.model("Experience", experienceSchema);
