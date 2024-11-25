import { Box, Flex, VStack, Icon, Text, Button, Collapse, useDisclosure, IconButton } from '@chakra-ui/react'
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom'
import { 
  MdDashboard, 
  MdPeople, 
  MdShoppingCart, 
  MdCampaign,
  MdSettings,
  MdLogout,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdMenu
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
    text: 'Cadastros',
    section: 'CADASTROS',
    subItems: [
      { text: 'Clientes', path: '/cadastros/clientes' },
      { text: 'Produtos', path: '/cadastros/produtos' },
      { text: 'Serviços', path: '/cadastros/servicos' }
    ]
  },
  { 
    icon: MdShoppingCart, 
    text: 'Vendas',
    section: 'OPERAÇÕES',
    subItems: [
      { text: 'Produtos', path: '/vendas/produtos' },
      { text: 'Ordem de Serviço', path: '/vendas/ordem-servico' },
      { text: 'Fretes', path: '/vendas/fretes' }
    ]
  },
  { 
    icon: MdCampaign, 
    text: 'Marketing',
    section: 'MARKETING',
    subItems: [
      { text: 'Campanhas', path: '/marketing/campanhas' },
      { text: 'Contatos', path: '/marketing/contatos' },
      { text: 'Disparos', path: '/marketing/disparos' }
    ]
  },
  {
    icon: MdSettings,
    text: 'Configurações',
    section: 'CONFIGURAÇÕES',
    subItems: [
      { text: 'Empresa', path: '/configuracoes/empresa' },
      { text: 'Usuários', path: '/configuracoes/usuarios' },
      { text: 'Permissões', path: '/configuracoes/permissoes' }
    ]
  }
]

const MenuItem = ({ icon, text, path, subItems, isOpen, onToggle }) => {
  const location = useLocation()
  
  const isActive = location.pathname === path || 
                  (subItems && subItems.some(item => location.pathname === item.path))

  if (subItems) {
    return (
      <VStack align="stretch" w="full" spacing={1}>
        <Button
          variant="ghost"
          onClick={onToggle}
          w="full"
          justifyContent="flex-start"
          bg={isActive ? 'blue.50' : 'transparent'}
          color={isActive ? 'blue.500' : 'gray.700'}
          leftIcon={<Icon as={icon} />}
          rightIcon={
            <Icon 
              as={isOpen ? MdKeyboardArrowDown : MdKeyboardArrowRight}
              transform={isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}
              transition="transform 0.2s"
            />
          }
          _hover={{ bg: 'gray.100' }}
        >
          {text}
        </Button>

        <Collapse in={isOpen} animateOpacity>
          <VStack align="stretch" pl={6} spacing={1}>
            {subItems.map((item) => (
              <Button
                key={item.path}
                as={Link}
                to={item.path}
                variant="ghost"
                size="sm"
                justifyContent="flex-start"
                bg={location.pathname === item.path ? 'blue.50' : 'transparent'}
                color={location.pathname === item.path ? 'blue.500' : 'gray.700'}
                _hover={{ bg: 'gray.100' }}
              >
                {item.text}
              </Button>
            ))}
          </VStack>
        </Collapse>
      </VStack>
    )
  }

  return (
    <Button
      as={Link}
      to={path}
      variant="ghost"
      w="full"
      justifyContent="flex-start"
      bg={isActive ? 'blue.50' : 'transparent'}
      color={isActive ? 'blue.500' : 'gray.700'}
      leftIcon={<Icon as={icon} />}
      _hover={{ bg: 'gray.100' }}
    >
      {text}
    </Button>
  )
}

const MainLayout = () => {
  const { signOut } = useAuth()
  const navigate = useNavigate()
  const [openMenus, setOpenMenus] = useState({})
  const { isOpen: isSidebarOpen, onToggle: onSidebarToggle } = useDisclosure({ defaultIsOpen: true })

  const handleLogout = async () => {
    try {
      const { error } = await signOut()
      if (error) throw error
      navigate('/login')
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
    }
  }

  const toggleMenu = (menuText) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuText]: !prev[menuText]
    }))
  }

  // Group menu items by section
  const menuSections = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = []
    }
    acc[item.section].push(item)
    return acc
  }, {})

  return (
    <Flex h="100vh" overflow="hidden">
      {/* Mobile Menu Button */}
      <IconButton
        icon={<Icon as={MdMenu} />}
        position="fixed"
        top={4}
        left={4}
        zIndex={20}
        onClick={onSidebarToggle}
        display={{ base: 'flex', md: 'none' }}
      />

      {/* Sidebar */}
      <Box
        w={{ base: 'full', md: '280px' }}
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        h="100vh"
        position={{ base: 'fixed', md: 'relative' }}
        zIndex={10}
        transform={{ base: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)', md: 'none' }}
        transition="all 0.3s"
        overflowY="auto"
        display={{ base: isSidebarOpen ? 'block' : 'none', md: 'block' }}
      >
        <VStack spacing={6} align="stretch" p={4} h="full">
          {/* Logo */}
          <Box py={2}>
            <Text fontSize="xl" fontWeight="bold" color="blue.500">
              ERP System
            </Text>
          </Box>

          {/* Menu Sections */}
          <VStack spacing={6} align="stretch" flex={1}>
            {Object.entries(menuSections).map(([section, items]) => (
              <VStack key={section} align="stretch" spacing={1}>
                <Text
                  fontSize="xs"
                  fontWeight="bold"
                  color="gray.500"
                  px={3}
                  py={2}
                >
                  {section}
                </Text>
                {items.map((item) => (
                  <MenuItem
                    key={item.text}
                    {...item}
                    isOpen={openMenus[item.text]}
                    onToggle={() => toggleMenu(item.text)}
                  />
                ))}
              </VStack>
            ))}
          </VStack>

          {/* Logout Button */}
          <Button
            variant="ghost"
            w="full"
            justifyContent="flex-start"
            leftIcon={<Icon as={MdLogout} />}
            onClick={handleLogout}
            color="gray.700"
            _hover={{ bg: 'gray.100' }}
          >
            Sair
          </Button>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box flex={1} p={8} bg="gray.50" overflowY="auto">
        <Outlet />
      </Box>
    </Flex>
  )
}

export default MainLayout
