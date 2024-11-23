import { useState } from 'react'
import {
  Box,
  Flex,
  Icon,
  IconButton,
  Link,
  Text,
  Tooltip,
  VStack,
  Divider,
  Collapse,
  Avatar,
  Button,
  useToast,
} from '@chakra-ui/react'
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom'
import {
  MdDashboard,
  MdPeople,
  MdShoppingCart,
  MdBuild,
  MdShoppingBasket,
  MdCampaign,
  MdPerson,
  MdBusiness,
  MdMenu,
  MdChevronLeft,
  MdKeyboardArrowRight,
  MdKeyboardArrowDown,
  MdEmail,
  MdBarChart,
  MdSettings,
  MdAttachMoney,
  MdReceipt,
  MdInventory,
  MdCategory,
  MdExitToApp,
} from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'

const menuItems = [
  { 
    name: 'Dashboard', 
    icon: MdDashboard, 
    path: '/' 
  },
  {
    name: 'Vendas',
    icon: MdShoppingBasket,
    submenu: [
      { name: 'Pedidos', icon: MdReceipt, path: '/sales' },
      { name: 'Orçamentos', icon: MdAttachMoney, path: '/quotes' },
    ]
  },
  {
    name: 'Produtos',
    icon: MdShoppingCart,
    submenu: [
      { name: 'Lista de Produtos', icon: MdInventory, path: '/products' },
      { name: 'Categorias', icon: MdCategory, path: '/product-categories' },
    ]
  },
  { 
    name: 'Serviços', 
    icon: MdBuild, 
    path: '/services' 
  },
  { 
    name: 'Clientes', 
    icon: MdPeople, 
    path: '/customers' 
  },
  {
    name: 'Marketing',
    icon: MdCampaign,
    submenu: [
      { name: 'Campanhas', icon: MdBarChart, path: '/marketing' },
      { name: 'Email Marketing', icon: MdEmail, path: '/email-marketing' },
    ]
  },
  { 
    name: 'Usuários', 
    icon: MdPerson, 
    path: '/users' 
  },
  {
    name: 'Configurações',
    icon: MdSettings,
    submenu: [
      { name: 'Empresas', icon: MdBusiness, path: '/companies' },
      { name: 'Preferências', icon: MdSettings, path: '/settings' },
    ]
  },
]

