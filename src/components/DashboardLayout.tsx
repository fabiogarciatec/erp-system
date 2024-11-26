import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  IconButton,
  Icon,
  useColorModeValue,
  useDisclosure,
  Drawer,
  DrawerContent,
  BoxProps,
  useToast,
  CloseButton,
} from '@chakra-ui/react';
import {
  FiMenu,
  FiHome,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/supabase';

interface NavItemProps extends BoxProps {
  icon: IconType;
  children: string;
  onClick?: () => void;
}

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const NavItem = ({ icon, children, onClick, ...rest }: NavItemProps) => {
  return (
    <Box
      as="a"
      href="#"
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
      onClick={(e) => {
        e.preventDefault();
        onClick?.();
      }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'blue.400',
          color: 'white',
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            _groupHover={{
              color: 'white',
            }}
            as={icon}
          />
        )}
        {children}
      </Flex>
    </Box>
  );
};

const SidebarContent = ({ onClose, ...rest }: SidebarProps) => {
  const navigate = useNavigate();
  const toast = useToast();
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: 'Logout realizado com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      transition="3s ease"
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
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
      <NavItem icon={FiHome} onClick={() => navigate('/dashboard')}>Dashboard</NavItem>
      <NavItem icon={FiUsers} onClick={() => navigate('/customers')}>Clientes</NavItem>
      <NavItem icon={FiBox}>Produtos</NavItem>
      <NavItem icon={FiDollarSign}>Vendas</NavItem>
      <NavItem icon={FiBarChart2}>Relatórios</NavItem>
      <NavItem icon={FiSettings}>Configurações</NavItem>
      <NavItem icon={FiLogOut} onClick={handleLogout}>
        Sair
      </NavItem>
    </Box>
  );
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
      <SidebarContent
        onClose={onClose}
        display={{ base: 'none', md: 'block' }}
      />
      <Drawer
        autoFocus={false}
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
      {/* mobilenav */}
      <Box ml={{ base: 0, md: 60 }} p="4">
        {/* Header */}
        <Flex
          mb={5}
          alignItems="center"
          justifyContent={{ base: 'space-between', md: 'flex-end' }}
        >
          <IconButton
            display={{ base: 'flex', md: 'none' }}
            onClick={onOpen}
            variant="outline"
            aria-label="open menu"
            icon={<FiMenu />}
          />
          <Text
            display={{ base: 'flex', md: 'none' }}
            fontSize="2xl"
            fontWeight="bold"
          >
            ERP FATEC
          </Text>
          <Text color="gray.600" fontSize="sm">
            {user?.email}
          </Text>
        </Flex>
        {/* Content */}
        {children}
      </Box>
    </Box>
  );
}
