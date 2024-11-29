import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Layout from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Customers } from './pages/Customers';
import { Products } from './pages/Products';
import { Sales } from './pages/Sales';
import { Financial } from './pages/Financial';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Users } from './pages/Users';
import { Inventory } from './pages/Inventory';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Dashboard />} />
          
          {/* Cadastros */}
          <Route path="customers" element={<Customers />} />
          <Route path="products" element={<Products />} />
          
          {/* Vendas */}
          <Route path="sales" element={<Sales />} />
          
          {/* Financeiro */}
          <Route path="financial" element={<Financial />}>
            <Route path="receivables" element={<Financial type="receivables" />} />
            <Route path="payables" element={<Financial type="payables" />} />
            <Route path="cash-flow" element={<Financial type="cash-flow" />} />
          </Route>
          
          {/* Estoque */}
          <Route path="inventory" element={<Inventory />} />
          
          {/* Relatórios */}
          <Route path="reports">
            <Route index element={<Reports />} />
            <Route path="sales" element={<Reports type="sales" />} />
            <Route path="financial" element={<Reports type="financial" />} />
            <Route path="inventory" element={<Reports type="inventory" />} />
          </Route>
          
          {/* Configurações */}
          <Route path="settings" element={<Settings />} />
          <Route path="settings/profile" element={<Profile />} />
          <Route path="settings/users" element={<Users />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
