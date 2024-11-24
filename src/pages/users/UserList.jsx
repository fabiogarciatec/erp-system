import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Badge,
  Text,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Flex,
  Spacer,
} from '@chakra-ui/react'
import { MdAdd, MdSearch } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import DataTable from '../../components/DataTable'
import UserForm from './components/UserForm'
import UserActions from './components/UserActions'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'user',
    password: '',
  })

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users)
    } else {
      const query = searchQuery.toLowerCase()
      const filtered = users.filter(
        user =>
          user.full_name?.toLowerCase().includes(query) ||
          user.email?.toLowerCase().includes(query) ||
          user.role?.toLowerCase().includes(query)
      )
      setFilteredUsers(filtered)
    }
  }, [searchQuery, users])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data)
      setFilteredUsers(data)
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      toast({
        title: 'Erro ao carregar usuários',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEdit = (user) => {
    setSelectedUser(user)
    setFormData({
      email: user.email || '',
      full_name: user.full_name || '',
      role: user.role || 'user',
      password: '',
    })
    onOpen()
  }

  const handleDelete = async (user) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', user.id)

      if (error) throw error

      toast({
        title: 'Usuário excluído',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      fetchUsers()
    } catch (error) {
      console.error('Erro ao excluir usuário:', error)
      toast({
        title: 'Erro ao excluir usuário',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleResetPassword = async (user) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: 'Email de redefinição de senha enviado',
        description: 'O usuário receberá instruções por email',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Erro ao resetar senha:', error)
      toast({
        title: 'Erro ao resetar senha',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (selectedUser) {
        // Atualização
        const updateData = {
          full_name: formData.full_name,
          role: formData.role,
        }

        const { error } = await supabase
          .from('user_profiles')
          .update(updateData)
          .eq('id', selectedUser.id)

        if (error) throw error

        toast({
          title: 'Usuário atualizado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        // Criação
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        })

        if (authError) throw authError

        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert([
            {
              id: authData.user.id,
              email: formData.email,
              full_name: formData.full_name,
              role: formData.role,
            },
          ])

        if (profileError) throw profileError

        toast({
          title: 'Usuário criado',
          description: 'Um email de confirmação foi enviado.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }

      onClose()
      fetchUsers()
      setFormData({
        email: '',
        full_name: '',
        role: 'user',
        password: '',
      })
      setSelectedUser(null)
    } catch (error) {
      console.error('Erro ao salvar usuário:', error)
      toast({
        title: 'Erro ao salvar usuário',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const columns = [
    {
      header: 'Nome',
      accessor: 'full_name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Função',
      accessor: 'role',
      cell: (value) => (
        <Badge
          colorScheme={
            value === 'admin'
              ? 'red'
              : value === 'manager'
              ? 'purple'
              : 'blue'
          }
        >
          {value === 'admin'
            ? 'Administrador'
            : value === 'manager'
            ? 'Gerente'
            : 'Usuário'}
        </Badge>
      ),
    },
    {
      header: 'Ações',
      accessor: 'actions',
      cell: (_, row) => (
        <UserActions
          user={row}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onResetPassword={handleResetPassword}
        />
      ),
    },
  ]

  return (
    <Card>
      <CardHeader>
        <Flex alignItems="center">
          <Heading size="md">Usuários</Heading>
          <Spacer />
          <Button
            leftIcon={<MdAdd />}
            colorScheme="blue"
            onClick={() => {
              setSelectedUser(null)
              setFormData({
                email: '',
                full_name: '',
                role: 'user',
                password: '',
              })
              onOpen()
            }}
          >
            Novo Usuário
          </Button>
        </Flex>
      </CardHeader>

      <CardBody>
        <Box mb={4}>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <MdSearch />
            </InputLeftElement>
            <Input
              placeholder="Buscar usuários..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </Box>

        <DataTable
          columns={columns}
          data={filteredUsers}
          isLoading={loading}
        />

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <UserForm
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isEdit={!!selectedUser}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      </CardBody>
    </Card>
  )
}
