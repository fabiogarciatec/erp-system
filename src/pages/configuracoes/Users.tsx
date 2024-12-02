import {
  Box,
  Container,
  Flex,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  HStack,
  Badge,
  Text,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  InputGroup,
  InputLeftElement,
  Checkbox,
  Stack,
  Tag,
  TagLabel,
  useColorModeValue,
  Divider,
} from '@chakra-ui/react';
import { useState } from 'react';
import {
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiMoreVertical,
  FiSearch,
  FiMail,
  FiLock,
  FiUser,
  FiUsers,
  FiShield,
  FiAlertCircle,
  FiCheck,
} from 'react-icons/fi';

interface Permission {
  id: string;
  name: string;
  description: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: 'active' | 'inactive';
  lastLogin?: string;
  avatar?: string;
  department?: string;
  phone?: string;
}

// Mock data
const mockPermissions: Permission[] = [
  { id: '1', name: 'read:users', description: 'Ver usuários' },
  { id: '2', name: 'write:users', description: 'Criar/Editar usuários' },
  { id: '3', name: 'delete:users', description: 'Remover usuários' },
  { id: '4', name: 'read:financial', description: 'Ver dados financeiros' },
  { id: '5', name: 'write:financial', description: 'Gerenciar dados financeiros' },
  { id: '6', name: 'read:inventory', description: 'Ver estoque' },
  { id: '7', name: 'write:inventory', description: 'Gerenciar estoque' },
  { id: '8', name: 'read:reports', description: 'Ver relatórios' },
  { id: '9', name: 'manage:settings', description: 'Gerenciar configurações' },
];

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Administrador',
    description: 'Acesso total ao sistema',
    permissions: mockPermissions,
  },
  {
    id: '2',
    name: 'Gerente',
    description: 'Acesso gerencial com algumas restrições',
    permissions: mockPermissions.filter((p) => !p.name.includes('delete')),
  },
  {
    id: '3',
    name: 'Usuário',
    description: 'Acesso básico ao sistema',
    permissions: mockPermissions.filter((p) => p.name.startsWith('read')),
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: mockRoles[0],
    status: 'active',
    lastLogin: '2024-01-20 15:30',
    department: 'TI',
    phone: '(11) 99999-9999',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john@example.com',
    role: mockRoles[1],
    status: 'active',
    lastLogin: '2024-01-19 10:15',
    department: 'Vendas',
    phone: '(11) 98888-8888',
  },
  {
    id: '3',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: mockRoles[2],
    status: 'inactive',
    lastLogin: '2024-01-15 08:45',
    department: 'Financeiro',
    phone: '(11) 97777-7777',
  },
];

function Users() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const toast = useToast();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const handleAddUser = () => {
    setSelectedUser(null);
    onOpen();
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDeleteUser = (userId: string) => {
    // Em produção, aqui seria feita a chamada à API
    setUsers(users.filter((user) => user.id !== userId));
    toast({
      title: 'Usuário removido',
      description: 'O usuário foi removido com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleSaveUser = () => {
    // Em produção, aqui seria feita a chamada à API
    toast({
      title: selectedUser ? 'Usuário atualizado' : 'Usuário criado',
      description: selectedUser
        ? 'As alterações foram salvas com sucesso.'
        : 'O novo usuário foi criado com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box height="100vh" overflow="hidden">
      <Flex direction="column" h="full">
        {/* Header */}
        <Box p={6} borderBottomWidth="1px" borderColor={borderColor} bg={bgColor}>
          <Flex justify="space-between" align="center">
            <Box>
              <Heading size="lg">Usuários</Heading>
              <Text color="gray.500" mt={1}>
                Gerencie os usuários e suas permissões
              </Text>
            </Box>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={handleAddUser}
              size="lg"
            >
              Novo Usuário
            </Button>
          </Flex>

          {/* Search Bar */}
          <InputGroup maxW="600px" mt={6}>
            <InputLeftElement pointerEvents="none">
              <FiSearch color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="Buscar por nome, email ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </InputGroup>
        </Box>

        {/* Table Container */}
        <Box overflowY="auto" flex="1" p={6}>
          <Table variant="simple" bg={bgColor} rounded="lg" shadow="sm">
            <Thead>
              <Tr>
                <Th>Usuário</Th>
                <Th>Cargo</Th>
                <Th>Departamento</Th>
                <Th>Status</Th>
                <Th>Último Acesso</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredUsers.map((user) => (
                <Tr key={user.id}>
                  <Td>
                    <HStack spacing={3}>
                      <Box
                        bg="gray.100"
                        w="40px"
                        h="40px"
                        rounded="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <FiUser size="20px" color="gray.600" />
                      </Box>
                      <Box>
                        <Text fontWeight="medium">{user.name}</Text>
                        <Text fontSize="sm" color="gray.500">
                          {user.email}
                        </Text>
                      </Box>
                    </HStack>
                  </Td>
                  <Td>
                    <Tag colorScheme="purple" size="md">
                      <TagLabel>{user.role.name}</TagLabel>
                    </Tag>
                  </Td>
                  <Td>{user.department}</Td>
                  <Td>
                    <Badge
                      colorScheme={user.status === 'active' ? 'green' : 'red'}
                      px={2}
                      py={1}
                      rounded="full"
                    >
                      {user.status === 'active' ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.500">
                      {user.lastLogin}
                    </Text>
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
                        <MenuItem
                          icon={<FiEdit2 />}
                          onClick={() => handleEditUser(user)}
                        >
                          Editar
                        </MenuItem>
                        <MenuItem
                          icon={<FiTrash2 />}
                          onClick={() => handleDeleteUser(user.id)}
                          color="red.500"
                        >
                          Remover
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>

      {/* Add/Edit User Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  placeholder="Digite o nome completo"
                  defaultValue={selectedUser?.name}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>E-mail</FormLabel>
                <Input
                  type="email"
                  placeholder="Digite o e-mail"
                  defaultValue={selectedUser?.email}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input
                  placeholder="Digite o telefone"
                  defaultValue={selectedUser?.phone}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Departamento</FormLabel>
                <Input
                  placeholder="Digite o departamento"
                  defaultValue={selectedUser?.department}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Cargo</FormLabel>
                <Select
                  placeholder="Selecione o cargo"
                  defaultValue={selectedUser?.role.id}
                >
                  {mockRoles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Status</FormLabel>
                <Select
                  placeholder="Selecione o status"
                  defaultValue={selectedUser?.status}
                >
                  <option value="active">Ativo</option>
                  <option value="inactive">Inativo</option>
                </Select>
              </FormControl>

              <Box w="full">
                <FormLabel>Permissões</FormLabel>
                <Box
                  maxH="200px"
                  overflowY="auto"
                  borderWidth="1px"
                  borderColor={borderColor}
                  rounded="md"
                  p={4}
                >
                  <Stack spacing={3}>
                    {mockPermissions.map((permission) => (
                      <Checkbox
                        key={permission.id}
                        defaultChecked={selectedUser?.role.permissions.some(
                          (p) => p.id === permission.id
                        )}
                      >
                        <Box>
                          <Text fontWeight="medium">{permission.description}</Text>
                          <Text fontSize="sm" color="gray.500">
                            {permission.name}
                          </Text>
                        </Box>
                      </Checkbox>
                    ))}
                  </Stack>
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSaveUser}>
              {selectedUser ? 'Salvar' : 'Criar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default Users;
