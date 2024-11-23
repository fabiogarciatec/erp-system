import React from 'react'
import { Box, VStack, Text, Link, Flex, Icon, Button } from '@chakra-ui/react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { FiHome, FiUsers, FiBox, FiTruck, FiDollarSign, FiTool, FiLogOut } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'

const MenuItem = ({ icon, children, to }) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      w="full"
      _hover={{ textDecoration: 'none', bg: 'gray.100' }}
      p={3}
      borderRadius="md"
    >
      <Flex align="center">
        <Icon as={icon} boxSize={5} mr={3} />
        <Text fontSize="md">{children}</Text>
      </Flex>
    </Link>
  )
}

const Sidebar = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box
      as="nav"
      pos="fixed"
      left="0"
      w="60"
      top="0"
      h="100vh"
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      px={4}
    >
      <VStack spacing={6} align="stretch" py={8}>
        <Box>
          <Text fontSize="xl" fontWeight="bold" mb={8} px={3}>
            ERP System
          </Text>
          <VStack spacing={2} align="stretch">
            <MenuItem icon={FiHome} to="/">
              Dashboard
            </MenuItem>
            <MenuItem icon={FiUsers} to="/users">
              Usuários
            </MenuItem>
            <MenuItem icon={FiBox} to="/products">
              Produtos
            </MenuItem>
            <MenuItem icon={FiTruck} to="/suppliers">
              Fornecedores
            </MenuItem>
            <MenuItem icon={FiDollarSign} to="/sales">
              Vendas
            </MenuItem>
            <MenuItem icon={FiTool} to="/services">
              Serviços
            </MenuItem>
          </VStack>
        </Box>
        <Box mt="auto">
          <Button
            w="full"
            variant="ghost"
            leftIcon={<FiLogOut />}
            onClick={handleLogout}
            justifyContent="flex-start"
            px={3}
          >
            Sair
          </Button>
        </Box>
      </VStack>
    </Box>
  )
}

export default Sidebar
