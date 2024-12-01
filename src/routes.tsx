import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import { Products } from './pages/Products';
import { Sales } from './pages/Sales';
import { Financial } from './pages/Financial';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { Profile2 } from './pages/Profile';
import { Users } from './pages/Users';
import { Inventory } from './pages/Inventory';
import { GeneralSettings } from './pages/settings/General';
import { IntegrationsSettings } from './pages/settings/Integrations';
import { Security } from './pages/settings/Security';
import { Notifications } from './pages/settings/Notifications';
import { Backup } from './pages/settings/Backup';
import Categorias from './pages/cadastros/Categorias';
import Empresa from './pages/empresa';

// Componente placeholder para páginas não implementadas
const PlaceholderPage = ({ title }: { title: string }) => (
  <div style={{ padding: '20px' }}>
    <h2>{title}</h2>
    <p>Esta página será implementada em breve.</p>
  </div>
);

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
          <Route path="configuracoes">
            <Route index element={<Settings />} />
            <Route path="perfil" element={<Profile2 />} />
            <Route path="empresa" element={<Empresa />} />
            <Route path="geral" element={<GeneralSettings />} />
            <Route path="integracoes" element={<IntegrationsSettings />} />
            <Route path="seguranca" element={<Security />} />
            <Route path="notificacoes" element={<Notifications />} />
            <Route path="backup" element={<Backup />} />
            <Route path="usuarios" element={<Users />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
