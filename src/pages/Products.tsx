import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
  Center,
  Text,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { FiEdit2, FiPlus, FiTrash2 } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';
import { useCompany } from '../contexts/CompanyContext';
import { Product } from '../types';

export function Products() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { createRecord, updateRecord, deleteRecord, getRecords, loading: companyLoading } = useCompany();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
  });

  const loadProducts = async () => {
    if (companyLoading) return;

    setLoading(true);
    try {
      const { data, error } = await getRecords<Product>('products', {
        orderBy: { column: 'name', ascending: true },
      });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      toast({
        title: 'Erro ao carregar produtos',
        description: 'Não foi possível carregar a lista de produtos.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [getRecords, toast, companyLoading]);

  if (companyLoading || loading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  const handleSubmit = async () => {
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock),
      };

      if (selectedProduct) {
        const { error } = await updateRecord<Product>(
          'products',
          selectedProduct.id,
          productData
        );
        if (error) throw error;
        toast({
          title: 'Produto atualizado',
          description: 'O produto foi atualizado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        const { error } = await createRecord<Product>('products', productData);
        if (error) throw error;
        toast({
          title: 'Produto criado',
          description: 'O produto foi criado com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }

      onClose();
      setFormData({ name: '', description: '', price: '', stock: '' });
      setSelectedProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      toast({
        title: 'Erro ao salvar produto',
        description: 'Ocorreu um erro ao salvar o produto. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock_quantity.toString(),
    });
    onOpen();
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      const { error } = await deleteRecord('products', id);
      if (error) throw error;

      toast({
        title: 'Produto excluído',
        description: 'O produto foi excluído com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      loadProducts();
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      toast({
        title: 'Erro ao excluir produto',
        description: 'Ocorreu um erro ao excluir o produto. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleNewProduct = () => {
    setSelectedProduct(null);
    setFormData({ name: '', description: '', price: '', stock: '' });
    onOpen();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <PageHeader title="Produtos" />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="blue"
          onClick={handleNewProduct}
          mb={6}
        >
          Novo Produto
        </Button>

        {products.length === 0 ? (
          <Center py={8}>
            <Text>Nenhum produto cadastrado.</Text>
          </Center>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Descrição</Th>
                <Th isNumeric>Preço</Th>
                <Th isNumeric>Estoque</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {products.map((product) => (
                <Tr key={product.id}>
                  <Td>{product.name}</Td>
                  <Td>{product.description}</Td>
                  <Td isNumeric>R$ {product.price.toFixed(2)}</Td>
                  <Td isNumeric>{product.stock_quantity}</Td>
                  <Td>
                    <Button
                      size="sm"
                      leftIcon={<FiEdit2 />}
                      variant="ghost"
                      colorScheme="blue"
                      onClick={() => handleEdit(product)}
                      mr={2}
                    >
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiTrash2 />}
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => handleDelete(product.id)}
                    >
                      Excluir
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedProduct ? 'Editar Produto' : 'Novo Produto'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Nome</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Input
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Preço</FormLabel>
                <Input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Estoque</FormLabel>
                <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: e.target.value })
                  }
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
