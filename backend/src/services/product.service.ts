import { AppError } from "../middleware/AppError";
import { Category } from "../entities/Category";
import { InventoryMovement } from "../entities/InventoryMovement";
import { dataSource } from "../database/dataSource";
import { Product } from "../entities/Product";
import { productRepository } from "../repositories/product.repository";
import type {
  CreateProductInput,
  ListProductsQuery,
  UpdateProductInput,
} from "../validators/product.validator";

function mapDatabaseError(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  ) {
    throw new AppError(
      "A product with this SKU already exists.",
      409,
      "PRODUCT_SKU_EXISTS",
    );
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23503"
  ) {
    throw new AppError(
      "The selected category does not exist.",
      400,
      "INVALID_CATEGORY",
    );
  }

  throw error;
}

export class ProductService {
  static async list(query: ListProductsQuery) {
    const qb = productRepository
      .createQueryBuilder("product")
      .leftJoinAndSelect("product.category", "category")
      .orderBy("product.name", "ASC")
      .take(query.limit)
      .skip(query.offset);

    if (query.category_id) {
      qb.andWhere("product.category_id = :categoryId", {
        categoryId: query.category_id,
      });
    }

    if (query.search) {
      qb.andWhere("(product.name ILIKE :search OR product.sku ILIKE :search)", {
        search: `%${query.search}%`,
      });
    }

    if (query.low_stock === "true") {
      qb.andWhere("product.current_stock <= product.reorder_level");
    }

    const [items, total] = await qb.getManyAndCount();

    return { items, total, limit: query.limit, offset: query.offset };
  }

  static async getById(id: string): Promise<Product> {
    const product = await productRepository.findOne({
      where: { id },
      relations: { category: true },
    });

    if (!product) {
      throw new AppError("Product not found.", 404, "PRODUCT_NOT_FOUND");
    }

    return product;
  }

  static async create(input: CreateProductInput): Promise<Product> {
    const category = await dataSource
      .getRepository(Category)
      .findOneBy({ id: input.category_id });

    if (!category) {
      throw new AppError(
        "The selected category does not exist.",
        400,
        "INVALID_CATEGORY",
      );
    }

    const product = productRepository.create({
      ...input,
      description: input.description ?? null,
      reorder_level: input.reorder_level ?? 0,
      current_stock: 0,
    });

    try {
      return await productRepository.save(product);
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  static async update(id: string, input: UpdateProductInput): Promise<Product> {
    const product = await this.getById(id);

    if (input.category_id) {
      const category = await dataSource
        .getRepository(Category)
        .findOneBy({ id: input.category_id });

      if (!category) {
        throw new AppError(
          "The selected category does not exist.",
          400,
          "INVALID_CATEGORY",
        );
      }
    }

    // Keep stock changes exclusively in InventoryMovementService.
    const { category: _category, inventory_movements: _movements, ...current } = product;
    Object.assign(current, input);

    try {
      return await productRepository.save(current);
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  static async delete(id: string): Promise<void> {
    const product = await this.getById(id);
    const movementCount = await dataSource.getRepository(InventoryMovement).count({
      where: { product_id: id },
    });

    if (movementCount > 0) {
      throw new AppError(
        "Cannot delete a product with inventory movement history.",
        409,
        "PRODUCT_HAS_MOVEMENT_HISTORY",
      );
    }

    await productRepository.remove(product);
  }
}
