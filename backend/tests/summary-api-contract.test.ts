import request from "supertest";

jest.mock("../src/services/summary.service", () => ({
  SummaryService: {
    getSummary: jest.fn().mockResolvedValue({
      total_categories: 2,
      total_products: 5,
      total_units_in_stock: 42,
      total_inventory_value: "1234.50",
      low_stock_products: 1,
      out_of_stock_products: 0,
    }),
    getMovementSummary: jest.fn().mockResolvedValue({
      stock_in: { movement_count: 4, total_quantity: 50 },
      stock_out: { movement_count: 2, total_quantity: 8 },
    }),
  },
}));

import app from "../src/app";

describe("Summary API routes", () => {
  it("returns the inventory summary", async () => {
    const response = await request(app).get("/api/v1/summary");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      total_categories: 2,
      total_products: 5,
      total_units_in_stock: 42,
      total_inventory_value: "1234.50",
      low_stock_products: 1,
      out_of_stock_products: 0,
    });
  });

  it("returns stock-in and stock-out aggregates", async () => {
    const response = await request(app).get("/api/v1/summary/movements");

    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      stock_in: { movement_count: 4, total_quantity: 50 },
      stock_out: { movement_count: 2, total_quantity: 8 },
    });
  });
});
