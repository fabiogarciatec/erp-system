import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
  VStack,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton,
  useColorModeValue,
  Flex,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  FormErrorMessage,
} from '@chakra-ui/react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';

interface SignUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function SignUpModal({ isOpen, onClose }: SignUpModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signUp(email, password, nome);
      onClose();
    } catch (error) {
      console.error('Erro no cadastro:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Criar conta</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome completo</FormLabel>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
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
              </FormControl>

              <Button
                type="submit"
                colorScheme="blue"
                width="full"
                isLoading={isSubmitting}
                loadingText="Cadastrando..."
              >
                Cadastrar
              </Button>
            </VStack>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signIn } = useAuth();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log('Login: Iniciando processo de login');
      await signIn(email, password);
      console.log('Login: Login bem sucedido, aguardando redirecionamento');
    } catch (error: any) {
      console.error('Login: Erro no login:', error);
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={useColorModeValue('gray.50', 'gray.900')}>
      <Container maxW="lg" py={{ base: 12, md: 24 }} px={{ base: 4, sm: 8 }}>
        <Stack spacing={8}>
          <Stack align="center">
            <Heading
              fontSize={{ base: '2xl', md: '4xl' }}
              textAlign="center"
              color={useColorModeValue('gray.900', 'white')}
            >
              Entre na sua conta
            </Heading>
            <Text fontSize={{ base: 'sm', md: 'md' }} color={useColorModeValue('gray.600', 'gray.400')}>
              para acessar o sistema ✌️
            </Text>
          </Stack>

          <Box
            py={8}
            px={{ base: 4, sm: 10 }}
            bg={bgColor}
            boxShadow="lg"
            borderRadius="xl"
            border="1px"
            borderColor={borderColor}
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing={6}>
                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu@email.com"
                    size="lg"
                    autoComplete="username"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Senha</FormLabel>
                  <InputGroup size="lg">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="********"
                      autoComplete="current-password"
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
                </FormControl>

                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  isLoading={isSubmitting}
                  loadingText="Entrando..."
                  w="full"
                >
                  Entrar
                </Button>
              </VStack>
            </form>

            <Stack pt={6} spacing={4}>
              <Text align="center">
                Não tem uma conta?{' '}
                <Link color="blue.500" onClick={onOpen} _hover={{ textDecoration: 'underline' }}>
                  Cadastre-se
                </Link>
              </Text>
              <Text align="center" fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
                Ao entrar, você concorda com nossos{' '}
                <Link color="blue.500" href="#" _hover={{ textDecoration: 'underline' }}>
                  termos de serviço
                </Link>
              </Text>
            </Stack>
          </Box>
        </Stack>
      </Container>

      <SignUpModal isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
}
