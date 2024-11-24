import React from 'react'
import { Box, Heading, Button, VStack, useToast } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'

const Home = () => {
  const { user, logout } = useAuth()
  const toast = useToast()

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: 'Logout realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading>Bem-vindo ao ERP!</Heading>
        <Box>
          <Heading size="md" mb={2}>Informações do Usuário:</Heading>
          <Box bg="gray.50" p={4} borderRadius="md">
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>ID:</strong> {user?.id}</p>
          </Box>
        </Box>
        <Button colorScheme="red" onClick={handleLogout}>
          Sair
        </Button>
      </VStack>
    </Box>
  )
}

export default Home
