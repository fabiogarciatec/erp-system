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
  Select,
} from '@chakra-ui/react'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import DataTable from '../../components/DataTable'

export default function CompaniesList() {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postal_code: '',
    status: 'active',
  })

  useEffect(() => {
    fetchCompanies()
  }, [])

  const fetchCompanies = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('name')

      if (error) throw error

      setCompanies(data || [])
    } catch (error) {
      console.error('Erro ao buscar empresas:', error)
      toast({
        title: 'Erro ao carregar empresas',
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

  const handleEdit = (company) => {
    setSelectedCompany(company)
    setFormData({
      name: company.name || '',
      cnpj: company.cnpj || '',
      email: company.email || '',
      phone: company.phone || '',
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      postal_code: company.postal_code || '',
      status: company.status || 'active',
    })
    onOpen()
  }

  const handleDelete = async (company) => {
    if (!window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', company.id)

      if (error) throw error

      toast({
        title: 'Empresa excluída',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      fetchCompanies()
    } catch (error) {
      console.error('Erro ao excluir empresa:', error)
      toast({
        title: 'Erro ao excluir empresa',
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
      if (selectedCompany) {
        const { error } = await supabase
          .from('companies')
          .update(formData)
          .eq('id', selectedCompany.id)

        if (error) throw error

        toast({
          title: 'Empresa atualizada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        const { error } = await supabase
          .from('companies')
          .insert([formData])

        if (error) throw error

        toast({
          title: 'Empresa criada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      onClose()
      fetchCompanies()
      setFormData({
        name: '',
        cnpj: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        postal_code: '',
        status: 'active',
      })
      setSelectedCompany(null)
    } catch (error) {
      console.error('Erro ao salvar empresa:', error)
      toast({
        title: 'Erro ao salvar empresa',
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
      header: 'CNPJ',
      accessor: 'cnpj',
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
      header: 'Cidade',
      accessor: 'city',
    },
    {
      header: 'Estado',
      accessor: 'state',
    },
    {
      header: 'Status',
      accessor: 'status',
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
            setSelectedCompany(null)
            setFormData({
              name: '',
              cnpj: '',
              email: '',
              phone: '',
              address: '',
              city: '',
              state: '',
              postal_code: '',
              status: 'active',
            })
            onOpen()
          }}
        >
          Nova Empresa
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={companies}
        isLoading={loading}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCompany ? 'Editar Empresa' : 'Nova Empresa'}
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

                <FormControl isRequired>
                  <FormLabel>CNPJ</FormLabel>
                  <Input
                    name="cnpj"
                    value={formData.cnpj}
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

                <FormControl>
                  <FormLabel>Cidade</FormLabel>
                  <Input
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Estado</FormLabel>
                  <Input
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>CEP</FormLabel>
                  <Input
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="active">Ativa</option>
                    <option value="inactive">Inativa</option>
                    <option value="suspended">Suspensa</option>
                  </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" width="100%">
                  {selectedCompany ? 'Atualizar' : 'Criar'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
