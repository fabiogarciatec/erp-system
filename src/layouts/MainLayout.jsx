import { Box, Flex, VStack, Icon, Text, Button, Spacer, Collapse, useDisclosure } from '@chakra-ui/react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  MdDashboard, 
  MdPeople, 
  MdShoppingCart, 
  MdCampaign,
  MdSettings,
  MdLogout,
  MdBusiness,
  MdTune,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight
} from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'
import { useState } from 'react'

const menuItems = [
  { 
    icon: MdDashboard, 
    text: 'Dashboard', 
    path: '/dashboard',
    section: 'MENU'
  },
  { 
    icon: MdPeople, 
    text: 'Cadastros', 
    path: '/customers',
    section: 'CADASTROS',
    subItems: [
      { text: 'Clientes', path: '/customers' },
      { text: 'Fornecedores', path: '/suppliers' },
      { text: 'Produtos', path: '/products' },
      { text: 'Serviços', path: '/services' }
    ]
  },
  { 
    icon: MdShoppingCart, 
    text: 'Vendas', 
    path: '/sales',
    section: 'OPERAÇÕES',
    subItems: [
      { text: 'Pedidos', path: '/sales/orders' },
      { text: 'Orçamentos', path: '/sales/quotes' },
      { text: 'Ordens de Serviço', path: '/sales/service-orders' }
    ]
  },
  { 
    icon: MdCampaign, 
    text: 'Marketing', 
    path: '/marketing',
    section: 'MARKETING',
    subItems: [
      { text: 'Campanhas', path: '/marketing/campaigns' },
      { text: 'E-mail Marketing', path: '/marketing/email' },
      { text: 'Leads', path: '/marketing/leads' }
    ]
  },
  {
    icon: MdBusiness,
    text: 'Empresas',
    path: '/companies/profile',
    section: 'CONFIGURAÇÕES',
    subItems: [
      { text: 'Minha Empresa', path: '/companies/profile' },
      { text: 'Filiais', path: '/companies/branches' }
    ]
  },
  {
    icon: MdPeople,
    text: 'Usuários',
    path: '/users/list',
    section: 'CONFIGURAÇÕES',
    subItems: [
      { text: 'Lista de Usuários', path: '/users/list' },
      { text: 'Permissões', path: '/users/roles' }
    ]
  },
  {
    icon: MdTune,
    text: 'Configurações',
    path: '/settings/general',
    section: 'CONFIGURAÇÕES',
    subItems: [
      { text: 'Geral', path: '/settings/general' },
      { text: 'Integrações', path: '/settings/integrations' }
    ]
  }
]

const MenuItem = ({ icon, text, path, subItems }) => {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  
  const isActive = location.pathname === path || 
                  (subItems && subItems.some(item => location.pathname === item.path))

  const handleClick = (e) => {
    e.preventDefault()
    if (subItems) {
      setIsOpen(!isOpen)
    } else {
      navigate(path)
    }
  }

  return (
    <VStack align="start" w="full" spacing={1}>
      <Box
        as="button"
        onClick={handleClick}
        w="full"
        p={2}
        borderRadius="md"
        bg={isActive ? 'blue.50' : 'transparent'}
        color={isActive ? 'blue.500' : 'gray.700'}
        _hover={{
          bg: isActive ? 'blue.50' : 'gray.50'
        }}
        display="flex"
        alignItems="center"
      >
        <Icon as={icon} mr={3} />
        <Text flex="1" textAlign="left">{text}</Text>
        {subItems && (
          <Icon 
            as={isOpen ? MdKeyboardArrowDown : MdKeyboardArrowRight} 
            ml={2}
          />
        )}
      </Box>

      {subItems && (
        <Collapse in={isOpen} animateOpacity>
          <VStack align="start" w="full" pl={6} mt={1}>
            {subItems.map((item) => (
              <Box
                key={item.path}
                as="button"
                onClick={() => navigate(item.path)}
                w="full"
                p={2}
                borderRadius="md"
                bg={location.pathname === item.path ? 'blue.50' : 'transparent'}
                color={location.pathname === item.path ? 'blue.500' : 'gray.700'}
                _hover={{
                  bg: location.pathname === item.path ? 'blue.50' : 'gray.50'
                }}
                display="flex"
                alignItems="center"
              >
                <Text flex="1" textAlign="left">{item.text}</Text>
              </Box>
            ))}
          </VStack>
        </Collapse>
      )}
    </VStack>
  )
}

const MainLayout = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  // Group menu items by section
  const menuSections = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = []
    }
    acc[item.section].push(item)
    return acc
  }, {})

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Sidebar */}
      <Box w="280px" bg="white" borderRight="1px" borderColor="gray.200" p={4} overflowY="auto">
        <VStack spacing={6} align="stretch" h="full">
          {/* Logo or Brand */}
          <Box p={2}>
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              ERP System
            </Text>
          </Box>

          {/* Menu Sections */}
          <VStack spacing={6} align="stretch" flex="1">
            {Object.entries(menuSections).map(([section, items]) => (
              <VStack key={section} align="start" spacing={2}>
                <Text fontSize="sm" color="gray.500" fontWeight="medium" px={2}>
                  {section}
                </Text>
                {items.map((item) => (
                  <MenuItem
                    key={item.path}
                    icon={item.icon}
                    text={item.text}
                    path={item.path}
                    subItems={item.subItems}
                  />
                ))}
              </VStack>
            ))}
          </VStack>

          {/* Logout Button */}
          <Button
            leftIcon={<MdLogout />}
            variant="ghost"
            w="full"
            justifyContent="start"
            onClick={logout}
            mb={4}
          >
            Sair
          </Button>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" p={8} overflowY="auto">
        <Outlet />
      </Box>
    </Flex>
  )
}

export default MainLayout
