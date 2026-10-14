import { AppError } from "../middleware/AppError";
import { Product } from "../entities/Product";
import { dataSource } from "../database/dataSource";
import { Category } from "../entities/Category";
import { categoryRepository } from "../repositories/category.repository";
import type { CreateCategoryInput, UpdateCategoryInput } from "../validators/category.validator";

function mapDatabaseError(error: unknown): never {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === "23505"
  ) {
    throw new AppError(
      "A category with this name already exists.",
      409,
      "CATEGORY_NAME_EXISTS",
    );
  }

  throw error;
}

export class CategoryService {
  static async list(): Promise<Category[]> {
    return categoryRepository.find({ order: { name: "ASC" } });
  }

  static async getById(id: string): Promise<Category> {
    const category = await categoryRepository.findOneBy({ id });

    if (!category) {
      throw new AppError("Category not found.", 404, "CATEGORY_NOT_FOUND");
    }

    return category;
  }

  static async create(input: CreateCategoryInput): Promise<Category> {
    const category = categoryRepository.create({
      name: input.name,
      description: input.description ?? null,
    });

    try {
      return await categoryRepository.save(category);
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  static async update(id: string, input: UpdateCategoryInput): Promise<Category> {
    const category = await this.getById(id);
    categoryRepository.merge(category, input);

    try {
      return await categoryRepository.save(category);
    } catch (error) {
      return mapDatabaseError(error);
    }
  }

  static async delete(id: string): Promise<void> {
    const category = await this.getById(id);
    const productCount = await dataSource.getRepository(Product).count({
      where: { category_id: id },
    });

    if (productCount > 0) {
      throw new AppError(
        "Cannot delete a category that has products.",
        409,
        "CATEGORY_IN_USE",
      );
    }

    await categoryRepository.remove(category);
  }
}
