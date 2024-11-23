import React from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  useToast,
} from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

function Login() {
  const toast = useToast()

  const handleSubmit = (e) => {
    e.preventDefault()
    // Implementar lógica de login aqui
    toast({
      title: 'Login em desenvolvimento',
      description: 'A funcionalidade de login será implementada em breve.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    })
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
    >
      <Box
        p={8}
        maxWidth="400px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        bg="white"
      >
        <VStack spacing={4} align="stretch">
          <Heading textAlign="center">ERP System</Heading>
          <Text textAlign="center" color="gray.600">
            Faça login para acessar o sistema
          </Text>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="seu@email.com"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input
                  type="password"
                  placeholder="********"
                />
              </FormControl>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
              >
                Entrar
              </Button>
            </VStack>
          </form>
          <Text textAlign="center">
            Não tem uma conta?{' '}
            <Link as={RouterLink} to="/register" color="blue.500">
              Registre-se
            </Link>
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}

export default Login
