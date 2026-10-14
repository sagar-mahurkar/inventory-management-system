import { dataSource } from "../database/dataSource";
import { Product } from "../entities/Product";

export const productRepository = dataSource.getRepository(Product);
