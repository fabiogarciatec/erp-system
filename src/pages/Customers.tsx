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
import { FiEdit2, FiTrash2, FiPlus, FiSearch } from 'react-icons/fi';
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
    setIsLoading(true);
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar clientes',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer);
    onOpen();
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteCustomer(id);
      toast({
        title: 'Cliente excluído com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
      loadCustomers();
    } catch (error: any) {
      toast({
        title: 'Erro ao excluir cliente',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
    setDeleteId(null);
  };

  const handleNewCustomer = () => {
    setSelectedCustomer(undefined);
    onOpen();
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadCustomers();
      return;
    }

    setIsLoading(true);
    try {
      const data = await searchCustomers(searchQuery);
      setCustomers(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao buscar clientes',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
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
            onClick={handleNewCustomer}
          >
            Novo Cliente
          </Button>
        </Flex>

        {/* Barra de busca */}
        <Flex mb={6}>
          <Input
            placeholder="Buscar clientes..."
            mr={4}
            maxW="400px"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <IconButton
            aria-label="Buscar clientes"
            icon={<FiSearch />}
            colorScheme="blue"
            onClick={handleSearch}
            isLoading={isLoading}
          />
        </Flex>

        {/* Tabela de clientes */}
        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Telefone</Th>
                <Th>Status</Th>
                <Th>Última Compra</Th>
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
                    {customer.last_purchase
                      ? new Date(customer.last_purchase).toLocaleDateString()
                      : '-'}
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Editar cliente"
                      icon={<FiEdit2 />}
                      size="sm"
                      mr={2}
                      onClick={() => handleEdit(customer)}
                    />
                    <IconButton
                      aria-label="Excluir cliente"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => setDeleteId(customer.id)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

        {/* Modal de cadastro/edição */}
        <CustomerModal
          isOpen={isOpen}
          onClose={onClose}
          customer={selectedCustomer}
          onSuccess={loadCustomers}
        />

        {/* Dialog de confirmação de exclusão */}
        <AlertDialog
          isOpen={!!deleteId}
          leastDestructiveRef={cancelRef}
          onClose={() => setDeleteId(null)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Excluir Cliente
              </AlertDialogHeader>

              <AlertDialogBody>
                Tem certeza? Esta ação não poderá ser desfeita.
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
