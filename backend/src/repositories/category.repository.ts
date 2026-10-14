import { dataSource } from "../database/dataSource";
import { Category } from "../entities/Category";

export const categoryRepository = dataSource.getRepository(Category);
