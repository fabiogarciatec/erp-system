import React, { useState, useEffect } from 'react';
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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
  const toast = useToast();
  const { handleSignIn } = useAuth();

  useEffect(() => {
    const handleRecoveryToken = async () => {
      const hash = window.location.hash;
      if (!hash || !hash.includes('type=recovery')) {
        navigate('/login');
        return;
      }

      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        
        if (error || !user?.email) {
          toast({
            title: 'Link inválido ou expirado',
            description: 'Por favor, solicite um novo link de redefinição de senha.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
          navigate('/login');
          return;
        }

        setEmail(user.email);
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
        navigate('/login');
      }
    };

    handleRecoveryToken();
  }, [navigate, toast]);

  const validateForm = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = 'Nova senha é obrigatória';
    } else if (password.length < 6) {
      newErrors.password = 'A senha deve ter pelo menos 6 caracteres';
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Atualiza a senha
      const { error: updateError } = await supabase.auth.updateUser({
        password: password
      });

      if (updateError) throw updateError;

      // Faz login com a nova senha
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) throw signInError;

      toast({
        title: 'Senha atualizada',
        description: 'Sua senha foi atualizada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Aguarda um pouco para garantir que o estado foi atualizado
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 1000);

    } catch (error) {
      console.error('Erro ao redefinir senha:', error);
      toast({
        title: 'Erro ao redefinir senha',
        description: error.message || 'Ocorreu um erro ao tentar redefinir sua senha. Por favor, tente novamente.',
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
            <Heading size="lg">Redefinir Senha</Heading>
            <Text color="gray.600" fontSize="sm" textAlign="center">
              Digite sua nova senha abaixo
            </Text>

            <FormControl isInvalid={errors.password}>
              <FormLabel>Nova Senha</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
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

            <FormControl isInvalid={errors.confirmPassword}>
              <FormLabel>Confirmar Nova Senha</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                />
                <InputRightElement>
                  <IconButton
                    aria-label={showConfirmPassword ? 'Esconder senha' : 'Mostrar senha'}
                    icon={showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                    variant="ghost"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{errors.confirmPassword}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
              loadingText="Atualizando..."
            >
              Atualizar Senha
            </Button>

            <Button
              variant="ghost"
              width="full"
              onClick={() => navigate('/login')}
              isDisabled={loading}
            >
              Voltar para Login
            </Button>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default ResetPassword;
