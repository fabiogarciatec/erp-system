import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  Card,
  CardBody,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Hide,
  Input,
  Show,
  Stack,
  Text,
  useToast,
  useColorMode,
  VStack,
} from '@chakra-ui/react'
import { useAuth } from '@/contexts/AuthContext'
import { InputMaskChakra } from '@/components/InputMaskChakra'

interface LoginFormProps {
  isRegistering: boolean
  setIsRegistering: (value: boolean) => void
  handleSubmit: (event: React.FormEvent) => Promise<void>
  isLoading: boolean
  email: string
  setEmail: (value: string) => void
  password: string
  setPassword: (value: string) => void
  companyName: string
  setCompanyName: (value: string) => void
  companyDocument: string
  setCompanyDocument: (value: string) => void
  companyEmail: string
  setCompanyEmail: (value: string) => void
  companyPhone: string
  setCompanyPhone: (value: string) => void
  error: string
}

export default function Login() {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [companyName, setCompanyName] = useState<string>('')
  const [companyDocument, setCompanyDocument] = useState<string>('')
  const [companyEmail, setCompanyEmail] = useState<string>('')
  const [companyPhone, setCompanyPhone] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isRegistering, setIsRegistering] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const { login, register } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const { colorMode } = useColorMode()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError('')
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
          companyPhone
        })
        toast({
          title: 'Registro realizado com sucesso!',
          description: 'Por favor, verifique seu e-mail para confirmar o cadastro.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        setIsRegistering(false)
      } else {
        await login(email, password)
        navigate('/dashboard')
      }
    } catch (error: any) {
      setError(error.message)
      toast({
        title: 'Erro',
        description: error.message || 'Ocorreu um erro. Tente novamente.',
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
      p={{ base: 4, md: 8 }}
      bg={colorMode === 'dark' 
        ? 'linear-gradient(135deg, #1A365D 0%, #2D3748 100%)'
        : 'linear-gradient(135deg, #0396FF 0%, #ABDCFF 100%)'
      }
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
          maxH={{ base: "auto", md: isRegistering ? "700px" : "500px" }}
          w="90%"
          boxShadow="xl"
          borderRadius="xl"
          mx="auto"
          my={{ base: 4, md: 8 }}
        >
          <Box
            flex="1"
            bg={colorMode === 'dark'
              ? 'linear-gradient(135deg, #2D3748 0%, #1A365D 100%)'
              : 'linear-gradient(135deg, #f8faff 0%, #ffffff 100%)'
            }
            p={8}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="xl"
            boxShadow={colorMode === 'dark'
              ? 'inset 0 0 20px rgba(0, 0, 0, 0.3)'
              : 'inset 0 0 20px rgba(74, 144, 226, 0.1)'
            }
          >
            <Flex
              direction={{ base: 'row', md: 'column' }}
              align="center"
              justify="center"
              gap={{ base: 4, md: 8 }}
            >
              <Heading
                fontSize={'4xl'}
                textAlign={{ base: 'left', md: 'center' }}
                mb={{ base: 0, md: 4 }}
                mr={{ base: 4, md: 0 }}
                color={colorMode === 'dark' ? '#CBD5E0' : '#666'}
                position="relative"
                top="35px"
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
                      <stop offset="0%" style={{ stopColor: colorMode === 'dark' ? '#4299E1' : '#0066cc' }} />
                      <stop offset="100%" style={{ stopColor: colorMode === 'dark' ? '#63B3ED' : '#0099ff' }} />
                    </linearGradient>
                    <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style={{ stopColor: colorMode === 'dark' ? '#4299E1' : '#0066cc' }} />
                      <stop offset="100%" style={{ stopColor: colorMode === 'dark' ? '#63B3ED' : '#0099ff' }} />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Logo FATEC com Seta */}
                  <g transform="translate(120, 30)">
                    <text
                      x="0"
                      y="25"
                      fill="url(#logoGradient)"
                      filter={colorMode === 'dark' ? 'url(#glow)' : 'none'}
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
                      fill={colorMode === 'dark' ? '#FC8181' : '#E53E3E'}
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
                    fill={colorMode === 'dark' ? '#CBD5E0' : '#666'}
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
                    fill={colorMode === 'dark' ? '#CBD5E0' : '#666'}
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

          <CardBody 
            flex="1" 
            py={30} 
            px={{ base: 4, md: 8 }}
            bg={colorMode === 'dark' ? 'gray.700' : 'white'} 
            boxShadow="inset 0 0 20px rgba(74, 144, 226, 0.1)"
            overflowY="auto"
          >
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
              error={error}
            />
          </CardBody>
        </Card>
      </Hide>

      {/* Layout Mobile */}
      <Show below='md'>
        <Container maxW="container.xl" py={6}>
          <Card
            maxH={{ base: isRegistering ? "85vh" : "auto" }}
            overflow="hidden"
          >
            <CardBody 
              py={30} 
              px={4}
              bg={colorMode === 'dark' ? 'gray.700' : 'white'} 
              boxShadow="inset 0 0 20px rgba(74, 144, 226, 0.1)"
              overflowY="auto"
            >
              <Stack
                direction={{ base: 'column', md: 'row' }}
                align="center"
                justify="center"
                gap={{ base: 4, md: 8 }}
              >
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
                        <stop offset="0%" style={{ stopColor: colorMode === 'dark' ? '#4299E1' : '#0066cc' }} />
                        <stop offset="100%" style={{ stopColor: colorMode === 'dark' ? '#63B3ED' : '#0099ff' }} />
                      </linearGradient>
                      <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: colorMode === 'dark' ? '#4299E1' : '#0066cc' }} />
                        <stop offset="100%" style={{ stopColor: colorMode === 'dark' ? '#63B3ED' : '#0099ff' }} />
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
                        fill={colorMode === 'dark' ? '#FC8181' : '#E53E3E'}
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
                      fill={colorMode === 'dark' ? '#CBD5E0' : '#666'}
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
                      fill={colorMode === 'dark' ? '#CBD5E0' : '#666'}
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
              </Stack>
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
                error={error}
              />
            </CardBody>
          </Card>
        </Container>
      </Show>
    </Box>
  )
}

