import { dataSource } from "../database/dataSource";
import { Category } from "../entities/Category";
import { InventoryMovement } from "../entities/InventoryMovement";
import { Product } from "../entities/Product";

export interface InventorySummaryRaw {
  total_products: string;
  total_units_in_stock: string;
  total_inventory_value: string;
  low_stock_products: string;
  out_of_stock_products: string;
  total_categories: string;
}

export interface MovementSummaryRaw {
  movement_type: "STOCK_IN" | "STOCK_OUT";
  movement_count: string;
  total_quantity: string;
}

export class SummaryRepository {
  static async getInventorySummary(): Promise<InventorySummaryRaw> {
    const productStats = await dataSource
      .getRepository(Product)
      .createQueryBuilder("product")
      .select("COUNT(product.id)", "total_products")
      .addSelect("COALESCE(SUM(product.current_stock), 0)", "total_units_in_stock")
      .addSelect(
        "COALESCE(SUM(product.current_stock * product.unit_price), 0)::numeric(14, 2)",
        "total_inventory_value",
      )
      .addSelect(
        "COUNT(*) FILTER (WHERE product.current_stock <= product.reorder_level)",
        "low_stock_products",
      )
      .addSelect(
        "COUNT(*) FILTER (WHERE product.current_stock = 0)",
        "out_of_stock_products",
      )
      .getRawOne<Omit<InventorySummaryRaw, "total_categories">>();

    const totalCategories = await dataSource
      .getRepository(Category)
      .createQueryBuilder("category")
      .select("COUNT(category.id)", "total_categories")
      .getRawOne<{ total_categories: string }>();

    return {
      total_products: productStats?.total_products ?? "0",
      total_units_in_stock: productStats?.total_units_in_stock ?? "0",
      total_inventory_value: productStats?.total_inventory_value ?? "0.00",
      low_stock_products: productStats?.low_stock_products ?? "0",
      out_of_stock_products: productStats?.out_of_stock_products ?? "0",
      total_categories: totalCategories?.total_categories ?? "0",
    };
  }

  static async getMovementSummary(): Promise<MovementSummaryRaw[]> {
    return dataSource
      .getRepository(InventoryMovement)
      .createQueryBuilder("movement")
      .select("movement.movement_type", "movement_type")
      .addSelect("COUNT(movement.id)", "movement_count")
      .addSelect("COALESCE(SUM(movement.quantity), 0)", "total_quantity")
      .groupBy("movement.movement_type")
      .getRawMany<MovementSummaryRaw>();
  }
}
