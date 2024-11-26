import {
  Box,
  Flex,
  useColorModeValue,
  BoxProps,
  Text,
} from '@chakra-ui/react';
import {
  FiHome,
  FiTruck,
  FiSettings,
  FiShoppingBag,
  FiBarChart2,
  FiDatabase,
} from 'react-icons/fi';
import { SidebarNavItem } from './SidebarNavItem';

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
    label: 'Cadastro',
    icon: FiDatabase,
    subItems: [
      {
        label: 'Clientes',
        href: '/customers',
      },
      {
        label: 'Fornecedores',
        href: '/suppliers',
      },
      {
        label: 'Produtos',
        href: '/products',
      },
      {
        label: 'Serviços',
        href: '/services',
      },
      {
        label: 'Categorias',
        href: '/categories',
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
      },
      {
        label: 'Serviços',
        href: '/sales/services',
      },
      {
        label: 'Fretes',
        href: '/shipping',
      },
      {
        label: 'Ordens de Serviço',
        href: '/sales/service-orders',
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
      },
      {
        label: 'Rastreamento',
        href: '/shipping/tracking',
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
      },
      {
        label: 'Empresa',
        href: '/settings/company',
      },
      {
        label: 'Segurança',
        href: '/settings/security',
      },
      {
        label: 'Notificações',
        href: '/settings/notifications',
      },
      {
        label: 'Backup',
        href: '/settings/backup',
      },
    ],
  },
];

export function Sidebar({ onClose, ...rest }: SidebarProps) {
  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="100vh"
      maxH="100vh"
      overflowY="auto"
      display="flex"
      flexDirection="column"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: useColorModeValue('gray.300', 'gray.600'),
          borderRadius: '24px',
        },
      }}
      {...rest}
    >
      <Flex h="12" alignItems="center" mx="8" justifyContent="space-between" flexShrink={0}>
        <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
        </Text>
      </Flex>
      <Box flex="1" overflowY="auto" pb="100px">
        {NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.label}
            icon={item.icon}
            href={item.href}
            subItems={item.subItems}
          >
            {item.label}
          </SidebarNavItem>
        ))}
      </Box>
    </Box>
  );
}
