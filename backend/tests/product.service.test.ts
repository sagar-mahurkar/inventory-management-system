import { ProductService } from "../src/services/product.service";
import { productRepository } from "../src/repositories/product.repository";
import { dataSource } from "../src/database/dataSource";
import { Category } from "../src/entities/Category";
import { InventoryMovement } from "../src/entities/InventoryMovement";

jest.mock("../src/database/dataSource", () => ({
  dataSource: { getRepository: jest.fn() },
}));

jest.mock("../src/repositories/product.repository", () => ({
  productRepository: {
    createQueryBuilder: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  },
}));

describe("ProductService", () => {
  const categoryId = "550e8400-e29b-41d4-a716-446655440000";
  const productId = "550e8400-e29b-41d4-a716-446655440001";
  const category = { id: categoryId, name: "Office" };
  const product = {
    id: productId,
    category_id: categoryId,
    category,
    sku: "OFF-001",
    name: "Paper",
    description: null,
    unit_price: "10.00",
    current_stock: 0,
    reorder_level: 0,
    inventory_movements: [],
  };

  beforeEach(() => jest.clearAllMocks());

  it("creates a product with zero stock and defaults", async () => {
    (dataSource.getRepository as jest.Mock).mockReturnValue({
      findOneBy: jest.fn().mockResolvedValue(category),
    });
    (productRepository.create as jest.Mock).mockReturnValue(product);
    (productRepository.save as jest.Mock).mockResolvedValue(product);

    await expect(ProductService.create({
      category_id: categoryId,
      sku: "OFF-001",
      name: "Paper",
      unit_price: "10.00",
    })).resolves.toEqual(product);

    expect(productRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      current_stock: 0,
      reorder_level: 0,
      description: null,
    }));
  });

  it("rejects creation with a nonexistent category", async () => {
    (dataSource.getRepository as jest.Mock).mockReturnValue({
      findOneBy: jest.fn().mockResolvedValue(null),
    });

    await expect(ProductService.create({
      category_id: categoryId,
      sku: "OFF-001",
      name: "Paper",
      unit_price: "10.00",
    })).rejects.toMatchObject({ statusCode: 400, code: "INVALID_CATEGORY" });

    expect(productRepository.save).not.toHaveBeenCalled();
  });

  it("maps duplicate SKUs to a conflict", async () => {
    (dataSource.getRepository as jest.Mock).mockReturnValue({
      findOneBy: jest.fn().mockResolvedValue(category),
    });
    (productRepository.create as jest.Mock).mockReturnValue(product);
    (productRepository.save as jest.Mock).mockRejectedValue({ code: "23505" });

    await expect(ProductService.create({
      category_id: categoryId,
      sku: "OFF-001",
      name: "Paper",
      unit_price: "10.00",
    })).rejects.toMatchObject({ statusCode: 409, code: "PRODUCT_SKU_EXISTS" });
  });

  it("rejects deletion when movement history exists", async () => {
    (productRepository.findOne as jest.Mock).mockResolvedValue(product);
    (dataSource.getRepository as jest.Mock).mockReturnValue({
      count: jest.fn().mockResolvedValue(2),
    });

    await expect(ProductService.delete(productId)).rejects.toMatchObject({
      statusCode: 409,
      code: "PRODUCT_HAS_MOVEMENT_HISTORY",
    });
    expect(productRepository.remove).not.toHaveBeenCalled();
    expect(dataSource.getRepository).toHaveBeenCalledWith(InventoryMovement);
  });

  it("deletes a product with no movement history", async () => {
    (productRepository.findOne as jest.Mock).mockResolvedValue(product);
    (dataSource.getRepository as jest.Mock).mockReturnValue({
      count: jest.fn().mockResolvedValue(0),
    });

    await ProductService.delete(productId);
    expect(productRepository.remove).toHaveBeenCalledWith(product);
  });
});
