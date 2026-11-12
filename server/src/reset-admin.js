import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDatabase } from "./config/database.js";
import "./config/env.js";
import { User } from "./models/User.js";

async function resetAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!process.env.MONGODB_URI || !email || !password) {
    throw new Error("MONGODB_URI, ADMIN_EMAIL, and ADMIN_PASSWORD must be set in server/.env.");
  }

  await connectDatabase();
  const passwordHash = await bcrypt.hash(password, 12);
  await User.findOneAndUpdate(
    { email },
    { $set: { email, passwordHash, role: "admin" } },
    { upsert: true, new: true, setDefaultsOnInsert: true, runValidators: true }
  );
  console.info("Admin credentials synced from server/.env.");
}

resetAdmin()
  .catch((error) => {
    console.error("Admin credential reset failed", { name: error?.name || "Error" });
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
