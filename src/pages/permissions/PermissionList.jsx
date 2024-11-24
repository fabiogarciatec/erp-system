import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Heading,
  HStack,
  Icon,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MdSave } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'

// Definição das permissões do sistema
const systemPermissions = {
  users: {
    label: 'Usuários',
    permissions: {
      view: 'Visualizar usuários',
      create: 'Criar usuários',
      edit: 'Editar usuários',
      delete: 'Excluir usuários',
    },
  },
  companies: {
    label: 'Empresas',
    permissions: {
      view: 'Visualizar empresas',
      create: 'Criar empresas',
      edit: 'Editar empresas',
      delete: 'Excluir empresas',
    },
  },
  products: {
    label: 'Produtos',
    permissions: {
      view: 'Visualizar produtos',
      create: 'Criar produtos',
      edit: 'Editar produtos',
      delete: 'Excluir produtos',
    },
  },
  sales: {
    label: 'Vendas',
    permissions: {
      view: 'Visualizar vendas',
      create: 'Criar vendas',
      edit: 'Editar vendas',
      delete: 'Excluir vendas',
    },
  },
  reports: {
    label: 'Relatórios',
    permissions: {
      view: 'Visualizar relatórios',
      create: 'Criar relatórios',
      export: 'Exportar relatórios',
    },
  },
}

export default function PermissionList() {
  const toast = useToast()
  const { userProfile } = useAuth()
  const [roles, setRoles] = useState([])
  const [rolePermissions, setRolePermissions] = useState({})
  const [loading, setLoading] = useState(false)

  // Busca as funções e permissões do banco
  const fetchRolesAndPermissions = async () => {
    try {
      // Busca todas as funções
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name')

      if (rolesError) throw rolesError

      setRoles(rolesData)

      // Busca todas as permissões
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('*')

      if (permissionsError) throw permissionsError

      // Organiza as permissões por função
      const permissionsByRole = {}
      permissionsData.forEach((permission) => {
        if (!permissionsByRole[permission.role_id]) {
          permissionsByRole[permission.role_id] = {}
        }
        permissionsByRole[permission.role_id][permission.permission_key] = true
      })

      setRolePermissions(permissionsByRole)
    } catch (error) {
      console.error('Erro ao carregar funções e permissões:', error)
      toast({
        title: 'Erro ao carregar funções e permissões',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  useEffect(() => {
    fetchRolesAndPermissions()
  }, [])

  // Atualiza uma permissão específica
  const handlePermissionChange = (roleId, module, permission) => {
    setRolePermissions((prev) => {
      const newPermissions = { ...prev }
      const permissionKey = `${module}.${permission}`

      if (!newPermissions[roleId]) {
        newPermissions[roleId] = {}
      }

      newPermissions[roleId][permissionKey] = !newPermissions[roleId][permissionKey]
      return newPermissions
    })
  }

  // Salva todas as permissões atualizadas
  const handleSavePermissions = async () => {
    setLoading(true)

    try {
      // Primeiro, remove todas as permissões existentes
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .neq('role_id', 0) // Não deleta permissões do superadmin

      if (deleteError) throw deleteError

      // Prepara as novas permissões para inserção
      const newPermissions = []
      Object.entries(rolePermissions).forEach(([roleId, permissions]) => {
        Object.entries(permissions).forEach(([permissionKey, hasPermission]) => {
          if (hasPermission) {
            newPermissions.push({
              role_id: roleId,
              permission_key: permissionKey,
            })
          }
        })
      })

      // Insere as novas permissões
      if (newPermissions.length > 0) {
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(newPermissions)

        if (insertError) throw insertError
      }

      toast({
        title: 'Permissões atualizadas com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Erro ao salvar permissões:', error)
      toast({
        title: 'Erro ao salvar permissões',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  // Verifica se uma permissão está marcada
  const isPermissionChecked = (roleId, module, permission) => {
    const permissionKey = `${module}.${permission}`
    return rolePermissions[roleId]?.[permissionKey] || false
  }

  return (
    <Card>
      <CardHeader>
        <Flex align="center" gap={4}>
          <Box flex="1">
            <Heading size="md">Permissões</Heading>
            <Text color="gray.600" fontSize="sm">
              Gerencie as permissões de acesso por função
            </Text>
          </Box>
          <Button
            leftIcon={<Icon as={MdSave} boxSize={5} />}
            colorScheme="blue"
            onClick={handleSavePermissions}
            isLoading={loading}
            loadingText="Salvando..."
          >
            Salvar Alterações
          </Button>
        </Flex>
      </CardHeader>

      <CardBody overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Módulo/Função</Th>
              {roles.map((role) => (
                <Th key={role.id} textAlign="center">
                  {role.display_name}
                </Th>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {Object.entries(systemPermissions).map(([module, { label, permissions }]) => (
              <>
                <Tr key={module} bg="gray.50">
                  <Td fontWeight="bold" colSpan={roles.length + 1}>
                    {label}
                  </Td>
                </Tr>
                {Object.entries(permissions).map(([permission, permissionLabel]) => (
                  <Tr key={`${module}-${permission}`}>
                    <Td pl={8}>{permissionLabel}</Td>
                    {roles.map((role) => (
                      <Td key={`${role.id}-${module}-${permission}`} textAlign="center">
                        <Checkbox
                          isChecked={isPermissionChecked(role.id, module, permission)}
                          onChange={() => handlePermissionChange(role.id, module, permission)}
                          isDisabled={role.name === 'admin'} // Admin sempre tem todas as permissões
                        />
                      </Td>
                    ))}
                  </Tr>
                ))}
              </>
            ))}
          </Tbody>
        </Table>
      </CardBody>
    </Card>
  )
}
