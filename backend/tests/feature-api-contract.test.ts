import request from "supertest";
import app from "../src/app";

describe("Feature API request validation and routing", () => {
  it("returns 404 for an unknown category route", async () => {
    const response = await request(app).get("/api/v1/categories/not-a-route/extra");
    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });

  it("rejects a category without a name before accessing the database", async () => {
    const response = await request(app)
      .post("/api/v1/categories")
      .send({ description: "Missing required name" });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects a product with invalid fields before accessing the database", async () => {
    const response = await request(app)
      .post("/api/v1/products")
      .send({ sku: "", name: "", category_id: "not-a-uuid", unit_price: -1 });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });

  it("rejects a movement with a non-positive quantity before accessing the database", async () => {
    const response = await request(app)
      .post("/api/v1/inventory-movements")
      .send({ product_id: "550e8400-e29b-41d4-a716-446655440000", movement_type: "STOCK_IN", quantity: 0 });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
  });
});
