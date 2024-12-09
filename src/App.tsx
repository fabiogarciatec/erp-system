import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, ColorModeScript, extendTheme, ThemeConfig } from '@chakra-ui/react';
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
import Users from './pages/configuracoes/Users';
import Permissions from './pages/configuracoes/Permissions';

interface ThemeProps {
  colorMode: string;
}

const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  } as ThemeConfig,
  styles: {
    global: (props: ThemeProps) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Menu: {
      baseStyle: (props: ThemeProps) => ({
        list: {
          bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
          border: '1px solid',
          borderColor: props.colorMode === 'dark' ? 'gray.700' : 'gray.200',
        },
      }),
    },
  },
});

const App: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <AuthProvider>
          <SidebarProvider>
            <Layout>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                
                {/* Rotas de Cadastros */}
                <Route path="/cadastros/clientes" element={<PrivateRoute><Clientes /></PrivateRoute>} />
                <Route path="/cadastros/produtos" element={<PrivateRoute><Produtos /></PrivateRoute>} />
                <Route path="/cadastros/fornecedores" element={<PrivateRoute><Fornecedores /></PrivateRoute>} />
                <Route path="/cadastros/categorias" element={<PrivateRoute><Categorias /></PrivateRoute>} />
                
                {/* Rotas de Operações */}
                <Route path="/operacoes/vendas" element={<PrivateRoute><Vendas /></PrivateRoute>} />
                <Route path="/operacoes/orcamentos" element={<PrivateRoute><Orcamentos /></PrivateRoute>} />
                <Route path="/operacoes/pedidos" element={<PrivateRoute><Pedidos /></PrivateRoute>} />
                <Route path="/operacoes/notas-fiscais" element={<PrivateRoute><NotasFiscais /></PrivateRoute>} />
                
                {/* Rotas de Configurações */}
                <Route path="/configuracoes" element={<PrivateRoute><Settings /></PrivateRoute>} />
                <Route path="/configuracoes/perfil" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/configuracoes/empresa" element={<PrivateRoute><Company /></PrivateRoute>} />
                <Route path="/configuracoes/gerais" element={<PrivateRoute><GeneralSettings /></PrivateRoute>} />
                <Route path="/configuracoes/integracoes" element={<PrivateRoute><IntegrationsSettings /></PrivateRoute>} />
                <Route path="/configuracoes/seguranca" element={<PrivateRoute><Security /></PrivateRoute>} />
                <Route path="/configuracoes/notificacoes" element={<PrivateRoute><Notifications /></PrivateRoute>} />
                <Route path="/configuracoes/backup" element={<PrivateRoute><Backup /></PrivateRoute>} />
                <Route path="/configuracoes/usuarios" element={<PrivateRoute><Users /></PrivateRoute>} />
                <Route path="/configuracoes/permissoes" element={<PrivateRoute><Permissions /></PrivateRoute>} />
                
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </SidebarProvider>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  );
};

export default App;
