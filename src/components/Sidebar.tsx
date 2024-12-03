import {
  Box,
  BoxProps,
  Button,
  Collapse,
  Flex,
  FlexProps,
  Icon,
  Stack,
  Text,
  useColorModeValue,
  useDisclosure,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiTrendingUp,
  FiCompass,
  FiStar,
  FiSettings,
  FiMenu,
  FiUsers,
  FiDollarSign,
  FiPackage,
  FiTool,
  FiRefreshCw,
  FiBarChart2,
  FiLogOut,
  FiDatabase,
  FiChevronDown,
  FiBox,
  FiShoppingCart,
  FiPieChart,
  FiUser,
  FiShield,
  FiBell,
  FiLink,
  FiFileText,
  FiClipboard,
  FiFile,
  FiCreditCard,
  FiTruck,
  FiCalendar,
  FiTag,
  FiGrid,
  FiPercent,
} from 'react-icons/fi';
import { Logo } from './Logo';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NavItemProps extends BoxProps {
  icon?: any;
  children: React.ReactNode;
  subItems?: Array<{
    label: string;
    href: string;
    icon?: any;
  }>;
}

const NavItem = ({ icon, children, subItems, ...rest }: NavItemProps) => {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();

  // Movendo todos os useColorModeValue para o topo do componente
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const activeTextColor = 'blue.500';
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverTextColor = useColorModeValue('gray.900', 'white');
  const activeBgColor = useColorModeValue('blue.50', 'rgba(66, 153, 225, 0.1)');

  // Verifica se algum submenu está ativo
  const isSubMenuActive = subItems?.some(item => location.pathname === item.href);

  return (
    <Box>
      <Flex
        align="center"
        px="6"
        py="3"
        cursor="pointer"
        role="group"
        onClick={onToggle}
        color={textColor}
        bg={isSubMenuActive ? activeBgColor : 'transparent'}
        _hover={{
          bg: hoverBgColor,
          color: hoverTextColor,
        }}
        {...rest}
      >
        {icon && (
          <Icon
            mr="4"
            fontSize="16"
            as={icon}
            color={isSubMenuActive ? activeTextColor : 'inherit'}
          />
        )}
        <Text flex="1" color={isSubMenuActive ? activeTextColor : 'inherit'}>{children}</Text>
        {subItems && (
          <Icon
            as={FiChevronDown}
            transition="all .25s ease-in-out"
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
            color={isSubMenuActive ? activeTextColor : 'inherit'}
          />
        )}
      </Flex>
      {subItems && (
        <Collapse in={isOpen} animateOpacity>
          <Stack pl="12" mt="2">
            {subItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <Link key={item.href} to={item.href} style={{ textDecoration: 'none' }}>
                  <Flex
                    align="center"
                    py="2"
                    px="4"
                    rounded="md"
                    bg={isActive ? activeBgColor : 'transparent'}
                    color={isActive ? activeTextColor : textColor}
                    _hover={{
                      bg: hoverBgColor,
                      color: hoverTextColor,
                    }}
                  >
                    {item.icon && <Icon as={item.icon} mr="3" fontSize="14" />}
                    <Text fontSize="sm">{item.label}</Text>
                  </Flex>
                </Link>
              );
            })}
          </Stack>
        </Collapse>
      )}
    </Box>
  );
};

