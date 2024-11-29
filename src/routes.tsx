import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
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
import { GeneralSettings } from './pages/settings/General';
import { IntegrationsSettings } from './pages/settings/Integrations';
import { Security } from './pages/settings/Security';
import { Notifications } from './pages/settings/Notifications';
import { Backup } from './pages/settings/Backup';
import { Categorias } from './pages/cadastros/Categorias';
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
          <Route path="financeiro">
            <Route index element={<Financial />} />
            <Route path="contas-receber" element={<PlaceholderPage title="Contas a Receber" />} />
            <Route path="contas-pagar" element={<PlaceholderPage title="Contas a Pagar" />} />
            <Route path="fluxo-caixa" element={<PlaceholderPage title="Fluxo de Caixa" />} />
            <Route path="bancos" element={<PlaceholderPage title="Bancos" />} />
          </Route>
          
          {/* Estoque */}
          <Route path="estoque">
            <Route index element={<Inventory />} />
            <Route path="movimentacoes" element={<PlaceholderPage title="Movimentações" />} />
            <Route path="ajustes" element={<PlaceholderPage title="Ajustes" />} />
            <Route path="transferencias" element={<PlaceholderPage title="Transferências" />} />
          </Route>
          
          {/* Relatórios */}
          <Route path="relatorios">
            <Route index element={<Reports />} />
            <Route path="vendas" element={<PlaceholderPage title="Relatório de Vendas" />} />
            <Route path="financeiro" element={<PlaceholderPage title="Relatório Financeiro" />} />
            <Route path="estoque" element={<PlaceholderPage title="Relatório de Estoque" />} />
            <Route path="clientes" element={<PlaceholderPage title="Relatório de Clientes" />} />
          </Route>
          
          {/* Usuários */}
          <Route path="usuarios" element={<Users />} />
          
          {/* Configurações */}
          <Route path="configuracoes">
            <Route index element={<Settings />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="geral" element={<GeneralSettings />} />
            <Route path="integracoes" element={<IntegrationsSettings />} />
            <Route path="seguranca" element={<Security />} />
            <Route path="empresa" element={<Empresa />} />
            <Route path="notificacoes" element={<Notifications />} />
            <Route path="backup" element={<Backup />} />
          </Route>

          {/* Rota para qualquer caminho não encontrado */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
