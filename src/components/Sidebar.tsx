import {
  Box,
  Button,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiHome,
  FiUsers,
  FiSettings,
  FiBox,
  FiTruck,
  FiFileText,
  FiLogOut,
  FiDollarSign,
  FiLayers,
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Logo } from './Logo';
import { SidebarNavItem } from './SidebarNavItem';

interface SidebarProps {
  onClose: () => void;
  display?: { base: string; md: string };
}

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    icon: FiHome,
    href: '/',
  },
  {
    label: 'Cadastros',
    icon: FiUsers,
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
        icon: FiFileText,
      },
      {
        label: 'Categorias',
        href: '/categories',
        icon: FiLayers,
      },
    ],
  },
  {
    label: 'Vendas',
    icon: FiBox,
    subItems: [
      {
        label: 'Produtos',
        href: '/sales/products',
        icon: FiBox,
      },
      {
        label: 'Serviços',
        href: '/sales/services',
        icon: FiFileText,
      },
      {
        label: 'Fretes',
        href: '/shipping',
        icon: FiTruck,
      },
      {
        label: 'Ordens de Serviço',
        href: '/sales/service-orders',
        icon: FiFileText,
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
        icon: FiBox,
      },
      {
        label: 'Rastreamento',
        href: '/shipping/tracking',
        icon: FiTruck,
      },
    ],
  },
  {
    label: 'Financeiro',
    icon: FiDollarSign,
    subItems: [
      {
        label: 'Contas a Receber',
        href: '/financial/receivables',
        icon: FiDollarSign,
      },
      {
        label: 'Contas a Pagar',
        href: '/financial/payables',
        icon: FiDollarSign,
      },
      {
        label: 'Fluxo de Caixa',
        href: '/financial/cash-flow',
        icon: FiDollarSign,
      },
    ],
  },
  {
    label: 'Relatórios',
    icon: FiFileText,
    subItems: [
      {
        label: 'Vendas',
        href: '/reports/sales',
        icon: FiBox,
      },
      {
        label: 'Financeiro',
        href: '/reports/financial',
        icon: FiDollarSign,
      },
      {
        label: 'Estoque',
        href: '/reports/inventory',
        icon: FiBox,
      },
    ],
  },
  {
    label: 'Configurações',
    icon: FiSettings,
    subItems: [
      {
        label: 'Perfil',
        href: '/settings/profile',
        icon: FiUsers,
      },
      {
        label: 'Empresa',
        href: '/settings/company',
        icon: FiBox,
      },
      {
        label: 'Segurança',
        href: '/settings/security',
        icon: FiSettings,
      },
      {
        label: 'Financeiro',
        href: '/settings/financial',
        icon: FiDollarSign,
      },
      {
        label: 'Vendas',
        href: '/settings/sales',
        icon: FiBox,
      },
      {
        label: 'Notificações',
        href: '/settings/notifications',
        icon: FiSettings,
      },
      {
        label: 'Usuários',
        href: '/settings/users',
        icon: FiUsers,
      },
      {
        label: 'Backup',
        href: '/settings/backup',
        icon: FiBox,
      },
      {
        label: 'Integrações',
        href: '/settings/integrations',
        icon: FiSettings,
      }
    ],
  },
];

export function Sidebar({ onClose, display }: SidebarProps) {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <Box
      transition="3s ease"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w={{ base: 'full', md: 64 }}
      pos="fixed"
      h="full"
      display={display}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />
      </Flex>

      <Box
        h="calc(100vh - 80px)"
        overflowY="auto"
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
        <Flex direction="column" flex="1">
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
        </Flex>

        <Button
          variant="ghost"
          onClick={handleSignOut}
          display="flex"
          alignItems="center"
          justifyContent="center"
          w="full"
          p="4"
          mt="4"
          leftIcon={<Box as={FiLogOut} />}
          _hover={{
            bg: 'red.50',
            color: 'red.500',
          }}
        >
          Sair
        </Button>
      </Box>
    </Box>
  );
}
