import type { Request, Response } from "express";
import { ProductService } from "../services/product.service";

export async function listProducts(req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await ProductService.list(req.query as never) });
}
export async function getProduct(req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await ProductService.getById(req.params.id as string) });
}
export async function createProduct(req: Request, res: Response): Promise<void> {
  res.status(201).json({ data: await ProductService.create(req.body) });
}
export async function updateProduct(req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await ProductService.update(req.params.id as string, req.body) });
}
export async function deleteProduct(req: Request, res: Response): Promise<void> {
  await ProductService.delete(req.params.id as string);
  res.status(204).send();
}
