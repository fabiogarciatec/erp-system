import {
  Box,
  Container,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Badge,
  IconButton,
  useToast,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { useState } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
    status: 'active',
  },
];

export function Users() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users] = useState<User[]>(mockUsers);
  const toast = useToast();

  const handleDelete = (userId: string) => {
    // Aqui será implementada a lógica de deletar no banco de dados
    toast({
      title: 'Usuário removido',
      description: 'O usuário foi removido com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={4}>
        <HStack justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Usuários
          </Text>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Novo Usuário
          </Button>
        </HStack>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>E-mail</Th>
              <Th>Cargo</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.name}</Td>
                <Td>{user.email}</Td>
                <Td>
                  {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                </Td>
                <Td>
                  <Badge
                    colorScheme={user.status === 'active' ? 'green' : 'red'}
                  >
                    {user.status === 'active' ? 'Ativo' : 'Inativo'}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <IconButton
                      aria-label="Editar usuário"
                      icon={<FiEdit2 />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                    />
                    <IconButton
                      aria-label="Remover usuário"
                      icon={<FiTrash2 />}
                      size="sm"
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(user.id)}
                    />
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal de Novo Usuário */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Novo Usuário</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input placeholder="Nome do usuário" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input type="email" placeholder="E-mail do usuário" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Senha</FormLabel>
                <Input type="password" placeholder="Senha" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Cargo</FormLabel>
                <Select placeholder="Selecione o cargo">
                  <option value="admin">Administrador</option>
                  <option value="user">Usuário</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select defaultValue="active">
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
            <Button colorScheme="blue">
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
