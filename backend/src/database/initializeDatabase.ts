import { Client } from "pg";

import { env, getDatabaseConfig } from "../config/env";
import { dataSource } from "./dataSource";

function quotePostgresIdentifier(identifier: string): string {
  return `"${identifier.replace(/"/g, '""')}"`;
}

/**
 * Creates the configured application database if it does not exist, then
 * initializes TypeORM and applies any pending, versioned schema migrations.
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

  await dataSource.initialize();
  console.info("Application database connection established.");

  try {
    const appliedMigrations = await dataSource.runMigrations({ transaction: "all" });

    if (appliedMigrations.length > 0) {
      console.info(
        `Applied ${appliedMigrations.length} database migration(s): ${appliedMigrations
          .map((migration) => migration.name)
          .join(", ")}`,
      );
    } else {
      console.info("Database schema is up to date.");
    }
  } catch (error) {
    await dataSource.destroy();
    throw error;
  }
}
