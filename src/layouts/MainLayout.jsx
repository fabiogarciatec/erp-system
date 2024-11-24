import { Box, Flex, VStack, Icon, Text, Link as ChakraLink, Button, Spacer, Collapse } from '@chakra-ui/react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { 
  MdDashboard, 
  MdPeople, 
  MdShoppingCart, 
  MdCampaign,
  MdSettings,
  MdLogout,
  MdInventory,
  MdMiscellaneousServices,
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
    path: '/',
    section: 'MENU'
  },
  { 
    icon: MdPeople, 
    text: 'Clientes', 
    path: '/cadastros/clientes',
    section: 'CADASTROS'
  },
  {
    icon: MdInventory,
    text: 'Produtos',
    path: '/cadastros/produtos',
    section: 'CADASTROS'
  },
  {
    icon: MdMiscellaneousServices,
    text: 'Serviços',
    path: '/cadastros/servicos',
    section: 'CADASTROS'
  },
  { 
    icon: MdShoppingCart, 
    text: 'Vendas', 
    path: '/vendas',
    section: 'VENDAS',
    subItems: [
      { text: 'Produtos', path: '/vendas/produtos' },
      { text: 'Ordem de Serviço', path: '/vendas/ordem-servico' },
      { text: 'Fretes', path: '/vendas/fretes' }
    ]
  },
  { 
    icon: MdCampaign, 
    text: 'Marketing', 
    path: '/marketing',
    section: 'MARKETING',
    subItems: [
      { text: 'Campanhas', path: '/marketing/campanhas' },
      { text: 'Contatos', path: '/marketing/contatos' },
      { text: 'Disparos em massa', path: '/marketing/disparos' }
    ]
  },
  { 
    icon: MdBusiness, 
    text: 'Empresa', 
    path: '/configuracoes/empresa',
    section: 'CONFIGURAÇÕES'
  },
  { 
    icon: MdPeople, 
    text: 'Usuários', 
    path: '/configuracoes/usuarios',
    section: 'CONFIGURAÇÕES'
  }
]

const MenuItem = ({ icon, text, path, subItems }) => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const isActive = location.pathname === path || 
                  (subItems && subItems.some(item => location.pathname === item.path))

  const handleClick = (e) => {
    if (subItems) {
      e.preventDefault()
      setIsOpen(!isOpen)
    }
  }

  return (
    <VStack align="start" w="full" spacing={1}>
      <ChakraLink
        as={Link}
        to={path}
        w="full"
        p={2}
        borderRadius="md"
        onClick={handleClick}
        bg={isActive ? 'blue.50' : 'transparent'}
        color={isActive ? 'blue.600' : 'inherit'}
        _hover={{
          bg: isActive ? 'blue.100' : 'gray.100',
          color: isActive ? 'blue.700' : 'inherit'
        }}
      >
        <Flex align="center" justify="space-between">
          <Flex align="center">
            <Icon as={icon} boxSize={5} />
            <Text ml={2}>{text}</Text>
          </Flex>
          {subItems && (
            <Icon 
              as={isOpen ? MdKeyboardArrowDown : MdKeyboardArrowRight} 
              boxSize={5}
              transition="transform 0.2s"
              transform={isOpen ? 'rotate(0deg)' : 'rotate(0deg)'}
            />
          )}
        </Flex>
      </ChakraLink>
      
      {subItems && (
        <Collapse in={isOpen} animateOpacity>
          <VStack align="start" pl={6} w="full" spacing={1}>
            {subItems.map((item) => {
              const isSubItemActive = location.pathname === item.path
              return (
                <ChakraLink
                  key={item.path}
                  as={Link}
                  to={item.path}
                  w="full"
                  p={2}
                  borderRadius="md"
                  bg={isSubItemActive ? 'blue.50' : 'transparent'}
                  color={isSubItemActive ? 'blue.600' : 'inherit'}
                  _hover={{
                    bg: isSubItemActive ? 'blue.100' : 'gray.100',
                    color: isSubItemActive ? 'blue.700' : 'inherit'
                  }}
                >
                  {item.text}
                </ChakraLink>
              )
            })}
          </VStack>
        </Collapse>
      )}
    </VStack>
  )
}

export default function MainLayout() {
  const { signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  // Agrupar itens do menu por seção
  const menuSections = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = []
    }
    acc[item.section].push(item)
    return acc
  }, {})

  return (
    <Flex h="100vh">
      {/* Sidebar */}
      <Box w="250px" bg="white" p={4} shadow="sm" overflowY="auto">
        <VStack align="stretch" spacing={8} minH="100%">
          {/* Logo ou Nome do Sistema */}
          <Box p={4}>
            <Text fontSize="xl" fontWeight="bold">ERP System</Text>
          </Box>

          {/* Menu Items por Seção */}
          {Object.entries(menuSections).map(([section, items]) => (
            <VStack key={section} align="stretch" spacing={4}>
              <Text fontSize="sm" color="gray.500" fontWeight="bold" px={4}>
                {section}
              </Text>
              {items.map((item) => (
                <MenuItem key={item.path} {...item} />
              ))}
            </VStack>
          ))}

          {/* Spacer para empurrar o botão de logout para baixo */}
          <Spacer />

          {/* Botão de Logout */}
          <Button
            variant="ghost"
            onClick={handleLogout}
            leftIcon={<Icon as={MdLogout} />}
            justifyContent="flex-start"
            w="100%"
            mb={4}
          >
            Sair
          </Button>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex="1" bg="gray.50" p={8} overflowY="auto">
        <Outlet />
      </Box>
    </Flex>
  )
}
