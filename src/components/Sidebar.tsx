import {
  Box,
  Flex,
  useColorModeValue,
  BoxProps,
  Text,
  Button,
  Divider,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTruck,
  FiSettings,
  FiShoppingBag,
  FiBarChart2,
  FiDatabase,
  FiUsers,
  FiBox,
  FiTool,
  FiGrid,
  FiPackage,
  FiDollarSign,
  FiShoppingCart,
  FiTrello,
  FiMap,
  FiUser,
  FiCreditCard,
  FiArchive,
  FiClipboard,
  FiTrendingUp,
  FiShield,
  FiBell,
  FiLink,
  FiLogOut,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from './Logo';
import SidebarNavItem from './SidebarNavItem';

interface SidebarProps extends BoxProps {
  onClose: () => void;
}

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: FiHome,
    href: '/',
  },
  {
    label: 'Cadastros',
    icon: FiDatabase,
    subItems: [
      {
        label: 'Clientes',
        href: '/customers',
        icon: FiUsers,
      },
      {
        label: 'Fornecedores',
        href: '/suppliers',
        icon: FiTruck,
      },
      {
        label: 'Produtos',
        href: '/products',
        icon: FiBox,
      },
      {
        label: 'Serviços',
        href: '/services',
        icon: FiTool,
      },
      {
        label: 'Categorias',
        href: '/categories',
        icon: FiGrid,
      },
    ],
  },
  {
    label: 'Vendas',
    icon: FiShoppingBag,
    subItems: [
      {
        label: 'Produtos',
        href: '/sales/products',
        icon: FiPackage,
      },
      {
        label: 'Serviços',
        href: '/sales/services',
        icon: FiTool,
      },
      {
        label: 'Fretes',
        href: '/shipping',
        icon: FiTruck,
      },
      {
        label: 'Ordens de Serviço',
        href: '/sales/service-orders',
        icon: FiClipboard,
      },
    ],
  },
  {
    label: 'Expedição',
    icon: FiTruck,
    subItems: [
      {
        label: 'Ordens',
        href: '/shipping/orders',
        icon: FiTrello,
      },
      {
        label: 'Rastreamento',
        href: '/shipping/tracking',
        icon: FiMap,
      },
    ],
  },
  {
    label: 'Relatórios',
    icon: FiBarChart2,
    href: '/reports',
  },
  {
    label: 'Configurações',
    icon: FiSettings,
    subItems: [
      {
        label: 'Perfil',
        href: '/settings/profile',
        icon: FiUser,
      },
      {
        label: 'Empresa',
        href: '/settings/company',
        icon: FiArchive,
      },
      {
        label: 'Segurança',
        href: '/settings/security',
        icon: FiShield,
      },
      {
        label: 'Financeiro',
        href: '/settings/financial',
        icon: FiCreditCard,
      },
      {
        label: 'Vendas',
        href: '/settings/sales',
        icon: FiTrendingUp,
      },
      {
        label: 'Notificações',
        href: '/settings/notifications',
        icon: FiBell,
      },
      {
        label: 'Usuários',
        href: '/settings/users',
        icon: FiUsers,
      },
      {
        label: 'Backup',
        href: '/settings/backup',
        icon: FiDatabase,
      },
      {
        label: 'Integrações',
        href: '/settings/integrations',
        icon: FiLink,
      }
    ],
  },
];

const Sidebar = ({ onClose, ...rest }: SidebarProps) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      {...rest}
    >
      <Flex h="full" direction="column">
        <Box 
          px="4" 
          bg={useColorModeValue('white', 'gray.800')} 
          borderBottom="1px" 
          borderBottomColor={borderColor}
          display="flex"
          alignItems="center"
          justifyContent="center"
          height="16"
        >
          <Logo />
        </Box>

        <Box
          flex="1"
          overflowY="auto"
          bg={useColorModeValue('white', 'gray.800')}
          css={{
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-track': {
              width: '6px',
              background: useColorModeValue('gray.100', 'whiteAlpha.50'),
            },
            '&::-webkit-scrollbar-thumb': {
              background: useColorModeValue('gray.300', 'whiteAlpha.200'),
              borderRadius: '24px',
            },
          }}
        >
          <Flex direction="column" pt="6">
            {NAV_ITEMS.map((item) => (
              <SidebarNavItem
                key={item.label}
                icon={item.icon}
                href={item.href}
                subItems={item.subItems}
                onClick={onClose}
              >
                {item.label}
              </SidebarNavItem>
            ))}
            <Box minH="20px" />
          </Flex>
        </Box>

        <Box 
          p="4" 
          borderTop="1px" 
          borderTopColor={borderColor}
          bg={useColorModeValue('white', 'gray.800')}
        >
          <Button
            w="full"
            variant="ghost"
            colorScheme="red"
            leftIcon={<FiLogOut />}
            onClick={handleLogout}
            _hover={{
              bg: 'red.50',
              color: 'red.500',
            }}
            size="lg"
            fontSize="md"
            fontWeight="normal"
            justifyContent="flex-start"
            height="45px"
          >
            Sair
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default Sidebar;
