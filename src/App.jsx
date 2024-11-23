import React from 'react'
import { useState } from 'react'
import { ChakraProvider, Box } from '@chakra-ui/react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import MainLayout from './layouts/MainLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import CompanyRegistration from './pages/CompanyRegistration'
import CompaniesList from './pages/companies/CompaniesList'
import CustomerList from './pages/customers/CustomerList'
import ProductList from './pages/products/ProductList'
import ServiceList from './pages/services/ServiceList'
import SalesList from './pages/sales/SalesList'
import UserList from './pages/users/UserList'
import MarketingList from './pages/marketing/MarketingList'
import { AuthProvider, useAuth } from './contexts/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}

const PublicRoute = ({ children }) => {
  const { user } = useAuth()
  const location = useLocation()

  if (user) {
    return <Navigate to={location.state?.from?.pathname || '/'} replace />
  }

  return children
}

const AppContent = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const isPublicRoute = ['/login', '/register'].includes(location.pathname)

  const handleSidebarResize = (collapsed) => {
    setSidebarCollapsed(collapsed)
  }

  return (
    <Box minH="100vh">
      {!isPublicRoute && (
        <Sidebar onResize={handleSidebarResize} />
      )}
      <Box
        ml={isPublicRoute ? 0 : (sidebarCollapsed ? '60px' : '240px')}
        transition="margin-left 0.2s ease"
        p={isPublicRoute ? 0 : 4}
      >
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><CompanyRegistration /></PublicRoute>} />
          
          {/* Protected Routes */}
          <Route path="/" element={<PrivateRoute><MainLayout /></PrivateRoute>}>
            <Route index element={<PrivateRoute><Dashboard /></PrivateRoute>} />
            <Route path="companies" element={<PrivateRoute><CompaniesList /></PrivateRoute>} />
            <Route path="customers" element={<PrivateRoute><CustomerList /></PrivateRoute>} />
            <Route path="products" element={<PrivateRoute><ProductList /></PrivateRoute>} />
            <Route path="services" element={<PrivateRoute><ServiceList /></PrivateRoute>} />
            <Route path="sales" element={<PrivateRoute><SalesList /></PrivateRoute>} />
            <Route path="users" element={<PrivateRoute><UserList /></PrivateRoute>} />
            <Route path="marketing" element={<PrivateRoute><MarketingList /></PrivateRoute>} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Box>
    </Box>
  )
}

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App
