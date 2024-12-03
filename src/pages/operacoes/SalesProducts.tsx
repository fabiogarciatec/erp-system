import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';

export function SalesProducts() {
  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Vendas de Produtos"
        subtitle="Gerencie suas vendas de produtos"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Vendas', href: '/sales' },
          { label: 'Produtos', href: '/sales/products' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
        <Box p={4} borderBottomWidth="1px" display="flex" justifyContent="space-between">
          <Button 
            colorScheme="blue" 
            leftIcon={<FiPlus />}
          >
            Nova Venda
          </Button>
        </Box>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Código</Th>
                <Th>Cliente</Th>
                <Th>Data</Th>
                <Th>Valor Total</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>VD001</Td>
                <Td>Cliente Exemplo</Td>
                <Td>01/01/2024</Td>
                <Td>R$ 1.500,00</Td>
                <Td>
                  <Badge colorScheme="green">Concluída</Badge>
                </Td>
                <Td>-</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
