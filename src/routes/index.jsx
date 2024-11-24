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
      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        {/* Dashboard */}
        <Route path="/" element={<Dashboard />} />
        
        {/* Cadastros */}
        <Route path="/cadastros">
          <Route path="clientes" element={<PlaceholderPage title="Lista de Clientes" />} />
          <Route path="produtos" element={<PlaceholderPage title="Lista de Produtos" />} />
          <Route path="servicos" element={<PlaceholderPage title="Lista de Serviços" />} />
        </Route>
        
        {/* Vendas */}
        <Route path="/vendas">
          <Route path="produtos" element={<PlaceholderPage title="Vendas de Produtos" />} />
          <Route path="ordem-servico" element={<PlaceholderPage title="Ordem de Serviço" />} />
          <Route path="fretes" element={<PlaceholderPage title="Fretes" />} />
        </Route>
        
        {/* Marketing */}
        <Route path="/marketing">
          <Route path="campanhas" element={<PlaceholderPage title="Campanhas" />} />
          <Route path="contatos" element={<PlaceholderPage title="Contatos" />} />
          <Route path="disparos" element={<PlaceholderPage title="Disparos em Massa" />} />
        </Route>
        
        {/* Configurações */}
        <Route path="/configuracoes">
          <Route path="empresa" element={<PlaceholderPage title="Configurações da Empresa" />} />
          <Route path="usuarios" element={<UserList />} />
          <Route path="permissoes" element={<Permissions />} />
        </Route>
      </Route>
      
      {/* Redireciona qualquer outra rota para a home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
