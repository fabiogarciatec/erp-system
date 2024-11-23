import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

// Components
import Sidebar from './components/Sidebar'

// Componente PrivateRoute simplificado
const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <AuthProvider>
      <Box minH="100vh">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Flex>
                  <Sidebar />
                  <Box ml="60" flex="1" p={8}>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Box>
                </Flex>
              </PrivateRoute>
            }
          />
        </Routes>
      </Box>
    </AuthProvider>
  )
}

export default App
