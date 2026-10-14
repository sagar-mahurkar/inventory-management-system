import { Client } from "pg";

import { env, getDatabaseConfig } from "../config/env";
import { dataSource } from "./dataSource";

function quotePostgresIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

/**
 * Creates the configured application database if it does not exist, then
 * initializes the application's TypeORM connection. It does not create tables.
 *
 * The configured database user must have permission to CREATE DATABASE.
 */
export async function initializeDatabase(): Promise<void> {
  const config = getDatabaseConfig();

  const adminClient = new Client({
    host: config.host,
    port: config.port,
    database: env.DATABASE_ADMIN_DB,
    user: config.username,
    password: config.password,
  });

  try {
    await adminClient.connect();

    const result = await adminClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [config.database],
    );

    if (result.rowCount === 0) {
      await adminClient.query(
        `CREATE DATABASE ${quotePostgresIdentifier(config.database)}`,
      );
      console.info(`Created database "${config.database}".`);
    } else {
      console.info(`Database "${config.database}" already exists.`);
    }
  } finally {
    await adminClient.end();
  }

  // synchronize is disabled; no tables or schema are created in this phase.
  await dataSource.initialize();
  console.info("Application database connection established.");
}
