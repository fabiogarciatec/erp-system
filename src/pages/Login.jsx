import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
  InputGroup,
  InputRightElement,
  IconButton,
  Divider,
  HStack,
  Link,
} from '@chakra-ui/react'
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom'
import { MdVisibility, MdVisibilityOff, MdBusiness } from 'react-icons/md'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      await signIn(email, password)
      const from = location.state?.from?.pathname || '/'
      navigate(from, { replace: true })
      toast({
        title: 'Login realizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      py={10}
    >
      <Container maxW="md">
        <VStack spacing={8}>
          <Box textAlign="center">
            <Heading size="lg" mb={2}>Bem-vindo ao ERP</Heading>
            <Text color="gray.600">Faça login para continuar</Text>
          </Box>

          <Box
            bg="white"
            p={8}
            borderRadius="lg"
            boxShadow="lg"
            w="100%"
          >
            <VStack as="form" spacing={4} onSubmit={handleSubmit}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu email"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Sua senha"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                      icon={showPassword ? <MdVisibilityOff /> : <MdVisibility />}
                      variant="ghost"
                      onClick={() => setShowPassword(!showPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                w="100%"
                isLoading={loading}
              >
                Entrar
              </Button>
            </VStack>

            <VStack mt={6} spacing={4}>
              <Divider />
              <Text color="gray.600">Não tem uma empresa cadastrada?</Text>
              <Button
                as={RouterLink}
                to="/register"
                w="100%"
                variant="outline"
                colorScheme="blue"
                leftIcon={<MdBusiness />}
              >
                Cadastrar Minha Empresa
              </Button>
            </VStack>
          </Box>

          <HStack spacing={2} color="gray.600" fontSize="sm">
            <Link href="#" color="blue.500">Termos de Uso</Link>
            <Text>•</Text>
            <Link href="#" color="blue.500">Política de Privacidade</Link>
          </HStack>
        </VStack>
      </Container>
    </Box>
  )
}
