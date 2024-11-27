import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
  Center,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { useCompany } from '../contexts/CompanyContext';
import { Customer } from '@/types';

const initialCustomerData: Customer = {
  id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  created_at: undefined,
  updated_at: undefined,
};

export function Customers() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { createRecord, updateRecord, deleteRecord, getRecords, loading: companyLoading } = useCompany();

  const [formData, setFormData] = useState<Customer>(initialCustomerData);

  const loadCustomers = async () => {
    if (companyLoading) return;

    setLoading(true);
    try {
      const { data, error } = await getRecords<Customer>('customers', {
        orderBy: { column: 'name', ascending: true },
      });

      if (error) throw error;
      setCustomers(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      toast({
        title: 'Erro ao carregar clientes',
        description: 'Não foi possível carregar a lista de clientes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [getRecords, toast, companyLoading]);

  if (companyLoading || loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const handleSubmit = async () => {
    try {
      const customerData: Customer = {
        id: formData.id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        created_at: formData.created_at,
        updated_at: formData.updated_at,
      };

      if (selectedCustomer) {
        const { error } = await updateRecord<Customer>(
          'customers',
          selectedCustomer.id,
          customerData
        );
        if (error) throw error;
        toast({
          title: 'Cliente atualizado',
          description: 'O cliente foi atualizado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const { error } = await createRecord<Customer>('customers', customerData);
        if (error) throw error;
        toast({
          title: 'Cliente criado',
          description: 'O cliente foi criado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }

      onClose();
      setFormData(initialCustomerData);
      setSelectedCustomer(null);
      loadCustomers();
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      toast({
        title: 'Erro ao salvar cliente',
        description: 'Ocorreu um erro ao salvar o cliente. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      id: customer.id,
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      created_at: customer.created_at,
      updated_at: customer.updated_at,
    });
    onOpen();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      const { error } = await deleteRecord('customers', id);
      if (error) throw error;

      toast({
        title: 'Cliente excluído',
        description: 'O cliente foi excluído com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      loadCustomers();
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
      toast({
        title: 'Erro ao excluir cliente',
        description: 'Ocorreu um erro ao excluir o cliente. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    setFormData(initialCustomerData);
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <PageHeader title="Clientes" />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={handleNewCustomer}
          mb={6}
        >
          Novo Cliente
        </Button>

        {customers.length === 0 ? (
          <Center py={8}>
            <Text>Nenhum cliente cadastrado.</Text>
          </Center>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Telefone</Th>
                <Th>Endereço</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer) => (
                <Tr key={customer.id}>
                  <Td>{customer.name || '-'}</Td>
                  <Td>{customer.email || '-'}</Td>
                  <Td>{customer.phone || '-'}</Td>
                  <Td>{customer.address || '-'}</Td>
                  <Td>
                    <Button
                      size="sm"
                      leftIcon={<FiEdit2 />}
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => handleEdit(customer)}
                      mr={2}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiTrash2 />}
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(customer.id)}
                    >
                      Excluir
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCustomer ? 'Editar Cliente' : 'Novo Cliente'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Endereço</FormLabel>
                <Input
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
