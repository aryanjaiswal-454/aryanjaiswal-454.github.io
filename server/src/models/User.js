import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ["admin"], default: "admin" }
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model("User", userSchema);
