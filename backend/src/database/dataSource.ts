import "reflect-metadata";
import { DataSource } from "typeorm";

import { env, getDatabaseConfig } from "../config/env";
import { Category } from "../entities/Category";
import { InventoryMovement } from "../entities/InventoryMovement";
import { Product } from "../entities/Product";
import { InitialInventorySchema1792020000000 } from "./migrations/InitialInventorySchema1792020000000";

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
  migrations: [InitialInventorySchema1792020000000],
  subscribers: [],
  migrationsRun: false,
});

export { env };
