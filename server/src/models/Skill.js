import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  group: { type: String, required: true, unique: true, trim: true, maxlength: 100 },
  items: { type: [String], default: [] },
  order: { type: Number, default: 0 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

skillSchema.virtual("id").get(function getId() { return this._id.toString(); });

export const Skill = mongoose.models.Skill || mongoose.model("Skill", skillSchema);
