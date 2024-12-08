import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  useToast,
  VStack,
  Divider,
  Text,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';

interface CadastroModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CadastroModal({ isOpen, onClose, onSuccess }: CadastroModalProps) {
  // Dados do usuário
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Dados da empresa
  const [nomeEmpresa, setNomeEmpresa] = useState('');
  const [cnpj, setCnpj] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const toast = useToast();

  const formatCNPJ = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    let formatted = cleaned;

    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + '.';
      if (cleaned.length >= 5) {
        formatted += cleaned.slice(2, 5) + '.';
        if (cleaned.length >= 8) {
          formatted += cleaned.slice(5, 8) + '/';
          if (cleaned.length >= 12) {
            formatted += cleaned.slice(8, 12) + '-';
            if (cleaned.length >= 14) {
              formatted += cleaned.slice(12, 14);
            } else {
              formatted += cleaned.slice(12);
            }
          } else {
            formatted += cleaned.slice(8);
          }
        } else {
          formatted += cleaned.slice(5);
        }
      } else {
        formatted += cleaned.slice(2);
      }
    }

    return formatted;
  };

  const handleCNPJChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCNPJ(e.target.value);
    setCnpj(formatted);
  };

  const validateCNPJ = (cnpj: string) => {
    const cleaned = cnpj.replace(/\D/g, '');
    return cleaned.length === 14;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validações
      if (password !== confirmPassword) {
        throw new Error('As senhas não coincidem');
      }

      if (password.length < 6) {
        throw new Error('A senha deve ter pelo menos 6 caracteres');
      }

      if (!validateCNPJ(cnpj)) {
        throw new Error('CNPJ inválido');
      }

      // Cadastra usuário e empresa
      await register({
        email,
        password,
        companyName: nomeEmpresa,
        companyDocument: cnpj.replace(/\D/g, '')
      });

      toast({
        title: 'Cadastro realizado com sucesso!',
        description: 'Verifique seu email para confirmar o cadastro.',
        status: 'success',
        duration: 5000,
      });

      onSuccess?.();
      onClose();
    } catch (error: any) {
      console.error('Erro ao cadastrar:', error);
      toast({
        title: 'Erro ao cadastrar',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setNome('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNomeEmpresa('');
    setCnpj('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>Criar Conta</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6}>
            <VStack spacing={4} width="100%">
              <Text fontWeight="bold" alignSelf="flex-start">Dados do Usuário</Text>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
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
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Confirmar Senha</FormLabel>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Digite a senha novamente"
                />
              </FormControl>
            </VStack>

            <Divider />

            <VStack spacing={4} width="100%">
              <Text fontWeight="bold" alignSelf="flex-start">Dados da Empresa</Text>
              <FormControl isRequired>
                <FormLabel>Nome da Empresa</FormLabel>
                <Input
                  value={nomeEmpresa}
                  onChange={(e) => setNomeEmpresa(e.target.value)}
                  placeholder="Nome da empresa"
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>CNPJ</FormLabel>
                <Input
                  value={cnpj}
                  onChange={handleCNPJChange}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                />
              </FormControl>
            </VStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            type="submit"
            isLoading={isLoading}
            loadingText="Cadastrando..."
          >
            Criar Conta
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
