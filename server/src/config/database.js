import mongoose from "mongoose";

export async function connectDatabase() {
  await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 10_000
  });
  console.info("MongoDB connected.");
}
