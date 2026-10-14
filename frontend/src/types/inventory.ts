export type Category = {
  id: string;
  name: string;
  description: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  description: string;
  unitPrice: number;
  quantity: number;
  lowStockThreshold: number;
};

export type MovementType = 'IN' | 'OUT';

export type InventoryMovement = {
  id: string;
  productId: string;
  productName?: string;
  type: MovementType;
  quantity: number;
  note: string;
  createdAt: string;
};
