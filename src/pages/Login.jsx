import React, { useState } from 'react'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Text,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { FiEye, FiEyeOff } from 'react-icons/fi'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loginError, setLoginError] = useState('')
  const navigate = useNavigate()
  const { login } = useAuth()
  const toast = useToast()

  const validateForm = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido'
    }
    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    } else if (password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoginError('')
    
    if (!validateForm()) return

    setIsLoading(true)
    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (error) {
      setLoginError(
        error.message === 'Invalid login credentials'
          ? 'Email ou senha inválidos'
          : 'Erro ao fazer login. Tente novamente.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box 
      minH="100vh" 
      display="flex" 
      alignItems="center" 
      justifyContent="center"
      bg="gray.50"
    >
      <Container maxW="md">
        <Box 
          p={8} 
          bg="white" 
          borderRadius="lg" 
          boxShadow="lg"
          border="1px"
          borderColor="gray.200"
        >
          <VStack spacing={6}>
            <Heading size="lg">Login</Heading>
            <Text color="gray.600" fontSize="sm">
              Entre com suas credenciais para acessar o sistema
            </Text>

            {loginError && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {loginError}
              </Alert>
            )}
            
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4}>
                <FormControl isInvalid={errors.email}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      setErrors({ ...errors, email: '' })
                    }}
                    placeholder="seu@email.com"
                    bg="white"
                  />
                  <FormErrorMessage>{errors.email}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={errors.password}>
                  <FormLabel>Senha</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        setErrors({ ...errors, password: '' })
                      }}
                      placeholder="Sua senha"
                      bg="white"
                    />
                    <InputRightElement>
                      <IconButton
                        aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                        icon={showPassword ? <FiEyeOff /> : <FiEye />}
                        variant="ghost"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    </InputRightElement>
                  </InputGroup>
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  size="lg"
                  mt={4}
                  isLoading={isLoading}
                  loadingText="Entrando..."
                >
                  Entrar
                </Button>
              </VStack>
            </form>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}

export default Login
