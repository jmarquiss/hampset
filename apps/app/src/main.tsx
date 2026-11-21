import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter } from 'react-router';
import { RouterProvider } from 'react-router/dom';

import { Layout } from './components/Layout';
import './index.css';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { NotFound } from './pages/NotFound';

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: 1 } } });

const router = createBrowserRouter([
  { element: <Login />, path: '/login' },
  {
    children: [
      { element: <Home />, index: true },
      { element: <NotFound />, path: '*' },
    ],
    element: <Layout />,
  },
]);

const root = document.getElementById('root');
if (!root) throw new Error('index.html is missing #root');

createRoot(root).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
