import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { signInWithEmail } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await signInWithEmail(email, password);
      // Não precisamos mais navegar aqui, o useEffect cuidará disso
      toast({
        title: 'Login realizado com sucesso',
        description: 'Você será redirecionado para o dashboard.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao fazer login',
        description: error.message || 'Verifique suas credenciais e tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="lg" py={12}>
      <Stack spacing={8}>
        <Stack align="center">
          <Heading fontSize="4xl">ERP FATEC</Heading>
          <Text fontSize="lg" color="gray.600">
            Entre com suas credenciais
          </Text>
        </Stack>
        <Box
          rounded="lg"
          bg="white"
          boxShadow="lg"
          p={8}
          as="form"
          onSubmit={handleSubmit}
        >
          <Stack spacing={4}>
            <FormControl id="email">
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </FormControl>
            <FormControl id="password">
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              size="lg"
              fontSize="md"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
}
