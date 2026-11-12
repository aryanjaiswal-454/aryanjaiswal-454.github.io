import mongoose from "mongoose";
import { validateEnvironment } from "./config/env.js";
import { connectDatabase } from "./config/database.js";

let environmentValid = true;

try {
  validateEnvironment();
} catch (error) {
  console.error("Environment check failed", { message: error.message });
  process.exitCode = 1;
  environmentValid = false;
}

if (environmentValid) {
  try {
    await connectDatabase();
    console.info("MongoDB connectivity: verified.");
  } catch (error) {
    console.error("MongoDB connectivity: failed.", {
      name: error?.name || "Error",
      code: error?.code || "unknown",
      codeName: error?.codeName || "unknown"
    });
    process.exitCode = 1;
  }
}

await mongoose.disconnect();
