import { InventoryMovementService } from "../src/services/inventoryMovement.service";
import { dataSource } from "../src/database/dataSource";
import { Product } from "../src/entities/Product";
import { InventoryMovement } from "../src/entities/InventoryMovement";

jest.mock("../src/database/dataSource", () => ({
  dataSource: {
    transaction: jest.fn(),
  },
}));

describe("InventoryMovementService.create", () => {
  const product = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    current_stock: 10,
  };

  let productRepository: {
    createQueryBuilder: jest.Mock;
    save: jest.Mock;
  };
  let movementRepository: {
    create: jest.Mock;
    save: jest.Mock;
  };
  let queryBuilder: {
    setLock: jest.Mock;
    where: jest.Mock;
    getOne: jest.Mock;
  };
  let manager: { getRepository: jest.Mock };

  beforeEach(() => {
    jest.clearAllMocks();

    queryBuilder = {
      setLock: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue({ ...product }),
    };

    productRepository = {
      createQueryBuilder: jest.fn().mockReturnValue(queryBuilder),
      save: jest.fn(async (value) => value),
    };

    movementRepository = {
      create: jest.fn((value) => value),
      save: jest.fn(async (value) => value),
    };

    manager = {
      getRepository: jest.fn((entity) =>
        entity === Product ? productRepository : movementRepository,
      ),
    };

    (dataSource.transaction as jest.Mock).mockImplementation(
      async (callback: (transactionManager: typeof manager) => unknown) =>
        callback(manager),
    );
  });

  it("increments stock and records a stock-in movement", async () => {
    const result = await InventoryMovementService.create({
      product_id: product.id,
      movement_type: "STOCK_IN",
      quantity: 5,
    });

    expect(queryBuilder.setLock).toHaveBeenCalledWith("pessimistic_write");
    expect(productRepository.save).toHaveBeenCalledWith({
      ...product,
      current_stock: 15,
    });
    expect(movementRepository.create).toHaveBeenCalledWith({
      product_id: product.id,
      movement_type: "STOCK_IN",
      quantity: 5,
      note: null,
    });
    expect(movementRepository.save).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({
      product_id: product.id,
      movement_type: "STOCK_IN",
      quantity: 5,
    });
  });

  it("decrements stock and records a stock-out movement when stock is sufficient", async () => {
    await InventoryMovementService.create({
      product_id: product.id,
      movement_type: "STOCK_OUT",
      quantity: 4,
      note: "Sale",
    });

    expect(productRepository.save).toHaveBeenCalledWith({
      ...product,
      current_stock: 6,
    });
    expect(movementRepository.create).toHaveBeenCalledWith({
      product_id: product.id,
      movement_type: "STOCK_OUT",
      quantity: 4,
      note: "Sale",
    });
    expect(movementRepository.save).toHaveBeenCalledTimes(1);
  });

  it("rejects stock-out when stock is insufficient without saving stock or movement", async () => {
    await expect(
      InventoryMovementService.create({
        product_id: product.id,
        movement_type: "STOCK_OUT",
        quantity: 11,
      }),
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "INSUFFICIENT_STOCK",
    });

    expect(productRepository.save).not.toHaveBeenCalled();
    expect(movementRepository.create).not.toHaveBeenCalled();
    expect(movementRepository.save).not.toHaveBeenCalled();
  });

  it("returns a product-not-found error without creating a movement", async () => {
    queryBuilder.getOne.mockResolvedValueOnce(null);

    await expect(
      InventoryMovementService.create({
        product_id: product.id,
        movement_type: "STOCK_IN",
        quantity: 1,
      }),
    ).rejects.toMatchObject({
      statusCode: 404,
      code: "PRODUCT_NOT_FOUND",
    });

    expect(productRepository.save).not.toHaveBeenCalled();
    expect(movementRepository.create).not.toHaveBeenCalled();
    expect(movementRepository.save).not.toHaveBeenCalled();
  });

  it("propagates a movement persistence failure", async () => {
    movementRepository.save.mockRejectedValueOnce(
      new Error("movement persistence failed"),
    );

    await expect(
      InventoryMovementService.create({
        product_id: product.id,
        movement_type: "STOCK_IN",
        quantity: 2,
      }),
    ).rejects.toThrow("movement persistence failed");
  });
});
