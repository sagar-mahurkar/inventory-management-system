import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { DashboardPage } from '../pages/DashboardPage';
import { CategoriesPage } from '../pages/CategoriesPage';
import { ProductsPage } from '../pages/ProductsPage';
import { MovementsPage } from '../pages/MovementsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'categories', element: <CategoriesPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'movements', element: <MovementsPage /> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
]);
