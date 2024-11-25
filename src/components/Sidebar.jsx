import React from 'react';
import {
  Box,
  VStack,
  Link,
  Text,
  Icon,
  Collapse,
  useDisclosure,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiUsers,
  FiPackage,
  FiDollarSign,
  FiShoppingCart,
  FiTruck,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiMail,
  FiPhone,
} from 'react-icons/fi';
import { usePermissions } from '../contexts/PermissionsContext';

const menuItems = [
  {
    name: 'Dashboard',
    path: '/',
    icon: FiHome,
    permission: null,
  },
  {
    name: 'Cadastros',
    icon: FiPackage,
    permission: 'companies.view',
    children: [
      { name: 'Clientes', path: '/cadastros/clientes', permission: 'companies.view' },
      { name: 'Produtos', path: '/cadastros/produtos', permission: 'products.view' },
      { name: 'Serviços', path: '/cadastros/servicos', permission: 'products.view' },
      { name: 'Fornecedores', path: '/cadastros/fornecedores', permission: 'companies.view' },
    ],
  },
  {
    name: 'Vendas',
    icon: FiDollarSign,
    permission: 'sales.view',
    children: [
      { name: 'Produtos', path: '/vendas/produtos', permission: 'sales.view' },
      { name: 'Ordem de Serviço', path: '/vendas/ordem-servico', permission: 'sales.view' },
      { name: 'Fretes', path: '/vendas/fretes', permission: 'sales.view' },
      { name: 'Orçamentos', path: '/vendas/orcamentos', permission: 'sales.view' },
    ],
  },
  {
    name: 'Marketing',
    icon: FiMail,
    permission: 'marketing.view',
    children: [
      { name: 'Campanhas', path: '/marketing/campanhas', permission: 'marketing.view' },
      { name: 'Contatos', path: '/marketing/contatos', permission: 'marketing.view' },
      { name: 'Disparos', path: '/marketing/disparos', permission: 'marketing.view' },
    ],
  },
  {
    name: 'Configurações',
    icon: FiSettings,
    permission: 'companies.view',
    children: [
      { name: 'Empresa', path: '/configuracoes/empresa', permission: 'companies.view' },
      { name: 'Usuários', path: '/configuracoes/usuarios', permission: 'users.view' },
      { name: 'Permissões', path: '/configuracoes/permissoes', permission: 'users.edit' },
    ],
  },
];

const MenuItem = ({ item }) => {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();
  const { checkPermission } = usePermissions();
  const hasChildren = item.children && item.children.length > 0;

  // Verifica se o usuário tem permissão para ver este item
  if (item.permission && !checkPermission(item.permission)) {
    return null;
  }

  // Filtra os filhos baseado nas permissões
  const authorizedChildren = hasChildren
    ? item.children.filter(child => !child.permission || checkPermission(child.permission))
    : [];

  // Se não tem filhos autorizados, não mostra o menu pai
  if (hasChildren && authorizedChildren.length === 0) {
    return null;
  }

  const isActive = (path) => location.pathname === path;

  if (hasChildren) {
    return (
      <Box w="full">
        <Flex
          px={4}
          py={2}
          alignItems="center"
          cursor="pointer"
          _hover={{ bg: 'gray.100' }}
          onClick={onToggle}
        >
          <Icon as={item.icon} mr={3} />
          <Text flex={1}>{item.name}</Text>
          <Icon
            as={isOpen ? FiChevronDown : FiChevronRight}
            transition="transform 0.2s"
          />
        </Flex>
        <Collapse in={isOpen}>
          <VStack pl={6} mt={1} alignItems="stretch">
            {authorizedChildren.map((child) => (
              <Link
                as={RouterLink}
                to={child.path}
                key={child.path}
                px={4}
                py={2}
                _hover={{ bg: 'gray.100' }}
                bg={isActive(child.path) ? 'gray.100' : 'transparent'}
                borderRadius="md"
              >
                <Text fontSize="sm">{child.name}</Text>
              </Link>
            ))}
          </VStack>
        </Collapse>
      </Box>
    );
  }

  return (
    <Link
      as={RouterLink}
      to={item.path}
      w="full"
      px={4}
      py={2}
      display="flex"
      alignItems="center"
      _hover={{ bg: 'gray.100' }}
      bg={isActive(item.path) ? 'gray.100' : 'transparent'}
      borderRadius="md"
    >
      <Icon as={item.icon} mr={3} />
      <Text>{item.name}</Text>
    </Link>
  );
};

const Sidebar = () => {
  return (
    <Box
      position="fixed"
      left={0}
      width="250px"
      height="100vh"
      bg="white"
      borderRight="1px"
      borderColor="gray.200"
      py={4}
      overflowY="auto"
      css={{
        '&::-webkit-scrollbar': {
          width: '4px',
        },
        '&::-webkit-scrollbar-track': {
          width: '6px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#cbd5e0',
          borderRadius: '24px',
        },
      }}
    >
      <VStack spacing={1} align="stretch">
        {menuItems.map((item) => (
          <MenuItem key={item.name} item={item} />
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
