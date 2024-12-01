import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChakraProvider, ColorModeScript, extendTheme } from '@chakra-ui/react';
import { AuthProvider } from '@/contexts/AuthContext';
import { PrivateRoute } from '@/components/PrivateRoute';
import Layout from '@/components/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Customers from '@/pages/Customers';
import NotFound from '@/pages/NotFound';
import Unauthorized from '@/pages/Unauthorized';

// Importando as páginas de cadastro
import Clientes from '@/pages/cadastros/Clientes';
import Produtos from '@/pages/cadastros/Produtos';
import Fornecedores from '@/pages/cadastros/Fornecedores';
import Categorias from '@/pages/cadastros/Categorias';

// Importando as páginas de operações
import Vendas from '@/pages/operacoes/Vendas';
import Orcamentos from '@/pages/operacoes/Orcamentos';
import Pedidos from '@/pages/operacoes/Pedidos';
import NotasFiscais from '@/pages/operacoes/NotasFiscais';

// Importando as páginas de configurações
import Perfil from '@/pages/configuracoes/Perfil';
import Empresa from '@/pages/configuracoes/Empresa';

import { routerConfig } from './router.config';

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
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          borderColor: props.colorMode === 'dark' ? 'gray.600' : 'gray.200',
        },
        item: {
          bg: props.colorMode === 'dark' ? 'gray.700' : 'white',
          _hover: {
            bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.100',
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
      <BrowserRouter future={routerConfig.future}>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Private routes */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Dashboard */}
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
            
            {/* Cadastros */}
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

            {/* Operações */}
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

            {/* Configurações */}
            <Route
              path="/configuracoes/perfil"
              element={
                <PrivateRoute>
                  <Layout>
                    <Perfil />
                  </Layout>
                </PrivateRoute>
              }
            />

            <Route
              path="/configuracoes/empresa"
              element={
                <PrivateRoute>
                  <Layout>
                    <Empresa />
                  </Layout>
                </PrivateRoute>
              }
            />

            {/* 404 route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
}

export default App;
