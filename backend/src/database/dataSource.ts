import "reflect-metadata";
import { DataSource } from "typeorm";

import { env, getDatabaseConfig } from "../config/env";
import { Category } from "../entities/Category";
import { InventoryMovement } from "../entities/InventoryMovement";
import { Product } from "../entities/Product";

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
  entities: [Category, Product, InventoryMovement],
  migrations: [],
  subscribers: [],
  // Keep schema changes explicit; database provisioning does not create tables.
  migrationsRun: false,
});

export { env };
