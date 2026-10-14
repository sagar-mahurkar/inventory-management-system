import type { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export async function listCategories(_req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await CategoryService.list() });
}
export async function getCategory(req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await CategoryService.getById(req.params.id as string) });
}
export async function createCategory(req: Request, res: Response): Promise<void> {
  res.status(201).json({ data: await CategoryService.create(req.body) });
}
export async function updateCategory(req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await CategoryService.update(req.params.id as string, req.body) });
}
export async function deleteCategory(req: Request, res: Response): Promise<void> {
  await CategoryService.delete(req.params.id as string);
  res.status(204).send();
}
