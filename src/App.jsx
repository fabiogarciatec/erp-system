import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { AuthProvider } from './contexts/AuthContext'
import { PermissionsProvider } from './contexts/PermissionsContext'
import AppRoutes from './routes'

function App() {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <PermissionsProvider>
            <AppRoutes />
          </PermissionsProvider>
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  )
}

export default App
