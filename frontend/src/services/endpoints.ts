// Paths are relative to VITE_API_URL, which includes /api/v1.
export const API_ENDPOINTS = {
  HEALTH: '/health',
  CATEGORIES: {
    ROOT: '/categories',
    BY_ID: (id: string) => `/categories/${encodeURIComponent(id)}`,
  },
  PRODUCTS: {
    ROOT: '/products',
    BY_ID: (id: string) => `/products/${encodeURIComponent(id)}`,
  },
  INVENTORY_MOVEMENTS: '/inventory-movements',
  SUMMARY: '/summary',
  MOVEMENT_SUMMARY: '/summary/movements',
} as const;
