import type { Request, Response } from "express";
import { InventoryMovementService } from "../services/inventoryMovement.service";

export async function listInventoryMovements(req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: await InventoryMovementService.list(req.query as never) });
}
export async function createInventoryMovement(req: Request, res: Response): Promise<void> {
  res.status(201).json({ data: await InventoryMovementService.create(req.body) });
}
