import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box, Flex, ChakraProvider } from '@chakra-ui/react'
import { AuthProvider, useAuth } from './contexts/AuthContext'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import UserList from './pages/users/UserList'
import CompanyList from './pages/companies/CompanyList'
import ProductList from './pages/products/ProductList'
import ServiceList from './pages/services/ServiceList'
import SalesList from './pages/sales/SalesList'
import SupplierList from './pages/suppliers/SupplierList'

// Components
import Sidebar from './components/Sidebar'

// Componente PrivateRoute simplificado
const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function App() {
  return (
    <ChakraProvider>
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
                    <Box ml="60" w="calc(100% - 15rem)" minH="100vh" bg="gray.50">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/users" element={<UserList />} />
                        <Route path="/companies" element={<CompanyList />} />
                        <Route path="/products" element={<ProductList />} />
                        <Route path="/services" element={<ServiceList />} />
                        <Route path="/sales" element={<SalesList />} />
                        <Route path="/suppliers" element={<SupplierList />} />
                      </Routes>
                    </Box>
                  </Flex>
                </PrivateRoute>
              }
            />
          </Routes>
        </Box>
      </AuthProvider>
    </ChakraProvider>
  )
}

export default App
