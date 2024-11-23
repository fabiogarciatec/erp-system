import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  HStack,
} from '@chakra-ui/react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { supabase } from '../services/supabase'

export default function CompanyRegistration() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const [formData, setFormData] = useState({
    companyName: '',
    companyDocument: '',
    adminEmail: '',
    adminPassword: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.companyName || !formData.adminEmail || !formData.adminPassword) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Por favor, preencha todos os campos obrigatórios',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsLoading(true)

    try {
      // 1. Criar usuário no Auth usando signUpWithPassword
      const { data: authData, error: authError } = await supabase.auth.signUpWithPassword({
        email: formData.adminEmail,
        password: formData.adminPassword,
      })

      if (authError) {
        throw new Error('Erro ao criar usuário: ' + authError.message)
      }

      // 2. Criar empresa
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([{
          name: formData.companyName,
          document: formData.companyDocument || null
        }])
        .select()
        .single()

      if (companyError) {
        throw new Error('Erro ao criar empresa: ' + companyError.message)
      }

      // 3. Criar perfil do usuário como admin
      const { error: profileError } = await supabase
        .from('user_profiles')
        .insert([{
          id: authData.user.id,
          full_name: formData.adminEmail.split('@')[0],
          role: 'admin',
          company_id: company.id,
          active: true,
          email: formData.adminEmail
        }])

      if (profileError) {
        throw new Error('Erro ao criar perfil: ' + profileError.message)
      }

      // 4. Fazer logout após o registro
      await supabase.auth.signOut()

      toast({
        title: 'Empresa registrada com sucesso!',
        description: 'Você já pode fazer login no sistema.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // 5. Redirecionar para login
      navigate('/login')
    } catch (error) {
      console.error('Erro no processo de registro:', error)
      toast({
        title: 'Erro no registro',
        description: error.message,
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
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading mb={2}>Registre sua Empresa</Heading>
          <Text color="gray.600">Crie sua conta empresarial para começar</Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome da Empresa</FormLabel>
              <Input
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="Digite o nome da empresa"
              />
            </FormControl>

            <FormControl>
              <FormLabel>CNPJ</FormLabel>
              <Input
                name="companyDocument"
                value={formData.companyDocument}
                onChange={handleChange}
                placeholder="Digite o CNPJ da empresa"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email do Administrador</FormLabel>
              <Input
                name="adminEmail"
                type="email"
                value={formData.adminEmail}
                onChange={handleChange}
                placeholder="Digite seu email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Senha</FormLabel>
              <InputGroup>
                <Input
                  name="adminPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.adminPassword}
                  onChange={handleChange}
                  placeholder="Digite sua senha"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                    icon={showPassword ? <FaEyeSlash /> : <FaEye />}
                    onClick={() => setShowPassword(!showPassword)}
                    variant="ghost"
                    size="sm"
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <HStack spacing={4} width="full">
              <Button
                onClick={() => navigate('/login')}
                width="full"
                variant="outline"
              >
                Voltar
              </Button>
              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isLoading}
                loadingText="Registrando..."
              >
                Registrar Empresa
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  )
}
