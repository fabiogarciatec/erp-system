import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Heading,
  Text,
  Flex,
  Spacer,
  HStack,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  useToast,
  Badge,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Icon,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { MdAdd, MdSearch, MdEdit, MdDelete, MdLock } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../contexts/AuthContext'
import DataTable from '../../components/DataTable'
import UserForm from './components/UserForm'
import DeleteAlert from '../../components/DeleteAlert'
import { formatPhone, cleanPhone } from '../../utils/formatters'
import { usePermissions } from '../../hooks/usePermissions'

export default function UserList() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { user, userProfile } = useAuth()
  const { canCreateUsers, canEditUsers, canDeleteUsers, hasPermission } = usePermissions()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)
  const toast = useToast()

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    phone: '',
    role: 'user',
    status: 'active',
    password: '',
  })

  useEffect(() => {
    if (user && hasPermission('users.view')) {
      fetchUsers()
    }
  }, [user, hasPermission])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('full_name', { ascending: true })

      if (error) throw error

      setUsers(data || [])
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      toast({
        title: 'Erro ao buscar usuários',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const getRoleBadge = (role) => {
    const roles = {
      admin: { color: 'red', label: 'Administrador' },
      manager: { color: 'purple', label: 'Gerente' },
      sales: { color: 'green', label: 'Vendedor' },
      support: { color: 'blue', label: 'Suporte' },
      user: { color: 'gray', label: 'Usuário' },
    }
    return roles[role] || { color: 'gray', label: role }
  }

  const getStatusBadge = (status) => {
    const statuses = {
      active: { color: 'green', label: 'Ativo' },
      inactive: { color: 'gray', label: 'Inativo' },
      suspended: { color: 'yellow', label: 'Suspenso' },
      blocked: { color: 'red', label: 'Bloqueado' },
    }
    return statuses[status] || { color: 'gray', label: status }
  }

  const columns = [
    {
      header: 'Nome',
      accessorKey: 'full_name',
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Telefone',
      accessorKey: 'phone',
      cell: ({ value }) => formatPhone(value),
    },
    {
      header: 'Função',
      accessorKey: 'role',
      cell: ({ value }) => {
        const badge = getRoleBadge(value)
        return (
          <Badge colorScheme={badge.color} variant="subtle">
            {badge.label}
          </Badge>
        )
      },
    },
    {
      header: 'Status',
      accessorKey: 'status',
      cell: ({ value }) => {
        const badge = getStatusBadge(value)
        return (
          <Badge colorScheme={badge.color} variant="subtle">
            {badge.label}
          </Badge>
        )
      },
    },
    {
      header: 'Ações',
      accessorKey: 'actions',
      cell: ({ row }) => {
        return (
          <HStack spacing={2}>
            <Tooltip 
              label={canEditUsers ? "Editar usuário" : "Sem permissão para editar"} 
              placement="top"
            >
              <IconButton
                icon={<Icon as={MdEdit} boxSize={5} />}
                aria-label="Editar usuário"
                size="sm"
                colorScheme={canEditUsers ? "blue" : "gray"}
                variant="ghost"
                onClick={canEditUsers ? () => handleEdit(row.original) : undefined}
                cursor={canEditUsers ? "pointer" : "not-allowed"}
                opacity={canEditUsers ? 1 : 0.5}
                _hover={{
                  bg: canEditUsers ? "blue.50" : "transparent",
                  opacity: canEditUsers ? 0.8 : 0.5
                }}
              />
            </Tooltip>
            <Tooltip 
              label={canEditUsers ? "Redefinir senha" : "Sem permissão para redefinir senha"} 
              placement="top"
            >
              <IconButton
                icon={<Icon as={MdLock} boxSize={5} />}
                aria-label="Redefinir senha"
                size="sm"
                colorScheme={canEditUsers ? "purple" : "gray"}
                variant="ghost"
                onClick={canEditUsers ? () => handleResetPassword(row.original) : undefined}
                cursor={canEditUsers ? "pointer" : "not-allowed"}
                opacity={canEditUsers ? 1 : 0.5}
                _hover={{
                  bg: canEditUsers ? "purple.50" : "transparent",
                  opacity: canEditUsers ? 0.8 : 0.5
                }}
              />
            </Tooltip>
            <Tooltip 
              label={canDeleteUsers ? "Excluir usuário" : "Sem permissão para excluir"} 
              placement="top"
            >
              <IconButton
                icon={<Icon as={MdDelete} boxSize={5} />}
                aria-label="Excluir usuário"
                size="sm"
                colorScheme={canDeleteUsers ? "red" : "gray"}
                variant="ghost"
                onClick={canDeleteUsers ? () => handleDeleteClick(row.original) : undefined}
                cursor={canDeleteUsers ? "pointer" : "not-allowed"}
                opacity={canDeleteUsers ? 1 : 0.5}
                _hover={{
                  bg: canDeleteUsers ? "red.50" : "transparent",
                  opacity: canDeleteUsers ? 0.8 : 0.5
                }}
              />
            </Tooltip>
          </HStack>
        );
      },
    },
  ]

  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase()
    return (
      user.full_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower) ||
      (user.phone && user.phone.includes(searchQuery))
    )
  })

  const handleNewUser = () => {
    setSelectedUser(null)
    setFormData({
      email: '',
      full_name: '',
      phone: '',
      role: 'user',
      status: 'active',
      password: '',
    })
    onOpen()
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      ...user,
      password: '',
    })
    onOpen()
  }

  const handleDeleteClick = (user) => {
    setUserToDelete(user)
    setIsDeleteDialogOpen(true)
  }

  const handleResetPassword = async (user) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })
      
      if (error) throw error

      toast({
        title: 'Email enviado',
        description: 'Um email para redefinição de senha foi enviado para o usuário.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Erro ao enviar email de redefinição:', error)
      toast({
        title: 'Erro ao enviar email',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleDelete = async () => {
    if (!userToDelete?.id) {
      toast({
        title: 'Erro ao excluir usuário',
        description: 'ID do usuário não encontrado',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setLoading(true);

      // Verifica se é o último admin
      const { data: admins, error: adminsError } = await supabase
        .from('user_profiles')
        .select('id, role')
        .eq('role', 'admin');

      if (adminsError) throw adminsError;

      // Previne a exclusão se for o último admin
      if (userToDelete.role === 'admin' && admins.length === 1) {
        throw new Error('Não é possível excluir o último administrador do sistema');
      }

      // Previne auto-exclusão
      if (userToDelete.id === user.id) {
        throw new Error('Você não pode excluir sua própria conta');
      }

      // Remove o perfil do usuário
      const { error: deleteError } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', userToDelete.id);

      if (deleteError) throw deleteError;

      toast({
        title: 'Usuário excluído',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Limpa o telefone antes de enviar para o banco
    const cleanedFormData = {
      ...formData,
      phone: cleanPhone(formData.phone)
    }

    try {
      if (selectedUser) {
        // Atualizar usuário
        const { error } = await supabase
          .from('user_profiles')
          .update({
            full_name: cleanedFormData.full_name,
            phone: cleanedFormData.phone,
            role: cleanedFormData.role,
            status: cleanedFormData.status,
            updated_at: new Date(),
          })
          .eq('id', selectedUser.id)

        if (error) throw error

        toast({
          title: 'Usuário atualizado com sucesso',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        // Criar novo usuário
        const { data: { user }, error: signUpError } = await supabase.auth.signUp({
          email: cleanedFormData.email,
          password: cleanedFormData.password,
        })

        if (signUpError) throw signUpError

        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: user.id,
              company_id: userProfile.company_id,
              full_name: cleanedFormData.full_name,
              email: cleanedFormData.email,
              phone: cleanedFormData.phone,
              role: cleanedFormData.role,
              status: cleanedFormData.status,
            },
          ])

        if (profileError) throw profileError

        toast({
          title: 'Usuário criado com sucesso',
          description: 'Um email de confirmação foi enviado.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }

      onClose()
      fetchUsers()
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      toast({
        title: 'Erro ao salvar usuário',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <Flex align="center" gap={4}>
          <Box flex="1">
            <Heading size="md">Usuários</Heading>
            <Text color="gray.600" fontSize="sm">
              Gerencie os usuários da sua empresa
            </Text>
          </Box>
          <Flex mb={4} alignItems="center" gap={4}>
            <InputGroup maxW="800px">
              <InputLeftElement pointerEvents="none">
                <Icon as={MdSearch} color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Buscar usuários..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="md"
              />
            </InputGroup>
            <Tooltip 
              label={canCreateUsers ? "Adicionar novo usuário" : "Sem permissão para adicionar usuários"} 
              placement="top"
            >
              <Button
                leftIcon={<Icon as={MdAdd} boxSize={5} />}
                colorScheme={canCreateUsers ? "blue" : "gray"}
                onClick={canCreateUsers ? handleNewUser : undefined}
                cursor={canCreateUsers ? "pointer" : "not-allowed"}
                opacity={canCreateUsers ? 1 : 0.5}
                size="md"
                minW="180px"
                _hover={{
                  bg: canCreateUsers ? "blue.600" : "gray.100",
                  opacity: canCreateUsers ? 0.9 : 0.5
                }}
              >
                Adicionar Usuário
              </Button>
            </Tooltip>
          </Flex>
        </Flex>
      </CardHeader>

      <CardBody>
        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={loading}
        />
      </CardBody>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          onClose()
          setSelectedUser(null)
          setFormData({
            email: '',
            full_name: '',
            phone: '',
            role: 'user',
            status: 'active',
            password: '',
          })
        }}
        size="md"
        isCentered
      >
        <ModalOverlay
          bg="blackAlpha.300"
          backdropFilter="blur(10px)"
        />
        <ModalContent>
          <ModalHeader>
            <Flex alignItems="center" gap={2}>
              {selectedUser ? (
                <>
                  <MdEdit />
                  Editar Usuário
                </>
              ) : (
                <>
                  <MdAdd />
                  Adicionar Usuário
                </>
              )}
            </Flex>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <UserForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleSubmit={(e) => handleSubmit(e)}
              isEdit={!!selectedUser}
              isLoading={loading}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      <DeleteAlert
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setUserToDelete(null)
        }}
        onConfirm={handleDelete}
        title="Excluir Usuário"
        message={`Tem certeza que deseja excluir o usuário "${userToDelete?.full_name}"?`}
        isLoading={loading}
      />
    </Card>
  )
}
