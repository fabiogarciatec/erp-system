import React from 'react'
import { ChakraProvider, Spinner, Center } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import MainLayout from './layouts/MainLayout'
import UserList from './pages/users/UserList'

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

  return <MainLayout>{children}</MainLayout>
}

// Componente de rota pública
const PublicRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth()

  if (!initialized || loading) {
    return <LoadingScreen />
  }

  if (user) {
    console.log('Usuário já autenticado, redirecionando para dashboard...')
    return <Navigate to="/" replace />
  }

  return children
}

// Componente de rotas
const AppRoutes = () => {
  return (
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
      <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      
      {/* Cadastros */}
      <Route path="/cadastros/clientes" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
      <Route path="/cadastros/produtos" element={<ProtectedRoute><div>Produtos</div></ProtectedRoute>} />
      <Route path="/cadastros/servicos" element={<ProtectedRoute><div>Serviços</div></ProtectedRoute>} />
      
      {/* Vendas */}
      <Route path="/vendas/produtos" element={<ProtectedRoute><div>Vendas de Produtos</div></ProtectedRoute>} />
      <Route path="/vendas/ordem-servico" element={<ProtectedRoute><div>Ordem de Serviço</div></ProtectedRoute>} />
      <Route path="/vendas/fretes" element={<ProtectedRoute><div>Fretes</div></ProtectedRoute>} />
      
      {/* Marketing */}
      <Route path="/marketing/campanhas" element={<ProtectedRoute><div>Campanhas</div></ProtectedRoute>} />
      <Route path="/marketing/contatos" element={<ProtectedRoute><div>Contatos</div></ProtectedRoute>} />
      <Route path="/marketing/disparos" element={<ProtectedRoute><div>Disparos em Massa</div></ProtectedRoute>} />
      
      {/* Configurações */}
      <Route path="/configuracoes/empresa" element={<ProtectedRoute><div>Empresa</div></ProtectedRoute>} />
      <Route path="/configuracoes/usuarios" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
      
      {/* Redireciona qualquer outra rota para a home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

// Componente principal
function App() {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
