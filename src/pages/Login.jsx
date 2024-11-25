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
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import { useAuth } from '../contexts/AuthContext'
import { sendPasswordResetEmail } from '../services/supabase'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()
  const { signIn } = useAuth()

  const validateForm = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email é obrigatório'
    }
    if (!password) {
      newErrors.password = 'Senha é obrigatória'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      const { error } = await signIn(email, password)
      if (error) throw error
    } catch (error) {
      console.error('Erro no login:', error)
      toast({
        title: 'Erro no login',
        description: error.message || 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        title: 'Email necessário',
        description: 'Por favor, digite seu email para recuperar a senha.',
        status: 'warning',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);
      const { error } = await sendPasswordResetEmail(email);
      
      if (error) throw error;

      toast({
        title: 'Email enviado',
        description: 'Se o email estiver cadastrado, você receberá um link para redefinir sua senha.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao solicitar redefinição de senha:', error);
      toast({
        title: 'Erro ao enviar email',
        description: error.message || 'Ocorreu um erro ao tentar enviar o email de recuperação.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

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
          <VStack spacing={6} as="form" onSubmit={handleSubmit}>
            <Heading size="lg">Login</Heading>

            <FormControl isInvalid={errors.email}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu email"
              />
              <FormErrorMessage>{errors.email}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={errors.password}>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua senha"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
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
              width="full"
              isLoading={loading}
              loadingText="Entrando..."
            >
              Entrar
            </Button>

            <Button
              variant="ghost"
              width="full"
              onClick={handleForgotPassword}
              isLoading={loading}
              loadingText="Enviando email..."
            >
              Esqueci minha senha
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  )
}

export default Login
