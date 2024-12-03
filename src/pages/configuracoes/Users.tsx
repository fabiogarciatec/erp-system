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
  Badge,
  useToast,
  useColorModeValue,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  company_id: string;
}

function Users() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('company_id', currentUser?.currentCompany?.id);

      if (error) throw error;
      setUsers(data || []);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentUser?.currentCompany?.id]);

  const handleAddUser = () => {
    setSelectedUser(null);
    onOpen();
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    onOpen();
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      toast({
        title: 'Usuário removido',
        description: 'O usuário foi removido com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      fetchUsers();
    } catch (error: any) {
      toast({
        title: 'Erro ao remover usuário',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleSaveUser = async (formData: any) => {
    try {
      if (selectedUser) {
        // Update existing user
        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            role: formData.role,
          })
          .eq('id', selectedUser.id);

        if (error) throw error;

        toast({
          title: 'Usuário atualizado',
          description: 'As alterações foram salvas com sucesso.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Create new user
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
              role: formData.role,
              company_id: currentUser?.currentCompany?.id,
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!authData.user) throw new Error('Erro ao criar usuário');

        // Aguarda um momento para garantir que o trigger do Supabase criou o perfil
        await new Promise(resolve => setTimeout(resolve, 2000));

        try {
          // Cria a relação entre usuário e empresa
          const { error: userCompanyError } = await supabase
            .from('user_companies')
            .insert([{
              user_id: authData.user.id,
              company_id: currentUser?.currentCompany?.id,
              is_owner: false,
              created_at: new Date().toISOString()
            }]);

          if (userCompanyError) throw userCompanyError;

          // Atribui a role padrão ao usuário
          const { data: defaultRole, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'user')
            .single();

          if (roleError) throw roleError;

          const { error: userRoleError } = await supabase
            .from('user_roles')
            .insert([{
              user_id: authData.user.id,
              role_id: defaultRole.id,
              created_at: new Date().toISOString()
            }]);

          if (userRoleError) throw userRoleError;

          // Atualiza o perfil
          const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
              id: authData.user.id,
              email: formData.email,
              full_name: formData.full_name,
              role: formData.role,
              company_id: currentUser?.currentCompany?.id,
              updated_at: new Date().toISOString()
            }, {
              onConflict: 'id'
            });

          if (profileError) throw profileError;

          toast({
            title: 'Usuário criado com sucesso',
            description: 'Um email de confirmação foi enviado para ' + formData.email + '. O usuário precisa confirmar o email antes de fazer login.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });

        } catch (error: any) {
          // Log do erro para diagnóstico
          console.error('Erro ao criar relações do usuário:', error);
          throw error;
        }
      }

      onClose();
      fetchUsers();
    } catch (error: any) {
      console.error('Erro completo:', error);
      toast({
        title: 'Erro ao salvar usuário',
        description: error.message || 'Ocorreu um erro ao salvar o usuário',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={5}>
      <Flex justify="space-between" align="center" mb={5}>
        <Heading size="lg">Usuários</Heading>
        <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={handleAddUser}>
          Novo Usuário
        </Button>
      </Flex>

      <Box bg={bgColor} rounded="lg" shadow="sm" overflow="hidden">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Email</Th>
              <Th>Função</Th>
              <Th>Data de Criação</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {users.map((user) => (
              <Tr key={user.id}>
                <Td>{user.full_name || '-'}</Td>
                <Td>{user.email}</Td>
                <Td>
                  <Badge colorScheme={user.role === 'admin' ? 'red' : 'blue'}>
                    {user.role}
                  </Badge>
                </Td>
                <Td>{new Date(user.created_at).toLocaleDateString()}</Td>
                <Td>
                  <IconButton
                    aria-label="Editar usuário"
                    icon={<FiEdit2 />}
                    size="sm"
                    colorScheme="blue"
                    variant="ghost"
                    mr={2}
                    onClick={() => handleEditUser(user)}
                  />
                  <IconButton
                    aria-label="Remover usuário"
                    icon={<FiTrash2 />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleDeleteUser(user.id)}
                  />
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.currentTarget);
              handleSaveUser(Object.fromEntries(formData));
            }}
          >
            <ModalHeader>
              {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome Completo</FormLabel>
                  <Input
                    name="full_name"
                    defaultValue={selectedUser?.full_name || ''}
                  />
                </FormControl>

                {!selectedUser && (
                  <>
                    <FormControl isRequired>
                      <FormLabel>Email</FormLabel>
                      <Input name="email" type="email" />
                    </FormControl>

                    <FormControl isRequired>
                      <FormLabel>Senha</FormLabel>
                      <Input name="password" type="password" />
                    </FormControl>
                  </>
                )}

                <FormControl isRequired>
                  <FormLabel>Função</FormLabel>
                  <Select
                    name="role"
                    defaultValue={selectedUser?.role || 'user'}
                  >
                    <option value="user">Usuário</option>
                    <option value="admin">Administrador</option>
                    <option value="manager">Gerente</option>
                  </Select>
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" colorScheme="blue">
                Salvar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
}

export default Users;
