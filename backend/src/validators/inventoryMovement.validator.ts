import { z } from "zod";

export const createInventoryMovementSchema = z.object({
  product_id: z.string().uuid(),
  movement_type: z.enum(["STOCK_IN", "STOCK_OUT"]),
  quantity: z.number().int().positive(),
  note: z.string().trim().max(500).nullable().optional(),
}).strict();

export const listInventoryMovementsQuerySchema = z.object({
  product_id: z.string().uuid().optional(),
  movement_type: z.enum(["STOCK_IN", "STOCK_OUT"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
}).strict();

export type CreateInventoryMovementInput = z.infer<typeof createInventoryMovementSchema>;
export type ListInventoryMovementsQuery = z.infer<typeof listInventoryMovementsQuerySchema>;
