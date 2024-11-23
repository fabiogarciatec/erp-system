import React from 'react'
import { Box, VStack, Icon, Text, Link as ChakraLink, Flex } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'
import {
  FiHome,
  FiUsers,
  FiBox,
  FiDollarSign,
  FiShoppingBag,
  FiTruck,
  FiSettings,
  FiBarChart2,
  FiFileText,
  FiGrid,
} from 'react-icons/fi'

const NavItem = ({ icon, children, to }) => {
  return (
    <ChakraLink
      as={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        _hover={{
          bg: 'cyan.400',
          color: 'white',
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
          _groupHover={{
            color: 'white',
          }}
        />
        <Text fontSize="1.1rem">{children}</Text>
      </Flex>
    </ChakraLink>
  )
}

const Sidebar = () => {
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
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w="60"
    >
      <VStack spacing={1} align="stretch" mt="8">
        <NavItem icon={FiHome} to="/">
          Dashboard
        </NavItem>
        <NavItem icon={FiUsers} to="/users">
          Usuários
        </NavItem>
        <NavItem icon={FiGrid} to="/companies">
          Empresas
        </NavItem>
        <NavItem icon={FiBox} to="/products">
          Produtos
        </NavItem>
        <NavItem icon={FiShoppingBag} to="/services">
          Serviços
        </NavItem>
        <NavItem icon={FiDollarSign} to="/sales">
          Vendas
        </NavItem>
        <NavItem icon={FiTruck} to="/suppliers">
          Fornecedores
        </NavItem>
        <NavItem icon={FiBarChart2} to="/reports">
          Relatórios
        </NavItem>
        <NavItem icon={FiFileText} to="/invoices">
          Notas Fiscais
        </NavItem>
        <NavItem icon={FiSettings} to="/settings">
          Configurações
        </NavItem>
      </VStack>
    </Box>
  )
}

export default Sidebar
