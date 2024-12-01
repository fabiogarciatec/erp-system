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
  Flex,
  Stack,
  Hide,
  Show
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
    <Box
      minH="100vh"
      w="100vw"
      m="0"
      p="0"
      bg="linear-gradient(135deg, #0396FF 0%, #ABDCFF 100%)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      overflowY="auto"
    >
      {/* Layout Desktop */}
      <Hide below='md'>
        <Card
          direction={{ base: 'column', md: 'row' }}
          overflow="hidden"
          variant="outline"
          maxW="900px"
          w="90%"
          boxShadow="xl"
          borderRadius="xl"
          mx="auto"
        >
          <Box
            flex="1"
            bg="linear-gradient(135deg, #f8faff 0%, #ffffff 100%)"
            p={8}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="xl"
            boxShadow="inset 0 0 20px rgba(74, 144, 226, 0.1)"
          >
            <Flex
              direction={{ base: 'row', md: 'column' }}
              align="center"
              justify="center"
              spacing={{ base: 4, md: 0 }}
            >
              <Heading
                fontSize={'4xl'}
                textAlign={{ base: 'left', md: 'center' }}
                mb={{ base: 0, md: 4 }}
                mr={{ base: 4, md: 0 }}
              >
                {isRegistering ? 'Criar Conta' : 'Login'}
              </Heading>
              <Box
                w={{ base: '150px', md: '400px' }}
                h={{ base: '100px', md: 'auto' }}
                ml={{ base: 'auto', md: 0 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 400 300"
                  style={{
                    width: '100%',
                    height: '100%',
                    maxWidth: '400px',
                    objectFit: 'contain'
                  }}
                >
                  {/* Gradientes */}
                  <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#0066cc' }} />
                      <stop offset="100%" style={{ stopColor: '#0099ff' }} />
                    </linearGradient>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: '#0066cc' }} />
                      <stop offset="100%" style={{ stopColor: '#0099ff' }} />
                    </linearGradient>
                  </defs>

                  {/* Logo FATEC com Seta */}
                  <g transform="translate(120, 30)">
                    <text
                      x="0"
                      y="25"
                      fill="url(#logoGradient)"
                      style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        fontFamily: 'Arial',
                        letterSpacing: '1px'
                      }}
                    >
                      FATEC
                    </text>
                    <text
                      x="110"
                      y="25"
                      fill="#666"
                      style={{ 
                        fontSize: '28px', 
                        fontWeight: 'bold', 
                        fontFamily: 'Arial'
                      }}
                    >
                      ERP
                    </text>
                    {/* Seta característica da FATEC */}
                    <path
                      d="M85 15 L100 15 L100 5 L120 20 L100 35 L100 25 L85 25 Z"
                      fill="url(#arrowGradient)"
                    />
                  </g>

                  <text
                    x="200"
                    y="78"
                    textAnchor="middle"
                    fill="#666"
                    style={{ 
                      fontSize: '13px', 
                      fontFamily: 'Arial',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Gestão Empresarial Inteligente
                  </text>

                  {/* Monitor com Dashboard */}
                  <rect
                    x="120"
                    y="90"
                    width="160"
                    height="120"
                    rx="8"
                    fill="#ffffff"
                    stroke="url(#logoGradient)"
                    strokeWidth="2"
                    filter="url(#shadow)"
                  />

                  {/* Gráficos e Elementos do Dashboard */}
                  <g transform="translate(130, 100)">
                    {/* Gráfico de Barras */}
                    <rect x="10" y="10" width="15" height="40" fill="url(#logoGradient)" rx="2" />
                    <rect x="30" y="20" width="15" height="30" fill="url(#logoGradient)" rx="2" />
                    <rect x="50" y="15" width="15" height="35" fill="url(#logoGradient)" rx="2" />
                    
                    {/* Linha de Tendência */}
                    <path
                      d="M10 70 Q40 40 80 60"
                      stroke="url(#logoGradient)"
                      strokeWidth="2"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Círculo de Progresso */}
                    <circle
                      cx="120"
                      cy="40"
                      r="25"
                      fill="none"
                      stroke="url(#logoGradient)"
                      strokeWidth="4"
                      strokeDasharray="110,40"
                    />
                  </g>

                  {/* Base do Monitor */}
                  <rect
                    x="140"
                    y="210"
                    width="120"
                    height="10"
                    rx="5"
                    fill="url(#logoGradient)"
                  />
                  <rect
                    x="180"
                    y="220"
                    width="40"
                    height="5"
                    rx="2.5"
                    fill="url(#logoGradient)"
                  />

                  {/* Ícones Laterais */}
                  <g>
                    {/* Módulos do Sistema */}
                    <g transform="translate(80, 120)">
                      {[0, 40, 80].map((y, i) => (
                        <rect
                          key={i}
                          x="0"
                          y={y}
                          width="30"
                          height="30"
                          rx="6"
                          fill="#f8faff"
                          stroke="url(#logoGradient)"
                          strokeWidth="2"
                        />
                      ))}
                    </g>

                    <g transform="translate(290, 120)">
                      {[0, 40, 80].map((y, i) => (
                        <rect
                          key={i}
                          x="0"
                          y={y}
                          width="30"
                          height="30"
                          rx="6"
                          fill="#f8faff"
                          stroke="url(#logoGradient)"
                          strokeWidth="2"
                        />
                      ))}
                    </g>
                  </g>

                  {/* Linhas de Conexão */}
                  <g stroke="url(#logoGradient)" strokeWidth="1" strokeDasharray="3,3">
                    <path d="M110 135 h10 M280 135 h10" />
                    <path d="M110 175 h10 M280 175 h10" />
                    <path d="M110 215 h10 M280 215 h10" />
                  </g>

                  {/* Elementos Decorativos */}
                  <circle cx="80" cy="90" r="4" fill="url(#logoGradient)" />
                  <circle cx="320" cy="90" r="4" fill="url(#logoGradient)" />
                  <circle cx="200" cy="250" r="4" fill="url(#logoGradient)" />

                  {/* Texto de Copyright */}
                  <text
                    x="200"
                    y="270"
                    textAnchor="middle"
                    fill="#666"
                    style={{ 
                      fontSize: '12px', 
                      fontFamily: 'Arial',
                      letterSpacing: '0.5px'
                    }}
                  >
                    FatecInfo Tecnologia®
                  </text>
                </svg>
              </Box>
            </Flex>
          </Box>

          <CardBody flex="1" p={8}>
            <LoginForm 
              isRegistering={isRegistering}
              setIsRegistering={setIsRegistering}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              companyName={companyName}
              setCompanyName={setCompanyName}
              companyDocument={companyDocument}
              setCompanyDocument={setCompanyDocument}
              companyEmail={companyEmail}
              setCompanyEmail={setCompanyEmail}
              companyPhone={companyPhone}
              setCompanyPhone={setCompanyPhone}
            />
          </CardBody>
        </Card>
      </Hide>

      {/* Layout Mobile */}
      <Show below='md'>
        <Box
          w="100%"
          minH="100vh"
          bg="linear-gradient(135deg, #0396FF 0%, #ABDCFF 100%)"
          overflowY="auto"
          display="flex"
          alignItems="center"
          justifyContent="center"
          py={{ base: 20, sm: 16 }}
        >
          <VStack
            w="100%"
            spacing={{ base: 4, sm: 6 }}
            px={4}
            align="center"
          >
            <Box
              w="100%"
              maxW="450px"
              bg="white"
              borderRadius="xl"
              p={{ base: 4, sm: 6 }}
              boxShadow="lg"
              overflowY="visible"
            >
              <VStack spacing={{ base: 4, sm: 6 }} align="center" w="100%">
                <Heading
                  fontSize={{ base: "2xl", sm: "3xl" }}
                  color="gray.700"
                  alignSelf="flex-start"
                  mb={{ base: 2, sm: 0 }}
                >
                  {isRegistering ? 'Criar Conta' : 'Login'}
                </Heading>

                <Box w="100%">
                  <LoginForm 
                    isRegistering={isRegistering}
                    setIsRegistering={setIsRegistering}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    companyName={companyName}
                    setCompanyName={setCompanyName}
                    companyDocument={companyDocument}
                    setCompanyDocument={setCompanyDocument}
                    companyEmail={companyEmail}
                    setCompanyEmail={setCompanyEmail}
                    companyPhone={companyPhone}
                    setCompanyPhone={setCompanyPhone}
                  />
                </Box>
              </VStack>
            </Box>
          </VStack>
        </Box>
      </Show>
    </Box>
  )
}

