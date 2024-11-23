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
  Textarea,
  VStack,
  HStack,
  IconButton,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import DataTable from '../../components/DataTable'

export default function ServiceList() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedService, setSelectedService] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
    category: '',
  })

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('name')

      if (error) throw error

      setServices(data || [])
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
      toast({
        title: 'Erro ao carregar serviços',
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

  const handleNumberInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleEdit = (service) => {
    setSelectedService(service)
    setFormData({
      name: service.name || '',
      description: service.description || '',
      price: service.price || '',
      duration: service.duration || '',
      category: service.category || '',
    })
    onOpen()
  }

  const handleDelete = async (service) => {
    if (!window.confirm('Tem certeza que deseja excluir este serviço?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', service.id)

      if (error) throw error

      toast({
        title: 'Serviço excluído',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      fetchServices()
    } catch (error) {
      console.error('Erro ao excluir serviço:', error)
      toast({
        title: 'Erro ao excluir serviço',
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
      const serviceData = {
        ...formData,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
      }

      if (selectedService) {
        const { error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', selectedService.id)

        if (error) throw error

        toast({
          title: 'Serviço atualizado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        const { error } = await supabase
          .from('services')
          .insert([serviceData])

        if (error) throw error

        toast({
          title: 'Serviço criado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      onClose()
      fetchServices()
      setFormData({
        name: '',
        description: '',
        price: '',
        duration: '',
        category: '',
      })
      setSelectedService(null)
    } catch (error) {
      console.error('Erro ao salvar serviço:', error)
      toast({
        title: 'Erro ao salvar serviço',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    if (hours > 0) {
      return `${hours}h${remainingMinutes > 0 ? ` ${remainingMinutes}min` : ''}`
    }
    return `${minutes}min`
  }

  const columns = [
    {
      header: 'Nome',
      accessor: 'name',
    },
    {
      header: 'Categoria',
      accessor: 'category',
    },
    {
      header: 'Preço',
      accessor: 'price',
      cell: (value) => formatCurrency(value),
    },
    {
      header: 'Duração',
      accessor: 'duration',
      cell: (value) => formatDuration(value),
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
            setSelectedService(null)
            setFormData({
              name: '',
              description: '',
              price: '',
              duration: '',
              category: '',
            })
            onOpen()
          }}
        >
          Novo Serviço
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={services}
        isLoading={loading}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedService ? 'Editar Serviço' : 'Novo Serviço'}
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
                  <FormLabel>Categoria</FormLabel>
                  <Input
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Preço</FormLabel>
                  <NumberInput
                    value={formData.price}
                    onChange={(value) => handleNumberInputChange('price', value)}
                    min={0}
                    precision={2}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Duração (minutos)</FormLabel>
                  <NumberInput
                    value={formData.duration}
                    onChange={(value) => handleNumberInputChange('duration', value)}
                    min={0}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>

                <Button type="submit" colorScheme="blue" width="100%">
                  {selectedService ? 'Atualizar' : 'Criar'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