function Sidebar(props: FlexProps) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const activeTextColor = 'blue.500';
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const hoverTextColor = useColorModeValue('gray.900', 'white');
  const activeBgColor = useColorModeValue('blue.50', 'rgba(66, 153, 225, 0.1)');
  const logoutBg = useColorModeValue('red.50', 'rgba(254, 178, 178, 0.12)');
  const logoutColor = useColorModeValue('red.500', 'red.300');
  const logoutHoverBg = useColorModeValue('red.100', 'rgba(254, 178, 178, 0.24)');
  const logoutHoverColor = useColorModeValue('red.500', 'red.300');

  const { logout } = useAuth();
  const location = useLocation();

  const cadastrosSubItems = [
    { label: 'Clientes', href: '/cadastros/clientes', icon: FiUsers },
    { label: 'Produtos', href: '/cadastros/produtos', icon: FiBox },
    { label: 'Fornecedores', href: '/cadastros/fornecedores', icon: FiTruck },
    { label: 'Categorias', href: '/cadastros/categorias', icon: FiGrid },
    { label: 'Serviços', href: '/cadastros/servicos', icon: FiTool },
    { label: 'Marcas', href: '/cadastros/marcas', icon: FiTag },
    { label: 'Unidades', href: '/cadastros/unidades', icon: FiBox }
  ];

  const operacoesSubItems = [
    { label: 'Vendas', href: '/operacoes/vendas', icon: FiShoppingCart },
    { label: 'Orçamentos', href: '/operacoes/orcamentos', icon: FiFileText },
    { label: 'Pedidos', href: '/operacoes/pedidos', icon: FiClipboard },
    { label: 'Notas Fiscais', href: '/operacoes/notas-fiscais', icon: FiFile },
    { label: 'PDV', href: '/operacoes/pdv', icon: FiDollarSign },
    { label: 'Agendamentos', href: '/operacoes/agendamentos', icon: FiCalendar },
  ];

  const financeiroSubItems = [
    { label: 'Contas a Receber', href: '/financeiro/contas-receber', icon: FiDollarSign },
    { label: 'Contas a Pagar', href: '/financeiro/contas-pagar', icon: FiCreditCard },
    { label: 'Fluxo de Caixa', href: '/financeiro/fluxo-caixa', icon: FiTrendingUp },
    { label: 'Bancos', href: '/financeiro/bancos', icon: FiDatabase },
    { label: 'Conciliação', href: '/financeiro/conciliacao', icon: FiRefreshCw },
    { label: 'Centro de Custos', href: '/financeiro/centro-custos', icon: FiGrid },
  ];

  const estoqueSubItems = [
    { label: 'Movimentações', href: '/estoque/movimentacoes', icon: FiPackage },
    { label: 'Ajustes', href: '/estoque/ajustes', icon: FiTool },
    { label: 'Transferências', href: '/estoque/transferencias', icon: FiRefreshCw },
    { label: 'Inventário', href: '/estoque/inventario', icon: FiClipboard },
    { label: 'Compras', href: '/estoque/compras', icon: FiShoppingCart },
  ];

  const relatoriosSubItems = [
    { label: 'Vendas', href: '/relatorios/vendas', icon: FiBarChart2 },
    { label: 'Financeiro', href: '/relatorios/financeiro', icon: FiPieChart },
    { label: 'Estoque', href: '/relatorios/estoque', icon: FiBox },
    { label: 'Clientes', href: '/relatorios/clientes', icon: FiUsers },
    { label: 'Comissões', href: '/relatorios/comissoes', icon: FiPercent },
    { label: 'DRE', href: '/relatorios/dre', icon: FiTrendingUp },
  ];

  const configuracoesSubItems = [
    { label: 'Perfil', href: '/configuracoes/perfil', icon: FiUser },
    { label: 'Empresa', href: '/configuracoes/empresa', icon: FiGrid },
    { label: 'Geral', href: '/configuracoes/gerais', icon: FiTool },
    { label: 'Usuários', href: '/configuracoes/usuarios', icon: FiUsers },
    { label: 'Segurança', href: '/configuracoes/seguranca', icon: FiShield },
    { label: 'Notificações', href: '/configuracoes/notificacoes', icon: FiBell },
    { label: 'Integrações', href: '/configuracoes/integracoes', icon: FiLink },
    { label: 'Backup', href: '/configuracoes/backup', icon: FiRefreshCw },
    { label: 'Permissões', href: '/configuracoes/permissoes', icon: FiShield },
  ];

  const SidebarConfig = [
    { label: 'Dashboard', icon: FiHome, href: '/dashboard' },
    {
      label: 'Cadastros',
      icon: FiDatabase,
      subItems: cadastrosSubItems,
    },
    {
      label: 'Operações',
      icon: FiShoppingCart,
      subItems: operacoesSubItems,
    },
    {
      label: 'Financeiro',
      icon: FiDollarSign,
      subItems: financeiroSubItems,
    },
    {
      label: 'Estoque',
      icon: FiPackage,
      subItems: estoqueSubItems,
    },
    {
      label: 'Relatórios',
      icon: FiBarChart2,
      subItems: relatoriosSubItems,
    },
    {
      label: 'Configurações',
      icon: FiSettings,
      subItems: configuracoesSubItems,
    },
  ];

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
      {...props}
    >
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Logo />
      </Flex>

      <Flex direction="column" flex="1">
        {SidebarConfig.map((item) => {
          if (item.subItems) {
            return (
              <NavItem key={item.label} icon={item.icon} subItems={item.subItems}>
                {item.label}
              </NavItem>
            );
          } else {
            return (
              <Link key={item.href} to={item.href} style={{ textDecoration: 'none' }}>
                <NavItem icon={item.icon}>{item.label}</NavItem>
              </Link>
            );
          }
        })}
        <Box mt="auto" pt={8} mb={4}>
          <Button
            onClick={logout}
            variant="ghost"
            width="90%"
            mx="auto"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg={logoutBg}
            color={logoutColor}
            _hover={{
              bg: logoutHoverBg,
              color: logoutHoverColor,
            }}
            leftIcon={<FiLogOut />}
          >
            Sair
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}

export default Sidebar;
