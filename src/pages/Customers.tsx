import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  useToast,
  useDisclosure,
  Badge,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { CustomerModal } from '../components/CustomerModal';
import { Customer, getCustomers, deleteCustomer, searchCustomers } from '../services/customers';

export function Customers() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);

  const loadCustomers = async () => {
    try {
      setIsLoading(true);
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar clientes',
        description: 'Tente novamente mais tarde',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleEditOrCreateCustomer = (customer?: Customer) => {
    setSelectedCustomer(customer);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCustomer(id);
      toast({
        title: 'Cliente excluído com sucesso!',
        status: 'success',
        duration: 3000,
      });
      loadCustomers();
    } catch (error) {
      toast({
        title: 'Erro ao excluir cliente',
        description: 'Tente novamente mais tarde',
        status: 'error',
        duration: 3000,
      });
    }
    setDeleteId(null);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCustomers();
      return;
    }

    try {
      setIsLoading(true);
      const results = await searchCustomers(searchQuery);
      setCustomers(results);
    } catch (error) {
      toast({
        title: 'Erro ao pesquisar clientes',
        description: 'Tente novamente mais tarde',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Container maxW="container.xl">
        <Flex justify="space-between" align="center" mb={8}>
          <Heading size="lg">Clientes</Heading>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={() => handleEditOrCreateCustomer()}
          >
            Novo Cliente
          </Button>
        </Flex>

        <Box mb={8}>
          <Input
            placeholder="Pesquisar clientes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <IconButton
            aria-label="Pesquisar clientes"
            icon={<FiSearch />}
            colorScheme="blue"
            onClick={handleSearch}
            isLoading={isLoading}
          />
        </Box>

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
              {customers.map((customer) => (
                <Tr key={customer.id}>
                  <Td>{customer.name}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{customer.phone}</Td>
                  <Td>
                    <Badge
                      colorScheme={customer.status === 'active' ? 'green' : 'red'}
                    >
                      {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Editar cliente"
                      icon={<FiEdit2 />}
                      size="sm"
                      mr={2}
                      onClick={() => handleEditOrCreateCustomer(customer)}
                    />
                    <IconButton
                      aria-label="Excluir cliente"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => setDeleteId(customer.id || null)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        <CustomerModal
          isOpen={isOpen}
          onClose={onClose}
          customer={selectedCustomer}
          onSuccess={loadCustomers}
        />

        <AlertDialog
          isOpen={!!deleteId}
          leastDestructiveRef={cancelRef}
          onClose={() => setDeleteId(null)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>Excluir Cliente</AlertDialogHeader>
              <AlertDialogBody>
                Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setDeleteId(null)}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="red"
                  onClick={() => deleteId && handleDelete(deleteId)}
                  ml={3}
                >
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </Container>
    </DashboardLayout>
  );
}
