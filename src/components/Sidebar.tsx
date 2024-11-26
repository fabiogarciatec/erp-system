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
  useDisclosure
} from '@chakra-ui/react';
import { IconType } from 'react-icons';
import {
  FiHome,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiLogOut,
  FiMenu
} from 'react-icons/fi';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabase';

interface LinkItemProps {
  name: string;
  icon: IconType;
  path: string;
}

const LinkItems: Array<LinkItemProps> = [
  { name: 'Dashboard', icon: FiHome, path: '/' },
  { name: 'Clientes', icon: FiUsers, path: '/customers' },
  { name: 'Produtos', icon: FiBox, path: '/products' },
  { name: 'Vendas', icon: FiDollarSign, path: '/sales' },
];

interface NavItemProps extends BoxProps {
  icon: IconType;
  children: string;
  path: string;
  isActive?: boolean;
}

const NavItem = ({ icon, children, path, isActive, ...rest }: NavItemProps) => {
  const activeColor = useColorModeValue('blue.500', 'blue.200');
  const hoverBg = useColorModeValue('blue.50', 'blue.700');
  const navigate = useNavigate();

  return (
    <Box
      as="button"
      onClick={() => navigate(path)}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      w="full"
    >
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
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

interface SidebarProps extends BoxProps {
  onClose?: () => void;
}

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
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          ERP FATEC
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
      </Flex>
      <VStack spacing={1} align="stretch" py={2}>
        {LinkItems.map((link) => (
          <NavItem
            key={link.name}
            icon={link.icon}
            path={link.path}
            isActive={location.pathname === link.path}
          >
            {link.name}
          </NavItem>
        ))}
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
      <Box display={{ base: 'flex', md: 'none' }} position="fixed" top={4} left={4} zIndex={20}>
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
