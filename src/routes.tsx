import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/cadastros/Clientes';
import Products from './pages/cadastros/Produtos';
import Sales from './pages/operacoes/Vendas';
import { Financial } from './pages/financeiro/Financial';
import { Reports } from './pages/relatorios/Reports';
import { Settings } from './pages/configuracoes/Settings';
import Profile from './pages/configuracoes/Profile';
import { Company } from './pages/configuracoes/company';
import { Inventory } from './pages/estoque/Inventory';
import { GeneralSettings } from './pages/configuracoes/General';
import { IntegrationsSettings } from './pages/configuracoes/Integrations';
import { Security } from './pages/configuracoes/Security';
import { Notifications } from './pages/configuracoes/Notifications';
import { Backup } from './pages/configuracoes/Backup';
import Categorias from './pages/cadastros/Categorias';
import PlaceholderPage from './components/PlaceholderPage';
import NotFound from './pages/NotFound';
import Users from './pages/configuracoes/Users.jsx';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Outlet /></Layout>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Cadastros */}
          <Route path="cadastros">
            <Route path="clientes" element={<Customers />} />
            <Route path="produtos" element={<Products />} />
            <Route path="fornecedores" element={<PlaceholderPage title="Fornecedores" />} />
            <Route path="categorias" element={<Categorias />} />
          </Route>
          
          {/* Operações */}
          <Route path="operacoes">
            <Route path="vendas" element={<Sales />} />
            <Route path="orcamentos" element={<PlaceholderPage title="Orçamentos" />} />
            <Route path="pedidos" element={<PlaceholderPage title="Pedidos" />} />
            <Route path="notas-fiscais" element={<PlaceholderPage title="Notas Fiscais" />} />
          </Route>

          {/* Financeiro */}
          <Route path="financeiro" element={<Financial />} />

          {/* Estoque */}
          <Route path="estoque" element={<Inventory />} />

          {/* Relatórios */}
          <Route path="relatorios" element={<Reports />} />

          {/* Configurações */}
          <Route path="configuracoes" element={<Settings />}>
            <Route path="perfil" element={<Profile />} />
            <Route path="empresa" element={<Company />} />
            <Route path="gerais" element={<GeneralSettings />} />
            <Route path="integracoes" element={<IntegrationsSettings />} />
            <Route path="seguranca" element={<Security />} />
            <Route path="notificacoes" element={<Notifications />} />
            <Route path="backup" element={<Backup />} />
            <Route path="permissoes" element={<PlaceholderPage title="Permissões" />} />
            <Route path="usuarios" element={<Users />} />
          </Route>

          {/* Catch-all route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
