import {
  Box,
  Flex,
  Icon,
  Text,
  Stack,
  Collapse,
  useColorModeValue,
  BoxProps,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiBox,
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiPieChart,
  FiSettings,
  FiChevronDown,
  FiUser,
  FiShield,
  FiBell,
  FiLink,
  FiDatabase,
  FiFileText,
  FiClipboard,
  FiFile,
  FiCreditCard,
  FiTrendingUp,
  FiTool,
  FiRefreshCw,
  FiBarChart2,
} from 'react-icons/fi';
import { Logo } from './Logo';
import { useState } from 'react';

interface NavItemProps extends BoxProps {
  icon?: any;
  children: React.ReactNode;
  to?: string;
  subItems?: Array<{
    label: string;
    href: string;
    icon?: any;
  }>;
}

const NavItem = ({ icon, children, to, subItems, ...rest }: NavItemProps) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = to ? location.pathname === to : false;
  const hasSubItems = subItems && subItems.length > 0;

  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'blue.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');
  const hoverBg = useColorModeValue('gray.100', 'gray.700');

  const content = (
    <Flex
      align="center"
      p="4"
      mx="4"
      borderRadius="lg"
      role="group"
      cursor="pointer"
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : inactiveColor}
      _hover={{
        bg: hoverBg,
        color: activeColor,
      }}
      onClick={() => hasSubItems && setIsOpen(!isOpen)}
      {...rest}
    >
      {icon && (
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
          color={isActive ? activeColor : inactiveColor}
          _groupHover={{
            color: activeColor,
          }}
        />
      )}
      <Text flex="1">{children}</Text>
      {hasSubItems && (
        <Icon
          as={FiChevronDown}
          transition="all .25s ease-in-out"
          transform={isOpen ? 'rotate(180deg)' : ''}
          w={6}
          h={6}
        />
      )}
    </Flex>
  );

  return (
    <Box>
      {to ? (
        <Link to={to}>
          {content}
        </Link>
      ) : (
        content
      )}

      {hasSubItems && (
        <Collapse in={isOpen} animateOpacity>
          <Stack mt="2" pl="12" ml="4">
            {subItems.map((subItem) => (
              <Link key={subItem.href} to={subItem.href}>
                <Flex
                  align="center"
                  p="3"
                  borderRadius="md"
                  role="group"
                  cursor="pointer"
                  color={location.pathname === subItem.href ? activeColor : inactiveColor}
                  bg={location.pathname === subItem.href ? activeBg : 'transparent'}
                  _hover={{
                    bg: hoverBg,
                    color: activeColor,
                  }}
                >
                  {subItem.icon && (
                    <Icon
                      mr="3"
                      fontSize="14"
                      as={subItem.icon}
                      color={location.pathname === subItem.href ? activeColor : inactiveColor}
                      _groupHover={{
                        color: activeColor,
                      }}
                    />
                  )}
                  <Text fontSize="sm">{subItem.label}</Text>
                </Flex>
              </Link>
            ))}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
};

export default function Sidebar() {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const cadastrosSubItems = [
    { label: 'Clientes', href: '/cadastros/clientes', icon: FiUsers },
    { label: 'Produtos', href: '/cadastros/produtos', icon: FiBox },
    { label: 'Fornecedores', href: '/cadastros/fornecedores', icon: FiUsers },
    { label: 'Categorias', href: '/cadastros/categorias', icon: FiBox },
  ];

  const operacoesSubItems = [
    { label: 'Vendas', href: '/operacoes/vendas', icon: FiShoppingCart },
    { label: 'Orçamentos', href: '/operacoes/orcamentos', icon: FiFileText },
    { label: 'Pedidos', href: '/operacoes/pedidos', icon: FiClipboard },
    { label: 'Notas Fiscais', href: '/operacoes/notas-fiscais', icon: FiFile },
  ];

  const financeiroSubItems = [
    { label: 'Contas a Receber', href: '/financeiro/contas-receber', icon: FiDollarSign },
    { label: 'Contas a Pagar', href: '/financeiro/contas-pagar', icon: FiCreditCard },
    { label: 'Fluxo de Caixa', href: '/financeiro/fluxo-caixa', icon: FiTrendingUp },
    { label: 'Bancos', href: '/financeiro/bancos', icon: FiDatabase },
  ];

  const estoqueSubItems = [
    { label: 'Movimentações', href: '/estoque/movimentacoes', icon: FiPackage },
    { label: 'Ajustes', href: '/estoque/ajustes', icon: FiTool },
    { label: 'Transferências', href: '/estoque/transferencias', icon: FiRefreshCw },
  ];

  const relatoriosSubItems = [
    { label: 'Vendas', href: '/relatorios/vendas', icon: FiBarChart2 },
    { label: 'Financeiro', href: '/relatorios/financeiro', icon: FiPieChart },
    { label: 'Estoque', href: '/relatorios/estoque', icon: FiBox },
    { label: 'Clientes', href: '/relatorios/clientes', icon: FiUsers },
  ];

  const settingsSubItems = [
    { label: 'Perfil', href: '/configuracoes/perfil', icon: FiUser },
    { label: 'Geral', href: '/configuracoes/geral', icon: FiSettings },
    { label: 'Segurança', href: '/configuracoes/seguranca', icon: FiShield },
    { label: 'Empresa', href: '/configuracoes/empresa', icon: FiUsers },
    { label: 'Notificações', href: '/configuracoes/notificacoes', icon: FiBell },
    { label: 'Integrações', href: '/configuracoes/integracoes', icon: FiLink },
    { label: 'Backup', href: '/configuracoes/backup', icon: FiDatabase },
  ];

  const location = useLocation();

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="100vh"
      pb="10"
      overflowX="hidden"
      overflowY="auto"
      bg={bgColor}
      borderRight="1px"
      borderRightColor={borderColor}
      w="60"
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
    >
      <Flex px="4" py="5" align="center" justify="center">
        <Logo />
      </Flex>

      <Stack spacing="1" mt="6">
        <Link to="/dashboard" style={{ textDecoration: 'none' }}>
          <Flex
            align="center"
            p="4"
            mx="4"
            borderRadius="lg"
            role="group"
            cursor="pointer"
            bg={location.pathname === '/dashboard' ? useColorModeValue('blue.50', 'blue.900') : 'transparent'}
            color={location.pathname === '/dashboard' ? useColorModeValue('blue.700', 'blue.200') : useColorModeValue('gray.600', 'gray.400')}
            _hover={{
              bg: useColorModeValue('gray.100', 'gray.700'),
              color: useColorModeValue('blue.700', 'blue.200'),
            }}
          >
            <Icon
              mr="4"
              fontSize="16"
              as={FiHome}
              color={location.pathname === '/dashboard' ? useColorModeValue('blue.700', 'blue.200') : useColorModeValue('gray.600', 'gray.400')}
            />
            <Text flex="1">Dashboard</Text>
          </Flex>
        </Link>

        <Box py="2">
          <Text px="6" fontSize="xs" fontWeight="semibold" textTransform="uppercase" mb="2" color="gray.500">
            Cadastros
          </Text>
          <NavItem icon={FiUsers} subItems={cadastrosSubItems}>
            Cadastros
          </NavItem>
        </Box>

        <Box py="2">
          <Text px="6" fontSize="xs" fontWeight="semibold" textTransform="uppercase" mb="2" color="gray.500">
            Operações
          </Text>
          <NavItem icon={FiShoppingCart} subItems={operacoesSubItems}>
            Vendas
          </NavItem>
          <NavItem icon={FiDollarSign} subItems={financeiroSubItems}>
            Financeiro
          </NavItem>
          <NavItem icon={FiPackage} subItems={estoqueSubItems}>
            Estoque
          </NavItem>
        </Box>

        <Box py="2">
          <Text px="6" fontSize="xs" fontWeight="semibold" textTransform="uppercase" mb="2" color="gray.500">
            Análises
          </Text>
          <NavItem icon={FiPieChart} subItems={relatoriosSubItems}>
            Relatórios
          </NavItem>
        </Box>

        <Box py="2">
          <NavItem icon={FiSettings} subItems={settingsSubItems}>
            Configurações
          </NavItem>
        </Box>
      </Stack>
    </Box>
  );
}
