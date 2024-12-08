import React, { useState, useEffect, useRef, forwardRef } from 'react';
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
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Flex,
  Center,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  Icon,
  Heading,
  SimpleGrid
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { FiEdit2, FiTrash2, FiStar, FiUserPlus, FiMoreVertical, FiUsers, FiUserCheck, FiUserX, FiShield } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';
import { PageHeader } from '@/components/PageHeader';
import { useCompany } from '@/contexts/CompanyContext';

// Componente wrapper para o FiStar
const StarIcon = forwardRef((props, ref) => {
  return <Box ref={ref} as="span" display="inline-block"><FiStar {...props} /></Box>;
});

function Users() {
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();
  const { isOpen: isNewOpen, onOpen: onNewOpen, onClose: onNewClose } = useDisclosure();
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
    selectedRole: '',
    is_active: true
  });
  const cancelRef = useRef();
  const toast = useToast();
  const { user: currentUser } = useAuth();
  const { currentCompany } = useCompany();

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

  // Função para aplicar máscara de telefone
  const applyPhoneMask = (value) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, '');
    
    // Aplica a máscara dependendo da quantidade de números
    if (numbers.length <= 10) { // Telefone fixo
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3').trim();
    } else { // Celular
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3').trim();
    }
  };

  // Função para limpar a máscara
  const clearPhoneMask = (value) => {
    return value.replace(/\D/g, '');
  };

  // Handler para mudança no campo de telefone
  const handlePhoneChange = (e) => {
    const maskedValue = applyPhoneMask(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: maskedValue
    }));
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
      
      // 1. Buscar perfis
      const { data: userData, error } = await supabase
        .from('profiles')
        .select('*')
        .is('deleted_at', null);
  
      if (error) throw error;
  
      // 2. Buscar papéis para os usuários
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          user_id,
          roles (
            id,
            name
          )
        `);
  
      if (rolesError) throw rolesError;
  
      // 3. Combinar os dados
      const formattedUsers = userData.map(user => ({
        ...user,
        phone: user.phone ? applyPhoneMask(user.phone) : '',
        roles: userRoles
          .filter(r => r.user_id === user.id)
          .map(r => r.roles)
      }));
  
      setUsers(formattedUsers);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      toast({
        title: 'Erro ao buscar usuários',
        description: error.message || 'Erro desconhecido',
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
      selectedRole: '',
      is_active: true
    });
    onNewOpen();
  };

  const handleEditUser = (user) => {
    if (!canEditUser(user)) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para editar este usuário.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setSelectedUser(user);
    setFormData({
      email: user.email,
      full_name: user.full_name,
      phone: user.phone ? applyPhoneMask(user.phone) : '',
      password: '',
      confirmPassword: '',
      selectedRole: user.roles?.[0]?.name || '',
      is_active: user.is_active
    });
    onEditOpen();
  };

  const handleDeleteClick = (user) => {
    if (!canEditUser(user)) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para excluir este usuário.',
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
      selectedRole: roleId
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    try {
      setLoading(true);

      // Validações básicas
      if (!formData.full_name || !formData.email) {
        toast({
          title: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos obrigatórios.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      // Se for novo usuário ou se senha foi fornecida, validar senha
      if (!selectedUser || formData.password) {
        if (formData.password !== formData.confirmPassword) {
          toast({
            title: 'Senhas não conferem',
            description: 'A senha e a confirmação devem ser iguais.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }

        if (!selectedUser && formData.password.length < 6) {
          toast({
            title: 'Senha muito curta',
            description: 'A senha deve ter no mínimo 6 caracteres.',
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          return;
        }
      }

      let userId = selectedUser?.id;

      // Se não for edição, criar novo usuário
      if (!selectedUser) {
        const { data, error: createError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (createError) throw createError;
        if (!data?.user?.id) throw new Error('Erro ao criar usuário: ID não gerado');
        
        userId = data.user.id;
      }

      // Atualizar perfil do usuário
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          email: formData.email,
          full_name: formData.full_name,
          phone: clearPhoneMask(formData.phone),
          is_active: formData.is_active,
          updated_at: new Date(),
        });

      if (profileError) throw profileError;

      // Buscar os IDs dos papéis selecionados
      const { data: selectedRoleId, error: rolesError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', formData.selectedRole)
        .single();

      if (rolesError) throw rolesError;

      // Remover papéis antigos se for edição
      if (selectedUser) {
        const { error: deleteError } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId);

        if (deleteError) throw deleteError;
      }

      // Inserir novo papel
      if (selectedRoleId) {
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role_id: selectedRoleId.id
          });

        if (insertError) throw insertError;
      }

      // Vincular usuário à empresa atual
      if (!selectedUser) {
        // Primeiro buscar company_id do usuário atual
        const { data: userCompany, error: companyError } = await supabase
          .from('user_companies')
          .select('company_id')
          .eq('user_id', currentUser.id)
          .single();

        if (companyError) throw companyError;
        if (!userCompany?.company_id) throw new Error('Empresa não encontrada');

        const { error: linkError } = await supabase
          .from('user_companies')
          .insert({
            user_id: userId,
            company_id: userCompany.company_id,
          });

        if (linkError) throw linkError;
      }

      toast({
        title: selectedUser ? 'Usuário atualizado' : 'Usuário criado',
        description: 'Operação realizada com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Fechar o modal apropriado
      if (selectedUser) {
        onEditClose();
      } else {
        onNewClose();
      }

      // Atualizar lista de usuários
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
    <Box h="100%" display="flex" flexDirection="column">
      <PageHeader 
        title="Usuários"
        subtitle="Gerencie os usuários do sistema"
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Usuários', href: '/configuracoes/users' }
        ]}
      />
      <Box 
        flex="1"
        mt={{ base: "0px", md: "4px" }}
        px={{ base: 4, md: 8 }}
        pb={{ base: 4, md: 8 }}
        display="flex"
        flexDirection="column"
      >
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={4} mb={6}>
          <Box
            bg="white"
            p={4}
            borderRadius="lg"
            shadow="sm"
            border="1px"
            borderColor="gray.100"
          >
            <HStack spacing={4}>
              <Icon as={FiUsers} boxSize={8} color="blue.500" />
              <Box>
                <Text color="gray.500" fontSize="sm">Total de Usuários</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {users.length}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box
            bg="white"
            p={4}
            borderRadius="lg"
            shadow="sm"
            border="1px"
            borderColor="gray.100"
          >
            <HStack spacing={4}>
              <Icon as={FiUserCheck} boxSize={8} color="green.500" />
              <Box>
                <Text color="gray.500" fontSize="sm">Usuários Ativos</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {users.filter(user => user.is_active).length}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box
            bg="white"
            p={4}
            borderRadius="lg"
            shadow="sm"
            border="1px"
            borderColor="gray.100"
          >
            <HStack spacing={4}>
              <Icon as={FiUserX} boxSize={8} color="red.500" />
              <Box>
                <Text color="gray.500" fontSize="sm">Usuários Inativos</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {users.filter(user => !user.is_active).length}
                </Text>
              </Box>
            </HStack>
          </Box>

          <Box
            bg="white"
            p={4}
            borderRadius="lg"
            shadow="sm"
            border="1px"
            borderColor="gray.100"
          >
            <HStack spacing={4}>
              <Icon as={FiShield} boxSize={8} color="purple.500" />
              <Box>
                <Text color="gray.500" fontSize="sm">Administradores</Text>
                <Text fontSize="2xl" fontWeight="bold">
                  {users.filter(user => user.roles?.some(role => role.name === 'admin')).length}
                </Text>
              </Box>
            </HStack>
          </Box>
        </SimpleGrid>

        <Flex 
          justify="flex-end" 
          align="center" 
          mb={4}
          gap={2}
          flexWrap="wrap"
        >
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            size="sm"
            onClick={handleAddUser}
            borderRadius="lg"
            _hover={{ transform: 'translateY(-1px)', shadow: 'md' }}
            transition="all 0.2s"
          >
            Novo Usuário
          </Button>
        </Flex>

        <Box 
          bg="white" 
          borderRadius="lg" 
          shadow="sm"
          overflow="hidden"
          border="1px"
          borderColor="gray.100"
        >
          {loading ? (
            <Center p={8}>
              <Spinner size="lg" color="blue.500" />
            </Center>
          ) : users.length === 0 ? (
            <Center p={8} flexDirection="column" gap={3}>
              <Icon as={FiUsers} boxSize={8} color="gray.400" />
              <Text color="gray.500">Nenhum usuário cadastrado</Text>
            </Center>
          ) : (
            <Table variant="simple" w="100%">
              <Thead bg="gray.50">
                <Tr>
                  <Th color="gray.600">Nome</Th>
                  <Th color="gray.600">Email</Th>
                  <Th color="gray.600" display={{ base: 'none', md: 'table-cell' }}>Telefone</Th>
                  <Th color="gray.600" display={{ base: 'none', md: 'table-cell' }}>Função</Th>
                  <Th color="gray.600" display={{ base: 'none', md: 'table-cell' }}>Status</Th>
                  <Th width="1%"></Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user) => (
                  <Tr 
                    key={user.id}
                    _hover={{ bg: 'gray.50' }}
                    transition="background 0.2s"
                  >
                    <Td>
                      <Text fontWeight="medium">{user.full_name}</Text>
                    </Td>
                    <Td>
                      <Text color="gray.600" fontSize="sm">{user.email}</Text>
                    </Td>
                    <Td display={{ base: 'none', md: 'table-cell' }}>
                      <Text color="gray.600" fontSize="sm">{user.phone}</Text>
                    </Td>
                    <Td display={{ base: 'none', md: 'table-cell' }}>
                      <HStack spacing={1}>
                        {user.roles?.map((role) => (
                          <Tag
                            key={role.id}
                            size="sm"
                            variant="subtle"
                            colorScheme={role.name === 'admin' ? 'purple' : 'blue'}
                          >
                            {role.name}
                          </Tag>
                        ))}
                      </HStack>
                    </Td>
                    <Td display={{ base: 'none', md: 'table-cell' }}>
                      <Tag
                        size="sm"
                        variant="subtle"
                        colorScheme={user.is_active ? 'green' : 'red'}
                      >
                        {user.is_active ? 'Ativo' : 'Inativo'}
                      </Tag>
                    </Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          as={IconButton}
                          icon={<FiMoreVertical />}
                          variant="ghost"
                          size="sm"
                          _hover={{ bg: 'gray.100' }}
                        />
                        <MenuList shadow="lg">
                          <MenuItem 
                            icon={<EditIcon />} 
                            onClick={() => handleEditUser(user)}
                            _hover={{ bg: 'gray.100' }}
                          >
                            Editar
                          </MenuItem>
                          <MenuItem 
                            icon={<DeleteIcon />} 
                            onClick={() => handleDeleteClick(user)}
                            color="red.500"
                            _hover={{ bg: 'red.50' }}
                          >
                            Excluir
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>

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

        {/* Modal de Novo Usuário */}
        <Modal isOpen={isNewOpen} onClose={onNewClose} size="xl">
          <ModalOverlay />
          <ModalContent mx={{ base: "8px", md: 0 }}>
            <ModalHeader>Novo Usuário</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome Completo</FormLabel>
                  <Input
                    placeholder="Digite o nome completo"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Digite o email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Senha</FormLabel>
                  <Input
                    type="password"
                    placeholder="Digite a senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Confirmar Senha</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirme a senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Função</FormLabel>
                  <RadioGroup
                    value={formData.selectedRole}
                    onChange={(value) => setFormData({ ...formData, selectedRole: value })}
                  >
                    <VStack align="start">
                      {roles.map((role) => (
                        <Radio
                          key={role.id}
                          value={role.name}
                          isDisabled={!canAssignRole(role.name)}
                        >
                          {role.name}
                        </Radio>
                      ))}
                    </VStack>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Switch
                    isChecked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onNewClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={loading}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Modal de Edição */}
        <Modal isOpen={isEditOpen} onClose={onEditClose} size="xl">
          <ModalOverlay />
          <ModalContent mx={{ base: "8px", md: 0 }}>
            <ModalHeader>Editar Usuário</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome Completo</FormLabel>
                  <Input
                    placeholder="Digite o nome completo"
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Digite o email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    maxLength={15}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Nova Senha (opcional)</FormLabel>
                  <Input
                    type="password"
                    placeholder="Digite a nova senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Confirmar Nova Senha</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirme a nova senha"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Função</FormLabel>
                  <RadioGroup
                    value={formData.selectedRole}
                    onChange={(value) => setFormData({ ...formData, selectedRole: value })}
                  >
                    <VStack align="start">
                      {roles.map((role) => (
                        <Radio
                          key={role.id}
                          value={role.name}
                          isDisabled={!canAssignRole(role.name)}
                        >
                          {role.name}
                        </Radio>
                      ))}
                    </VStack>
                  </RadioGroup>
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Switch
                    isChecked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={loading}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Box>
  );
}

export default Users;
