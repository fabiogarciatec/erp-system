import {
  Box,
  VStack,
  Icon,
  Text,
  Link,
  Flex,
  useColorModeValue,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import {
  MdDashboard,
  MdPeople,
  MdShoppingCart,
  MdCampaign,
  MdSettings,
} from 'react-icons/md';

const menuItems = [
  { icon: MdDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: MdPeople, label: 'Cadastros', path: '/cadastros' },
  { icon: MdShoppingCart, label: 'Vendas', path: '/vendas' },
  { icon: MdCampaign, label: 'Marketing', path: '/marketing' },
  { icon: MdSettings, label: 'Configurações', path: '/configuracoes' },
];

export function Sidebar() {
  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="100vh"
      w="64"
      bg={bg}
      borderRight="1px"
      borderRightColor={borderColor}
      py={5}
    >
      <VStack spacing={1} align="stretch">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            as={RouterLink}
            to={item.path}
            _hover={{ textDecoration: 'none', bg: 'gray.100' }}
            p={3}
          >
            <Flex align="center">
              <Icon as={item.icon} boxSize={5} mr={3} />
              <Text fontSize="sm">{item.label}</Text>
            </Flex>
          </Link>
        ))}
      </VStack>
    </Box>
  );
}
