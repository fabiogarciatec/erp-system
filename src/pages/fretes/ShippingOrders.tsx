import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';

export function ShippingOrders() {
  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Ordens de Frete"
        subtitle="Gerencie suas ordens de frete"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Expedição', href: '/shipping' },
          { label: 'Ordens de Frete', href: '/shipping/orders' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <Box mb={4} display="flex" justifyContent="space-between">
          <InputGroup maxW="300px">
            <Input placeholder="Buscar ordem..." />
            <InputRightElement>
              <FiSearch />
            </InputRightElement>
          </InputGroup>
          <Button leftIcon={<FiPlus />} colorScheme="blue">
            Nova Ordem
          </Button>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Número</Th>
              <Th>Cliente</Th>
              <Th>Status</Th>
              <Th>Data de Criação</Th>
              <Th>Data de Entrega</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>ORD001</Td>
              <Td>Cliente A</Td>
              <Td>Em Processamento</Td>
              <Td>2024-01-15</Td>
              <Td>2024-01-20</Td>
            </Tr>
            <Tr>
              <Td>ORD002</Td>
              <Td>Cliente B</Td>
              <Td>Em Trânsito</Td>
              <Td>2024-01-14</Td>
              <Td>2024-01-19</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
