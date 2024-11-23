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
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import DataTable from '../../components/DataTable'

export default function CustomerList() {
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name')

      if (error) throw error

      setCustomers(data || [])
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
      toast({
        title: 'Erro ao carregar clientes',
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

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
    })
    onOpen()
  }

  const handleDelete = async (customer) => {
    if (!window.confirm('Tem certeza que deseja excluir este cliente?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', customer.id)

      if (error) throw error

      toast({
        title: 'Cliente excluído',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      fetchCustomers()
    } catch (error) {
      console.error('Erro ao excluir cliente:', error)
      toast({
        title: 'Erro ao excluir cliente',
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
      if (selectedCustomer) {
        const { error } = await supabase
          .from('customers')
          .update(formData)
          .eq('id', selectedCustomer.id)

        if (error) throw error

        toast({
          title: 'Cliente atualizado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        const { error } = await supabase
          .from('customers')
          .insert([formData])

        if (error) throw error

        toast({
          title: 'Cliente criado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      onClose()
      fetchCustomers()
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
      })
      setSelectedCustomer(null)
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
      toast({
        title: 'Erro ao salvar cliente',
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
      accessor: 'name',
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Telefone',
      accessor: 'phone',
    },
    {
      header: 'Endereço',
      accessor: 'address',
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
            setSelectedCustomer(null)
            setFormData({
              name: '',
              email: '',
              phone: '',
              address: '',
            })
            onOpen()
          }}
        >
          Novo Cliente
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={customers}
        isLoading={loading}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCustomer ? 'Editar Cliente' : 'Novo Cliente'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Endereço</FormLabel>
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="100%">
                  {selectedCustomer ? 'Atualizar' : 'Criar'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
