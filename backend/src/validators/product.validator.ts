import { z } from "zod";

const nonNegativeInteger = z.number().int().min(0);

export const createProductSchema = z.object({
  category_id: z.string().uuid(),
  sku: z.string().trim().min(1).max(64),
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().nullable().optional(),
  unit_price: z.union([
    z.string().regex(/^\d{1,10}(\.\d{1,2})?$/),
    z.number().finite().min(0).transform((value) => value.toFixed(2)),
  ]),
  reorder_level: nonNegativeInteger.optional(),
}).strict();

export const updateProductSchema = z.object({
  category_id: z.string().uuid().optional(),
  sku: z.string().trim().min(1).max(64).optional(),
  name: z.string().trim().min(1).max(160).optional(),
  description: z.string().trim().nullable().optional(),
  unit_price: z.union([
    z.string().regex(/^\d{1,10}(\.\d{1,2})?$/),
    z.number().finite().min(0).transform((value) => value.toFixed(2)),
  ]).optional(),
  reorder_level: nonNegativeInteger.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, {
  message: "At least one field must be provided.",
});

export const productIdSchema = z.string().uuid();

export const listProductsQuerySchema = z.object({
  category_id: z.string().uuid().optional(),
  search: z.string().trim().max(160).optional(),
  low_stock: z.enum(["true", "false"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  offset: z.coerce.number().int().min(0).default(0),
}).strict();

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type ListProductsQuery = z.infer<typeof listProductsQuerySchema>;
