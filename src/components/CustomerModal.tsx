import { useState, useEffect } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  Textarea,
  useToast,
} from '@chakra-ui/react';
import supabase from '../lib/supabase';
import { Customer, CustomerInsert, CustomerUpdate } from '../types/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
  onSuccess: () => void;
}

export function CustomerModal({ isOpen, onClose, customer, onSuccess }: CustomerModalProps) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [tipo, setTipo] = useState<'individual' | 'corporate' | null>(null);
  const [observacoes, setObservacoes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    if (customer) {
      setNome(customer.nome || '');
      setEmail(customer.email || '');
      setTelefone(formatPhoneInput(customer.telefone || ''));
      setCpfCnpj(formatCpfCnpj(customer.cpf_cnpj || ''));
      setTipo(customer.tipo);
      setObservacoes(customer.observacoes || '');
    } else {
      resetForm();
    }
  }, [customer]);

  const resetForm = () => {
    setNome('');
    setEmail('');
    setTelefone('');
    setCpfCnpj('');
    setTipo(null);
    setObservacoes('');
  };

  const formatPhoneInput = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneInput(e.target.value);
    setTelefone(formattedValue);
  };

  const formatCpfCnpj = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 11) {
      return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
    }
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  };

  const handleCpfCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCpfCnpj(e.target.value);
    setCpfCnpj(formattedValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !user.currentCompany) {
      toast({
        title: 'Erro',
        description: 'Usuário não está associado a uma empresa',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      const phoneNumbers = telefone.replace(/\D/g, '');
      const cleanCpfCnpj = cpfCnpj.replace(/\D/g, '');
      
      const customerData: CustomerUpdate | CustomerInsert = {
        nome,
        email: email || null,
        telefone: phoneNumbers || null,
        empresa_id: user.currentCompany.id,
        cpf_cnpj: cleanCpfCnpj || null,
        tipo: tipo || 'individual',
        observacoes: observacoes || null,
        created_at: new Date().toISOString(),
        created_by: user.id,
        updated_at: new Date().toISOString(),
      };

      if (customer?.id) {
        const { error } = await supabase
          .from('customers')
          .update(customerData as CustomerUpdate)
          .eq('id', customer.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([{ 
            ...customerData, 
            created_at: new Date().toISOString()
          } as CustomerInsert]);

        if (error) throw error;
      }

      toast({
        title: customer ? 'Cliente atualizado' : 'Cliente criado',
        status: 'success',
        duration: 3000,
      });

      onSuccess();
      onClose();
      resetForm();
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error);
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <form onSubmit={handleSubmit}>
          <ModalHeader>{customer ? 'Editar Cliente' : 'Novo Cliente'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Nome do cliente"
                />
              </FormControl>

              <FormControl>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@exemplo.com"
                />
              </FormControl>

              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input
                  value={telefone}
                  onChange={handlePhoneChange}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Tipo</FormLabel>
                <Select
                  value={tipo || ''}
                  onChange={(e) => setTipo(e.target.value as 'individual' | 'corporate')}
                  placeholder="Selecione o tipo"
                >
                  <option value="individual">Pessoa Física</option>
                  <option value="corporate">Pessoa Jurídica</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>{tipo === 'individual' ? 'CPF' : 'CNPJ'}</FormLabel>
                <Input
                  value={cpfCnpj}
                  onChange={handleCpfCnpjChange}
                  placeholder={tipo === 'individual' ? '000.000.000-00' : '00.000.000/0000-00'}
                  maxLength={tipo === 'individual' ? 14 : 18}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Observações</FormLabel>
                <Textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  placeholder="Observações sobre o cliente"
                  rows={3}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              colorScheme="blue"
              type="submit"
              isLoading={isLoading}
            >
              {customer ? 'Atualizar' : 'Criar'}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
