import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Services } from './pages/Services';
import { Shipping } from './pages/Shipping';
import { SalesProducts } from './pages/SalesProducts';
import { ServiceOrders } from './pages/ServiceOrders';
import { ShippingOrders } from './pages/ShippingOrders';
import { Reports } from './pages/Reports';
import { Profile } from './pages/settings/Profile';
import { Security } from './pages/settings/Security';
import { Notifications } from './pages/settings/Notifications';
import { Backup } from './pages/settings/Backup';
import Company from './pages/settings/Company';
import { AuthProvider } from './contexts/AuthContext';
import { PrivateRoute } from './components/PrivateRoute';

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/customers" element={
              <PrivateRoute>
                <Customers />
              </PrivateRoute>
            } />
            <Route path="/products" element={
              <PrivateRoute>
                <Products />
              </PrivateRoute>
            } />
            <Route path="/services" element={
              <PrivateRoute>
                <Services />
              </PrivateRoute>
            } />
            <Route path="/shipping" element={
              <PrivateRoute>
                <Shipping />
              </PrivateRoute>
            } />
            <Route path="/sales/products" element={
              <PrivateRoute>
                <SalesProducts />
              </PrivateRoute>
            } />
            <Route path="/sales/services" element={
              <PrivateRoute>
                <ServiceOrders />
              </PrivateRoute>
            } />
            <Route path="/sales/shipping" element={
              <PrivateRoute>
                <ShippingOrders />
              </PrivateRoute>
            } />
            <Route path="/reports" element={
              <PrivateRoute>
                <Reports />
              </PrivateRoute>
            } />
            <Route path="/settings/profile" element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            } />
            <Route path="/settings/company" element={
              <PrivateRoute>
                <Company />
              </PrivateRoute>
            } />
            <Route path="/settings/security" element={
              <PrivateRoute>
                <Security />
              </PrivateRoute>
            } />
            <Route path="/settings/notifications" element={
              <PrivateRoute>
                <Notifications />
              </PrivateRoute>
            } />
            <Route path="/settings/backup" element={
              <PrivateRoute>
                <Backup />
              </PrivateRoute>
            } />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
