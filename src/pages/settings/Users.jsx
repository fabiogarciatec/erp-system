import React, { useState, useEffect } from 'react';
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
  VStack,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiMoreVertical, FiSearch, FiUserPlus } from 'react-icons/fi';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user: currentUser } = useAuth();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  // Buscar usuários e roles
  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // Primeiro busca todos os perfis
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Depois busca as roles separadamente para evitar problemas com joins nulos
      const { data: allRoles, error: rolesError } = await supabase
        .from('roles')
        .select('id, name, description');

      if (rolesError) throw rolesError;

      // Mapeia as roles para um objeto para fácil acesso
      const rolesMap = allRoles.reduce((acc, role) => {
        acc[role.id] = role;
        return acc;
      }, {});

      // Combina os perfis com suas roles
      const usersWithRoles = profiles.map(profile => ({
        ...profile,
        roles: profile.role_id ? rolesMap[profile.role_id] : null
      }));

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;

      setRoles(data || []);
    } catch (error) {
      console.error('Erro ao buscar roles:', error);
      toast({
        title: 'Erro ao carregar roles',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Usuário excluído',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      // Validações antes de salvar
      if (!selectedUser?.id) {
        throw new Error('ID do usuário não encontrado');
      }

      const updates = {
        full_name: selectedUser.full_name,
        status: selectedUser.status
      };

      // Só inclui role_id se ele for um UUID válido
      if (selectedUser.role_id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(selectedUser.role_id)) {
        updates.role_id = selectedUser.role_id;
      } else {
        throw new Error('Role inválida selecionada');
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', selectedUser.id);

      if (error) throw error;

      toast({
        title: 'Usuário atualizado',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      fetchUsers();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      toast({
        title: 'Erro ao salvar usuário',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'green';
      case 'inactive':
        return 'red';
      case 'suspended':
        return 'yellow';
      default:
        return 'gray';
    }
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
                    <Td>{user.full_name}</Td>
                    <Td>{user.email}</Td>
                    <Td>
                      <Badge colorScheme={user.roles?.name === 'admin' ? 'purple' : 'blue'}>
                        {user.roles?.name || 'Sem função'}
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
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    value={selectedUser?.full_name || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, full_name: e.target.value })}
                    required
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Função</FormLabel>
                  <Select
                    value={selectedUser?.role_id || ''}
                    onChange={(e) => setSelectedUser({ ...selectedUser, role_id: e.target.value })}
                    required
                  >
                    <option value="">Selecione uma função</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    value={selectedUser?.status || 'active'}
                    onChange={(e) => setSelectedUser({ ...selectedUser, status: e.target.value })}
                    required
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="suspended">Suspenso</option>
                  </Select>
                </FormControl>
              </VStack>
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
