import { createBrowserRouter, Navigate } from 'react-router-dom';
import { AppLayout } from '../layouts/AppLayout';
import { SetupPage } from '../pages/SetupPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <SetupPage title="Dashboard" description="The inventory dashboard will be implemented in Phase 11." />,
      },
      {
        path: 'categories',
        element: <SetupPage title="Categories" description="Category management will be implemented in Phase 11." />,
      },
      {
        path: 'products',
        element: <SetupPage title="Products" description="Product management will be implemented in Phase 11." />,
      },
      {
        path: 'movements',
        element: <SetupPage title="Stock movements" description="Stock-in, stock-out, and movement history screens will be implemented in Phase 11." />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);
