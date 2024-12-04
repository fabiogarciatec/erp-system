import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from './contexts/AuthContext';
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

const theme = extendTheme({
  config: {
    initialColorMode: 'system',
    useSystemColorMode: true,
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'white',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Menu: {
      baseStyle: (props: any) => ({
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
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Rota pública - Login */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Rotas privadas */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Rotas de Cadastros */}
            <Route
              path="/cadastros/clientes"
              element={
                <PrivateRoute>
                  <Layout>
                    <Clientes />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/cadastros/produtos"
              element={
                <PrivateRoute>
                  <Layout>
                    <Produtos />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/cadastros/fornecedores"
              element={
                <PrivateRoute>
                  <Layout>
                    <Fornecedores />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/cadastros/categorias"
              element={
                <PrivateRoute>
                  <Layout>
                    <Categorias />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Rotas de Operações */}
            <Route
              path="/operacoes/vendas"
              element={
                <PrivateRoute>
                  <Layout>
                    <Vendas />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/operacoes/orcamentos"
              element={
                <PrivateRoute>
                  <Layout>
                    <Orcamentos />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/operacoes/pedidos"
              element={
                <PrivateRoute>
                  <Layout>
                    <Pedidos />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/operacoes/notas-fiscais"
              element={
                <PrivateRoute>
                  <Layout>
                    <NotasFiscais />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Rotas de Configurações */}
            <Route
              path="/configuracoes"
              element={
                <PrivateRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes/perfil"
              element={
                <PrivateRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes/empresa"
              element={
                <PrivateRoute>
                  <Layout>
                    <Company />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes/gerais"
              element={
                <PrivateRoute>
                  <Layout>
                    <GeneralSettings />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes/integracoes"
              element={
                <PrivateRoute>
                  <Layout>
                    <IntegrationsSettings />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes/seguranca"
              element={
                <PrivateRoute>
                  <Layout>
                    <Security />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes/notificacoes"
              element={
                <PrivateRoute>
                  <Layout>
                    <Notifications />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes/backup"
              element={
                <PrivateRoute>
                  <Layout>
                    <Backup />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes/usuarios"
              element={
                <PrivateRoute>
                  <Layout>
                    <Users />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/configuracoes/permissoes"
              element={
                <PrivateRoute>
                  <Layout>
                    <Permissions />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* Rota padrão - Redireciona para o dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Rota 404 - Página não encontrada */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
