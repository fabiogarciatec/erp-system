import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Center, Spinner } from '@chakra-ui/react'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import UserList from '../pages/users/UserList'
import MainLayout from '../layouts/MainLayout'
import Permissions from '../pages/permissions'
import PlaceholderPage from '../components/PlaceholderPage'
import { ProtectedRoute } from '../components/ProtectedRoute'
import AcessoNegado from '../pages/acesso-negado/AcessoNegado'
import ResetPassword from '../pages/reset-password/ResetPassword'

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

// Componente de rota autenticada
const AuthenticatedRoute = ({ children }) => {
  const { user, loading, initialized } = useAuth()

  if (!initialized || loading) {
    return <LoadingScreen />
  }

  if (!user) {
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
    return <Navigate to="/" replace />
  }

  return children
}

// Componente especial para a rota de reset de senha
const ResetPasswordRoute = ({ children }) => {
  const { loading, initialized } = useAuth()
  
  if (!initialized || loading) {
    return <LoadingScreen />
  }

  // Verifica se a URL tem o token de recuperação
  const hasRecoveryToken = window.location.hash.includes('type=recovery')
  if (!hasRecoveryToken) {
    return <Navigate to="/login" replace />
  }

  return children
}

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
      
      {/* Rota de redefinição de senha */}
      <Route 
        path="/reset-password" 
        element={
          <ResetPasswordRoute>
            <ResetPassword />
          </ResetPasswordRoute>
        } 
      />
      
      {/* Rota de acesso negado */}
      <Route 
        path="/acesso-negado" 
        element={
          <AuthenticatedRoute>
            <AcessoNegado />
          </AuthenticatedRoute>
        } 
      />
      
      {/* Rotas protegidas */}
      <Route element={<AuthenticatedRoute><MainLayout /></AuthenticatedRoute>}>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Cadastros */}
        <Route path="/cadastros">
          <Route 
            path="clientes" 
            element={
              <ProtectedRoute requiredPermissions={['companies.view']}>
                <PlaceholderPage title="Lista de Clientes" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="produtos" 
            element={
              <ProtectedRoute requiredPermissions={['products.view']}>
                <PlaceholderPage title="Lista de Produtos" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="servicos" 
            element={
              <ProtectedRoute requiredPermissions={['products.view']}>
                <PlaceholderPage title="Lista de Serviços" />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Vendas */}
        <Route path="/vendas">
          <Route 
            path="produtos" 
            element={
              <ProtectedRoute requiredPermissions={['sales.view']}>
                <PlaceholderPage title="Vendas de Produtos" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="ordem-servico" 
            element={
              <ProtectedRoute requiredPermissions={['sales.view']}>
                <PlaceholderPage title="Ordem de Serviço" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="fretes" 
            element={
              <ProtectedRoute requiredPermissions={['sales.view']}>
                <PlaceholderPage title="Fretes" />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Marketing */}
        <Route path="/marketing">
          <Route 
            path="campanhas" 
            element={
              <ProtectedRoute requiredPermissions={['marketing.view']}>
                <PlaceholderPage title="Campanhas" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="contatos" 
            element={
              <ProtectedRoute requiredPermissions={['marketing.view']}>
                <PlaceholderPage title="Contatos" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="disparos" 
            element={
              <ProtectedRoute requiredPermissions={['marketing.view']}>
                <PlaceholderPage title="Disparos em Massa" />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        {/* Configurações */}
        <Route path="/configuracoes">
          <Route 
            path="empresa" 
            element={
              <ProtectedRoute requiredPermissions={['companies.view']}>
                <PlaceholderPage title="Configurações da Empresa" />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="usuarios" 
            element={
              <ProtectedRoute requiredPermissions={['users.view']}>
                <UserList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="permissoes" 
            element={
              <ProtectedRoute adminOnly>
                <Permissions />
              </ProtectedRoute>
            } 
          />
        </Route>
      </Route>
      
      {/* Rota para páginas não encontradas */}
      <Route 
        path="*" 
        element={
          <AuthenticatedRoute>
            <PlaceholderPage 
              title="Página não encontrada" 
              description="A página que você está procurando não existe."
            />
          </AuthenticatedRoute>
        } 
      />
    </Routes>
  )
}

export default AppRoutes
