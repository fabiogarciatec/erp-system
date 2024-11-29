import {
  Box,
  Button,
  Divider,
  Flex,
  Icon,
  Stack,
  Text,
  useColorModeValue,
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
} from 'react-icons/fi';

interface NavItemProps {
  icon: any;
  children: string;
  to: string;
}

const NavItem = ({ icon, children, to }: NavItemProps) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);
  const activeBg = useColorModeValue('blue.50', 'blue.900');
  const activeColor = useColorModeValue('blue.700', 'blue.200');
  const inactiveColor = useColorModeValue('gray.600', 'gray.400');

  return (
    <Button
      as={Link}
      to={to}
      variant="ghost"
      justifyContent="start"
      w="full"
      pl={4}
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : inactiveColor}
      _hover={{
        bg: activeBg,
        color: activeColor,
      }}
      leftIcon={<Icon as={icon} boxSize={5} />}
    >
      {children}
    </Button>
  );
};

function Sidebar() {
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
      bg={useColorModeValue('white', 'gray.800')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w="60"
    >
      <Flex px="4" py="5" align="center">
        <Text fontSize="2xl" fontWeight="semibold">
          ERP
        </Text>
      </Flex>
      <Flex
        direction="column"
        as="nav"
        fontSize="sm"
        color="gray.600"
        aria-label="Main Navigation"
      >
        <Stack spacing="1" px="2">
          <NavItem icon={FiHome} to="/">
            Dashboard
          </NavItem>

          <Box py="2">
            <Text px="3" fontSize="xs" fontWeight="semibold" textTransform="uppercase">
              Cadastros
            </Text>
            <Stack spacing="1" mt="2">
              <NavItem icon={FiUsers} to="/customers">
                Clientes
              </NavItem>
              <NavItem icon={FiBox} to="/products">
                Produtos
              </NavItem>
            </Stack>
          </Box>

          <Box py="2">
            <Text px="3" fontSize="xs" fontWeight="semibold" textTransform="uppercase">
              Operações
            </Text>
            <Stack spacing="1" mt="2">
              <NavItem icon={FiShoppingCart} to="/sales">
                Vendas
              </NavItem>
              <NavItem icon={FiDollarSign} to="/financial">
                Financeiro
              </NavItem>
              <NavItem icon={FiPackage} to="/inventory">
                Estoque
              </NavItem>
            </Stack>
          </Box>

          <Box py="2">
            <Text px="3" fontSize="xs" fontWeight="semibold" textTransform="uppercase">
              Análises
            </Text>
            <Stack spacing="1" mt="2">
              <NavItem icon={FiPieChart} to="/reports">
                Relatórios
              </NavItem>
            </Stack>
          </Box>

          <Divider my="2" />

          <NavItem icon={FiSettings} to="/settings">
            Configurações
          </NavItem>
        </Stack>
      </Flex>
    </Box>
  );
}

export default Sidebar;
