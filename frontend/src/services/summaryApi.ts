import { apiClient } from './apiClient';
import { API_ENDPOINTS } from './endpoints';
import type { ApiResponse } from '../types/api';
import type { InventorySummary, MovementSummary } from '../types/inventory';
export async function getInventorySummary(): Promise<InventorySummary> {
  const response = await apiClient.get<ApiResponse<InventorySummary>>(API_ENDPOINTS.SUMMARY);
  return response.data.data;
}
export async function getMovementSummary(): Promise<MovementSummary> {
  const response = await apiClient.get<ApiResponse<MovementSummary>>(API_ENDPOINTS.MOVEMENT_SUMMARY);
  return response.data.data;
}
