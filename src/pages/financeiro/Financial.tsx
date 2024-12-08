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
  SimpleGrid,
  Stack,
  TableContainer,
} from '@chakra-ui/react';
import { FiPlus, FiDownload } from 'react-icons/fi';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';

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

  const filteredTransactions = transactions.filter((transaction) => {
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

  const handleExportData = () => {
    // Implement export data logic here
  };

  return (
    <Box w="100%">
      <PageHeader
        title="Financeiro"
        subtitle="Gerencie as finanças da sua empresa"
        breadcrumbs={[
          { label: 'Financeiro', href: '/financeiro' },
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportData}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Nova Transação
            </Button>
          </Box>
        }
      />

      {/* Content */}
      <Box mt="154px" px={6}>
        <Box maxW="1600px" mx="auto">
          <Stack spacing={6}>
            {/* Summary Cards */}
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {/* Add summary cards here */}
            </SimpleGrid>

            {/* Filters */}
            <HStack spacing={4}>
              {/* Add filters here */}
            </HStack>

            {/* Transactions Table */}
            <TableContainer>
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
            </TableContainer>
          </Stack>
        </Box>
      </Box>

      {/* Modal */}
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
    </Box>
  );
}
