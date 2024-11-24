import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Sidebar from './components/Sidebar'
import Users from './pages/settings/Users'
import { AuthProvider, useAuth } from './contexts/AuthContext'

function AppContent() {
  const { isAuthenticated } = useAuth()

  // Se não estiver autenticado, mostra apenas o login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  // Se estiver autenticado, mostra o layout com sidebar
  return (
    <Box display="flex" minH="100vh">
      <Box as="nav" w="16rem" position="fixed" h="100vh">
        <Sidebar />
      </Box>
      <Box ml="16rem" flex="1" p={6} bg="gray.50">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/settings/users" element={<Users />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
