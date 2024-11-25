import React from 'react'
import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Checkbox,
  Flex,
  Heading,
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
  Spacer,
  Spinner,
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
  const { user, reloadUserPermissions } = useAuth()
  const [roles, setRoles] = useState([])
  const [rolePermissions, setRolePermissions] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  // Busca as funções e permissões do banco
  const fetchRolesAndPermissions = async () => {
    try {
      setError(null)
      console.log('Buscando funções...')
      
      // Busca todas as funções
      const { data: rolesData, error: rolesError } = await supabase
        .from('roles')
        .select('*')
        .order('name')

      if (rolesError) {
        console.error('Erro ao buscar funções:', rolesError)
        throw rolesError
      }

      console.log('Funções encontradas:', rolesData)
      setRoles(rolesData)

      // Busca todas as permissões
      console.log('Buscando permissões...')
      const { data: permissionsData, error: permissionsError } = await supabase
        .from('role_permissions')
        .select('*')

      if (permissionsError) {
        console.error('Erro ao buscar permissões:', permissionsError)
        throw permissionsError
      }

      console.log('Permissões encontradas:', permissionsData)

      // Organiza as permissões por função
      const permissionsByRole = {}
      permissionsData.forEach((permission) => {
        if (!permissionsByRole[permission.role_id]) {
          permissionsByRole[permission.role_id] = {}
        }
        permissionsByRole[permission.role_id][permission.permission_key] = true
      })

      console.log('Permissões organizadas:', permissionsByRole)
      setRolePermissions(permissionsByRole)
    } catch (error) {
      console.error('Erro ao carregar funções e permissões:', error)
      setError(error.message)
      toast({
        title: 'Erro ao carregar funções e permissões',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRolesAndPermissions()
  }, [])

  // Atualiza uma permissão específica
  const handlePermissionChange = (roleId, module, permission) => {
    console.log('Alterando permissão:', { roleId, module, permission })
    setRolePermissions((prev) => {
      const newPermissions = { ...prev }
      const permissionKey = `${module}.${permission}`

      if (!newPermissions[roleId]) {
        newPermissions[roleId] = {}
      }

      newPermissions[roleId][permissionKey] = !newPermissions[roleId][permissionKey]
      console.log('Novas permissões:', newPermissions)
      return newPermissions
    })
  }

  // Salva todas as permissões atualizadas
  const handleSavePermissions = async () => {
    setSaving(true)
    try {
      setError(null)
      console.log('Iniciando salvamento de permissões...')

      // Prepara as novas permissões para inserção
      const newPermissions = []
      Object.entries(rolePermissions).forEach(([roleId, permissions]) => {
        // Pula o role_id 1 (admin)
        if (roleId !== '1') {
          Object.entries(permissions).forEach(([permissionKey, hasPermission]) => {
            if (hasPermission) {
              newPermissions.push({
                role_id: roleId,
                permission_key: permissionKey
              })
            }
          })
        }
      })

      console.log('Permissões preparadas para salvamento:', newPermissions)

      // Primeiro, remove todas as permissões existentes
      console.log('Removendo permissões antigas...')
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .neq('role_id', 1) // Não deleta permissões do admin

      if (deleteError) {
        console.error('Erro ao deletar permissões:', deleteError)
        throw deleteError
      }

      // Depois, insere as novas permissões
      if (newPermissions.length > 0) {
        console.log('Inserindo novas permissões...')
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(newPermissions)

        if (insertError) {
          console.error('Erro ao inserir permissões:', insertError)
          throw insertError
        }
      }

      // Recarrega as permissões do usuário atual
      if (reloadUserPermissions) {
        console.log('Recarregando permissões do usuário...')
        await reloadUserPermissions()
      }

      console.log('Permissões salvas com sucesso')
      toast({
        title: 'Permissões salvas',
        description: 'As permissões foram atualizadas com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      // Recarrega a lista de permissões
      await fetchRolesAndPermissions()
    } catch (error) {
      console.error('Erro ao salvar permissões:', error)
      setError(error.message)
      toast({
        title: 'Erro ao salvar permissões',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Flex justify="center" align="center" h="100vh">
        <Spinner size="xl" color="blue.500" />
      </Flex>
    )
  }

  if (error) {
    return (
      <Box p={4}>
        <Text color="red.500">Erro ao carregar permissões: {error}</Text>
      </Box>
    )
  }

  return (
    <Card>
      <CardHeader>
        <Flex align="center">
          <Heading size="md">Permissões por Função</Heading>
          <Spacer />
          <Button
            leftIcon={<Icon as={MdSave} />}
            colorScheme="blue"
            onClick={handleSavePermissions}
            isLoading={saving}
            loadingText="Salvando..."
          >
            Salvar Alterações
          </Button>
        </Flex>
      </CardHeader>

      <CardBody>
        <Box overflowX="auto">
          <Table>
            <Thead>
              <Tr>
                <Th>Módulo/Permissão</Th>
                {roles.map((role) => (
                  <Th key={role.id} textAlign="center">
                    {role.name}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {Object.entries(systemPermissions).map(([module, { label, permissions }]) => (
                <React.Fragment key={module}>
                  {/* Cabeçalho do módulo */}
                  <Tr>
                    <Td colSpan={roles.length + 1}>
                      <Text fontWeight="bold">{label}</Text>
                    </Td>
                  </Tr>
                  {/* Permissões do módulo */}
                  {Object.entries(permissions).map(([permission, description]) => (
                    <Tr key={`${module}.${permission}`}>
                      <Td pl={8}>{description}</Td>
                      {roles.map((role) => (
                        <Td key={role.id} textAlign="center">
                          <Checkbox
                            isChecked={
                              role.name === 'admin' ||
                              (rolePermissions[role.id]?.[`${module}.${permission}`] ?? false)
                            }
                            onChange={() => handlePermissionChange(role.id, module, permission)}
                            isDisabled={role.name === 'admin'} // Admin sempre tem todas as permissões
                          />
                        </Td>
                      ))}
                    </Tr>
                  ))}
                </React.Fragment>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  )
}
