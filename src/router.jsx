import { createBrowserRouter } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CompanyRegistration from './pages/CompanyRegistration';
import UserList from './pages/users/UserList';
import PermissionList from './pages/permissions/PermissionList';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import { AuthProvider } from './contexts/AuthContext';

const routes = [
  {
    element: <AuthProvider />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <CompanyRegistration />,
      },
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [
          {
            element: <Layout />,
            children: [
              {
                path: '/',
                element: <Dashboard />,
              },
              {
                path: '/users',
                element: <UserList />,
              },
              {
                path: '/permissions',
                element: <PermissionList />,
              },
            ],
          },
        ],
      },
    ],
  },
];

export const router = createBrowserRouter(routes);
