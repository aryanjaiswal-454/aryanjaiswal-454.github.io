import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 180 },
  excerpt: { type: String, required: true, trim: true, maxlength: 1500 },
  url: { type: String, required: true, unique: true, trim: true },
  date: { type: String, default: null, trim: true },
  featured: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

postSchema.virtual("id").get(function getId() { return this._id.toString(); });

export const Post = mongoose.models.Post || mongoose.model("Post", postSchema);
