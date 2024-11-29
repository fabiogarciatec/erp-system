import {
  Box,
  Container,
  Text,
  HStack,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
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
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';

// Tipos mockados - mover para types/supabase.ts depois
interface Sale {
  id: string;
  customer_name: string;
  date: string;
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
  payment_method: string;
}

const mockSales: Sale[] = [
  {
    id: '1',
    customer_name: 'João Silva',
    date: '2024-03-10',
    total: 1500.00,
    status: 'completed',
    payment_method: 'credit_card',
  },
  {
    id: '2',
    customer_name: 'Empresa XYZ',
    date: '2024-03-09',
    total: 3200.50,
    status: 'pending',
    payment_method: 'bank_transfer',
  },
];

export function Sales() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [sales] = useState<Sale[]>(mockSales);

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={4}>
        <HStack justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Vendas
          </Text>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={onOpen}
          >
            Nova Venda
          </Button>
        </HStack>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Cliente</Th>
              <Th>Data</Th>
              <Th isNumeric>Total</Th>
              <Th>Forma de Pagamento</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {sales.map((sale) => (
              <Tr key={sale.id}>
                <Td>{sale.customer_name}</Td>
                <Td>{new Date(sale.date).toLocaleDateString()}</Td>
                <Td isNumeric>R$ {sale.total.toFixed(2)}</Td>
                <Td>
                  {sale.payment_method === 'credit_card' ? 'Cartão de Crédito' : 'Transferência'}
                </Td>
                <Td>
                  <Badge
                    colorScheme={
                      sale.status === 'completed'
                        ? 'green'
                        : sale.status === 'pending'
                        ? 'yellow'
                        : 'red'
                    }
                  >
                    {sale.status === 'completed'
                      ? 'Concluída'
                      : sale.status === 'pending'
                      ? 'Pendente'
                      : 'Cancelada'}
                  </Badge>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Modal de Nova Venda */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nova Venda</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Cliente</FormLabel>
                <Select placeholder="Selecione o cliente">
                  <option value="1">João Silva</option>
                  <option value="2">Empresa XYZ</option>
                </Select>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Produto</FormLabel>
                <Select placeholder="Selecione o produto">
                  <option value="1">Produto A</option>
                  <option value="2">Produto B</option>
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

              <FormControl isRequired>
                <FormLabel>Forma de Pagamento</FormLabel>
                <Select placeholder="Selecione a forma de pagamento">
                  <option value="credit_card">Cartão de Crédito</option>
                  <option value="bank_transfer">Transferência Bancária</option>
                  <option value="cash">Dinheiro</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Observações</FormLabel>
                <Input placeholder="Observações sobre a venda" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue">
              Finalizar Venda
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
