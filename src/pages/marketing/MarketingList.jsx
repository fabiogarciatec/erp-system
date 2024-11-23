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
  Select,
  Badge,
} from '@chakra-ui/react'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import DataTable from '../../components/DataTable'

export default function MarketingList() {
  const [campaigns, setCampaigns] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedCampaign, setSelectedCampaign] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    status: 'draft',
    start_date: '',
    end_date: '',
    target_audience: '',
    budget: '',
  })

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const fetchCampaigns = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('marketing_campaigns')
        .select('*')
        .order('start_date', { ascending: false })

      if (error) throw error

      setCampaigns(data || [])
    } catch (error) {
      console.error('Erro ao buscar campanhas:', error)
      toast({
        title: 'Erro ao carregar campanhas',
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

  const handleEdit = (campaign) => {
    setSelectedCampaign(campaign)
    setFormData({
      name: campaign.name || '',
      description: campaign.description || '',
      type: campaign.type || '',
      status: campaign.status || 'draft',
      start_date: campaign.start_date || '',
      end_date: campaign.end_date || '',
      target_audience: campaign.target_audience || '',
      budget: campaign.budget || '',
    })
    onOpen()
  }

  const handleDelete = async (campaign) => {
    if (!window.confirm('Tem certeza que deseja excluir esta campanha?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('marketing_campaigns')
        .delete()
        .eq('id', campaign.id)

      if (error) throw error

      toast({
        title: 'Campanha excluída',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      fetchCampaigns()
    } catch (error) {
      console.error('Erro ao excluir campanha:', error)
      toast({
        title: 'Erro ao excluir campanha',
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
      if (selectedCampaign) {
        const { error } = await supabase
          .from('marketing_campaigns')
          .update(formData)
          .eq('id', selectedCampaign.id)

        if (error) throw error

        toast({
          title: 'Campanha atualizada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        const { error } = await supabase
          .from('marketing_campaigns')
          .insert([formData])

        if (error) throw error

        toast({
          title: 'Campanha criada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      onClose()
      fetchCampaigns()
      setFormData({
        name: '',
        description: '',
        type: '',
        status: 'draft',
        start_date: '',
        end_date: '',
        target_audience: '',
        budget: '',
      })
      setSelectedCampaign(null)
    } catch (error) {
      console.error('Erro ao salvar campanha:', error)
      toast({
        title: 'Erro ao salvar campanha',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status) => {
    const statusColors = {
      draft: 'gray',
      active: 'green',
      paused: 'yellow',
      completed: 'blue',
      cancelled: 'red',
    }
    return statusColors[status] || 'gray'
  }

  const columns = [
    {
      header: 'Nome',
      accessor: 'name',
    },
    {
      header: 'Tipo',
      accessor: 'type',
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => (
        <Badge colorScheme={getStatusColor(value)}>
          {value.charAt(0).toUpperCase() + value.slice(1)}
        </Badge>
      ),
    },
    {
      header: 'Início',
      accessor: 'start_date',
      cell: (value) => formatDate(value),
    },
    {
      header: 'Fim',
      accessor: 'end_date',
      cell: (value) => formatDate(value),
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
            setSelectedCampaign(null)
            setFormData({
              name: '',
              description: '',
              type: '',
              status: 'draft',
              start_date: '',
              end_date: '',
              target_audience: '',
              budget: '',
            })
            onOpen()
          }}
        >
          Nova Campanha
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={campaigns}
        isLoading={loading}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedCampaign ? 'Editar Campanha' : 'Nova Campanha'}
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
                  <FormLabel>Descrição</FormLabel>
                  <Textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Tipo</FormLabel>
                  <Select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um tipo</option>
                    <option value="email">Email Marketing</option>
                    <option value="social_media">Redes Sociais</option>
                    <option value="ads">Anúncios</option>
                    <option value="content">Marketing de Conteúdo</option>
                    <option value="event">Eventos</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="draft">Rascunho</option>
                    <option value="active">Ativa</option>
                    <option value="paused">Pausada</option>
                    <option value="completed">Concluída</option>
                    <option value="cancelled">Cancelada</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Data de Início</FormLabel>
                  <Input
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Data de Término</FormLabel>
                  <Input
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Público-Alvo</FormLabel>
                  <Input
                    name="target_audience"
                    value={formData.target_audience}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Orçamento</FormLabel>
                  <Input
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <Button type="submit" colorScheme="blue" width="100%">
                  {selectedCampaign ? 'Atualizar' : 'Criar'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
