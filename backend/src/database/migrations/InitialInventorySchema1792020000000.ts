import { MigrationInterface, QueryRunner } from "typeorm";

/**
 * Creates the initial inventory schema from the approved MVP data model.
 * Safe to run once through TypeORM's migration history; it does not drop or
 * rewrite existing tables or data.
 */
export class InitialInventorySchema1792020000000 implements MigrationInterface {
  name = "InitialInventorySchema1792020000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "categories" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "name" varchar(100) NOT NULL,
        "description" text,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_categories_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_categories_name" UNIQUE ("name")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "products" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "category_id" uuid NOT NULL,
        "sku" varchar(64) NOT NULL,
        "name" varchar(160) NOT NULL,
        "description" text,
        "unit_price" numeric(12, 2) NOT NULL,
        "current_stock" integer NOT NULL DEFAULT 0,
        "reorder_level" integer NOT NULL DEFAULT 0,
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updated_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_products_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_products_sku" UNIQUE ("sku"),
        CONSTRAINT "CHK_products_unit_price_non_negative" CHECK ("unit_price" >= 0),
        CONSTRAINT "CHK_products_current_stock_non_negative" CHECK ("current_stock" >= 0),
        CONSTRAINT "CHK_products_reorder_level_non_negative" CHECK ("reorder_level" >= 0),
        CONSTRAINT "FK_products_category_id" FOREIGN KEY ("category_id")
          REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "inventory_movements" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "product_id" uuid NOT NULL,
        "movement_type" varchar(10) NOT NULL,
        "quantity" integer NOT NULL,
        "note" varchar(500),
        "created_at" timestamptz NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "PK_inventory_movements_id" PRIMARY KEY ("id"),
        CONSTRAINT "CHK_inventory_movements_movement_type"
          CHECK ("movement_type" IN ('STOCK_IN', 'STOCK_OUT')),
        CONSTRAINT "CHK_inventory_movements_quantity_positive" CHECK ("quantity" > 0),
        CONSTRAINT "FK_inventory_movements_product_id" FOREIGN KEY ("product_id")
          REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE NO ACTION
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_products_category_id" ON "products" ("category_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_movements_product_created_at" ON "inventory_movements" ("product_id", "created_at")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_movements_created_at" ON "inventory_movements" ("created_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "inventory_movements"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "categories"`);
  }
}
