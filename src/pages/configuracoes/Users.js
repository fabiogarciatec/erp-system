import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Container, Flex, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, IconButton, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, FormControl, FormLabel, Input, Select, VStack, Badge, useToast, useColorModeValue, } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
function Users() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
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
            if (error)
                throw error;
            setUsers(data || []);
        }
        catch (error) {
            toast({
                title: 'Erro ao carregar usuários',
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
    useEffect(() => {
        fetchUsers();
    }, [currentUser?.currentCompany?.id]);
    const handleAddUser = () => {
        setSelectedUser(null);
        onOpen();
    };
    const handleEditUser = (user) => {
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
            if (selectedUser) {
                // Update existing user
                const { error } = await supabase
                    .from('profiles')
                    .update({
                    full_name: formData.full_name,
                    role: formData.role,
                })
                    .eq('id', selectedUser.id);
                if (error)
                    throw error;
                toast({
                    title: 'Usuário atualizado',
                    description: 'As alterações foram salvas com sucesso.',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
            else {
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
                if (signUpError)
                    throw signUpError;
                if (!authData.user)
                    throw new Error('Erro ao criar usuário');
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
                    if (userCompanyError)
                        throw userCompanyError;
                    // Atribui a role padrão ao usuário
                    const { data: defaultRole, error: roleError } = await supabase
                        .from('roles')
                        .select('id')
                        .eq('name', 'user')
                        .single();
                    if (roleError)
                        throw roleError;
                    const { error: userRoleError } = await supabase
                        .from('user_roles')
                        .insert([{
                            user_id: authData.user.id,
                            role_id: defaultRole.id,
                            created_at: new Date().toISOString()
                        }]);
                    if (userRoleError)
                        throw userRoleError;
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
                    if (profileError)
                        throw profileError;
                    toast({
                        title: 'Usuário criado com sucesso',
                        description: 'Um email de confirmação foi enviado para ' + formData.email + '. O usuário precisa confirmar o email antes de fazer login.',
                        status: 'success',
                        duration: 5000,
                        isClosable: true,
                    });
                }
                catch (error) {
                    // Log do erro para diagnóstico
                    console.error('Erro ao criar relações do usuário:', error);
                    throw error;
                }
            }
            onClose();
            fetchUsers();
        }
        catch (error) {
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
    return (_jsxs(Container, { maxW: "container.xl", py: 5, children: [_jsxs(Flex, { justify: "space-between", align: "center", mb: 5, children: [_jsx(Heading, { size: "lg", children: "Usu\u00E1rios" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: handleAddUser, children: "Novo Usu\u00E1rio" })] }), _jsx(Box, { bg: bgColor, rounded: "lg", shadow: "sm", overflow: "hidden", children: _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Nome" }), _jsx(Th, { children: "Email" }), _jsx(Th, { children: "Fun\u00E7\u00E3o" }), _jsx(Th, { children: "Data de Cria\u00E7\u00E3o" }), _jsx(Th, { children: "A\u00E7\u00F5es" })] }) }), _jsx(Tbody, { children: users.map((user) => (_jsxs(Tr, { children: [_jsx(Td, { children: user.full_name || '-' }), _jsx(Td, { children: user.email }), _jsx(Td, { children: _jsx(Badge, { colorScheme: user.role === 'admin' ? 'red' : 'blue', children: user.role }) }), _jsx(Td, { children: new Date(user.created_at).toLocaleDateString() }), _jsxs(Td, { children: [_jsx(IconButton, { "aria-label": "Editar usu\u00E1rio", icon: _jsx(FiEdit2, {}), size: "sm", colorScheme: "blue", variant: "ghost", mr: 2, onClick: () => handleEditUser(user) }), _jsx(IconButton, { "aria-label": "Remover usu\u00E1rio", icon: _jsx(FiTrash2, {}), size: "sm", colorScheme: "red", variant: "ghost", onClick: () => handleDeleteUser(user.id) })] })] }, user.id))) })] }) }), _jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "md", children: [_jsx(ModalOverlay, {}), _jsx(ModalContent, { children: _jsxs("form", { onSubmit: (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.currentTarget);
                                handleSaveUser(Object.fromEntries(formData));
                            }, children: [_jsx(ModalHeader, { children: selectedUser ? 'Editar Usuário' : 'Novo Usuário' }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome Completo" }), _jsx(Input, { name: "full_name", defaultValue: selectedUser?.full_name || '' })] }), !selectedUser && (_jsxs(_Fragment, { children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Email" }), _jsx(Input, { name: "email", type: "email" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Senha" }), _jsx(Input, { name: "password", type: "password" })] })] })), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Fun\u00E7\u00E3o" }), _jsxs(Select, { name: "role", defaultValue: selectedUser?.role || 'user', children: [_jsx("option", { value: "user", children: "Usu\u00E1rio" }), _jsx("option", { value: "admin", children: "Administrador" }), _jsx("option", { value: "manager", children: "Gerente" })] })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Cancelar" }), _jsx(Button, { type: "submit", colorScheme: "blue", children: "Salvar" })] })] }) })] })] }));
}
export default Users;
