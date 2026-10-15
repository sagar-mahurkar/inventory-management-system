import { SummaryService } from "../src/services/summary.service";
import { SummaryRepository } from "../src/repositories/summary.repository";

jest.mock("../src/repositories/summary.repository", () => ({
  SummaryRepository: {
    getInventorySummary: jest.fn(),
    getMovementSummary: jest.fn(),
  },
}));

describe("SummaryService", () => {
  beforeEach(() => jest.clearAllMocks());

  it("converts numeric aggregate fields while preserving monetary precision as a string", async () => {
    (SummaryRepository.getInventorySummary as jest.Mock).mockResolvedValue({
      total_categories: "2",
      total_products: "5",
      total_units_in_stock: "42",
      total_inventory_value: "1234.50",
      low_stock_products: "1",
      out_of_stock_products: "0",
    });

    await expect(SummaryService.getSummary()).resolves.toEqual({
      total_categories: 2,
      total_products: 5,
      total_units_in_stock: 42,
      total_inventory_value: "1234.50",
      low_stock_products: 1,
      out_of_stock_products: 0,
    });
  });

  it("returns zero movement aggregates when the database has no movement rows", async () => {
    (SummaryRepository.getMovementSummary as jest.Mock).mockResolvedValue([]);

    await expect(SummaryService.getMovementSummary()).resolves.toEqual({
      stock_in: { movement_count: 0, total_quantity: 0 },
      stock_out: { movement_count: 0, total_quantity: 0 },
    });
  });

  it("aggregates stock-in and stock-out rows independently", async () => {
    (SummaryRepository.getMovementSummary as jest.Mock).mockResolvedValue([
      { movement_type: "STOCK_IN", movement_count: "3", total_quantity: "18" },
      { movement_type: "STOCK_OUT", movement_count: "2", total_quantity: "7" },
    ]);

    await expect(SummaryService.getMovementSummary()).resolves.toEqual({
      stock_in: { movement_count: 3, total_quantity: 18 },
      stock_out: { movement_count: 2, total_quantity: 7 },
    });
  });
});
