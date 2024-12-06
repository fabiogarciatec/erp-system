import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Card, CardBody, Checkbox, Divider, FormControl, FormLabel, HStack, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Table, Tbody, Td, Text, Textarea, Th, Thead, Tr, VStack, useDisclosure, useToast, } from '@chakra-ui/react';
import { FiShield, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
import { useEffect, useState } from 'react';
import { permissionsService } from '@/services/permissions';
import { useAuth } from '@/contexts/AuthContext';
const RoleModal = ({ isOpen, onClose, role, onSave }) => {
    const [name, setName] = useState(role?.name || '');
    const [description, setDescription] = useState(role?.description || '');
    const [isLoading, setIsLoading] = useState(false);
    useEffect(() => {
        if (role) {
            setName(role.name);
            setDescription(role.description);
        }
        else {
            setName('');
            setDescription('');
        }
    }, [role]);
    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            await onSave({ name, description });
            onClose();
        }
        catch (error) {
            console.error('Error saving role:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsxs(Modal, { isOpen: isOpen, onClose: onClose, children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: role ? 'Editar Cargo' : 'Novo Cargo' }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Nome" }), _jsx(Input, { value: name, onChange: (e) => setName(e.target.value), placeholder: "Nome do cargo" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Descri\u00E7\u00E3o" }), _jsx(Textarea, { value: description, onChange: (e) => setDescription(e.target.value), placeholder: "Descri\u00E7\u00E3o do cargo" })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Cancelar" }), _jsx(Button, { colorScheme: "blue", onClick: handleSubmit, isLoading: isLoading, children: "Salvar" })] })] })] }));
};
export default function Permissions() {
    const { user } = useAuth();
    const toast = useToast();
    const [roles, setRoles] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [modules, setModules] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [rolePermissions, setRolePermissions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { isOpen: isRoleModalOpen, onOpen: onRoleModalOpen, onClose: onRoleModalClose, } = useDisclosure();
    const [editingRole, setEditingRole] = useState(null);
    useEffect(() => {
        loadData();
    }, [user]);
    const loadData = async () => {
        try {
            setIsLoading(true);
            const [rolesData, permissionsData, modulesData] = await Promise.all([
                permissionsService.getRoles(user?.company_id ?? null),
                permissionsService.getPermissions(user?.company_id ?? null),
                permissionsService.getPermissionModules(),
            ]);
            setRoles(rolesData);
            setPermissions(permissionsData);
            setModules(modulesData);
            if (selectedRole) {
                const rolePerms = await permissionsService.getRolePermissions(selectedRole.id);
                setRolePermissions(rolePerms || []); // Garantir que sempre temos um array
            }
        }
        catch (error) {
            console.error('Error loading data:', error);
            toast({
                title: 'Erro ao carregar dados',
                description: 'Ocorreu um erro ao carregar as permissões e cargos.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRoleSelect = async (roleId) => {
        const role = roles.find((r) => r.id === roleId);
        setSelectedRole(role || null);
        if (role) {
            try {
                const rolePerms = await permissionsService.getRolePermissions(role.id);
                setRolePermissions(rolePerms || []); // Garantir que sempre temos um array
            }
            catch (error) {
                console.error('Error loading role permissions:', error);
                toast({
                    title: 'Erro',
                    description: 'Não foi possível carregar as permissões do cargo.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                setRolePermissions([]); // Em caso de erro, limpar as permissões
            }
        }
        else {
            setRolePermissions([]);
        }
    };
    const handlePermissionToggle = async (permissionId) => {
        if (!selectedRole)
            return;
        try {
            if (rolePermissions.includes(permissionId)) {
                await permissionsService.removePermissionFromRole(selectedRole.id, permissionId);
                setRolePermissions(rolePermissions.filter((id) => id !== permissionId));
            }
            else {
                await permissionsService.addPermissionToRole(selectedRole.id, permissionId);
                setRolePermissions([...rolePermissions, permissionId]);
            }
        }
        catch (error) {
            console.error('Error toggling permission:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível atualizar as permissões do cargo.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    const handleCreateRole = async (roleData) => {
        try {
            const newRole = await permissionsService.createRole({
                ...roleData,
                company_id: user?.company_id ?? null,
                is_system_role: false,
            });
            setRoles([...roles, newRole]);
            toast({
                title: 'Sucesso',
                description: 'Cargo criado com sucesso.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error('Error creating role:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível criar o cargo.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    const handleUpdateRole = async (roleData) => {
        if (!editingRole)
            return;
        try {
            const updatedRole = await permissionsService.updateRole(editingRole.id, roleData);
            setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
            toast({
                title: 'Sucesso',
                description: 'Cargo atualizado com sucesso.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error('Error updating role:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível atualizar o cargo.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    const handleDeleteRole = async (roleId) => {
        if (!window.confirm('Tem certeza que deseja excluir este cargo?'))
            return;
        try {
            await permissionsService.deleteRole(roleId);
            setRoles(roles.filter((role) => role.id !== roleId));
            if (selectedRole?.id === roleId) {
                setSelectedRole(null);
                setRolePermissions([]);
            }
            toast({
                title: 'Sucesso',
                description: 'Cargo excluído com sucesso.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error('Error deleting role:', error);
            toast({
                title: 'Erro',
                description: 'Não foi possível excluir o cargo.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };
    const handleEditRole = (role) => {
        setEditingRole(role);
        onRoleModalOpen();
    };
    const handleRoleModalClose = () => {
        setEditingRole(null);
        onRoleModalClose();
    };
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Permiss\u00F5es", icon: FiShield, description: "Gerencie os cargos e permiss\u00F5es do sistema" }), _jsx(Box, { px: 8, children: _jsx(Card, { children: _jsxs(CardBody, { children: [_jsxs(HStack, { spacing: 4, mb: 4, children: [_jsxs(FormControl, { flex: 1, children: [_jsx(FormLabel, { children: "Cargo" }), _jsx(Select, { value: selectedRole?.id || '', onChange: (e) => handleRoleSelect(e.target.value), placeholder: "Selecione um cargo", children: roles.map((role) => (_jsx("option", { value: role.id, children: role.name }, role.id))) })] }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: () => {
                                            setEditingRole(null);
                                            onRoleModalOpen();
                                        }, alignSelf: "flex-end", children: "Novo Cargo" })] }), selectedRole && (_jsxs(HStack, { spacing: 2, mb: 4, children: [_jsx(IconButton, { "aria-label": "Editar cargo", icon: _jsx(FiEdit2, {}), size: "sm", onClick: () => handleEditRole(selectedRole) }), _jsx(IconButton, { "aria-label": "Excluir cargo", icon: _jsx(FiTrash2, {}), size: "sm", colorScheme: "red", onClick: () => handleDeleteRole(selectedRole.id), isDisabled: selectedRole.is_system_role })] })), _jsx(Divider, { my: 4 }), modules.map((module) => {
                                const modulePermissions = permissions.filter((p) => p.module === module.code);
                                if (modulePermissions.length === 0)
                                    return null;
                                return (_jsxs(Box, { mb: 6, children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", mb: 2, children: module.name }), _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Permiss\u00E3o" }), _jsx(Th, { children: "Descri\u00E7\u00E3o" }), _jsx(Th, { width: "100px", children: "Conceder" })] }) }), _jsx(Tbody, { children: modulePermissions.map((permission) => (_jsxs(Tr, { children: [_jsx(Td, { children: permission.name }), _jsx(Td, { children: permission.description }), _jsx(Td, { children: _jsx(Checkbox, { isChecked: rolePermissions.includes(permission.id), onChange: () => handlePermissionToggle(permission.id), isDisabled: !selectedRole || selectedRole.is_system_role }) })] }, permission.id))) })] })] }, module.id));
                            })] }) }) }), _jsx(RoleModal, { isOpen: isRoleModalOpen, onClose: handleRoleModalClose, role: editingRole ?? undefined, onSave: editingRole ? handleUpdateRole : handleCreateRole })] }));
}
