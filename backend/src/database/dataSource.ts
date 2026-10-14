import "reflect-metadata";
import { DataSource } from "typeorm";

import { env, getDatabaseConfig } from "../config/env";

const databaseConfig = getDatabaseConfig();

export const dataSource = new DataSource({
  type: "postgres",
  host: databaseConfig.host,
  port: databaseConfig.port,
  database: databaseConfig.database,
  username: databaseConfig.username,
  password: databaseConfig.password,
  synchronize: false,
  logging: false,
  entities: [],
  migrations: [],
  subscribers: [],
  // Keep this explicit: schema creation belongs to a later phase.
  migrationsRun: false,
});

export { env };
