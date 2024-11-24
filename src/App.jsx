import React from 'react'
import { ChakraProvider, Spinner, Center, Box, Heading, Text } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MainLayout from './layouts/MainLayout'
import UserList from './pages/users/UserList'
import CustomerList from './pages/customers/CustomerList'

// Componentes de páginas
const PageWrapper = ({ children }) => (
  <Box p={8}>
    {children}
  </Box>
)

const ProductList = () => (
  <PageWrapper>
    <Heading mb={6}>Produtos</Heading>
    <Text>Lista de produtos em desenvolvimento...</Text>
  </PageWrapper>
)

const ServiceList = () => (
  <PageWrapper>
    <Heading mb={6}>Serviços</Heading>
    <Text>Lista de serviços em desenvolvimento...</Text>
  </PageWrapper>
)

const SupplierList = () => (
  <PageWrapper>
    <Heading mb={6}>Fornecedores</Heading>
    <Text>Lista de fornecedores em desenvolvimento...</Text>
  </PageWrapper>
)

const SalesOrders = () => (
  <PageWrapper>
    <Heading mb={6}>Pedidos de Venda</Heading>
    <Text>Lista de pedidos em desenvolvimento...</Text>
  </PageWrapper>
)

const ServiceOrders = () => (
  <PageWrapper>
    <Heading mb={6}>Ordens de Serviço</Heading>
    <Text>Lista de ordens de serviço em desenvolvimento...</Text>
  </PageWrapper>
)

const MarketingCampaigns = () => (
  <PageWrapper>
    <Heading mb={6}>Campanhas de Marketing</Heading>
    <Text>Lista de campanhas em desenvolvimento...</Text>
  </PageWrapper>
)

const CompanyProfile = () => (
  <PageWrapper>
    <Heading mb={6}>Perfil da Empresa</Heading>
    <Text>Informações da empresa em desenvolvimento...</Text>
  </PageWrapper>
)

const Settings = () => (
  <PageWrapper>
    <Heading mb={6}>Configurações</Heading>
    <Text>Configurações do sistema em desenvolvimento...</Text>
  </PageWrapper>
)

// Componente de loading
const LoadingScreen = () => (
  <Center h="100vh">
    <Spinner
      thickness="4px"
      speed="0.65s"
      emptyColor="gray.200"
      color="blue.500"
      size="xl"
    />
  </Center>
)

// Componente de rota protegida
const ProtectedRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth()

  if (!initialized || loading) {
    return <LoadingScreen />
  }

  if (!user) {
    console.log('Usuário não autenticado, redirecionando para login...')
    return <Navigate to="/login" replace />
  }

  return children
}

// Componente de rota pública
const PublicRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth()

  if (!initialized || loading) {
    return <LoadingScreen />
  }

  if (user) {
    console.log('Usuário já autenticado, redirecionando para dashboard...')
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Rota pública */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            
            {/* Rotas protegidas */}
            <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
              {/* Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Cadastros */}
              <Route path="/customers" element={<CustomerList />} />
              <Route path="/suppliers" element={<SupplierList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/services" element={<ServiceList />} />
              
              {/* Vendas */}
              <Route path="/sales/orders" element={<SalesOrders />} />
              <Route path="/sales/service-orders" element={<ServiceOrders />} />
              
              {/* Marketing */}
              <Route path="/marketing/campaigns" element={<MarketingCampaigns />} />
              
              {/* Empresas */}
              <Route path="/companies/profile" element={<CompanyProfile />} />
              
              {/* Usuários */}
              <Route path="/users/list" element={<UserList />} />
              
              {/* Configurações */}
              <Route path="/settings/general" element={<Settings />} />
            </Route>
            
            {/* Redireciona qualquer outra rota para o dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
