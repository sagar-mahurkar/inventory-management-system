import { AppError } from "../middleware/AppError";
import { dataSource } from "../database/dataSource";
import { Product } from "../entities/Product";
import { InventoryMovement } from "../entities/InventoryMovement";
import type {
  CreateInventoryMovementInput,
  ListInventoryMovementsQuery,
} from "../validators/inventoryMovement.validator";

export class InventoryMovementService {
  static async list(query: ListInventoryMovementsQuery) {
    const qb = dataSource
      .getRepository(InventoryMovement)
      .createQueryBuilder("movement")
      .leftJoinAndSelect("movement.product", "product")
      .orderBy("movement.created_at", "DESC")
      .take(query.limit)
      .skip(query.offset);

    if (query.product_id) {
      qb.andWhere("movement.product_id = :productId", {
        productId: query.product_id,
      });
    }

    if (query.movement_type) {
      qb.andWhere("movement.movement_type = :movementType", {
        movementType: query.movement_type,
      });
    }

    const [items, total] = await qb.getManyAndCount();

    return { items, total, limit: query.limit, offset: query.offset };
  }

  static async create(
    input: CreateInventoryMovementInput,
  ): Promise<InventoryMovement> {
    return dataSource.transaction(async (manager) => {
      const productRepository = manager.getRepository(Product);
      const movementRepository = manager.getRepository(InventoryMovement);

      // Serialize stock movements for this product.
      const product = await productRepository
        .createQueryBuilder("product")
        .setLock("pessimistic_write")
        .where("product.id = :id", { id: input.product_id })
        .getOne();

      if (!product) {
        throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
      }

      if (
        input.movement_type === "STOCK_OUT" &&
        product.current_stock < input.quantity
      ) {
        throw new AppError(
          "Insufficient stock for this stock-out.",
          409,
          "INSUFFICIENT_STOCK",
        );
      }

      product.current_stock +=
        input.movement_type === "STOCK_IN"
          ? input.quantity
          : -input.quantity;

      await productRepository.save(product);

      const movement = movementRepository.create({
        product_id: product.id,
        movement_type: input.movement_type,
        quantity: input.quantity,
        note: input.note ?? null,
      });

      return movementRepository.save(movement);
    });
  }
}
