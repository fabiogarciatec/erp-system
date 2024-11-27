import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { Login } from './pages/Login';
import { Layout } from './components/Layout';
import { Products } from './pages/Products';
import { Customers } from './pages/Customers';
import { Dashboard } from './pages/Dashboard';
import { Services } from './pages/Services';
import { Reports } from './pages/Reports';
import { SalesProducts } from './pages/SalesProducts';
import { ServiceOrders } from './pages/ServiceOrders';
import { Shipping } from './pages/Shipping';
import { ShippingOrders } from './pages/ShippingOrders';
import { Profile } from './pages/settings/Profile';
import { Company } from './pages/settings/Company';
import { Security } from './pages/settings/Security';
import { Notifications } from './pages/settings/Notifications';
import { Backup } from './pages/settings/Backup';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // ou um componente de loading
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <Layout>{children}</Layout>;
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard */}
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      
      {/* Cadastro */}
      <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
      <Route path="/suppliers" element={<PrivateRoute><Navigate to="/" /></PrivateRoute>} />
      <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/services" element={<PrivateRoute><Services /></PrivateRoute>} />
      <Route path="/categories" element={<PrivateRoute><Navigate to="/" /></PrivateRoute>} />
      
      {/* Vendas */}
      <Route path="/sales/products" element={<PrivateRoute><SalesProducts /></PrivateRoute>} />
      <Route path="/sales/services" element={<PrivateRoute><Navigate to="/" /></PrivateRoute>} />
      <Route path="/shipping" element={<PrivateRoute><Shipping /></PrivateRoute>} />
      <Route path="/sales/service-orders" element={<PrivateRoute><ServiceOrders /></PrivateRoute>} />
      
      {/* Expedição */}
      <Route path="/shipping/orders" element={<PrivateRoute><ShippingOrders /></PrivateRoute>} />
      <Route path="/shipping/tracking" element={<PrivateRoute><Navigate to="/" /></PrivateRoute>} />
      
      {/* Relatórios */}
      <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
      
      {/* Configurações */}
      <Route path="/settings/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/settings/company" element={<PrivateRoute><Company /></PrivateRoute>} />
      <Route path="/settings/security" element={<PrivateRoute><Security /></PrivateRoute>} />
      <Route path="/settings/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
      <Route path="/settings/backup" element={<PrivateRoute><Backup /></PrivateRoute>} />
      
      {/* Rota padrão */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
