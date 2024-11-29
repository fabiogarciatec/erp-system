import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  useToast,
  Container,
  Heading,
  Text,
  Divider,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import { CadastroModal } from '../components/CadastroModal';

export function NewLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showCadastroModal, setShowCadastroModal] = useState(false);
  const { signIn, usuario } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (usuario?.empresa_id) {
      console.log('Usuário com empresa, redirecionando');
      navigate('/hello');
    }
  }, [usuario, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('NewLogin: Tentando login com:', email);

    try {
      const user = await signIn(email, password);
      console.log('NewLogin: Login bem sucedido:', user);
      
      if (user.empresa_id) {
        navigate('/hello');
        
        toast({
          title: 'Login realizado com sucesso!',
          status: 'success',
          duration: 3000,
        });
      }
    } catch (error: any) {
      console.error('NewLogin: Erro no login:', error);
      
      toast({
        title: 'Erro ao fazer login',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="xl" mb={2}>Bem-vindo</Heading>
          <Text color="gray.600">Faça login para continuar</Text>
        </Box>

        <Box
          as="form"
          onSubmit={handleLogin}
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="lg"
        >
          <VStack spacing={4}>
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
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isLoading}
              loadingText="Entrando..."
            >
              Entrar
            </Button>
          </VStack>
        </Box>

        <Divider />

        <Box textAlign="center">
          <Text mb={4}>Ainda não tem uma conta?</Text>
          <Button
            variant="outline"
            colorScheme="blue"
            onClick={() => setShowCadastroModal(true)}
          >
            Criar conta
          </Button>
        </Box>
      </VStack>

      <CadastroModal
        isOpen={showCadastroModal}
        onClose={() => setShowCadastroModal(false)}
      />
    </Container>
  );
}