const LoginForm: React.FC<LoginFormProps> = ({
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
  setCompanyPhone,
  error
}) => {
  const { colorMode } = useColorMode()

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={{ base: 3, md: 4 }} align="stretch">
        {isRegistering && (
          <>
            <FormControl isRequired size="sm">
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Nome da Empresa</FormLabel>
              <Input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Digite o nome da empresa"
                size={{ base: "sm", md: "md" }}
              />
            </FormControl>
            <FormControl isRequired size="sm">
              <FormLabel fontSize={{ base: "sm", md: "md" }}>CNPJ</FormLabel>
              <InputMaskChakra
                mask="99.999.999/9999-99"
                value={companyDocument}
                onChange={(e) => setCompanyDocument(e.target.value)}
                placeholder="Digite o CNPJ"
                size={{ base: "sm", md: "md" }}
              />
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize={{ base: "sm", md: "md" }}>E-mail da Empresa</FormLabel>
              <Input
                type="email"
                value={companyEmail}
                onChange={(e) => setCompanyEmail(e.target.value)}
                placeholder="Digite o e-mail da empresa"
                size={{ base: "sm", md: "md" }}
              />
            </FormControl>
            <FormControl size="sm">
              <FormLabel fontSize={{ base: "sm", md: "md" }}>Telefone da Empresa</FormLabel>
              <InputMaskChakra
                mask="(99) 99999-9999"
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                placeholder="Digite o telefone da empresa"
                size={{ base: "sm", md: "md" }}
              />
            </FormControl>
          </>
        )}

        <FormControl isRequired size="sm">
          <FormLabel fontSize={{ base: "sm", md: "md" }}>E-mail</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            size={{ base: "sm", md: "md" }}
          />
        </FormControl>

        <FormControl isRequired size="sm">
          <FormLabel fontSize={{ base: "sm", md: "md" }}>Senha</FormLabel>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            size={{ base: "sm", md: "md" }}
          />
        </FormControl>

        <Button
          type="submit"
          colorScheme="blue"
          size={{ base: "sm", md: "md" }}
          isLoading={isLoading}
          w="full"
          mt={{ base: 2, md: 4 }}
        >
          {isRegistering ? 'Criar Conta' : 'Entrar'}
        </Button>

        <Button
          variant="ghost"
          onClick={() => setIsRegistering(!isRegistering)}
          size={{ base: "sm", md: "md" }}
          mt={1}
        >
          {isRegistering ? 'Já tem uma conta? Entre aqui' : 'Não tem uma conta? Crie aqui'}
        </Button>

        {error && (
          <Text color="red.500" fontSize={{ base: "sm", md: "md" }} textAlign="center" mt={2}>
            {error}
          </Text>
        )}
      </VStack>
    </form>
  )
}
