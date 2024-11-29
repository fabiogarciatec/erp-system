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
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
  HStack,
  Text,
  Badge,
  Flex,
  Stack,
  InputGroup,
  InputLeftElement,
  Icon,
  TableContainer,
  Select,
  ButtonGroup,
  Textarea,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { Customer } from '../types/supabase';
import { useAuth } from '../contexts/AuthContext';
import { customerService } from '../services/api';

export function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { usuario } = useAuth();

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await customerService.getRecords();
      setCustomers(data);
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

  const handleCreateCustomer = async (data: any) => {
    if (!usuario?.empresa_id) {
      toast({
        title: 'Erro',
        description: 'ID da empresa não encontrado',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const newCustomer: Omit<Customer, 'id' | 'created_at' | 'updated_at'> = {
        nome: data.nome || '',
        email: data.email || null,
        telefone: data.telefone || null,
        cpf_cnpj: data.cpf_cnpj || null,
        endereco: data.endereco || {},
        status: (data.status as 'active' | 'inactive' | 'suspended') || 'active',
        tipo: (data.tipo as 'individual' | 'corporate') || 'individual',
        empresa_id: usuario.empresa_id,
        observacoes: data.observacoes || null,
        ultima_compra: null,
        created_by: usuario.id
      };

      const result = await customerService.create(newCustomer);
      
      if ('error' in result) {
        throw result.error;
      }

      loadCustomers();
      onClose();
      toast({
        title: 'Cliente criado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao criar cliente:', error);
      toast({
        title: 'Erro ao criar cliente',
        description: 'Ocorreu um erro ao criar o cliente. Tente novamente.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleUpdateCustomer = async (id: string, formData: Partial<Customer>) => {
    try {
      await customerService.update(id, formData);
      toast({
        title: 'Cliente atualizado',
        description: 'O cliente foi atualizado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      loadCustomers();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar cliente:', error);
      toast({
        title: 'Erro ao atualizar cliente',
        description: 'Não foi possível atualizar o cliente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) return;

    try {
      await customerService.delete(id);
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
        description: 'Não foi possível excluir o cliente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <Box w="full" minH="100vh" bg="gray.100">
      <Container maxW="full" p={{ base: 4, lg: 8 }}>
        <Flex justify="space-between" align="center" wrap="wrap" gap={4} mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Clientes
          </Text>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={() => {
              setSelectedCustomer(null);
              onOpen();
            }}
          >
            Novo Cliente
          </Button>
        </Flex>

        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Email</Th>
                <Th>Telefone</Th>
                <Th>Tipo</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer) => (
                <Tr key={customer.id}>
                  <Td>{customer.nome}</Td>
                  <Td>{customer.email}</Td>
                  <Td>{customer.telefone}</Td>
                  <Td>
                    <Badge colorScheme={customer.tipo === 'individual' ? 'green' : 'blue'}>
                      {customer.tipo === 'individual' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={customer.status === 'active' ? 'green' : 'red'}>
                      {customer.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        leftIcon={<FiEdit2 />}
                        onClick={() => {
                          setSelectedCustomer(customer);
                          onOpen();
                        }}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        leftIcon={<FiTrash2 />}
                        onClick={() => handleDeleteCustomer(customer.id)}
                      >
                        Excluir
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>

        {/* Modal de Cliente */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedCustomer ? 'Editar Cliente' : 'Novo Cliente'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    name="nome"
                    defaultValue={selectedCustomer?.nome ?? ''}
                    placeholder="Nome do cliente"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    defaultValue={selectedCustomer?.email ?? ''}
                    placeholder="Email do cliente"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    name="telefone"
                    defaultValue={selectedCustomer?.telefone ?? ''}
                    placeholder="Telefone do cliente"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>CPF/CNPJ</FormLabel>
                  <Input
                    name="cpf_cnpj"
                    defaultValue={selectedCustomer?.cpf_cnpj ?? ''}
                    placeholder="CPF ou CNPJ do cliente"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    name="tipo"
                    defaultValue={selectedCustomer?.tipo ?? 'individual'}
                  >
                    <option value="individual">Pessoa Física</option>
                    <option value="corporate">Pessoa Jurídica</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    defaultValue={selectedCustomer?.status ?? 'active'}
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="suspended">Suspenso</option>
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel>Observações</FormLabel>
                  <Textarea
                    name="observacoes"
                    defaultValue={selectedCustomer?.observacoes ?? ''}
                    placeholder="Observações sobre o cliente"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="blue" onClick={() => handleCreateCustomer({})}>
                {selectedCustomer ? 'Salvar' : 'Criar'}
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Container>
    </Box>
  );
}
