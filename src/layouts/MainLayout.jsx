import { Box, Flex, VStack, Icon, Text, Link as ChakraLink, Button, Spacer } from '@chakra-ui/react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
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
  MdTune
} from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'

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
  },
  { 
    icon: MdTune, 
    text: 'Ajustes', 
    path: '/configuracoes/ajustes',
    section: 'CONFIGURAÇÕES'
  }
]

const MenuItem = ({ icon, text, path, subItems }) => {
  return (
    <VStack align="start" w="full">
      <ChakraLink as={Link} to={path} w="full" _hover={{ bg: 'gray.100' }} p={2} borderRadius="md">
        <Flex align="center">
          <Icon as={icon} boxSize={5} />
          <Text ml={2}>{text}</Text>
        </Flex>
      </ChakraLink>
      {subItems && (
        <VStack align="start" pl={6} w="full">
          {subItems.map((item) => (
            <ChakraLink
              key={item.path}
              as={Link}
              to={item.path}
              w="full"
              _hover={{ bg: 'gray.100' }}
              p={2}
              borderRadius="md"
            >
              {item.text}
            </ChakraLink>
          ))}
        </VStack>
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
      <Box w="250px" bg="white" p={4} shadow="sm">
        <VStack align="stretch" spacing={8} h="100%">
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
