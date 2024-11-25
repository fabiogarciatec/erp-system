import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
  Text,
  FormErrorMessage,
} from '@chakra-ui/react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const toast = useToast()
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Validações
  const isPasswordValid = password.length >= 6
  const doPasswordsMatch = password === confirmPassword
  const isFormValid = isPasswordValid && doPasswordsMatch && !loading

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Obtém o token da URL
      const token = searchParams.get('token')
      
      if (!token) {
        throw new Error('Token de redefinição não encontrado')
      }

      // Atualiza a senha usando o token
      const { error } = await supabase.auth.updateUser({
        password: password
      })

      if (error) throw error

      toast({
        title: 'Senha atualizada com sucesso!',
        description: 'Você será redirecionado para o login.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Redireciona para o login após alguns segundos
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (error) {
      console.error('Erro ao redefinir senha:', error)
      setError(error.message)
      toast({
        title: 'Erro ao redefinir senha',
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
    <Box maxW="md" mx="auto" py={10}>
      <Card>
        <CardHeader>
          <Heading size="lg" textAlign="center">
            Redefinir Senha
          </Heading>
        </CardHeader>

        <CardBody>
          <form onSubmit={handleResetPassword}>
            <Stack spacing={4}>
              <FormControl isInvalid={password && !isPasswordValid}>
                <FormLabel>Nova Senha</FormLabel>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                />
                <FormErrorMessage>
                  A senha deve ter pelo menos 6 caracteres
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={confirmPassword && !doPasswordsMatch}>
                <FormLabel>Confirme a Nova Senha</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                />
                <FormErrorMessage>
                  As senhas não conferem
                </FormErrorMessage>
              </FormControl>

              {error && (
                <Text color="red.500" fontSize="sm">
                  {error}
                </Text>
              )}

              <Button
                type="submit"
                colorScheme="blue"
                isLoading={loading}
                loadingText="Redefinindo..."
                isDisabled={!isFormValid}
              >
                Redefinir Senha
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate('/login')}
                isDisabled={loading}
              >
                Voltar para o Login
              </Button>
            </Stack>
          </form>
        </CardBody>
      </Card>
    </Box>
  )
}
