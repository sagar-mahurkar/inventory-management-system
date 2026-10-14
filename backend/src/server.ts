import { env } from "./config/env";
import { initializeDatabase } from "./database/initializeDatabase";
import app from "./app";

async function startServer(): Promise<void> {
  await initializeDatabase();

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

      if (dataSourceIsInitialized()) {
        // Dynamically imported below is intentionally avoided; see closeDatabase.
        void closeDatabase();
      }
    });
  }

  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

import { dataSource } from "./database/dataSource";

function dataSourceIsInitialized(): boolean {
  return dataSource.isInitialized;
}

async function closeDatabase(): Promise<void> {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
}

startServer().catch((error: unknown) => {
  console.error("Failed to initialize the application:", error);
  process.exitCode = 1;
});
