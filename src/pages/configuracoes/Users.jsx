import React, { useState, useEffect, useRef, forwardRef } from 'react';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  useDisclosure,
  useToast,
  IconButton,
  HStack,
  Text,
  Icon,
  Tooltip,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  ModalFooter,
  FormErrorMessage,
  Switch,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup
} from '@chakra-ui/react';
import { FiEdit2, FiTrash2, FiStar, FiUserPlus } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';
import { PageHeader } from '@/components/PageHeader';
import { useCompany } from '@/contexts/CompanyContext';

// Componente wrapper para o FiStar
const StarIcon = forwardRef((props, ref) => {
  return <Box ref={ref} as="span" display="inline-block"><FiStar {...props} /></Box>;
});

function Users() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    selectedRoles: [],
    is_active: true
  });
  const cancelRef = useRef();
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const { currentCompany } = useCompany();

  // Theme hooks
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const theadBg = useColorModeValue('gray.100', 'gray.600');

  // Função auxiliar para verificar se o usuário é Super Admin
  const isSuperAdmin = (user) => {
    return user?.roles?.some((role) => role.name === 'Super Admin');
  };

  // Função auxiliar para verificar se o usuário atual pode editar o usuário selecionado
  const canEditUser = (targetUser) => {
    if (isSuperAdmin(targetUser) && !isSuperAdmin(currentUser)) {
      return false;
    }
    return true;
  };

  // Função auxiliar para verificar se pode atribuir um papel
  const canAssignRole = (roleName) => {
    if (roleName === 'Super Admin' && !isSuperAdmin(currentUser)) {
      return false;
    }
    return true;
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
      console.error('Erro ao buscar papéis:', error.message);
      toast({
        title: 'Erro ao carregar papéis',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Primeiro buscar a empresa do usuário atual
      const { data: userCompany, error: companyError } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', currentUser.id)
        .single();

      if (companyError) throw companyError;

      if (!userCompany?.company_id) {
        console.warn('Nenhuma empresa encontrada para o usuário');
        return;
      }

      // Buscar usuários usando a função RPC
      const { data: usersData, error: usersError } = await supabase
        .rpc('get_users_with_emails', {
          company_id: userCompany.company_id
        });

      if (usersError) throw usersError;

      // Formatar os dados dos usuários
      const formattedUsers = (usersData || []).map(user => ({
        id: user.user_id,
        email: user.email || '',
        full_name: user.full_name || '',
        phone: user.phone || '',
        is_active: user.is_active,
        roles: Array.isArray(user.roles) ? user.roles : []
      }));

      setUsers(formattedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error.message);
      toast({
        title: 'Erro ao buscar usuários',
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
    fetchRoles();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      password: '',
      confirmPassword: '',
      selectedRoles: [],
      is_active: true
    });
    onOpen();
  };

  const handleEditUser = (user) => {
    if (!canEditUser(user)) {
      toast({
        title: 'Permissão negada',
        description: 'Apenas Super Admins podem modificar outros Super Admins',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // Extrair os IDs dos papéis
    const selectedRoles = user.roles?.map(role => role.role_id) || [];

    setFormData({
      email: user.email,
      full_name: user.full_name,
      phone: user.phone,
      selectedRoles,
      is_active: user.is_active
    });
    
    setSelectedUser(user);
    onOpen();
  };

  const handleDeleteClick = (user) => {
    if (!canEditUser(user)) {
      toast({
        title: 'Permissão negada',
        description: 'Apenas Super Admins podem excluir outros Super Admins',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setUserToDelete(user);
    setIsDeleteAlertOpen(true);
  };

  const handleDeleteUser = async (user) => {
    try {
      setLoading(true);

      // Buscar company_id do usuário atual
      const { data: userCompany, error: companyError } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', currentUser.id)
        .single();

      if (companyError) throw companyError;

      // Remover usuário da auth.users usando função RPC
      const { error: authError } = await supabase.rpc('delete_user', {
        user_id: user.id
      });

      if (authError) {
        console.error('Erro ao remover usuário do auth:', authError);
        // Continuar mesmo se falhar a remoção do auth
      }

      // Desativar o usuário na tabela profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_active: false,
          deleted_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Remover registro da tabela user_companies
      const { error: userCompanyError } = await supabase
        .from('user_companies')
        .delete()
        .eq('user_id', user.id)
        .eq('company_id', userCompany.company_id);

      if (userCompanyError) throw userCompanyError;

      // Remover todos os papéis do usuário
      const { error: deleteRolesError } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', user.id);

      if (deleteRolesError) throw deleteRolesError;

      toast({
        title: 'Usuário excluído com sucesso',
        description: 'O usuário foi removido completamente do sistema',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Atualizar a lista de usuários
      fetchUsers();
      
      // Fechar o popup de confirmação
      setIsDeleteAlertOpen(false);
      setUserToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error.message);
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    handleDeleteUser(userToDelete);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRoleChange = (roleId) => {
    setFormData(prev => ({
      ...prev,
      selectedRoles: [roleId] // Sempre será um array com apenas um item
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Buscar company_id do usuário atual
      const { data: userCompany, error: companyError } = await supabase
        .from('user_companies')
        .select('company_id')
        .eq('user_id', currentUser.id)
        .single();

      if (companyError) throw companyError;

      if (!userCompany?.company_id) {
        throw new Error('Empresa não encontrada');
      }

      if (selectedUser) {
        // Atualizar usuário existente
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            is_active: formData.is_active,
            updated_at: new Date().toISOString()
          })
          .eq('id', selectedUser.id);

        if (profileError) throw profileError;

        // Atualizar status na tabela user_companies
        const { error: userCompanyError } = await supabase
          .from('user_companies')
          .update({
            is_active: formData.is_active
          })
          .eq('user_id', selectedUser.id)
          .eq('company_id', userCompany.company_id);

        if (userCompanyError) throw userCompanyError;

        // Atualizar roles
        const { error: deleteRolesError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', selectedUser.id);

        if (deleteRolesError) throw deleteRolesError;

        if (formData.selectedRoles.length > 0) {
          const { error: insertRolesError } = await supabase
            .from('user_roles')
            .insert(
              formData.selectedRoles.map(roleId => ({
                user_id: selectedUser.id,
                role_id: roleId
              }))
            );

          if (insertRolesError) throw insertRolesError;
        }

        toast({
          title: 'Usuário atualizado com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Validar senha
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: 'Erro de validação',
            description: 'As senhas não coincidem',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        if (formData.password.length < 6) {
          toast({
            title: 'Erro de validação',
            description: 'A senha deve ter pelo menos 6 caracteres',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        // Criar novo usuário
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
            }
          }
        });

        if (authError) throw authError;

        // Atualizar perfil
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            phone: formData.phone,
            is_active: formData.is_active
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        // Criar registro na tabela user_companies
        const { error: userCompanyError } = await supabase
          .from('user_companies')
          .insert({
            user_id: authData.user.id,
            company_id: userCompany.company_id,
            is_active: formData.is_active
          });

        if (userCompanyError) throw userCompanyError;

        // Criar registros na tabela user_roles
        if (formData.selectedRoles.length > 0) {
          const { error: rolesError } = await supabase
            .from('user_roles')
            .insert(
              formData.selectedRoles.map(roleId => ({
                user_id: authData.user.id,
                role_id: roleId
              }))
            );

          if (rolesError) throw rolesError;
        }

        toast({
          title: 'Usuário criado com sucesso',
          description: 'O usuário pode fazer login com as credenciais fornecidas',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }

      onClose();
      fetchUsers();
    } catch (error) {
      console.error('Erro ao salvar usuário:', error.message);
      toast({
        title: 'Erro ao salvar usuário',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleNames = (user) => {
    if (!user.roles) return '-';
    return user.roles
      .map(ur => ur.role?.name)
      .join(', ') || '-';
  };

  return (
    <Box w="100%">
      <Box pt={{ base: "130px", md: "80px", xl: "80px" }}>
        <Card>
          <CardHeader>
            <HStack spacing={4} justify="space-between" w="100%">
              <Heading size="md">Lista de Usuários</Heading>
              <Button
                leftIcon={<FiUserPlus />}
                colorScheme="blue"
                onClick={handleAddUser}
              >
                Adicionar Usuário
              </Button>
            </HStack>
          </CardHeader>
          <TableContainer bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Email</Th>
                  <Th>Telefone</Th>
                  <Th>Status</Th>
                  <Th>Função</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user, index) => (
                  <Tr key={user.id}>
                    <Td>
                      <HStack>
                        <Text>{user.full_name}</Text>
                        {user.roles?.some(role => role.name === 'Super Admin') && (
                          <Tooltip label="Super Admin">
                            <span>
                              <StarIcon color="yellow.500" />
                            </span>
                          </Tooltip>
                        )}
                      </HStack>
                    </Td>
                    <Td>{user.email}</Td>
                    <Td>{user.phone}</Td>
                    <Td>
                      <Switch
                        isChecked={user.is_active}
                        isReadOnly
                        colorScheme="green"
                      />
                    </Td>
                    <Td>
                      {user.roles?.map(role => role.name).join(', ') || '-'}
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label={`Editar usuário ${user.full_name}`}
                          icon={<FiEdit2 />}
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          isDisabled={!canEditUser(user)}
                        />
                        <IconButton
                          aria-label={`Excluir usuário ${user.full_name}`}
                          icon={<FiTrash2 />}
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleDeleteClick(user)}
                          isDisabled={!canEditUser(user)}
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Card>

        <AlertDialog
          isOpen={isDeleteAlertOpen}
          leastDestructiveRef={cancelRef}
          onClose={() => setIsDeleteAlertOpen(false)}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader>
                Confirmar exclusão
              </AlertDialogHeader>
              <AlertDialogBody>
                Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={() => setIsDeleteAlertOpen(false)}>
                  Cancelar
                </Button>
                <Button colorScheme="red" onClick={confirmDelete} ml={3}>
                  Excluir
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>

        {/* Modal de Criar/Editar Usuário */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
            </ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody>
                <VStack spacing={4}>
                  {!selectedUser && (
                    <>
                      <FormControl isRequired>
                        <FormLabel>Email</FormLabel>
                        <Input
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Senha</FormLabel>
                        <Input
                          name="password"
                          type="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          placeholder="Mínimo 6 caracteres"
                        />
                      </FormControl>

                      <FormControl isRequired>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <Input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          placeholder="Digite a senha novamente"
                        />
                      </FormControl>
                    </>
                  )}

                  <FormControl isRequired>
                    <FormLabel>Nome Completo</FormLabel>
                    <Input
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Telefone</FormLabel>
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel>Função</FormLabel>
                    <RadioGroup
                      value={formData.selectedRoles[0] || ''}
                      onChange={handleRoleChange}
                    >
                      <VStack align="start">
                        {roles.map((role) => (
                          <Radio
                            key={role.id}
                            value={role.id}
                            isDisabled={!canAssignRole(role.name)}
                          >
                            {role.name}
                          </Radio>
                        ))}
                      </VStack>
                    </RadioGroup>
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">Ativo</FormLabel>
                    <Switch
                      name="is_active"
                      isChecked={formData.is_active}
                      onChange={(e) => {
                        const newValue = e.target.checked;
                        setFormData(prev => ({
                          ...prev,
                          is_active: newValue
                        }));
                      }}
                    />
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  colorScheme="blue"
                  type="submit"
                  isLoading={loading}
                >
                  {selectedUser ? 'Salvar' : 'Criar'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

export default Users;
