import { useState } from 'react';
import {
  Box,
  Flex,
  Text,
  BoxProps,
  Icon,
  VStack,
  IconButton,
  useColorModeValue,
  CloseButton,
  Drawer,
  DrawerContent,
  useDisclosure,
  Collapse,
  Stack
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import {
  FiHome,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiLogOut,
  FiMenu,
  FiChevronDown,
  FiChevronRight,
  FiTruck,
  FiTool,
  FiShoppingCart,
  FiFileText,
  FiBarChart2,
  FiSettings,
  FiUser,
  FiLock,
  FiMail,
  FiDatabase
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabase';

interface LinkItemProps {
  name: string;
  icon?: IconType;
  path?: string;
  children?: Array<{
    name: string;
    path: string;
    icon?: IconType;
  }>;
}

interface NavItemProps extends BoxProps {
  icon?: IconType;
  children: React.ReactNode;
  path?: string;
  isActive?: boolean;
  hasSubmenu?: boolean;
}

interface SidebarProps extends BoxProps {
  onClose?: () => void;
}

const LinkItems: Array<LinkItemProps> = [
  { 
    name: 'Dashboard', 
    icon: FiHome, 
    path: '/' 
  },
  { 
    name: 'Cadastros',
    icon: FiBox,
    children: [
      { name: 'Clientes', icon: FiUsers, path: '/customers' },
      { name: 'Produtos', icon: FiBox, path: '/products' },
      { name: 'Serviços', icon: FiTool, path: '/services' },
      { name: 'Fretes', icon: FiTruck, path: '/shipping' }
    ]
  },
  {
    name: 'Vendas',
    icon: FiShoppingCart,
    children: [
      { name: 'Produtos', icon: FiBox, path: '/sales/products' },
      { name: 'Ordem de Serviços', icon: FiFileText, path: '/sales/services' },
      { name: 'Fretes', icon: FiTruck, path: '/sales/shipping' }
    ]
  },
  {
    name: 'Relatórios',
    icon: FiBarChart2,
    path: '/reports'
  },
  {
    name: 'Configurações',
    icon: FiSettings,
    children: [
      { name: 'Perfil', icon: FiUser, path: '/settings/profile' },
      { name: 'Empresa', icon: FiDatabase, path: '/settings/company' },
      { name: 'Segurança', icon: FiLock, path: '/settings/security' },
      { name: 'Notificações', icon: FiMail, path: '/settings/notifications' },
      { name: 'Backup', icon: FiDatabase, path: '/settings/backup' }
    ]
  }
];

const NavItem = ({ icon, children, path, isActive, hasSubmenu, ...rest }: NavItemProps) => {
  const navigate = useNavigate();
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const hoverBg = useColorModeValue('blue.50', 'blue.700');
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    if (path) {
      navigate(path);
    } else if (hasSubmenu) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <Box w="full">
      <Flex
        align="center"
        p="3"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        color={isActive ? activeColor : undefined}
        bg={isActive ? hoverBg : undefined}
        _hover={{
          bg: hoverBg,
          color: activeColor,
        }}
        onClick={handleClick}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        <Text flex="1">{children}</Text>
        {hasSubmenu && (
          <Icon
            as={isOpen ? FiChevronDown : FiChevronRight}
            transition="all .25s ease-in-out"
          />
        )}
      </Flex>
      {hasSubmenu && (
        <Collapse in={isOpen} animateOpacity>
          <Stack pl={6} mt={1} spacing={1}>
            {rest.submenu}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const bg = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const renderNavItem = (item: LinkItemProps) => {
    if (item.children) {
      return (
        <NavItem
          key={item.name}
          icon={item.icon}
          hasSubmenu
          submenu={item.children.map((child) => (
            <NavItem
              key={child.name}
              icon={child.icon}
              path={child.path}
              isActive={location.pathname === child.path}
            >
              {child.name}
            </NavItem>
          ))}
        >
          {item.name}
        </NavItem>
      );
    }

    return (
      <NavItem
        key={item.name}
        icon={item.icon}
        path={item.path}
        isActive={location.pathname === item.path}
      >
        {item.name}
      </NavItem>
    );
  };

  return (
    <Box
      bg={bg}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Box pt="20">
        <VStack spacing={1} align="stretch" py={2}>
          {LinkItems.map((item) => renderNavItem(item))}
          <Box pt={4}>
            <NavItem
              icon={FiLogOut}
              path=""
              onClick={handleLogout}
              color="red.500"
              _hover={{
                color: 'red.400',
              }}
            >
              Sair
            </NavItem>
          </Box>
        </VStack>
      </Box>
    </Box>
  );
};

export function Sidebar({ ...rest }: SidebarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box>
      <SidebarContent display={{ base: 'none', md: 'block' }} {...rest} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        returnFocusOnClose={false}
        onOverlayClick={onClose}
        size="full"
      >
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>
      
      {/* Mobile nav */}
      <Box 
        display={{ base: 'flex', md: 'none' }} 
        position="fixed" 
        top={0}
        left={0}
        p={4}
        w="full"
        bg={useColorModeValue('white', 'gray.800')}
        borderBottomWidth="1px"
        borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        zIndex={9}
        alignItems="center"
      >
        <IconButton
          aria-label="Open menu"
          fontSize="20px"
          color={useColorModeValue('gray.800', 'inherit')}
          variant="ghost"
          icon={<FiMenu />}
          onClick={onOpen}
        />
      </Box>
    </Box>
  );
}
