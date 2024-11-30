import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
  VStack,
  HStack,
  Text,
  Badge,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Stack,
  Icon,
  InputGroup,
  InputLeftElement,
  Select,
  ButtonGroup,
  TableContainer,
  PageHeader, // Import PageHeader
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiTrash2, FiSearch, FiDownload } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { Product } from '../types/supabase';
import { useAuth } from '../contexts/AuthContext';
import { productService } from '../services/api';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const { usuario } = useAuth();

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await productService.getRecords();
      setProducts(data);
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

  const handleCreateProduct = async (formData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      if (!usuario.empresa_id) {
        throw new Error('Empresa não encontrada');
      }

      await productService.create({
        ...formData,
        empresa_id: usuario.empresa_id,
        created_by: usuario.id,
      });
      toast({
        title: 'Produto criado',
        description: 'O produto foi criado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      loadProducts();
      onClose();
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      toast({
        title: 'Erro ao criar produto',
        description: 'Ocorreu um erro ao criar o produto. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateProduct = async (id: string, formData: Partial<Product>) => {
    try {
      await productService.update(id, formData);
      toast({
        title: 'Produto atualizado',
        description: 'O produto foi atualizado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      loadProducts();
      onClose();
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      toast({
        title: 'Erro ao atualizar produto',
        description: 'Não foi possível atualizar o produto.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;

    try {
      await productService.delete(id);
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
        description: 'Não foi possível excluir o produto.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleExportProducts = async () => {
    // Implement export logic here
  };

  useEffect(() => {
    loadProducts();
  }, []);

  return (
    <Box w="100%">
      <PageHeader
        title="Produtos"
        subtitle="Gerencie seu catálogo de produtos"
        breadcrumbs={[
          { label: 'Cadastros', href: '/cadastros' },
          { label: 'Produtos', href: '/cadastros/produtos' }
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportProducts}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Novo Produto
            </Button>
          </Box>
        }
      />

      {/* Content */}
      <Box 
        mt="125px"
        px={6}
      >
        <Box maxW="1600px" mx="auto">
          <Flex justify="space-between" align="center" wrap="wrap" gap={4} mb={4}>
            <Text fontSize="2xl" fontWeight="bold">
              Produtos
            </Text>
          </Flex>

          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Nome</Th>
                  <Th>Código</Th>
                  <Th>Preço</Th>
                  <Th>Estoque</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product) => (
                  <Tr key={product.id}>
                    <Td>{product.nome}</Td>
                    <Td>{product.codigo || '-'}</Td>
                    <Td>R$ {product.preco.toFixed(2)}</Td>
                    <Td>
                      <HStack>
                        <Text>{product.estoque_atual}</Text>
                        {product.estoque_minimo !== null && product.estoque_atual <= product.estoque_minimo && (
                          <Badge colorScheme="red">Baixo</Badge>
                        )}
                      </HStack>
                    </Td>
                    <Td>
                      <Badge colorScheme={product.status === 'active' ? 'green' : 'red'}>
                        {product.status === 'active' ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <Button
                          size="sm"
                          leftIcon={<FiEdit2 />}
                          onClick={() => {
                            setSelectedProduct(product);
                            onOpen();
                          }}
                        >
                          Editar
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          leftIcon={<FiTrash2 />}
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Excluir
                        </Button>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      </Box>

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedProduct ? 'Editar Produto' : 'Novo Produto'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Nome</FormLabel>
                <Input
                  defaultValue={selectedProduct?.nome ?? ''}
                  placeholder="Nome do produto"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Código</FormLabel>
                <Input
                  defaultValue={selectedProduct?.codigo ?? ''}
                  placeholder="Código do produto"
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Preço</FormLabel>
                <NumberInput
                  defaultValue={selectedProduct?.preco ?? 0}
                  min={0}
                  precision={2}
                  step={0.01}
                >
                  <NumberInputField placeholder="Preço do produto" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Input
                  defaultValue={selectedProduct?.descricao ?? ''}
                  placeholder="Descrição do produto"
                />
              </FormControl>
              <FormControl>
                <FormLabel>Estoque Atual</FormLabel>
                <NumberInput
                  defaultValue={selectedProduct?.estoque_atual ?? 0}
                  min={0}
                  step={1}
                >
                  <NumberInputField placeholder="Quantidade em estoque" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <FormControl>
                <FormLabel>Estoque Mínimo</FormLabel>
                <NumberInput
                  defaultValue={selectedProduct?.estoque_minimo ?? 0}
                  min={0}
                  step={1}
                >
                  <NumberInputField placeholder="Quantidade mínima" />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue">
              {selectedProduct ? 'Salvar' : 'Criar'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
