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
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import { supabase } from '../../services/supabase'
import DataTable from '../../components/DataTable'

export default function ProductList() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    sku: '',
  })

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name')

      if (error) throw error

      setProducts(data || [])
    } catch (error) {
      console.error('Erro ao buscar produtos:', error)
      toast({
        title: 'Erro ao carregar produtos',
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

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      sku: product.sku || '',
    })
    onOpen()
  }

  const handleDelete = async (product) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id)

      if (error) throw error

      toast({
        title: 'Produto excluído',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      fetchProducts()
    } catch (error) {
      console.error('Erro ao excluir produto:', error)
      toast({
        title: 'Erro ao excluir produto',
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
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      }

      if (selectedProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', selectedProduct.id)

        if (error) throw error

        toast({
          title: 'Produto atualizado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])

        if (error) throw error

        toast({
          title: 'Produto criado',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      }

      onClose()
      fetchProducts()
      setFormData({
        name: '',
        description: '',
        price: '',
        stock: '',
        sku: '',
      })
      setSelectedProduct(null)
    } catch (error) {
      console.error('Erro ao salvar produto:', error)
      toast({
        title: 'Erro ao salvar produto',
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

  const columns = [
    {
      header: 'Nome',
      accessor: 'name',
    },
    {
      header: 'SKU',
      accessor: 'sku',
    },
    {
      header: 'Preço',
      accessor: 'price',
      cell: (value) => formatCurrency(value),
    },
    {
      header: 'Estoque',
      accessor: 'stock',
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
            setSelectedProduct(null)
            setFormData({
              name: '',
              description: '',
              price: '',
              stock: '',
              sku: '',
            })
            onOpen()
          }}
        >
          Novo Produto
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={products}
        isLoading={loading}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedProduct ? 'Editar Produto' : 'Novo Produto'}
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
                  <Input
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>SKU</FormLabel>
                  <Input
                    name="sku"
                    value={formData.sku}
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
                  <FormLabel>Estoque</FormLabel>
                  <NumberInput
                    value={formData.stock}
                    onChange={(value) => handleNumberInputChange('stock', value)}
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
                  {selectedProduct ? 'Atualizar' : 'Criar'}
                </Button>
              </VStack>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
