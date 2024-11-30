import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Text,
  Heading,
  Container,
  Card,
  CardBody,
  Divider,
} from '@chakra-ui/react'
import { useAuth } from '@/contexts/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyDocument, setCompanyDocument] = useState('')
  const [companyEmail, setCompanyEmail] = useState('')
  const [companyPhone, setCompanyPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (isRegistering) {
        if (!companyName || !companyDocument) {
          throw new Error('Nome e CNPJ da empresa são obrigatórios')
        }

        await register({
          email,
          password,
          companyName,
          companyDocument,
          companyEmail,
          companyPhone,
        })
        
        toast({
          title: 'Conta criada com sucesso!',
          description: 'Agora você pode fazer login.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setIsRegistering(false)
      } else {
        await login(email, password)
        navigate('/dashboard')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Ocorreu um erro',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Container maxW="container.sm" py={10}>
      <Card>
        <CardBody>
          <VStack spacing={8}>
            <Box textAlign="center">
              <Heading size="xl">
                {isRegistering ? 'Criar Conta' : 'Login'}
              </Heading>
              <Text mt={2} color="gray.600">
                {isRegistering
                  ? 'Crie sua conta para começar'
                  : 'Entre com suas credenciais'}
              </Text>
            </Box>

            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
              <VStack spacing={4} align="stretch">
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Senha</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </FormControl>

                {isRegistering && (
                  <>
                    <Divider my={4} />
                    <Text fontWeight="bold" mb={2}>
                      Dados da Empresa
                    </Text>

                    <FormControl isRequired>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                      />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>CNPJ</FormLabel>
                      <Input
                        value={companyDocument}
                        onChange={(e) => setCompanyDocument(e.target.value)}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Email da Empresa</FormLabel>
                      <Input
                        type="email"
                        value={companyEmail}
                        onChange={(e) => setCompanyEmail(e.target.value)}
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel>Telefone da Empresa</FormLabel>
                      <Input
                        value={companyPhone}
                        onChange={(e) => setCompanyPhone(e.target.value)}
                      />
                    </FormControl>
                  </>
                )}

                <Button
                  type="submit"
                  colorScheme="blue"
                  width="100%"
                  isLoading={isLoading}
                >
                  {isRegistering ? 'Criar Conta' : 'Entrar'}
                </Button>

                <Button
                  variant="ghost"
                  width="100%"
                  onClick={() => setIsRegistering(!isRegistering)}
                >
                  {isRegistering
                    ? 'Já tem uma conta? Entre'
                    : 'Não tem uma conta? Registre-se'}
                </Button>
              </VStack>
            </form>
          </VStack>
        </CardBody>
      </Card>
    </Container>
  )
}
