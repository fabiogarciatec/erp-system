import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Customers from './pages/cadastros/clientes';
import { Products } from './pages/cadastros/produtos';
import { Sales } from './pages/operacoes/vendas';
import { Financial } from './pages/financeiro/Financial';
import { Reports } from './pages/relatorios/Reports';
import { Settings } from './pages/configuracoes';
import { Profile } from './pages/configuracoes/Profile';
import { Company } from './pages/configuracoes/Company';
import { Users } from './pages/usuarios/Users';
import { Inventory } from './pages/estoque/Inventory';
import { GeneralSettings } from './pages/configuracoes/General';
import { IntegrationsSettings } from './pages/configuracoes/Integrations';
import { Security } from './pages/configuracoes/Security';
import { Notifications } from './pages/configuracoes/Notifications';
import { Backup } from './pages/configuracoes/Backup';
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
            <Route path="profile" element={<Profile />} />
            <Route path="company" element={<Company />} />
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
