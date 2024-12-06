import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { PrivateRoute } from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import Unauthorized from './pages/Unauthorized';
// Importando as páginas de cadastro
import Clientes from './pages/cadastros/Clientes';
import Produtos from './pages/cadastros/Produtos';
import Fornecedores from './pages/cadastros/Fornecedores';
import Categorias from './pages/cadastros/Categorias';
// Importando as páginas de operações
import Vendas from './pages/operacoes/Vendas';
import Orcamentos from './pages/operacoes/Orcamentos';
import Pedidos from './pages/operacoes/Pedidos';
import NotasFiscais from './pages/operacoes/NotasFiscais';
// Importando as páginas de configurações
import { Settings } from './pages/configuracoes/Settings';
import Profile from './pages/configuracoes/Profile';
import { Company } from './pages/configuracoes/company';
import { GeneralSettings } from './pages/configuracoes/General';
import { IntegrationsSettings } from './pages/configuracoes/Integrations';
import { Security } from './pages/configuracoes/Security';
import { Notifications } from './pages/configuracoes/Notifications';
import { Backup } from './pages/configuracoes/Backup';
import Users from './pages/configuracoes/Users.jsx';
import Permissions from './pages/configuracoes/Permissions';
const theme = extendTheme({
    config: {
        initialColorMode: 'system',
        useSystemColorMode: true,
    },
    styles: {
        global: (props) => ({
            body: {
                bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
                color: props.colorMode === 'dark' ? 'white' : 'gray.800',
            },
        }),
    },
    components: {
        Menu: {
            baseStyle: (props) => ({
                list: {
                    bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
                    border: '1px solid',
                    borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
                },
                item: {
                    _hover: {
                        bg: props.colorMode === 'dark' ? 'gray.700' : 'gray.100',
                    },
                },
            }),
        },
    },
});
function App() {
    return (_jsxs(ChakraProvider, { theme: theme, children: [_jsx(ColorModeScript, { initialColorMode: theme.config.initialColorMode }), _jsx(BrowserRouter, { children: _jsx(AuthProvider, { children: _jsx(SidebarProvider, { children: _jsx(Layout, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/unauthorized", element: _jsx(Unauthorized, {}) }), _jsx(Route, { path: "/dashboard", element: _jsx(PrivateRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "/cadastros/clientes", element: _jsx(PrivateRoute, { children: _jsx(Clientes, {}) }) }), _jsx(Route, { path: "/cadastros/produtos", element: _jsx(PrivateRoute, { children: _jsx(Produtos, {}) }) }), _jsx(Route, { path: "/cadastros/fornecedores", element: _jsx(PrivateRoute, { children: _jsx(Fornecedores, {}) }) }), _jsx(Route, { path: "/cadastros/categorias", element: _jsx(PrivateRoute, { children: _jsx(Categorias, {}) }) }), _jsx(Route, { path: "/operacoes/vendas", element: _jsx(PrivateRoute, { children: _jsx(Vendas, {}) }) }), _jsx(Route, { path: "/operacoes/orcamentos", element: _jsx(PrivateRoute, { children: _jsx(Orcamentos, {}) }) }), _jsx(Route, { path: "/operacoes/pedidos", element: _jsx(PrivateRoute, { children: _jsx(Pedidos, {}) }) }), _jsx(Route, { path: "/operacoes/notas-fiscais", element: _jsx(PrivateRoute, { children: _jsx(NotasFiscais, {}) }) }), _jsx(Route, { path: "/configuracoes", element: _jsx(PrivateRoute, { children: _jsx(Settings, {}) }) }), _jsx(Route, { path: "/configuracoes/perfil", element: _jsx(PrivateRoute, { children: _jsx(Profile, {}) }) }), _jsx(Route, { path: "/configuracoes/empresa", element: _jsx(PrivateRoute, { children: _jsx(Company, {}) }) }), _jsx(Route, { path: "/configuracoes/gerais", element: _jsx(PrivateRoute, { children: _jsx(GeneralSettings, {}) }) }), _jsx(Route, { path: "/configuracoes/integracoes", element: _jsx(PrivateRoute, { children: _jsx(IntegrationsSettings, {}) }) }), _jsx(Route, { path: "/configuracoes/seguranca", element: _jsx(PrivateRoute, { children: _jsx(Security, {}) }) }), _jsx(Route, { path: "/configuracoes/notificacoes", element: _jsx(PrivateRoute, { children: _jsx(Notifications, {}) }) }), _jsx(Route, { path: "/configuracoes/backup", element: _jsx(PrivateRoute, { children: _jsx(Backup, {}) }) }), _jsx(Route, { path: "/configuracoes/usuarios", element: _jsx(PrivateRoute, { children: _jsx(Users, {}) }) }), _jsx(Route, { path: "/configuracoes/permissoes", element: _jsx(PrivateRoute, { children: _jsx(Permissions, {}) }) }), _jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }) }) })] }));
}
export default App;
