import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter as Router } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'

// Pages
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

// Layout
import MainLayout from './layouts/MainLayout'
import Sidebar from './components/Sidebar'

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

function App() {
  return (
    <ChakraProvider>
      <Router>
        <AuthProvider>
          <Box minH="100vh">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/register" element={<PublicRoute><CompanyRegistration /></PublicRoute>} />
              
              {/* Protected Routes */}
              <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/companies" element={<CompaniesList />} />
                <Route path="/customers" element={<CustomerList />} />
                <Route path="/products" element={<ProductList />} />
                <Route path="/services" element={<ServiceList />} />
                <Route path="/sales" element={<SalesList />} />
                <Route path="/users" element={<UserList />} />
                <Route path="/marketing" element={<MarketingList />} />
              </Route>

              {/* Fallback Route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </AuthProvider>
      </Router>
    </ChakraProvider>
  )
}

export default App
