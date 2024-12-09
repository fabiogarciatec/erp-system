import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import {
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiUserPlus } from 'react-icons/fi';
import supabase from '@/lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { PostgrestError } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  role: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface Role {
  id: string;
  name: string;
}

interface SupabaseError {
  message: string;
}

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const { hasPermission } = usePermissions();

  const initialRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUsers(users || []);
    } catch (error: unknown) {
      console.error('Error fetching users:', error);
      const err = error as PostgrestError | Error;
      toast({
        title: 'Erro ao carregar usuários',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const fetchRoles = async () => {
    try {
      const { data: roles, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(roles || []);
    } catch (error: unknown) {
      console.error('Error fetching roles:', error);
      const err = error as PostgrestError | Error;
      toast({
        title: 'Erro ao carregar funções',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      const role = formData.get('role') as string;
      const active = formData.get('active') === 'true';

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            active,
          },
        },
      });

      if (error) throw error;

      toast({
        title: 'Usuário criado com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      fetchUsers();
      onClose();
    } catch (error: unknown) {
      console.error('Error creating user:', error);
      const err = error as PostgrestError | Error;
      toast({
        title: 'Erro ao criar usuário',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser) return;
    setIsLoading(true);

    try {
      const formData = new FormData(event.target as HTMLFormElement);
      const email = formData.get('email') as string;
      const role = formData.get('role') as string;
      const active = formData.get('active') === 'true';
      const password = formData.get('password') as string;

      if (password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password,
        });
        if (passwordError) throw passwordError;
      }

      const { error: updateError } = await supabase
        .from('users')
        .update({
          email,
          role,
          active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', selectedUser.id);

      if (updateError) throw updateError;

      toast({
        title: 'Usuário atualizado com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      fetchUsers();
      onClose();
    } catch (error: unknown) {
      console.error('Error updating user:', error);
      const err = error as PostgrestError | Error;
      toast({
        title: 'Erro ao atualizar usuário',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;

    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      if (error) throw error;

      toast({
        title: 'Usuário excluído com sucesso',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      fetchUsers();
    } catch (error: unknown) {
      console.error('Error deleting user:', error);
      const err = error as PostgrestError | Error;
      toast({
        title: 'Erro ao excluir usuário',
        description: err.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditing(true);
    onOpen();
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsEditing(false);
    onOpen();
  };

  const handleModalClose = () => {
    setSelectedUser(null);
    setIsEditing(false);
    onClose();
  };

  if (!hasPermission('users.view')) {
    return (
      <Box p={4}>
        <Text>Você não tem permissão para visualizar esta página.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Card>
        <CardHeader>
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">
              Usuários
            </Text>
            {hasPermission('users.create') && (
              <Button
                leftIcon={<FiUserPlus />}
                colorScheme="blue"
                onClick={handleAddUser}
              >
                Novo Usuário
              </Button>
            )}
          </HStack>
        </CardHeader>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Função</Th>
                <Th>Status</Th>
                <Th>Criado em</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user.id}>
                  <Td>{user.email}</Td>
                  <Td>{user.role}</Td>
                  <Td>
                    <Switch
                      isChecked={user.active}
                      isReadOnly
                      colorScheme="green"
                    />
                  </Td>
                  <Td>
                    {new Date(user.created_at).toLocaleDateString('pt-BR')}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      {hasPermission('users.update') && (
                        <Tooltip label="Editar">
                          <IconButton
                            aria-label="Editar usuário"
                            icon={<FiEdit2 />}
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          />
                        </Tooltip>
                      )}
                      {hasPermission('users.delete') && user.id !== currentUser?.id && (
                        <Tooltip label="Excluir">
                          <IconButton
                            aria-label="Excluir usuário"
                            icon={<FiTrash2 />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => handleDeleteUser(user.id)}
                          />
                        </Tooltip>
                      )}
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Card>

      <Modal
        initialFocusRef={initialRef}
        isOpen={isOpen}
        onClose={handleModalClose}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent as="form" onSubmit={isEditing ? handleUpdateUser : handleCreateUser}>
          <ModalHeader>
            {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  ref={initialRef}
                  name="email"
                  type="email"
                  defaultValue={selectedUser?.email}
                />
              </FormControl>
              <FormControl isRequired={!isEditing}>
                <FormLabel>Senha</FormLabel>
                <Input
                  name="password"
                  type="password"
                  placeholder={isEditing ? 'Deixe em branco para manter a senha atual' : ''}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Função</FormLabel>
                <select
                  name="role"
                  defaultValue={selectedUser?.role}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    borderRadius: '0.375rem',
                    border: '1px solid',
                    borderColor: 'inherit',
                  }}
                >
                  <option value="">Selecione uma função</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormControl display="flex" alignItems="center">
                <FormLabel htmlFor="active" mb="0">
                  Ativo
                </FormLabel>
                <Switch
                  id="active"
                  name="active"
                  defaultChecked={selectedUser?.active ?? true}
                  value="true"
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleModalClose}>
              Cancelar
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={isLoading}
            >
              {isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Users;
