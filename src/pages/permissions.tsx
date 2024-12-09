import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Select,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Heading,
  useToast,
  Stack
} from '@chakra-ui/react';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { usePermissions } from '@/hooks/usePermissions';

interface Permission {
    id: string;
    code: string;
    name: string;
    module: string;
    description: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
}

interface RolePermission {
    role_id: string;
    permission_id: string;
}

const PermissionsPage: React.FC = () => {
    const { user } = useAuth();
    const { hasPermission } = usePermissions();
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);
    const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const toast = useToast();

    // Verifica se o usuário tem permissão para gerenciar permissões
    const canManagePermissions = 
        hasPermission('PERMISSIONS_ASSIGN') || 
        hasPermission('PERMISSIONS_REVOKE');

    // Carrega dados iniciais
    useEffect(() => {
        const loadData = async () => {
            if (!canManagePermissions) {
                toast({
                    title: 'Acesso Negado',
                    description: 'Você não tem permissão para acessar esta página',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                return;
            }

            try {
                setLoading(true);

                // Carrega permissões
                const { data: permsData, error: permsError } = await supabase
                    .from('permissions')
                    .select('*')
                    .order('module, name');

                if (permsError) throw permsError;

                // Carrega papéis
                const { data: rolesData, error: rolesError } = await supabase
                    .from('roles')
                    .select('*')
                    .order('name');

                if (rolesError) throw rolesError;

                setPermissions(permsData || []);
                setRoles(rolesData || []);

            } catch (error: any) {
                toast({
                    title: 'Erro ao carregar dados',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [canManagePermissions, toast]);

    // Carrega permissões do papel selecionado
    useEffect(() => {
        const loadRolePermissions = async () => {
            if (!selectedRole) return;

            try {
                const { data, error } = await supabase
                    .from('role_permissions')
                    .select('*')
                    .eq('role_id', selectedRole);

                if (error) throw error;
                setRolePermissions(data || []);

            } catch (error: any) {
                toast({
                    title: 'Erro ao carregar permissões do papel',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
                console.error(error);
            }
        };

        loadRolePermissions();
    }, [selectedRole, toast]);

    // Atualiza permissão do papel
    const handlePermissionChange = async (permission: Permission, checked: boolean) => {
        if (!selectedRole) {
            toast({
                title: 'Atenção',
                description: 'Selecione um papel primeiro',
                status: 'warning',
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            if (checked) {
                // Adiciona permissão
                const { error } = await supabase
                    .from('role_permissions')
                    .insert({
                        role_id: selectedRole,
                        permission_id: permission.id
                    });

                if (error) throw error;
                
                setRolePermissions([
                    ...rolePermissions,
                    { role_id: selectedRole, permission_id: permission.id }
                ]);
                
                toast({
                    title: 'Sucesso',
                    description: 'Permissão adicionada com sucesso',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            } else {
                // Remove permissão
                const { error } = await supabase
                    .from('role_permissions')
                    .delete()
                    .match({
                        role_id: selectedRole,
                        permission_id: permission.id
                    });

                if (error) throw error;
                
                setRolePermissions(
                    rolePermissions.filter(
                        rp => !(rp.role_id === selectedRole && rp.permission_id === permission.id)
                    )
                );
                
                toast({
                    title: 'Sucesso',
                    description: 'Permissão removida com sucesso',
                    status: 'success',
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (error: any) {
            toast({
                title: 'Erro ao atualizar permissão',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            console.error(error);
        }
    };

    // Agrupa permissões por módulo
    const groupedPermissions = permissions.reduce((acc, permission) => {
        if (!acc[permission.module]) {
            acc[permission.module] = [];
        }
        acc[permission.module].push(permission);
        return acc;
    }, {} as { [key: string]: Permission[] });

    if (!canManagePermissions) {
        return (
            <Box p={4}>
                <Card>
                    <CardHeader>
                        <Heading size="md">Acesso Negado</Heading>
                    </CardHeader>
                    <CardBody>
                        <Text>Você não tem permissão para acessar esta página.</Text>
                    </CardBody>
                </Card>
            </Box>
        );
    }

    return (
        <Box p={4}>
            <Stack spacing={4}>
                <Card>
                    <CardHeader>
                        <Heading size="md">Gerenciamento de Permissões</Heading>
                    </CardHeader>
                    <CardBody>
                        <Select
                            placeholder="Selecione um papel"
                            value={selectedRole || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => 
                                setSelectedRole(e.target.value || null)
                            }
                            mb={4}
                        >
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
                                </option>
                            ))}
                        </Select>
                    </CardBody>
                </Card>

                {Object.entries(groupedPermissions).map(([module, modulePermissions]) => (
                    <Card key={module}>
                        <CardHeader>
                            <Heading size="md">{module}</Heading>
                        </CardHeader>
                        <CardBody>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Nome</Th>
                                        <Th>Código</Th>
                                        <Th>Descrição</Th>
                                        <Th>Concedida</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {modulePermissions.map((permission) => (
                                        <Tr key={permission.id}>
                                            <Td>{permission.name}</Td>
                                            <Td>{permission.code}</Td>
                                            <Td>{permission.description}</Td>
                                            <Td>
                                                <Checkbox
                                                    isChecked={rolePermissions.some(
                                                        rp => rp.permission_id === permission.id
                                                    )}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                        handlePermissionChange(permission, e.target.checked)
                                                    }
                                                    isDisabled={!selectedRole}
                                                />
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </CardBody>
                    </Card>
                ))}
            </Stack>
        </Box>
    );
};

export default PermissionsPage;
