import {
  Box,
  Container,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Button,
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
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  due_date: string;
  status: 'pending' | 'paid' | 'overdue';
  type: 'receivable' | 'payable';
}

const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Venda #1234',
    amount: 1500.00,
    due_date: '2024-03-15',
    status: 'pending',
    type: 'receivable',
  },
  {
    id: '2',
    description: 'Fornecedor ABC',
    amount: 2300.00,
    due_date: '2024-03-10',
    status: 'paid',
    type: 'payable',
  },
];

interface FinancialProps {
  type?: 'receivables' | 'payables' | 'cash-flow';
}

export function Financial({ type }: FinancialProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const params = useParams();
  const currentType = type || params.type || 'receivables';

  const filteredTransactions = transactions.filter(transaction => {
    if (currentType === 'receivables') return transaction.type === 'receivable';
    if (currentType === 'payables') return transaction.type === 'payable';
    return true;
  });

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'paid':
        return 'green';
      case 'pending':
        return 'yellow';
      case 'overdue':
        return 'red';
      default:
        return 'gray';
    }
  };

  const getStatusText = (status: Transaction['status']) => {
    switch (status) {
      case 'paid':
        return 'Pago';
      case 'pending':
        return 'Pendente';
      case 'overdue':
        return 'Atrasado';
      default:
        return status;
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={4}>
        <HStack justify="space-between" mb={4}>
          <Text fontSize="2xl" fontWeight="bold">
            Financeiro
          </Text>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={onOpen}
          >
            {currentType === 'receivables' ? 'Novo Recebimento' : 'Novo Pagamento'}
          </Button>
        </HStack>
      </Box>

      <Tabs index={currentType === 'receivables' ? 0 : currentType === 'payables' ? 1 : 2}>
        <TabList>
          <Tab>Contas a Receber</Tab>
          <Tab>Contas a Pagar</Tab>
          <Tab>Fluxo de Caixa</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Descrição</Th>
                  <Th>Vencimento</Th>
                  <Th isNumeric>Valor</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((transaction) => (
                  <Tr key={transaction.id}>
                    <Td>{transaction.description}</Td>
                    <Td>{new Date(transaction.due_date).toLocaleDateString()}</Td>
                    <Td isNumeric>R$ {transaction.amount.toFixed(2)}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Descrição</Th>
                  <Th>Vencimento</Th>
                  <Th isNumeric>Valor</Th>
                  <Th>Status</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTransactions.map((transaction) => (
                  <Tr key={transaction.id}>
                    <Td>{transaction.description}</Td>
                    <Td>{new Date(transaction.due_date).toLocaleDateString()}</Td>
                    <Td isNumeric>R$ {transaction.amount.toFixed(2)}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </Badge>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TabPanel>

          <TabPanel>
            <Text>Em desenvolvimento...</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Modal de Nova Transação */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {currentType === 'receivables' ? 'Novo Recebimento' : 'Novo Pagamento'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Descrição</FormLabel>
                <Input placeholder="Descrição da transação" />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Valor</FormLabel>
                <NumberInput min={0} precision={2}>
                  <NumberInputField placeholder="Valor" />
                </NumberInput>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Data de Vencimento</FormLabel>
                <Input type="date" />
              </FormControl>

              <FormControl>
                <FormLabel>Categoria</FormLabel>
                <Select placeholder="Selecione a categoria">
                  <option value="sale">Venda</option>
                  <option value="service">Serviço</option>
                  <option value="other">Outro</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Observações</FormLabel>
                <Input placeholder="Observações" />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue">
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
}
