import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import Users from './pages/configuracoes/Users';
function AppRoutes() {
    return (_jsx(BrowserRouter, { children: _jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(Layout, { children: _jsx(Outlet, {}) }), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(Dashboard, {}) }), _jsxs(Route, { path: "cadastros", children: [_jsx(Route, { path: "clientes", element: _jsx(Customers, {}) }), _jsx(Route, { path: "produtos", element: _jsx(Products, {}) }), _jsx(Route, { path: "fornecedores", element: _jsx(PlaceholderPage, { title: "Fornecedores" }) }), _jsx(Route, { path: "categorias", element: _jsx(Categorias, {}) })] }), _jsxs(Route, { path: "operacoes", children: [_jsx(Route, { path: "vendas", element: _jsx(Sales, {}) }), _jsx(Route, { path: "orcamentos", element: _jsx(PlaceholderPage, { title: "Or\u00E7amentos" }) }), _jsx(Route, { path: "pedidos", element: _jsx(PlaceholderPage, { title: "Pedidos" }) }), _jsx(Route, { path: "notas-fiscais", element: _jsx(PlaceholderPage, { title: "Notas Fiscais" }) })] }), _jsx(Route, { path: "financeiro", element: _jsx(Financial, {}) }), _jsx(Route, { path: "estoque", element: _jsx(Inventory, {}) }), _jsx(Route, { path: "relatorios", element: _jsx(Reports, {}) }), _jsxs(Route, { path: "configuracoes", element: _jsx(Settings, {}), children: [_jsx(Route, { path: "perfil", element: _jsx(Profile, {}) }), _jsx(Route, { path: "empresa", element: _jsx(Company, {}) }), _jsx(Route, { path: "gerais", element: _jsx(GeneralSettings, {}) }), _jsx(Route, { path: "integracoes", element: _jsx(IntegrationsSettings, {}) }), _jsx(Route, { path: "seguranca", element: _jsx(Security, {}) }), _jsx(Route, { path: "notificacoes", element: _jsx(Notifications, {}) }), _jsx(Route, { path: "backup", element: _jsx(Backup, {}) }), _jsx(Route, { path: "permissoes", element: _jsx(PlaceholderPage, { title: "Permiss\u00F5es" }) }), _jsx(Route, { path: "usuarios", element: _jsx(Users, {}) })] }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) }));
}
export default AppRoutes;
