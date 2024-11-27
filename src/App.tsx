import { useEffect } from 'react';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CompanyProvider } from './contexts/CompanyContext';
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
import { useAuth } from './contexts/AuthContext';

function PrivateRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return null; // ou um componente de loading
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<PrivateRoute />}>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Cadastro */}
        <Route path="/customers" element={<Customers />} />
        <Route path="/suppliers" element={<Navigate to="/" />} /> {/* TODO: Implementar página */}
        <Route path="/products" element={<Products />} />
        <Route path="/services" element={<Services />} />
        <Route path="/categories" element={<Navigate to="/" />} /> {/* TODO: Implementar página */}
        
        {/* Vendas */}
        <Route path="/sales/products" element={<SalesProducts />} />
        <Route path="/sales/services" element={<Navigate to="/" />} /> {/* TODO: Implementar página */}
        <Route path="/shipping" element={<Shipping />} />
        <Route path="/sales/service-orders" element={<ServiceOrders />} />
        
        {/* Expedição */}
        <Route path="/shipping/orders" element={<ShippingOrders />} />
        <Route path="/shipping/tracking" element={<Navigate to="/" />} /> {/* TODO: Implementar página */}
        
        {/* Relatórios */}
        <Route path="/reports" element={<Reports />} />
        
        {/* Configurações */}
        <Route path="/settings/profile" element={<Profile />} />
        <Route path="/settings/company" element={<Company />} />
        <Route path="/settings/security" element={<Security />} />
        <Route path="/settings/notifications" element={<Notifications />} />
        <Route path="/settings/backup" element={<Backup />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <CompanyProvider>
            <AppRoutes />
          </CompanyProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}
