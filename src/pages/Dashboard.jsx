import React from 'react'
import { Box, Heading, Button, VStack, Text } from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box p={8}>
      <VStack spacing={6} align="stretch">
        <Heading>Dashboard</Heading>
        <Text fontSize="lg">Bem-vindo, {user?.email}</Text>
        <Button onClick={handleLogout} colorScheme="red" size="md" w="fit-content">
          Sair
        </Button>
      </VStack>
    </Box>
  )
}

export default Dashboard
