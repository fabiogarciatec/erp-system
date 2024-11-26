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
  VStack,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { Customer, createCustomer, updateCustomer } from '../services/customers';

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer?: Customer;
  onSuccess: () => void;
}

export function CustomerModal({ isOpen, onClose, customer, onSuccess }: CustomerModalProps) {
  const toast = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<Omit<Customer, 'id' | 'created_at'>>({
    name: '',
    email: '',
    phone: '',
    status: 'active',
    last_purchase: null,
  });

  useEffect(() => {
    if (customer) {
      setFormData({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        status: customer.status,
        last_purchase: customer.last_purchase,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        status: 'active',
        last_purchase: null,
      });
    }
  }, [customer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (customer?.id) {
        await updateCustomer(customer.id, formData);
      } else {
        await createCustomer(formData);
      }
      
      toast({
        title: customer ? 'Cliente atualizado!' : 'Cliente cadastrado!',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      onSuccess();
      onClose();
    } catch (error: any) {
      toast({
        title: 'Erro ao salvar',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent as="form" onSubmit={handleSubmit}>
        <ModalHeader>
          {customer ? 'Editar Cliente' : 'Novo Cliente'}
        </ModalHeader>
        <ModalCloseButton />
        
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome completo"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@exemplo.com"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Telefone</FormLabel>
              <Input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(00) 00000-0000"
              />
            </FormControl>

            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="active">Ativo</option>
                <option value="inactive">Inativo</option>
              </Select>
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
            isLoading={isSubmitting}
          >
            {customer ? 'Atualizar' : 'Cadastrar'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
