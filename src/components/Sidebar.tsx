import {
  Box,
  VStack,
  Icon,
  Text,
  Link,
  Flex,
  useColorModeValue,
  BoxProps,
  CloseButton,
} from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../services/supabase';

interface NavItemProps {
  icon: IconType;
  children: string;
  onClick?: () => void;
}

const NavItem = ({ icon, children, onClick }: NavItemProps) => {
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
        transition="all 0.3s"
        _hover={{
          bg: 'blue.500',
          color: 'white',
        }}
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

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

export function SidebarContent({ onClose, ...rest }: SidebarProps) {
  const navigate = useNavigate();
  const { signOut: authSignOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      authSignOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Box
      bg="gray.800"
      w="240px"
      pos="fixed"
      top="0"
      left="0"
      h="100%"
      overflowY="auto"
      color="white"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: 'gray.600',
          borderRadius: '24px',
        },
      }}
      {...rest}
    >
      <Flex h="16" alignItems="center" mx="4" justifyContent="space-between" borderBottom="1px" borderColor="gray.700">
        <Text fontSize="2xl" fontWeight="bold" color="white">
          ERP FATEC
        </Text>
        <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} color="white" />
      </Flex>
      <Box>
        <NavItem icon={FiHome} onClick={() => navigate('/')}>
          Dashboard
        </NavItem>
        <NavItem icon={FiUsers} onClick={() => navigate('/customers')}>
          Clientes
        </NavItem>
        <NavItem icon={FiBox} onClick={() => navigate('/products')}>
          Produtos
        </NavItem>
        <NavItem icon={FiDollarSign} onClick={() => navigate('/sales')}>
          Vendas
        </NavItem>
        <NavItem icon={FiBarChart2} onClick={() => navigate('/reports')}>
          Relatórios
        </NavItem>
        <NavItem icon={FiSettings} onClick={() => navigate('/settings')}>
          Configurações
        </NavItem>
        <NavItem icon={FiLogOut} onClick={handleLogout}>
          Sair
        </NavItem>
      </Box>
    </Box>
  );
}
