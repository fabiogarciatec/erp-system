import React, { useState } from 'react'
import {
  Box,
  Flex,
  VStack,
  Text,
  Icon,
  Button,
  Collapse,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import {
  FiHome,
  FiUsers,
  FiBox,
  FiTruck,
  FiDollarSign,
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
  const activeBg = useColorModeValue('blue.50', 'blue.800')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  const activeColor = useColorModeValue('blue.600', 'blue.200')
  const iconColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Flex
      as={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      align="center"
      p="3"
      mx="2"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : 'inherit'}
      _hover={{
        bg: hoverBg,
        color: activeColor,
      }}
      transition="all 0.2s"
      justify="space-between"
    >
      <Flex align="center">
        <Icon
          mr="3"
          fontSize="16"
          as={icon}
          color={isActive ? activeColor : iconColor}
          _groupHover={{ color: activeColor }}
          transition="all 0.2s"
        />
        <Text fontSize="sm" fontWeight={isActive ? "semibold" : "medium"}>
          {children}
        </Text>
      </Flex>
      {hasSubmenu && (
        <Icon
          as={isOpen ? FiChevronDown : FiChevronRight}
          ml="auto"
          fontSize="14"
          transform={isOpen ? 'rotate(-180deg)' : undefined}
          transition="all 0.2s"
          color={isActive ? activeColor : iconColor}
          _groupHover={{ color: activeColor }}
        />
      )}
    </Flex>
  )
}

const SubMenuItem = ({ children, to, isActive }) => {
  const activeBg = useColorModeValue('blue.50', 'blue.800')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  const activeColor = useColorModeValue('blue.600', 'blue.200')

  return (
    <Flex
      as={Link}
      to={to}
      align="center"
      p="2"
      pl="11"
      mx="2"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : 'inherit'}
      _hover={{
        bg: hoverBg,
        color: activeColor,
      }}
      fontSize="sm"
      transition="all 0.2s"
    >
      <Text>{children}</Text>
    </Flex>
  )
}

const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [activeSubmenu, setActiveSubmenu] = useState(null)

  const bgColor = useColorModeValue('white', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

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
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w="64"
      sx={{
        '&::-webkit-scrollbar': {
          width: '2px',
        },
        '&::-webkit-scrollbar-track': {
          width: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('gray.300', 'gray.600'),
          borderRadius: '24px',
        },
      }}
    >
      <VStack spacing={1} align="stretch">
        <Box p="5" pb="3">
          <Text 
            fontSize="lg" 
            fontWeight="bold" 
            color={useColorModeValue('gray.800', 'white')}
            letterSpacing="tight"
          >
            ERP System
          </Text>
        </Box>

        <Box px="3" mb="4">
          <MenuItem icon={FiHome} to="/" isActive={isActive('/')}>
            Dashboard
          </MenuItem>
        </Box>

        <Divider mb="4" borderColor={borderColor} opacity={0.3} />

        <Box px="3" mb="4">
          <Text
            px="3"
            fontSize="xs"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            color={useColorModeValue('gray.500', 'gray.400')}
            mb="2"
          >
            Gestão
          </Text>

          <MenuItem
            icon={FiGrid}
            hasSubmenu
            isOpen={activeSubmenu === 'companies'}
            onClick={() => toggleSubmenu('companies')}
            isActive={location.pathname.startsWith('/companies')}
          >
            Empresas
          </MenuItem>
          <Collapse in={activeSubmenu === 'companies'} animateOpacity>
            <SubMenuItem to="/companies" isActive={isActive('/companies')}>
              Lista de Empresas
            </SubMenuItem>
            <SubMenuItem to="/companies/branches" isActive={isActive('/companies/branches')}>
              Filiais
            </SubMenuItem>
          </Collapse>
        </Box>

        <Box px="3" mb="4">
          <Text
            px="3"
            fontSize="xs"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            color={useColorModeValue('gray.500', 'gray.400')}
            mb="2"
          >
            Operacional
          </Text>

          <MenuItem
            icon={FiBox}
            hasSubmenu
            isOpen={activeSubmenu === 'products'}
            onClick={() => toggleSubmenu('products')}
            isActive={location.pathname.startsWith('/products')}
          >
            Produtos
          </MenuItem>
          <Collapse in={activeSubmenu === 'products'} animateOpacity>
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
            isActive={location.pathname.startsWith('/suppliers')}
          >
            Fornecedores
          </MenuItem>
          <Collapse in={activeSubmenu === 'suppliers'} animateOpacity>
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
            isActive={location.pathname.startsWith('/sales')}
          >
            Vendas
          </MenuItem>
          <Collapse in={activeSubmenu === 'sales'} animateOpacity>
            <SubMenuItem to="/sales" isActive={isActive('/sales')}>
              Pedidos de Venda
            </SubMenuItem>
            <SubMenuItem to="/sales/customers" isActive={isActive('/sales/customers')}>
              Clientes
            </SubMenuItem>
          </Collapse>
        </Box>

        <Box px="3" mb="4">
          <Text
            px="3"
            fontSize="xs"
            fontWeight="semibold"
            textTransform="uppercase"
            letterSpacing="wider"
            color={useColorModeValue('gray.500', 'gray.400')}
            mb="2"
          >
            Relatórios
          </Text>

          <MenuItem
            icon={FiBarChart2}
            hasSubmenu
            isOpen={activeSubmenu === 'reports'}
            onClick={() => toggleSubmenu('reports')}
            isActive={location.pathname.startsWith('/reports')}
          >
            Relatórios
          </MenuItem>
          <Collapse in={activeSubmenu === 'reports'} animateOpacity>
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
            isActive={location.pathname.startsWith('/fiscal')}
          >
            Fiscal
          </MenuItem>
          <Collapse in={activeSubmenu === 'fiscal'} animateOpacity>
            <SubMenuItem to="/fiscal/invoices" isActive={isActive('/fiscal/invoices')}>
              Notas Fiscais
            </SubMenuItem>
            <SubMenuItem to="/fiscal/taxes" isActive={isActive('/fiscal/taxes')}>
              Impostos
            </SubMenuItem>
          </Collapse>
        </Box>

        <Divider mb="4" borderColor={borderColor} opacity={0.3} />

        <Box px="3">
          <MenuItem
            icon={FiSettings}
            hasSubmenu
            isOpen={activeSubmenu === 'settings'}
            onClick={() => toggleSubmenu('settings')}
            isActive={location.pathname.startsWith('/settings')}
          >
            Configurações
          </MenuItem>
          <Collapse in={activeSubmenu === 'settings'} animateOpacity>
            <SubMenuItem to="/settings/general" isActive={isActive('/settings/general')}>
              Geral
            </SubMenuItem>
            <SubMenuItem to="/settings/users" isActive={isActive('/settings/users')}>
              Usuários
            </SubMenuItem>
            <SubMenuItem to="/settings/email" isActive={isActive('/settings/email')}>
              Email
            </SubMenuItem>
            <SubMenuItem to="/settings/integrations" isActive={isActive('/settings/integrations')}>
              Integrações
            </SubMenuItem>
          </Collapse>
        </Box>

        <Box px="5" mt="6">
          <Button
            width="full"
            size="sm"
            onClick={handleLogout}
            colorScheme="red"
            variant="ghost"
            leftIcon={<FiLogOut />}
            justifyContent="flex-start"
            fontWeight="medium"
            _hover={{
              bg: useColorModeValue('red.50', 'red.900'),
              color: useColorModeValue('red.600', 'red.200'),
            }}
          >
            Sair
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default Sidebar
