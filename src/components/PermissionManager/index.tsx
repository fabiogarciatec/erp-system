import { useState, useEffect } from 'react';
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Checkbox,
  Select,
  Text,
  Heading,
  VStack,
  HStack,
  useToast
} from '@chakra-ui/react';
import supabase from '@/lib/supabase';
import { usePermissions } from '@/hooks/usePermissions';

interface Permission {
  id: string;
  code: string;
  name: string;
  module: string;
}

interface Role {
  id: string;
  name: string;
}

interface RolePermission {
  role_id: string;
  permission_id: string;
}

export const PermissionManager = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<RolePermission[]>([]);
  const [loading, setLoading] = useState(true);
  const { userPermissions } = usePermissions();
  const toast = useToast();

  // Verificar se o usuário tem permissão para gerenciar permissões
  const canManagePermissions = userPermissions.some(
    (p) => p.permissions.code === 'PERMISSIONS_ASSIGN' || p.permissions.code === 'PERMISSIONS_REVOKE'
  );

  useEffect(() => {
    loadRoles();
    loadPermissions();
  }, []);

  useEffect(() => {
    if (selectedRole) {
      loadRolePermissions();
    }
  }, [selectedRole]);

  const loadRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('name');

      if (error) throw error;
      setRoles(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar papéis',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const loadPermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .order('module, name');

      if (error) throw error;
      setPermissions(data);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar permissões',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const loadRolePermissions = async () => {
    try {
      const { data, error } = await supabase
        .from('role_permissions')
        .select('*')
        .eq('role_id', selectedRole);

      if (error) throw error;
      setRolePermissions(data);
      setLoading(false);
    } catch (error: any) {
      toast({
        title: 'Erro ao carregar permissões do papel',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handlePermissionChange = async (permission: Permission, checked: boolean) => {
    if (!canManagePermissions) {
      toast({
        title: 'Acesso negado',
        description: 'Você não tem permissão para gerenciar permissões',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      if (checked) {
        // Adicionar permissão
        const { error } = await supabase
          .from('role_permissions')
          .insert({
            role_id: selectedRole,
            permission_id: permission.id
          });

        if (error) throw error;
      } else {
        // Remover permissão
        const { error } = await supabase
          .from('role_permissions')
          .delete()
          .eq('role_id', selectedRole)
          .eq('permission_id', permission.id);

        if (error) throw error;
      }

      // Recarregar permissões do papel
      await loadRolePermissions();

      toast({
        title: 'Sucesso',
        description: checked ? 'Permissão adicionada' : 'Permissão removida',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar permissão',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const groupPermissionsByModule = () => {
    const grouped: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      if (!grouped[permission.module]) {
        grouped[permission.module] = [];
      }
      grouped[permission.module].push(permission);
    });
    return grouped;
  };

  if (!canManagePermissions) {
    return (
      <Box p={4}>
        <Text>Você não tem permissão para acessar esta página.</Text>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <VStack spacing={4} align="stretch">
        <Heading size="lg">Gerenciamento de Permissões</Heading>
        
        <Select
          placeholder="Selecione um papel"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          {roles.map((role) => (
            <option key={role.id} value={role.id}>
              {role.name}
            </option>
          ))}
        </Select>

        {selectedRole && !loading && (
          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Módulo</Th>
                  <Th>Permissão</Th>
                  <Th>Código</Th>
                  <Th>Concedida</Th>
                </Tr>
              </Thead>
              <Tbody>
                {Object.entries(groupPermissionsByModule()).map(([module, modulePermissions]) => (
                  <>
                    <Tr key={module}>
                      <Td colSpan={4} bg="gray.50" fontWeight="bold">
                        {module}
                      </Td>
                    </Tr>
                    {modulePermissions.map((permission) => (
                      <Tr key={permission.id}>
                        <Td></Td>
                        <Td>{permission.name}</Td>
                        <Td>{permission.code}</Td>
                        <Td>
                          <Checkbox
                            isChecked={rolePermissions.some(
                              (rp) => rp.permission_id === permission.id
                            )}
                            onChange={(e) =>
                              handlePermissionChange(permission, e.target.checked)
                            }
                          />
                        </Td>
                      </Tr>
                    ))}
                  </>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
