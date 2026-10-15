import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types/api';
import type { Category } from '../types/inventory';

type CategoryDto = { id: string; name: string; description: string | null; created_at?: string; updated_at?: string };
const fromDto = (item: CategoryDto): Category => ({ id: item.id, name: item.name, description: item.description, createdAt: item.created_at, updatedAt: item.updated_at });

export async function listCategories(): Promise<Category[]> {
  const response = await apiClient.get<ApiResponse<CategoryDto[]>>(API_ENDPOINTS.CATEGORIES.ROOT);
  return response.data.data.map(fromDto);
}
export async function createCategory(input: { name: string; description: string }): Promise<Category> {
  const response = await apiClient.post<ApiResponse<CategoryDto>>(API_ENDPOINTS.CATEGORIES.ROOT, { name: input.name, description: input.description || null });
  return fromDto(response.data.data);
}
export async function updateCategory(id: string, input: { name: string; description: string }): Promise<Category> {
  const response = await apiClient.patch<ApiResponse<CategoryDto>>(API_ENDPOINTS.CATEGORIES.BY_ID(id), { name: input.name, description: input.description || null });
  return fromDto(response.data.data);
}
export async function deleteCategory(id: string): Promise<void> {
  await apiClient.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
}
