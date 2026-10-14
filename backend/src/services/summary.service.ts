import { SummaryRepository } from "../repositories/summary.repository";

export class SummaryService {
  static async getSummary() {
    const raw = await SummaryRepository.getInventorySummary();

    return {
      total_categories: Number(raw.total_categories),
      total_products: Number(raw.total_products),
      total_units_in_stock: Number(raw.total_units_in_stock),
      // Keep monetary totals as strings to avoid floating-point precision loss.
      total_inventory_value: raw.total_inventory_value,
      low_stock_products: Number(raw.low_stock_products),
      out_of_stock_products: Number(raw.out_of_stock_products),
    };
  }

  static async getMovementSummary() {
    const rawRows = await SummaryRepository.getMovementSummary();
    const byType = new Map(rawRows.map((row) => [row.movement_type, row]));

    return {
      stock_in: {
        movement_count: Number(byType.get("STOCK_IN")?.movement_count ?? 0),
        total_quantity: Number(byType.get("STOCK_IN")?.total_quantity ?? 0),
      },
      stock_out: {
        movement_count: Number(byType.get("STOCK_OUT")?.movement_count ?? 0),
        total_quantity: Number(byType.get("STOCK_OUT")?.total_quantity ?? 0),
      },
    };
  }
}