// Componente do formulário para evitar duplicação de código
const LoginForm = ({
  isRegistering,
  setIsRegistering,
  handleSubmit,
  isLoading,
  email,
  setEmail,
  password,
  setPassword,
  companyName,
  setCompanyName,
  companyDocument,
  setCompanyDocument,
  companyEmail,
  setCompanyEmail,
  companyPhone,
  setCompanyPhone
}) => {
  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <VStack spacing={4} align="stretch">
        <FormControl isRequired mb={4}>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size={{ base: "md", sm: "lg" }}
          />
        </FormControl>

        <FormControl isRequired mb={4}>
          <FormLabel>Senha</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            size={{ base: "md", sm: "lg" }}
          />
        </FormControl>

        {isRegistering && (
          <Box w="100%" mt={2}>
            <Text
              fontSize={{ base: "lg", sm: "xl" }}
              fontWeight="medium"
              color="gray.700"
              mb={4}
            >
              Dados da Empresa
            </Text>

            <VStack spacing={{ base: 3, sm: 4 }} align="stretch">
              <FormControl isRequired>
                <FormLabel>Nome da Empresa</FormLabel>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  size={{ base: "md", sm: "lg" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>CNPJ</FormLabel>
                <Input
                  value={companyDocument}
                  onChange={(e) => setCompanyDocument(e.target.value)}
                  size={{ base: "md", sm: "lg" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Email da Empresa</FormLabel>
                <Input
                  type="email"
                  value={companyEmail}
                  onChange={(e) => setCompanyEmail(e.target.value)}
                  size={{ base: "md", sm: "lg" }}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Telefone da Empresa</FormLabel>
                <Input
                  value={companyPhone}
                  onChange={(e) => setCompanyPhone(e.target.value)}
                  size={{ base: "md", sm: "lg" }}
                />
              </FormControl>
            </VStack>
          </Box>
        )}

        <Button
          colorScheme="blue"
          w="100%"
          mt={{ base: 6, sm: 8 }}
          size={{ base: "md", sm: "lg" }}
          isLoading={isLoading}
          onClick={handleSubmit}
        >
          {isRegistering ? 'Criar Conta' : 'Entrar'}
        </Button>

        <Button
          variant="link"
          onClick={() => setIsRegistering(!isRegistering)}
          mt={2}
          size={{ base: "sm", sm: "md" }}
        >
          {isRegistering ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Cadastre-se'}
        </Button>
      </VStack>
    </form>
  )
}
