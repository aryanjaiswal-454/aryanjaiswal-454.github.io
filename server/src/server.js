import app from "./app.js";
import { connectDatabase } from "./config/database.js";
import { validateEnvironment } from "./config/env.js";

async function start() {
  const { port } = validateEnvironment();
  await connectDatabase();
  const server = app.listen(port, () => {
    console.info(`Portfolio API listening on port ${port}.`);
  });

  const shutdown = (signal) => {
    console.info(`${signal} received; closing API server.`);
    server.close(async () => {
      const mongoose = await import("mongoose");
      await mongoose.default.disconnect();
      process.exit(0);
    });
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error("API startup failed", { name: error?.name || "Error" });
  process.exitCode = 1;
});
