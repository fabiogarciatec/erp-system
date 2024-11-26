import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  useDisclosure,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiSearch, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { supabase } from '../services/supabase';
import { CustomerModal } from '../components/CustomerModal';
import { PageHeader } from '../components/PageHeader';
import { useRef } from 'react';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
}

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');

      if (error) throw error;

      setCustomers(data || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: 'Erro ao carregar clientes',
        description: 'Não foi possível carregar a lista de clientes.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(null);
    onOpen();
  };

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    onOpen();
  };

  const confirmDelete = (customerId: string) => {
    setCustomerToDelete(customerId);
    onDeleteOpen();
  };

  const handleDelete = async () => {
    if (!customerToDelete) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customerToDelete);

      if (error) throw error;

      toast({
        title: 'Cliente excluído',
        description: 'O cliente foi excluído com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      fetchCustomers();
    } catch (error) {
      console.error('Error deleting customer:', error);
      toast({
        title: 'Erro ao excluir cliente',
        description: 'Não foi possível excluir o cliente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
      onDeleteClose();
      setCustomerToDelete(null);
    }
  };

  const handleSuccess = () => {
    onClose();
    fetchCustomers();
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    const cleaned = phone.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/);
    if (match) {
      return `(${match[1]}) ${match[2]}-${match[3]}`;
    }
    return phone;
  };

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box>
      <PageHeader
        title="Clientes"
        subtitle="Gerencie seus clientes"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Clientes', href: '/customers' },
        ]}
      />

      <Box bg="white" p={4} rounded="md" shadow="sm">
        <Flex mb={4} gap={4} justify="space-between">
          <InputGroup maxW="300px">
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={handleSearch}
            />
            <InputRightElement>
              <FiSearch />
            </InputRightElement>
          </InputGroup>
          <Button 
            colorScheme="blue" 
            leftIcon={<FiPlus />} 
            onClick={handleNewCustomer}
            isLoading={isLoading}
          >
            Novo Cliente
          </Button>
        </Flex>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Telefone</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredCustomers.map((customer) => (
                <Tr key={customer.id}>
                  <Td>{customer.name}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{formatPhoneNumber(customer.phone)}</Td>
                  <Td>
                    <Badge
                      colorScheme={customer.status === 'active' ? 'green' : 'red'}
                    >
                      {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </Td>
                  <Td>
                    <Flex gap={2}>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(customer)}
                        title="Editar cliente"
                      >
                        <FiEdit2 />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => confirmDelete(customer.id)}
                        title="Excluir cliente"
                      >
                        <FiTrash2 />
                      </Button>
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Box>

      <CustomerModal
        isOpen={isOpen}
        onClose={onClose}
        customer={selectedCustomer}
        onSuccess={handleSuccess}
      />

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Cliente
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
}
