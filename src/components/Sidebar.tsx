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
} from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
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
        label: 'Produtos',
        href: '/products',
        icon: FiBox,
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
        label: 'Segurança',
        href: '/settings/security',
        icon: FiSettings,
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
      position="fixed"
      top="16"
      left={0}
      h="calc(100vh - 4rem)"
      w="64"
      bg={bgColor}
      borderRight="1px"
      borderColor={borderColor}
      display={display}
    >
      <Flex direction="column" h="full">
        <Box 
          flex="1" 
          overflowY="auto" 
          css={{
            '&::-webkit-scrollbar': {
              width: '6px',
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-track': {
              width: '8px',
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: useColorModeValue('rgba(0,0,0,0.1)', 'rgba(255,255,255,0.1)'),
              borderRadius: '24px',
              '&:hover': {
                backgroundColor: useColorModeValue('rgba(0,0,0,0.2)', 'rgba(255,255,255,0.2)'),
              },
            },
            '&:hover::-webkit-scrollbar-thumb': {
              backgroundColor: useColorModeValue('rgba(0,0,0,0.2)', 'rgba(255,255,255,0.2)'),
            },
            '&::-webkit-scrollbar-thumb:active': {
              backgroundColor: useColorModeValue('rgba(0,0,0,0.3)', 'rgba(255,255,255,0.3)'),
            },
          }}
          py={4}
          px={4}
        >
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
        </Box>

        <Box p={4} borderTop="1px" borderColor={borderColor}>
          <Button
            variant="ghost"
            onClick={handleSignOut}
            display="flex"
            alignItems="center"
            w="full"
            p="4"
            leftIcon={<Box as={FiLogOut} fontSize="18px" />}
            color={useColorModeValue('gray.600', 'gray.400')}
            fontWeight="medium"
            _hover={{
              bg: useColorModeValue('red.50', 'rgba(254, 178, 178, 0.12)'),
              color: useColorModeValue('red.600', 'red.200'),
              transform: 'translateY(-1px)',
            }}
            transition="all 0.2s"
          >
            Sair
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
