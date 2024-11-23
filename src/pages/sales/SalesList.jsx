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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import DataTable from '../../components/DataTable'

export default function SalesList() {
  const [sales, setSales] = useState([])
  const [customers, setCustomers] = useState([])
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSale, setSelectedSale] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [formData, setFormData] = useState({
    customer_id: '',
    date: new Date().toISOString().split('T')[0],
    total: '',
    status: 'pending',
    payment_method: '',
    items: [],
  })

  useEffect(() => {
    fetchSales()
    fetchCustomers()
    fetchProducts()
    fetchServices()
  }, [])

  const fetchSales = async () => {
    try {
      setLoading(true)
      // Primeiro, buscar as vendas com clientes
      const { data: salesData, error: salesError } = await supabase
        .from('sales')
        .select(`
          *,
          customer:customers (
            id,
            name
          )
        `)
        .order('date', { ascending: false })

      if (salesError) throw salesError

      // Depois, buscar os itens de cada venda separadamente
      const salesWithItems = await Promise.all(
        salesData.map(async (sale) => {
          const { data: itemsData, error: itemsError } = await supabase
            .from('sale_items')
            .select(`
              id,
              quantity,
              price,
              sale_id,
              product_id,
              service_id,
              product:products!product_id (
                id,
                name,
                price
              ),
              service:services!service_id (
                id,
                name,
                price
              )
            `)
            .eq('sale_id', sale.id)

          if (itemsError) throw itemsError

          return {
            ...sale,
            items: itemsData || []
          }
        })
      )

      setSales(salesWithItems)
    } catch (error) {
      console.error('Erro ao buscar vendas:', error)
      toast({
        title: 'Erro ao carregar vendas',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('id, name')
        .order('name')

      if (error) throw error

      setCustomers(data || [])
    } catch (error) {
      console.error('Erro ao buscar clientes:', error)
    }
  }

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price')
        .order('name')

      if (error) throw error

      setProducts(data || [])
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
    }
  }

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('id, name, price')
        .order('name')

      if (error) throw error

      setServices(data || [])
    } catch (error) {
      console.error('Erro ao buscar serviços:', error)
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

  const handleEdit = (sale) => {
    setSelectedSale(sale)
    setFormData({
      customer_id: sale.customer_id || '',
      date: sale.date || new Date().toISOString().split('T')[0],
      total: sale.total || '',
      status: sale.status || 'pending',
      payment_method: sale.payment_method || '',
      items: sale.items || [],
    })
    onOpen()
  }

  const handleDelete = async (sale) => {
    if (!window.confirm('Tem certeza que deseja excluir esta venda?')) {
      return
    }

    try {
      // Primeiro excluir os itens da venda
      const { error: itemsError } = await supabase
        .from('sale_items')
        .delete()
        .eq('sale_id', sale.id)

      if (itemsError) throw itemsError

      // Depois excluir a venda
      const { error } = await supabase
        .from('sales')
        .delete()
        .eq('id', sale.id)

      if (error) throw error

      toast({
        title: 'Venda excluída',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      fetchSales()
    } catch (error) {
      console.error('Erro ao excluir venda:', error)
      toast({
        title: 'Erro ao excluir venda',
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
      const saleData = {
        customer_id: formData.customer_id,
        date: formData.date,
        total: parseFloat(formData.total),
        status: formData.status,
        payment_method: formData.payment_method,
      }

      if (selectedSale) {
        // Atualizar venda
        const { error } = await supabase
          .from('sales')
          .update(saleData)
          .eq('id', selectedSale.id)

        if (error) throw error

        // Atualizar itens da venda
        // Primeiro excluir os itens existentes
        const { error: deleteError } = await supabase
          .from('sale_items')
          .delete()
          .eq('sale_id', selectedSale.id)

        if (deleteError) throw deleteError

        // Depois inserir os novos itens
        if (formData.items.length > 0) {
          const { error: itemsError } = await supabase
            .from('sale_items')
            .insert(
              formData.items.map((item) => ({
                ...item,
                sale_id: selectedSale.id,
              }))
            )

          if (itemsError) throw itemsError
        }

        toast({
          title: 'Venda atualizada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        // Criar nova venda
        const { data, error } = await supabase
          .from('sales')
          .insert([saleData])
          .select()

        if (error) throw error

        // Inserir itens da venda
        if (formData.items.length > 0) {
          const { error: itemsError } = await supabase
            .from('sale_items')
            .insert(
              formData.items.map((item) => ({
                ...item,
                sale_id: data[0].id,
              }))
            )

          if (itemsError) throw itemsError
        }

        toast({
          title: 'Venda criada',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      onClose()
      fetchSales()
      setFormData({
        customer_id: '',
        date: new Date().toISOString().split('T')[0],
        total: '',
        status: 'pending',
        payment_method: '',
        items: [],
      })
      setSelectedSale(null)
    } catch (error) {
      console.error('Erro ao salvar venda:', error)
      toast({
        title: 'Erro ao salvar venda',
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const columns = [
    {
      header: 'Data',
      accessor: 'date',
      cell: (value) => formatDate(value),
    },
    {
      header: 'Cliente',
      accessor: 'customer.name',
    },
    {
      header: 'Total',
      accessor: 'total',
      cell: (value) => formatCurrency(value),
    },
    {
      header: 'Status',
      accessor: 'status',
      cell: (value) => {
        const statusMap = {
          pending: 'Pendente',
          completed: 'Concluída',
          cancelled: 'Cancelada',
        }
        return statusMap[value] || value
      },
    },
    {
      header: 'Forma de Pagamento',
      accessor: 'payment_method',
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
            setSelectedSale(null)
            setFormData({
              customer_id: '',
              date: new Date().toISOString().split('T')[0],
              total: '',
              status: 'pending',
              payment_method: '',
              items: [],
            })
            onOpen()
          }}
        >
          Nova Venda
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={sales}
        isLoading={loading}
      />

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedSale ? 'Editar Venda' : 'Nova Venda'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Cliente</FormLabel>
                  <Select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Data</FormLabel>
                  <Input
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Total</FormLabel>
                  <NumberInput
                    value={formData.total}
                    onChange={(value) => handleNumberInputChange('total', value)}
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
                  <FormLabel>Status</FormLabel>
                  <Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="pending">Pendente</option>
                    <option value="completed">Concluída</option>
                    <option value="cancelled">Cancelada</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Forma de Pagamento</FormLabel>
                  <Select
                    name="payment_method"
                    value={formData.payment_method}
                    onChange={handleInputChange}
                  >
                    <option value="">Selecione uma forma de pagamento</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                    <option value="cash">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="bank_transfer">Transferência Bancária</option>
                  </Select>
                </FormControl>

                <Button type="submit" colorScheme="blue" width="100%">
                  {selectedSale ? 'Atualizar' : 'Criar'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
