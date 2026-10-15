import { CategoryService } from "../src/services/category.service";
import { categoryRepository } from "../src/repositories/category.repository";
import { dataSource } from "../src/database/dataSource";
import { Product } from "../src/entities/Product";

jest.mock("../src/database/dataSource", () => ({
  dataSource: { getRepository: jest.fn() },
}));

jest.mock("../src/repositories/category.repository", () => ({
  categoryRepository: {
    find: jest.fn(),
    findOneBy: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  },
}));

describe("CategoryService", () => {
  const category = { id: "cat-1", name: "Office", description: null };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("lists categories alphabetically", async () => {
    (categoryRepository.find as jest.Mock).mockResolvedValue([category]);
    await expect(CategoryService.list()).resolves.toEqual([category]);
    expect(categoryRepository.find).toHaveBeenCalledWith({ order: { name: "ASC" } });
  });

  it("creates a category and normalizes missing description to null", async () => {
    (categoryRepository.create as jest.Mock).mockReturnValue(category);
    (categoryRepository.save as jest.Mock).mockResolvedValue(category);

    await expect(CategoryService.create({ name: "Office" })).resolves.toEqual(category);
    expect(categoryRepository.create).toHaveBeenCalledWith({
      name: "Office",
      description: null,
    });
  });

  it("returns a not-found error for an unknown category", async () => {
    (categoryRepository.findOneBy as jest.Mock).mockResolvedValue(null);
    await expect(CategoryService.getById("missing")).rejects.toMatchObject({
      statusCode: 404,
      code: "CATEGORY_NOT_FOUND",
    });
  });

  it("maps duplicate category names to a conflict", async () => {
    (categoryRepository.create as jest.Mock).mockReturnValue(category);
    (categoryRepository.save as jest.Mock).mockRejectedValue({ code: "23505" });

    await expect(CategoryService.create({ name: "Office" })).rejects.toMatchObject({
      statusCode: 409,
      code: "CATEGORY_NAME_EXISTS",
    });
  });

  it("rejects deletion when products reference the category", async () => {
    (categoryRepository.findOneBy as jest.Mock).mockResolvedValue(category);
    (dataSource.getRepository as jest.Mock).mockReturnValue({
      count: jest.fn().mockResolvedValue(1),
    });

    await expect(CategoryService.delete(category.id)).rejects.toMatchObject({
      statusCode: 409,
      code: "CATEGORY_IN_USE",
    });
    expect(categoryRepository.remove).not.toHaveBeenCalled();
    expect(dataSource.getRepository).toHaveBeenCalledWith(Product);
  });

  it("deletes a category when no products reference it", async () => {
    (categoryRepository.findOneBy as jest.Mock).mockResolvedValue(category);
    (dataSource.getRepository as jest.Mock).mockReturnValue({
      count: jest.fn().mockResolvedValue(0),
    });

    await CategoryService.delete(category.id);
    expect(categoryRepository.remove).toHaveBeenCalledWith(category);
  });
});
