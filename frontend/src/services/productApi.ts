import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import type { ApiResponse, PaginatedResult } from '../types/api';
import type { Product } from '../types/inventory';

type ProductDto = { id: string; category_id: string; category?: { name: string }; sku: string; name: string; description: string | null; unit_price: string | number; current_stock: number; reorder_level: number; created_at?: string; updated_at?: string };
type ProductListDto = { items: ProductDto[]; total: number; limit: number; offset: number };
const fromDto = (item: ProductDto): Product => ({ id: item.id, categoryId: item.category_id, categoryName: item.category?.name, sku: item.sku, name: item.name, description: item.description, unitPrice: String(item.unit_price), quantity: item.current_stock, lowStockThreshold: item.reorder_level, createdAt: item.created_at, updatedAt: item.updated_at });
export type ProductInput = { categoryId: string; sku: string; name: string; description: string; unitPrice: string; lowStockThreshold: number };
const toDto = (input: ProductInput) => ({ category_id: input.categoryId, sku: input.sku, name: input.name, description: input.description || null, unit_price: input.unitPrice, reorder_level: input.lowStockThreshold });

export async function listProducts(params: { search?: string; lowStock?: boolean; limit?: number; offset?: number } = {}): Promise<PaginatedResult<Product>> {
  const response = await apiClient.get<ApiResponse<ProductListDto>>(API_ENDPOINTS.PRODUCTS.ROOT, { params: { search: params.search || undefined, low_stock: params.lowStock ? 'true' : undefined, limit: params.limit ?? 100, offset: params.offset ?? 0 } });
  return { ...response.data.data, items: response.data.data.items.map(fromDto) };
}
export async function createProduct(input: ProductInput): Promise<Product> {
  const response = await apiClient.post<ApiResponse<ProductDto>>(API_ENDPOINTS.PRODUCTS.ROOT, toDto(input));
  return fromDto(response.data.data);
}
export async function updateProduct(id: string, input: ProductInput): Promise<Product> {
  const response = await apiClient.patch<ApiResponse<ProductDto>>(API_ENDPOINTS.PRODUCTS.BY_ID(id), toDto(input));
  return fromDto(response.data.data);
}
export async function deleteProduct(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.PRODUCTS.BY_ID(id));
}
