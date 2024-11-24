import React, { useState } from 'react';
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
  useColorModeValue,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  useToast,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiMoreVertical, FiSearch, FiUserPlus } from 'react-icons/fi';

// Mock data for users
const initialUsers = [
  {
    id: 1,
    name: 'João Silva',
    email: 'joao.silva@example.com',
    role: 'admin',
    status: 'active',
  },
  {
    id: 2,
    name: 'Maria Santos',
    email: 'maria.santos@example.com',
    role: 'user',
    status: 'active',
  },
  {
    id: 3,
    name: 'Pedro Oliveira',
    email: 'pedro.oliveira@example.com',
    role: 'manager',
    status: 'inactive',
  },
];

const Users = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  const handleEdit = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDelete = (userId) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(user => user.id !== userId));
      toast({
        title: 'Usuário excluído',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (selectedUser) {
      setUsers(users.map(user => 
        user.id === selectedUser.id ? selectedUser : user
      ));
    } else {
      const newUser = {
        ...selectedUser,
        id: users.length + 1,
      };
      setUsers([...users, newUser]);
    }
    onClose();
    toast({
      title: selectedUser?.id ? 'Usuário atualizado' : 'Usuário criado',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    return status === 'active' ? 'green' : 'red';
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor} overflow="hidden">
        <Box p={6}>
          <Flex justify="space-between" align="center" mb={8}>
            <Heading size="lg">Usuários</Heading>
            <Button
              leftIcon={<FiUserPlus />}
              colorScheme="blue"
              onClick={() => {
                setSelectedUser(null);
                onOpen();
              }}
            >
              Novo Usuário
            </Button>
          </Flex>

          <InputGroup mb={6}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Email</Th>
                  <Th>Função</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredUsers.map((user) => (
                  <Tr key={user.id} _hover={{ bg: hoverBg }}>
                    <Td>{user.name}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Badge colorScheme={user.role === 'admin' ? 'purple' : 'blue'}>
                        {user.role}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                        />
                        <MenuList>
                          <MenuItem icon={<FiEdit2 />} onClick={() => handleEdit(user)}>
                            Editar
                          </MenuItem>
                          <MenuItem icon={<FiTrash2 />} onClick={() => handleDelete(user.id)}>
                            Excluir
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSave}>
            <ModalHeader>
              {selectedUser?.id ? 'Editar Usuário' : 'Novo Usuário'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl mb={4}>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={selectedUser?.name || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  value={selectedUser?.email || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Função</FormLabel>
                <Select
                  value={selectedUser?.role || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                  required
                >
                  <option value="admin">Administrador</option>
                  <option value="manager">Gerente</option>
                  <option value="user">Usuário</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={selectedUser?.status || ''}
                  onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                  required
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </Select>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button colorScheme="blue" type="submit">
                Salvar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default Users;
