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
  FormControl,
  FormLabel,
  Input,
  VStack,
  Select,
  HStack,
  IconButton,
  Badge,
} from '@chakra-ui/react'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import DataTable from '../../components/DataTable'

export default function UserList() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedUser, setSelectedUser] = useState(null)
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

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data)
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
      password: '', // Senha vazia para edição
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
          {value}
        </Badge>
      ),
    },
    {
      header: 'Ações',
      accessor: 'actions',
      cell: (_, row) => (
        <HStack spacing={2}>
          <IconButton
            icon={<MdEdit />}
            aria-label="Editar"
            size="sm"
            onClick={() => handleEdit(row)}
          />
          <IconButton
            icon={<MdDelete />}
            aria-label="Excluir"
            size="sm"
            colorScheme="red"
            onClick={() => handleDelete(row)}
          />
        </HStack>
      ),
    },
  ]

  return (
    <Box>
      <Box mb={4}>
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
      </Box>

      <DataTable
        columns={columns}
        data={users}
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
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome Completo</FormLabel>
                  <Input
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                  />
                </FormControl>

                {!selectedUser && (
                  <FormControl isRequired>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                )}

                {!selectedUser && (
                  <FormControl isRequired>
                    <FormLabel>Senha</FormLabel>
                    <Input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                  </FormControl>
                )}

                <FormControl>
                  <FormLabel>Função</FormLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="user">Usuário</option>
                    <option value="manager">Gerente</option>
                    <option value="admin">Administrador</option>
                  </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" width="100%">
                  {selectedUser ? 'Atualizar' : 'Criar'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
