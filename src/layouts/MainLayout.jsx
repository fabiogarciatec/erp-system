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

  return (
    <VStack align="start" w="full" spacing={1}>
      {/* Menu Item Principal */}
      {subItems ? (
        // Item com submenu
        <Button
          variant="ghost"
          onClick={onToggle}
          w="full"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          bg={isActive ? 'blue.50' : 'transparent'}
          color={isActive ? 'blue.500' : 'gray.700'}
          _hover={{
            bg: isActive ? 'blue.50' : 'gray.50'
          }}
          leftIcon={<Icon as={icon} />}
          rightIcon={
            <Icon 
              as={isOpen ? MdKeyboardArrowDown : MdKeyboardArrowRight}
              transition="transform 0.2s"
              transform={isOpen ? 'rotate(0deg)' : 'rotate(-90deg)'}
            />
          }
        >
          {text}
        </Button>
      ) : (
        // Item sem submenu
        <Button
          as={Link}
          to={path}
          variant="ghost"
          w="full"
          display="flex"
          alignItems="center"
          justifyContent="flex-start"
          bg={isActive ? 'blue.50' : 'transparent'}
          color={isActive ? 'blue.500' : 'gray.700'}
          _hover={{
            bg: isActive ? 'blue.50' : 'gray.50',
            textDecoration: 'none'
          }}
          leftIcon={<Icon as={icon} />}
        >
          {text}
        </Button>
      )}

      {/* Submenu */}
      {subItems && (
        <Collapse in={isOpen} animateOpacity style={{ width: '100%' }}>
          <VStack align="stretch" pl={8} mt={1} spacing={1}>
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
                _hover={{
                  bg: location.pathname === item.path ? 'blue.50' : 'gray.50',
                  textDecoration: 'none'
                }}
              >
                {item.text}
              </Button>
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
  const [openMenus, setOpenMenus] = useState({})
  const { isOpen: isSidebarOpen, onToggle: onSidebarToggle } = useDisclosure({ defaultIsOpen: true })

  // Group menu items by section
  const menuSections = menuItems.reduce((acc, item) => {
    if (!acc[item.section]) {
      acc[item.section] = []
    }
    acc[item.section].push(item)
    return acc
  }, {})

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const toggleMenu = (menuText) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuText]: !prev[menuText]
    }))
  }

  return (
    <Flex h="100vh" bg="gray.50">
      {/* Toggle Button */}
      <IconButton
        icon={<Icon as={MdMenu} />}
        position="fixed"
        top={4}
        left={4}
        zIndex={2}
        onClick={onSidebarToggle}
        aria-label="Toggle Menu"
        display={{ base: 'flex', md: 'none' }}
      />

      {/* Sidebar */}
      <Box
        w={isSidebarOpen ? "280px" : "0px"}
        bg="white"
        borderRight="1px"
        borderColor="gray.200"
        overflowY="auto"
        transition="width 0.2s"
        position={{ base: 'fixed', md: 'relative' }}
        h="100vh"
        zIndex={1}
        pt={{ base: 16, md: 0 }}
      >
        <VStack spacing={6} align="stretch" h="full" p={4}>
          {/* Logo or Brand */}
          <Box>
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
                    key={item.path || item.text}
                    icon={item.icon}
                    text={item.text}
                    path={item.path}
                    subItems={item.subItems}
                    isOpen={openMenus[item.text]}
                    onToggle={() => toggleMenu(item.text)}
                  />
                ))}
              </VStack>
            ))}
          </VStack>

          {/* Logout Button */}
          <Button
            leftIcon={<Icon as={MdLogout} />}
            onClick={handleLogout}
            variant="ghost"
            justifyContent="flex-start"
            w="full"
          >
            Sair
          </Button>
        </VStack>
      </Box>

      {/* Main Content */}
      <Box 
        flex="1" 
        p={8} 
        ml={{ base: 0, md: isSidebarOpen ? "280px" : "0px" }}
        transition="margin-left 0.2s"
        w={{ base: '100%', md: `calc(100% - ${isSidebarOpen ? "280px" : "0px"})` }}
      >
        <Box maxW="1200px" mx="auto">
          <Outlet />
        </Box>
      </Box>
    </Flex>
  )
}

export default MainLayout
