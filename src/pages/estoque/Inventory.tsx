import {
  Box,
  Container,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  VStack,
  FormControl,
  FormLabel,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Badge,
  IconButton,
  useToast,
  Select,
} from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiPackage, FiDownload } from 'react-icons/fi';
import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';

interface InventoryItem {
  id: string;
  product_name: string;
  sku: string;
  quantity: number;
  min_quantity: number;
  location: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const mockInventory: InventoryItem[] = [
  {
    id: '1',
    product_name: 'Produto A',
    sku: 'SKU001',
    quantity: 50,
    min_quantity: 10,
    location: 'Prateleira A1',
    status: 'in_stock',
  },
  {
    id: '2',
    product_name: 'Produto B',
    sku: 'SKU002',
    quantity: 5,
    min_quantity: 15,
    location: 'Prateleira B2',
    status: 'low_stock',
  },
];

export function Inventory() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [inventory] = useState<InventoryItem[]>(mockInventory);
  const toast = useToast();

  const getStatusColor = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock':
        return 'green';
      case 'low_stock':
        return 'yellow';
      case 'out_of_stock':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: InventoryItem['status']) => {
    switch (status) {
      case 'in_stock':
        return 'Em Estoque';
      case 'low_stock':
        return 'Estoque Baixo';
      case 'out_of_stock':
        return 'Sem Estoque';
      default:
        return status;
    }
  };

  const handleAdjustStock = () => {
    toast({
      title: 'Estoque ajustado',
      description: 'O estoque foi ajustado com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
    onClose();
  };

  const handleExportInventory = () => {
    // Implement export functionality
  };

  return (
    <Box w="100%">
      <PageHeader
        title="Inventário"
        subtitle="Gerencie seu estoque"
        breadcrumbs={[
          { label: 'Operações', href: '/operacoes' },
          { label: 'Inventário', href: '/operacoes/inventario' }
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportInventory}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Novo Item
            </Button>
          </Box>
        }
      />

      <Box mt="154px" px={6}>
        <Box maxW="1600px" mx="auto">
          <Box mb={4}>
            <HStack justify="space-between" mb={4}>
              <Text fontSize="2xl" fontWeight="bold">
                Controle de Estoque
              </Text>
            </HStack>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Produto</Th>
                  <Th>SKU</Th>
                  <Th isNumeric>Quantidade</Th>
                  <Th isNumeric>Mínimo</Th>
                  <Th>Localização</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {inventory.map((item) => (
                  <Tr key={item.id}>
                    <Td>{item.product_name}</Td>
                    <Td>{item.sku}</Td>
                    <Td isNumeric>{item.quantity}</Td>
                    <Td isNumeric>{item.min_quantity}</Td>
                    <Td>{item.location}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(item.status)}>
                        {getStatusText(item.status)}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack spacing={2}>
                        <IconButton
                          aria-label="Ajustar estoque"
                          icon={<FiEdit2 />}
                          size="sm"
                          colorScheme="blue"
                          variant="ghost"
                          onClick={onOpen}
                        />
                        <IconButton
                          aria-label="Ver movimentações"
                          icon={<FiPackage />}
                          size="sm"
                          colorScheme="green"
                          variant="ghost"
                        />
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajuste de Estoque</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Produto</FormLabel>
                <Select placeholder="Selecione o produto">
                  <option value="1">Produto A</option>
                  <option value="2">Produto B</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Tipo de Movimentação</FormLabel>
                <Select placeholder="Selecione o tipo">
                  <option value="in">Entrada</option>
                  <option value="out">Saída</option>
                  <option value="adjustment">Ajuste</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Quantidade</FormLabel>
                <NumberInput min={1}>
                  <NumberInputField />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>

              <FormControl>
                <FormLabel>Localização</FormLabel>
                <Input placeholder="Localização do produto" />
              </FormControl>

              <FormControl>
                <FormLabel>Observações</FormLabel>
                <Input placeholder="Observações sobre o ajuste" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={handleAdjustStock}>
              Confirmar Ajuste
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
