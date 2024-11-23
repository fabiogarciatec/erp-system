import React, { useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  Button,
  Collapse,
  useDisclosure,
} from '@chakra-ui/react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiUsers,
  FiBox,
  FiTruck,
  FiDollarSign,
  FiTool,
  FiLogOut,
  FiChevronDown,
  FiChevronRight,
  FiGrid,
  FiFileText,
  FiSettings,
  FiBarChart2,
} from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'

const MenuItem = ({ icon, children, to, isActive, hasSubmenu, isOpen, onClick }) => {
  return (
    <Flex
      as={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isActive ? 'cyan.400' : 'transparent'}
      color={isActive ? 'white' : 'inherit'}
      _hover={{
        bg: 'cyan.400',
        color: 'white',
      }}
      justify="space-between"
    >
      <Flex align="center">
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
          color={isActive ? 'white' : 'gray.500'}
          _groupHover={{ color: 'white' }}
        />
        <Text fontSize="1.1rem">{children}</Text>
      </Flex>
      {hasSubmenu && (
        <Icon
          as={isOpen ? FiChevronDown : FiChevronRight}
          ml="auto"
          transform={isOpen ? 'rotate(-180deg)' : undefined}
          transition="all 0.3s"
        />
      )}
    </Flex>
  )
}

const SubMenuItem = ({ children, to, isActive }) => {
  return (
    <Flex
      as={Link}
      to={to}
      align="center"
      p="3"
      pl="12"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isActive ? 'cyan.400' : 'transparent'}
      color={isActive ? 'white' : 'inherit'}
      _hover={{
        bg: 'cyan.400',
        color: 'white',
      }}
    >
      <Text fontSize="1rem">{children}</Text>
    </Flex>
  )
}

const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const toggleSubmenu = (menu) => {
    setActiveSubmenu(activeSubmenu === menu ? null : menu)
  }

  const isActive = (path) => location.pathname === path

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="100vh"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w="60"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#CBD5E0',
          borderRadius: '24px',
        },
      }}
    >
      <VStack spacing={1} align="stretch">
        <Box p="5">
          <Text fontSize="2xl" fontWeight="bold" color="cyan.600">
            ERP System
          </Text>
        </Box>

        <MenuItem icon={FiHome} to="/" isActive={isActive('/')}>
          Dashboard
        </MenuItem>

        <MenuItem
          icon={FiUsers}
          hasSubmenu
          isOpen={activeSubmenu === 'users'}
          onClick={() => toggleSubmenu('users')}
        >
          Usuários
        </MenuItem>
        <Collapse in={activeSubmenu === 'users'}>
          <SubMenuItem to="/users" isActive={isActive('/users')}>
            Lista de Usuários
          </SubMenuItem>
          <SubMenuItem to="/users/roles" isActive={isActive('/users/roles')}>
            Permissões
          </SubMenuItem>
        </Collapse>

        <MenuItem
          icon={FiGrid}
          hasSubmenu
          isOpen={activeSubmenu === 'companies'}
          onClick={() => toggleSubmenu('companies')}
        >
          Empresas
        </MenuItem>
        <Collapse in={activeSubmenu === 'companies'}>
          <SubMenuItem to="/companies" isActive={isActive('/companies')}>
            Lista de Empresas
          </SubMenuItem>
          <SubMenuItem to="/companies/branches" isActive={isActive('/companies/branches')}>
            Filiais
          </SubMenuItem>
        </Collapse>

        <MenuItem
          icon={FiBox}
          hasSubmenu
          isOpen={activeSubmenu === 'products'}
          onClick={() => toggleSubmenu('products')}
        >
          Produtos
        </MenuItem>
        <Collapse in={activeSubmenu === 'products'}>
          <SubMenuItem to="/products" isActive={isActive('/products')}>
            Catálogo
          </SubMenuItem>
          <SubMenuItem to="/products/categories" isActive={isActive('/products/categories')}>
            Categorias
          </SubMenuItem>
          <SubMenuItem to="/products/inventory" isActive={isActive('/products/inventory')}>
            Estoque
          </SubMenuItem>
        </Collapse>

        <MenuItem
          icon={FiTruck}
          hasSubmenu
          isOpen={activeSubmenu === 'suppliers'}
          onClick={() => toggleSubmenu('suppliers')}
        >
          Fornecedores
        </MenuItem>
        <Collapse in={activeSubmenu === 'suppliers'}>
          <SubMenuItem to="/suppliers" isActive={isActive('/suppliers')}>
            Lista de Fornecedores
          </SubMenuItem>
          <SubMenuItem to="/suppliers/orders" isActive={isActive('/suppliers/orders')}>
            Pedidos
          </SubMenuItem>
        </Collapse>

        <MenuItem
          icon={FiDollarSign}
          hasSubmenu
          isOpen={activeSubmenu === 'sales'}
          onClick={() => toggleSubmenu('sales')}
        >
          Vendas
        </MenuItem>
        <Collapse in={activeSubmenu === 'sales'}>
          <SubMenuItem to="/sales" isActive={isActive('/sales')}>
            Pedidos de Venda
          </SubMenuItem>
          <SubMenuItem to="/sales/customers" isActive={isActive('/sales/customers')}>
            Clientes
          </SubMenuItem>
        </Collapse>

        <MenuItem
          icon={FiBarChart2}
          hasSubmenu
          isOpen={activeSubmenu === 'reports'}
          onClick={() => toggleSubmenu('reports')}
        >
          Relatórios
        </MenuItem>
        <Collapse in={activeSubmenu === 'reports'}>
          <SubMenuItem to="/reports/sales" isActive={isActive('/reports/sales')}>
            Vendas
          </SubMenuItem>
          <SubMenuItem to="/reports/inventory" isActive={isActive('/reports/inventory')}>
            Estoque
          </SubMenuItem>
          <SubMenuItem to="/reports/financial" isActive={isActive('/reports/financial')}>
            Financeiro
          </SubMenuItem>
        </Collapse>

        <MenuItem
          icon={FiFileText}
          hasSubmenu
          isOpen={activeSubmenu === 'fiscal'}
          onClick={() => toggleSubmenu('fiscal')}
        >
          Fiscal
        </MenuItem>
        <Collapse in={activeSubmenu === 'fiscal'}>
          <SubMenuItem to="/fiscal/invoices" isActive={isActive('/fiscal/invoices')}>
            Notas Fiscais
          </SubMenuItem>
          <SubMenuItem to="/fiscal/taxes" isActive={isActive('/fiscal/taxes')}>
            Impostos
          </SubMenuItem>
        </Collapse>

        <MenuItem
          icon={FiSettings}
          hasSubmenu
          isOpen={activeSubmenu === 'settings'}
          onClick={() => toggleSubmenu('settings')}
        >
          Configurações
        </MenuItem>
        <Collapse in={activeSubmenu === 'settings'}>
          <SubMenuItem to="/settings/general" isActive={isActive('/settings/general')}>
            Geral
          </SubMenuItem>
          <SubMenuItem to="/settings/email" isActive={isActive('/settings/email')}>
            Email
          </SubMenuItem>
          <SubMenuItem to="/settings/integrations" isActive={isActive('/settings/integrations')}>
            Integrações
          </SubMenuItem>
        </Collapse>

        <Box mt="6" mx="4">
          <Button
            width="full"
            onClick={handleLogout}
            colorScheme="red"
            variant="outline"
            leftIcon={<FiLogOut />}
          >
            Sair
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default Sidebar
