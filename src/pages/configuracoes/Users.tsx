import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
  Badge,
  IconButton,
  HStack,
  Text,
  Icon,
  Grid,
  GridItem,
  Tooltip,
  SimpleGrid,
  Stat,
  StatGroup,
  StatLabel,
  StatNumber
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiStar, FiUsers, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/PageHeader';

interface User {
  id: string;
  email: string;
  full_name: string | null;
  roles: any[];
  created_at: string;
  company_id: string | null;
  is_active: boolean;
}

function Users() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const toast = useToast();
  const { user: currentUser } = useAuth();

  // Theme hooks
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const textColorSecondary = useColorModeValue('gray.600', 'gray.400');
  const theadBg = useColorModeValue('gray.100', 'gray.600');

  // Função auxiliar para verificar se o usuário é Super Admin
  const isSuperAdmin = (user: any) => {
    return user?.roles?.some((role: any) => role.name === 'Super Admin');
  };

  // Função auxiliar para verificar se o usuário atual pode editar o usuário selecionado
  const canEditUser = (targetUser: any) => {
    // Se o usuário atual não é Super Admin, não pode editar Super Admins
    if (isSuperAdmin(targetUser) && !isSuperAdmin(currentUser)) {
      return false;
    }
    return true;
  };

  // Função auxiliar para verificar se pode atribuir um papel
  const canAssignRole = (roleName: string) => {
    // Apenas Super Admin pode atribuir papel de Super Admin
    if (roleName === 'Super Admin' && !isSuperAdmin(currentUser)) {
      return false;
    }
    return true;
  };

  // Função para buscar os papéis disponíveis
  const fetchRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data || []);
    } catch (error: any) {
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
      // Primeiro busca todos os perfis
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*');

      if (profilesError) throw profilesError;

      // Depois busca os papéis para cada usuário
      const usersWithRoles = await Promise.all(
        profilesData.map(async (profile) => {
          const { data: roleData, error: roleError } = await supabase
            .from('user_roles')
            .select(`
              roles (
                id,
                name
              )
            `)
            .eq('user_id', profile.id);

          if (roleError) throw roleError;

          return {
            ...profile,
            roles: roleData?.map(r => r.roles) || []
          };
        })
      );

      setUsers(usersWithRoles);
    } catch (error: any) {
      console.error('Erro ao buscar usuários:', error.message);
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    onOpen();
  };

  const handleEditUser = (user: any) => {
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
      // Verifica permissões antes de prosseguir
      if (selectedUser && !canEditUser(selectedUser)) {
        toast({
          title: 'Permissão negada',
          description: 'Apenas Super Admins podem modificar outros Super Admins',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Verifica se está tentando atribuir papel de Super Admin
      if (!canAssignRole(formData.role)) {
        toast({
          title: 'Permissão negada',
          description: 'Apenas Super Admins podem atribuir o papel de Super Admin',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      setLoading(true);

      if (selectedUser) {
        // Atualiza usuário existente
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            full_name: formData.full_name,
            email: formData.email,
            updated_at: new Date().toISOString(),
          })
          .eq('id', selectedUser.id);

        if (updateError) throw updateError;

        // Atualiza o papel do usuário
        if (formData.role) {
          // Primeiro, busca o ID do papel selecionado
          const { data: roleData, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('name', formData.role)
            .single();

          if (roleError) throw roleError;

          // Remove papéis existentes
          const { error: deleteRoleError } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', selectedUser.id);

          if (deleteRoleError) throw deleteRoleError;

          // Adiciona o novo papel
          const { error: insertRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: selectedUser.id,
              role_id: roleData.id
            });

          if (insertRoleError) throw insertRoleError;
        }
      } else {
        // Cria novo usuário via auth
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              full_name: formData.full_name,
            }
          }
        });

        if (signUpError) throw signUpError;
        if (!authData.user) throw new Error('Erro ao criar usuário');

        // Aguarda um momento para garantir que o trigger do Supabase criou o perfil
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Atualiza o perfil com a empresa atual
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            company_id: currentUser?.company_id,
            updated_at: new Date().toISOString()
          })
          .eq('id', authData.user.id);

        if (profileError) throw profileError;

        // Cria a relação entre usuário e empresa
        const { error: userCompanyError } = await supabase
          .from('user_companies')
          .insert({
            user_id: authData.user.id,
            company_id: currentUser?.company_id,
            is_owner: false,
            created_at: new Date().toISOString()
          });

        if (userCompanyError) throw userCompanyError;

        // Atribui o papel ao novo usuário
        if (formData.role) {
          // Busca o ID do papel selecionado
          const { data: roleData, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('name', formData.role)
            .single();

          if (roleError) throw roleError;

          // Adiciona o papel ao usuário
          const { error: insertRoleError } = await supabase
            .from('user_roles')
            .insert({
              user_id: authData.user.id,
              role_id: roleData.id
            });

          if (insertRoleError) throw insertRoleError;
        }
      }

      toast({
        title: 'Sucesso',
        description: `Usuário ${selectedUser ? 'atualizado' : 'criado'} com sucesso!`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      onClose();
      fetchUsers();
    } catch (error: any) {
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

  return (
    <Box>
      <PageHeader 
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
        icon={FiUsers}
        breadcrumbs={[
          { label: "Configurações", href: "/configuracoes" },
          { label: "Usuários", href: "/configuracoes/users" }
        ]}
      />

      <Box
        display="flex"
        mt="-10px"
        px={{ base: 2, xl: 8 }}
        flexDirection={{ base: "column", xl: "row" }}
        w={{ base: "96vw", xl: "86vw" }}
        position="relative"
        left="50%"
        transform="translateX(-50%)"
      >
        <VStack flex="1" spacing={6} align="stretch" width="100%">
          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 2, md: 4 }} mb={4}>
            <Card>
              <CardBody>
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text fontSize="sm" color="gray.500">Total de Usuários</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {users.length}
                    </Text>
                  </Box>
                  <Icon as={FiUsers} boxSize={8} color="blue.500" />
                </Flex>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text fontSize="sm" color="gray.500">Usuários Ativos</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {users.filter(user => user.is_active !== false).length}
                    </Text>
                  </Box>
                  <Icon as={FiUserCheck} boxSize={8} color="green.500" />
                </Flex>
              </CardBody>
            </Card>

            <Card>
              <CardBody>
                <Flex align="center" justify="space-between">
                  <Box>
                    <Text fontSize="sm" color="gray.500">Super Admins</Text>
                    <Text fontSize="2xl" fontWeight="bold">
                      {users.filter(user => 
                        user.roles?.some(role => 
                          role.name === 'Super Admin' || role.name === 'Admin'
                        )
                      ).length}
                    </Text>
                  </Box>
                  <Icon as={FiStar} boxSize={8} color="yellow.500" />
                </Flex>
              </CardBody>
            </Card>
          </SimpleGrid>

          {/* Bloco Adicionar Usuário */}
          <Card bg={cardBg} borderColor={borderColor} borderWidth="1px" shadow="sm" mb={4}>
            <CardHeader>
              <Flex justifyContent="space-between" alignItems="center">
                <Heading size="md">Lista de Usuários</Heading>
                {currentUser && (
                  <Button
                    leftIcon={<Icon as={FiUserPlus} />}
                    colorScheme="blue"
                    onClick={handleAddUser}
                    isLoading={loading}
                    size={{ base: "sm", md: "md" }}
                  >
                    Adicionar Usuário
                  </Button>
                )}
              </Flex>
            </CardHeader>
          </Card>

          {/* Tabela de Usuários */}
          <TableContainer bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <Table variant="simple" size={{ base: "sm", md: "md" }}>
              <Thead bg={theadBg}>
                <Tr>
                  <Th>Nome</Th>
                  <Th display={{ base: "none", md: "table-cell" }}>E-mail</Th>
                  <Th display={{ base: "none", md: "table-cell" }}>Função</Th>
                  <Th display={{ base: "none", md: "table-cell" }}>Data de Cadastro</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr key={user.id}>
                    <Td>
                      <VStack align="start" spacing={1}>
                        <Text>{user.full_name}</Text>
                        <Text
                          fontSize="sm"
                          color={textColorSecondary}
                          display={{ base: "block", md: "none" }}
                        >
                          {user.email}
                        </Text>
                        <Text
                          fontSize="sm"
                          color={textColorSecondary}
                          display={{ base: "block", md: "none" }}
                        >
                          {user.roles?.map(role => role.name).join(', ') || '-'}
                        </Text>
                      </VStack>
                    </Td>
                    <Td display={{ base: "none", md: "table-cell" }}>{user.email}</Td>
                    <Td display={{ base: "none", md: "table-cell" }}>{user.roles?.map(role => role.name).join(', ') || '-'}</Td>
                    <Td display={{ base: "none", md: "table-cell" }}>{new Date(user.created_at).toLocaleDateString('pt-BR')}</Td>
                    <Td>
                      <HStack spacing={2} justify={{ base: "flex-start", md: "flex-end" }}>
                        {canEditUser(user) && (
                          <Tooltip label="Editar usuário">
                            <IconButton
                              aria-label="Editar usuário"
                              icon={<FiEdit2 />}
                              size={{ base: "sm", md: "sm" }}
                              onClick={() => handleEditUser(user)}
                            />
                          </Tooltip>
                        )}
                        {isSuperAdmin(user) && (
                          <Tooltip label="Super Admin">
                            <Box>
                              <Icon as={FiStar} color="yellow.500" />
                            </Box>
                          </Tooltip>
                        )}
                        <Tooltip label="Remover usuário">
                          <IconButton
                            aria-label="Remover usuário"
                            icon={<FiTrash2 />}
                            size={{ base: "sm", md: "sm" }}
                            colorScheme="red"
                            onClick={() => handleDeleteUser(user.id)}
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

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
                        placeholder="Digite o nome completo"
                      />
                    </FormControl>

                    {!selectedUser && (
                      <>
                        <FormControl isRequired>
                          <FormLabel>E-mail</FormLabel>
                          <Input 
                            name="email" 
                            type="email" 
                            placeholder="Digite o e-mail"
                          />
                        </FormControl>

                        <FormControl isRequired>
                          <FormLabel>Senha</FormLabel>
                          <Input 
                            name="password" 
                            type="password" 
                            placeholder="Digite a senha"
                          />
                        </FormControl>
                      </>
                    )}

                    <FormControl isRequired>
                      <FormLabel>Função</FormLabel>
                      <Select
                        name="role"
                        defaultValue={selectedUser?.roles?.[0]?.name || ''}
                      >
                        <option value="">Selecione uma função</option>
                        {roles.map(role => (
                          canAssignRole(role.name) && (
                            <option key={role.id} value={role.name}>
                              {role.name}
                            </option>
                          )
                        ))}
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
        </VStack>
      </Box>
    </Box>
  );
}

export default Users;
