import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button, Card, CardBody, CardHeader, Flex, FormControl, FormLabel, Heading, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, TableContainer, Tbody, Td, Th, Thead, Tr, VStack, useColorModeValue, useDisclosure, useToast, IconButton, HStack, Text, Icon, Tooltip, SimpleGrid } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiEdit2, FiTrash2, FiStar, FiUsers, FiUserCheck, FiUserPlus } from 'react-icons/fi';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/PageHeader';
function Users() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const toast = useToast();
    const { user: currentUser } = useAuth();
    // Theme hooks
    const bgColor = useColorModeValue('gray.50', 'gray.800');
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
        // Se o usuário atual não é Super Admin, não pode editar Super Admins
        if (isSuperAdmin(targetUser) && !isSuperAdmin(currentUser)) {
            return false;
        }
        return true;
    };
    // Função auxiliar para verificar se pode atribuir um papel
    const canAssignRole = (roleName) => {
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
            if (error)
                throw error;
            setRoles(data || []);
        }
        catch (error) {
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
            if (profilesError)
                throw profilesError;
            // Depois busca os papéis para cada usuário
            const usersWithRoles = await Promise.all(profilesData.map(async (profile) => {
                const { data: roleData, error: roleError } = await supabase
                    .from('user_roles')
                    .select(`
              roles (
                id,
                name
              )
            `)
                    .eq('user_id', profile.id);
                if (roleError)
                    throw roleError;
                return {
                    ...profile,
                    roles: roleData?.map(r => r.roles) || []
                };
            }));
            setUsers(usersWithRoles);
        }
        catch (error) {
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
        setSelectedUser(user);
        onOpen();
    };
    const handleDeleteUser = async (userId) => {
        try {
            const { error } = await supabase
                .from('profiles')
                .delete()
                .eq('id', userId);
            if (error)
                throw error;
            toast({
                title: 'Usuário removido',
                description: 'O usuário foi removido com sucesso.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
            fetchUsers();
        }
        catch (error) {
            toast({
                title: 'Erro ao remover usuário',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };
    const handleSaveUser = async (formData) => {
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
                if (updateError)
                    throw updateError;
                // Atualiza o papel do usuário
                if (formData.role) {
                    // Primeiro, busca o ID do papel selecionado
                    const { data: roleData, error: roleError } = await supabase
                        .from('roles')
                        .select('id')
                        .eq('name', formData.role)
                        .single();
                    if (roleError)
                        throw roleError;
                    // Remove papéis existentes
                    const { error: deleteRoleError } = await supabase
                        .from('user_roles')
                        .delete()
                        .eq('user_id', selectedUser.id);
                    if (deleteRoleError)
                        throw deleteRoleError;
                    // Adiciona o novo papel
                    const { error: insertRoleError } = await supabase
                        .from('user_roles')
                        .insert({
                        user_id: selectedUser.id,
                        role_id: roleData.id
                    });
                    if (insertRoleError)
                        throw insertRoleError;
                }
            }
            else {
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
                if (signUpError)
                    throw signUpError;
                if (!authData.user)
                    throw new Error('Erro ao criar usuário');
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
                if (profileError)
                    throw profileError;
                // Cria a relação entre usuário e empresa
                const { error: userCompanyError } = await supabase
                    .from('user_companies')
                    .insert({
                    user_id: authData.user.id,
                    company_id: currentUser?.company_id,
                    is_owner: false,
                    created_at: new Date().toISOString()
                });
                if (userCompanyError)
                    throw userCompanyError;
                // Atribui o papel ao novo usuário
                if (formData.role) {
                    // Busca o ID do papel selecionado
                    const { data: roleData, error: roleError } = await supabase
                        .from('roles')
                        .select('id')
                        .eq('name', formData.role)
                        .single();
                    if (roleError)
                        throw roleError;
                    // Adiciona o papel ao usuário
                    const { error: insertRoleError } = await supabase
                        .from('user_roles')
                        .insert({
                        user_id: authData.user.id,
                        role_id: roleData.id
                    });
                    if (insertRoleError)
                        throw insertRoleError;
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
        }
        catch (error) {
            console.error('Erro ao salvar usuário:', error.message);
            toast({
                title: 'Erro ao salvar usuário',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Usu\u00E1rios", subtitle: "Gerencie os usu\u00E1rios do sistema", icon: FiUsers, breadcrumbs: [
                    { label: "Configurações", href: "/configuracoes" },
                    { label: "Usuários", href: "/configuracoes/users" }
                ] }), _jsx(Box, { display: "flex", mt: "-10px", px: { base: 2, xl: 8 }, flexDirection: { base: "column", xl: "row" }, w: { base: "96vw", xl: "86vw" }, position: "relative", left: "50%", transform: "translateX(-50%)", children: _jsxs(VStack, { flex: "1", spacing: 6, align: "stretch", width: "100%", children: [_jsxs(SimpleGrid, { columns: { base: 1, md: 3 }, spacing: { base: 2, md: 4 }, mb: 4, children: [_jsx(Card, { children: _jsx(CardBody, { children: _jsxs(Flex, { align: "center", justify: "space-between", children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Total de Usu\u00E1rios" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: users.length })] }), _jsx(Icon, { as: FiUsers, boxSize: 8, color: "blue.500" })] }) }) }), _jsx(Card, { children: _jsx(CardBody, { children: _jsxs(Flex, { align: "center", justify: "space-between", children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Usu\u00E1rios Ativos" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: users.filter(user => user.is_active !== false).length })] }), _jsx(Icon, { as: FiUserCheck, boxSize: 8, color: "green.500" })] }) }) }), _jsx(Card, { children: _jsx(CardBody, { children: _jsxs(Flex, { align: "center", justify: "space-between", children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "sm", color: "gray.500", children: "Super Admins" }), _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: users.filter(user => user.roles?.some(role => role.name === 'Super Admin' || role.name === 'Admin')).length })] }), _jsx(Icon, { as: FiStar, boxSize: 8, color: "yellow.500" })] }) }) })] }), _jsx(Card, { bg: cardBg, borderColor: borderColor, borderWidth: "1px", shadow: "sm", mb: 4, children: _jsx(CardHeader, { children: _jsxs(Flex, { justifyContent: "space-between", alignItems: "center", children: [_jsx(Heading, { size: "md", children: "Lista de Usu\u00E1rios" }), currentUser && (_jsx(Button, { leftIcon: _jsx(Icon, { as: FiUserPlus }), colorScheme: "blue", onClick: handleAddUser, isLoading: loading, size: { base: "sm", md: "md" }, children: "Adicionar Usu\u00E1rio" }))] }) }) }), _jsx(TableContainer, { bg: cardBg, borderRadius: "lg", borderWidth: "1px", borderColor: borderColor, children: _jsxs(Table, { variant: "simple", size: { base: "sm", md: "md" }, children: [_jsx(Thead, { bg: theadBg, children: _jsxs(Tr, { children: [_jsx(Th, { children: "Nome" }), _jsx(Th, { display: { base: "none", md: "table-cell" }, children: "E-mail" }), _jsx(Th, { display: { base: "none", md: "table-cell" }, children: "Fun\u00E7\u00E3o" }), _jsx(Th, { display: { base: "none", md: "table-cell" }, children: "Data de Cadastro" }), _jsx(Th, { children: "A\u00E7\u00F5es" })] }) }), _jsx(Tbody, { children: users.map((user) => (_jsxs(Tr, { children: [_jsx(Td, { children: _jsxs(VStack, { align: "start", spacing: 1, children: [_jsx(Text, { children: user.full_name }), _jsx(Text, { fontSize: "sm", color: textColorSecondary, display: { base: "block", md: "none" }, children: user.email }), _jsx(Text, { fontSize: "sm", color: textColorSecondary, display: { base: "block", md: "none" }, children: user.roles?.map(role => role.name).join(', ') || '-' })] }) }), _jsx(Td, { display: { base: "none", md: "table-cell" }, children: user.email }), _jsx(Td, { display: { base: "none", md: "table-cell" }, children: user.roles?.map(role => role.name).join(', ') || '-' }), _jsx(Td, { display: { base: "none", md: "table-cell" }, children: new Date(user.created_at).toLocaleDateString('pt-BR') }), _jsx(Td, { children: _jsxs(HStack, { spacing: 2, justify: { base: "flex-start", md: "flex-end" }, children: [canEditUser(user) && (_jsx(Tooltip, { label: "Editar usu\u00E1rio", children: _jsx(IconButton, { "aria-label": "Editar usu\u00E1rio", icon: _jsx(FiEdit2, {}), size: { base: "sm", md: "sm" }, onClick: () => handleEditUser(user) }) })), isSuperAdmin(user) && (_jsx(Tooltip, { label: "Super Admin", children: _jsx(Box, { children: _jsx(Icon, { as: FiStar, color: "yellow.500" }) }) })), _jsx(Tooltip, { label: "Remover usu\u00E1rio", children: _jsx(IconButton, { "aria-label": "Remover usu\u00E1rio", icon: _jsx(FiTrash2, {}), size: { base: "sm", md: "sm" }, colorScheme: "red", onClick: () => handleDeleteUser(user.id) }) })] }) })] }, user.id))) })] }) }), _jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "md", children: [_jsx(ModalOverlay, {}), _jsx(ModalContent, { children: _jsxs("form", { onSubmit: (e) => {
                                            e.preventDefault();
                                            const formData = new FormData(e.currentTarget);
                                            handleSaveUser(Object.fromEntries(formData));
                                        }, children: [_jsx(ModalHeader, { children: selectedUser ? 'Editar Usuário' : 'Novo Usuário' }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome Completo" }), _jsx(Input, { name: "full_name", defaultValue: selectedUser?.full_name || '', placeholder: "Digite o nome completo" })] }), !selectedUser && (_jsxs(_Fragment, { children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "E-mail" }), _jsx(Input, { name: "email", type: "email", placeholder: "Digite o e-mail" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Senha" }), _jsx(Input, { name: "password", type: "password", placeholder: "Digite a senha" })] })] })), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Fun\u00E7\u00E3o" }), _jsxs(Select, { name: "role", defaultValue: selectedUser?.roles?.[0]?.name || '', children: [_jsx("option", { value: "", children: "Selecione uma fun\u00E7\u00E3o" }), roles.map(role => (canAssignRole(role.name) && (_jsx("option", { value: role.name, children: role.name }, role.id))))] })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Cancelar" }), _jsx(Button, { type: "submit", colorScheme: "blue", children: "Salvar" })] })] }) })] })] }) })] }));
}
export default Users;
