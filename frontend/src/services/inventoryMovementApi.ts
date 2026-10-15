import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import type { ApiResponse, PaginatedResult } from '../types/api';
import type { InventoryMovement, MovementType } from '../types/inventory';

type MovementDto = { id: string; product_id: string; product?: { name: string }; movement_type: MovementType; quantity: number; note: string | null; created_at: string };
type MovementListDto = { items: MovementDto[]; total: number; limit: number; offset: number };
const fromDto = (item: MovementDto): InventoryMovement => ({ id: item.id, productId: item.product_id, productName: item.product?.name, movementType: item.movement_type, quantity: item.quantity, note: item.note, createdAt: item.created_at });
export async function listInventoryMovements(params: { movementType?: MovementType; limit?: number; offset?: number } = {}): Promise<PaginatedResult<InventoryMovement>> {
  const response = await apiClient.get<ApiResponse<MovementListDto>>(API_ENDPOINTS.INVENTORY_MOVEMENTS, { params: { movement_type: params.movementType, limit: params.limit ?? 100, offset: params.offset ?? 0 } });
  return { ...response.data.data, items: response.data.data.items.map(fromDto) };
}
export async function createInventoryMovement(input: { productId: string; movementType: MovementType; quantity: number; note: string }): Promise<InventoryMovement> {
  const response = await apiClient.post<ApiResponse<MovementDto>>(API_ENDPOINTS.INVENTORY_MOVEMENTS, { product_id: input.productId, movement_type: input.movementType, quantity: input.quantity, note: input.note || null });
  return fromDto(response.data.data);
}