export default function Sidebar({ onResize }) {
  const location = useLocation()
  const navigate = useNavigate()
  const toast = useToast()
  const { user, signOut } = useAuth()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [openSubmenus, setOpenSubmenus] = useState({})

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/login')
      toast({
        title: 'Logout realizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const toggleSidebar = () => {
    const newIsCollapsed = !isCollapsed
    setIsCollapsed(newIsCollapsed)
    onResize?.(newIsCollapsed)
  }

  const toggleSubmenu = (menuName) => {
    if (!isCollapsed) {
      setOpenSubmenus(prev => ({
        ...prev,
        [menuName]: !prev[menuName]
      }))
    }
  }

  const MenuItem = ({ item, isSubmenuItem = false }) => {
    const hasSubmenu = item.submenu && !isCollapsed
    const isActive = location.pathname === item.path
    const isSubmenuOpen = openSubmenus[item.name]
    const pl = isSubmenuItem ? (isCollapsed ? 2 : 8) : (isCollapsed ? 2 : 4)

    if (hasSubmenu) {
      return (
        <Box>
          <Flex
            align="center"
            px={pl}
            py={3}
            cursor="pointer"
            color={isActive ? 'blue.500' : 'gray.600'}
            onClick={() => toggleSubmenu(item.name)}
            _hover={{
              bg: 'gray.100',
              color: 'blue.500',
            }}
          >
            <Icon
              as={item.icon}
              fontSize="20"
              mr={isCollapsed ? 0 : 3}
            />
            {!isCollapsed && (
              <>
                <Text fontSize="sm" flex={1}>{item.name}</Text>
                <Icon
                  as={isSubmenuOpen ? MdKeyboardArrowDown : MdKeyboardArrowRight}
                  fontSize="20"
                />
              </>
            )}
          </Flex>
          <Collapse in={isSubmenuOpen}>
            <VStack spacing={0} align="stretch">
              {item.submenu.map((subItem) => (
                <MenuItem
                  key={subItem.path}
                  item={subItem}
                  isSubmenuItem={true}
                />
              ))}
            </VStack>
          </Collapse>
        </Box>
      )
    }

    return (
      <Tooltip
        label={isCollapsed ? item.name : ''}
        placement="right"
        hasArrow
      >
        <Link
          as={RouterLink}
          to={item.path}
          style={{ textDecoration: 'none' }}
          _focus={{ boxShadow: 'none' }}
        >
          <Flex
            align="center"
            px={pl}
            py={3}
            cursor="pointer"
            color={isActive ? 'blue.500' : 'gray.600'}
            bg={isActive ? 'blue.50' : 'transparent'}
            _hover={{
              bg: 'gray.100',
              color: 'blue.500',
            }}
            borderRight={isActive ? '3px solid' : 'none'}
            borderColor={isActive ? 'blue.500' : 'transparent'}
          >
            <Icon
              as={item.icon}
              fontSize="20"
              mr={isCollapsed ? 0 : 3}
            />
            {!isCollapsed && (
              <Text fontSize="sm">{item.name}</Text>
            )}
          </Flex>
        </Link>
      </Tooltip>
    )
  }

  return (
    <Box
      bg="white"
      w={isCollapsed ? '60px' : '240px'}
      h="100vh"
      position="fixed"
      left={0}
      top={0}
      boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.05)"
      transition="width 0.2s ease"
      zIndex={100}
      overflowX="hidden"
      overflowY="auto"
      display="flex"
      flexDirection="column"
    >
      <Flex
        h="60px"
        alignItems="center"
        justifyContent={isCollapsed ? 'center' : 'space-between'}
        px={isCollapsed ? 2 : 4}
      >
        {!isCollapsed && <Text fontSize="xl" fontWeight="bold">ERP</Text>}
        <IconButton
          aria-label={isCollapsed ? 'Expandir menu' : 'Recolher menu'}
          icon={isCollapsed ? <MdMenu /> : <MdChevronLeft />}
          variant="ghost"
          onClick={toggleSidebar}
          size="sm"
        />
      </Flex>

      <Divider />

      <VStack spacing={0} align="stretch" mt={2} flex={1}>
        {menuItems.map((item) => (
          <MenuItem key={item.path || item.name} item={item} />
        ))}
      </VStack>

      <Divider />

      <Box p={4}>
        <Flex
          direction={isCollapsed ? 'column' : 'row'}
          align="center"
          justify="space-between"
          mb={isCollapsed ? 4 : 2}
        >
          <Tooltip
            label={isCollapsed ? user?.email : ''}
            placement="right"
            hasArrow
          >
            <Flex align="center" mb={isCollapsed ? 2 : 0}>
              <Avatar
                size={isCollapsed ? 'sm' : 'md'}
                name={user?.email}
                src={user?.user_metadata?.avatar_url}
                mr={isCollapsed ? 0 : 2}
              />
              {!isCollapsed && (
                <Box>
                  <Text fontSize="sm" fontWeight="medium" noOfLines={1}>
                    {user?.email}
                  </Text>
                  <Text fontSize="xs" color="gray.500" noOfLines={1}>
                    {user?.user_metadata?.role || 'Usuário'}
                  </Text>
                </Box>
              )}
            </Flex>
          </Tooltip>

          <Tooltip
            label={isCollapsed ? 'Sair' : ''}
            placement="right"
            hasArrow
          >
            <IconButton
              aria-label="Sair"
              icon={<MdExitToApp />}
              variant="ghost"
              colorScheme="red"
              size={isCollapsed ? 'sm' : 'md'}
              onClick={handleSignOut}
            />
          </Tooltip>
        </Flex>
      </Box>
    </Box>
  )
}
