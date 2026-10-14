import { env } from "./config/env";
import app from "./app";

const server = app.listen(env.PORT, () => {
  console.log(`Server listening on port ${env.PORT}`);
});

function shutdown(signal: string): void {
  console.log(`${signal} received. Closing HTTP server.`);

  server.close((error) => {
    if (error) {
      console.error("Failed to close HTTP server cleanly:", error);
      process.exitCode = 1;
    }
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
