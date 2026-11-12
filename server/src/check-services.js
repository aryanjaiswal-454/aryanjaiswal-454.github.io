import mongoose from "mongoose";
import nodemailer from "nodemailer";
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

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === "true",
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      connectionTimeout: 8000,
      greetingTimeout: 8000,
      socketTimeout: 12000
    });
    await transporter.verify();
    console.info("SMTP authentication and transport: verified (no email sent).");
  } catch (error) {
    console.error("SMTP authentication or transport: failed.", { code: error?.code || "unknown" });
    process.exitCode = 1;
  }
}

await mongoose.disconnect();
