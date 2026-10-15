export type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  categoryName?: string;
  description: string | null;
  unitPrice: string;
  quantity: number;
  lowStockThreshold: number;
  createdAt?: string;
  updatedAt?: string;
};

export type MovementType = 'STOCK_IN' | 'STOCK_OUT';

export type InventoryMovement = {
  id: string;
  productId: string;
  productName?: string;
  movementType: MovementType;
  quantity: number;
  note: string | null;
  createdAt: string;
};

export type InventorySummary = {
  total_categories: number;
  total_products: number;
  total_units_in_stock: number;
  total_inventory_value: string;
  low_stock_products: number;
  out_of_stock_products: number;
};

export type MovementSummary = {
  stock_in: { movement_count: number; total_quantity: number };
  stock_out: { movement_count: number; total_quantity: number };
};
