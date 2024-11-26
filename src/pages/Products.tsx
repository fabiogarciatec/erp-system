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
import { PageHeader } from '../components/PageHeader';

export function Products() {
  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Produtos"
        subtitle="Gerencie seu catálogo de produtos"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Produtos', href: '/products' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <Box mb={4} display="flex" justifyContent="space-between">
          <InputGroup maxW="300px">
            <Input placeholder="Buscar produto..." />
            <InputRightElement>
              <FiSearch />
            </InputRightElement>
          </InputGroup>
          <Button leftIcon={<FiPlus />} colorScheme="blue">
            Novo Produto
          </Button>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Código</Th>
              <Th>Nome</Th>
              <Th>Categoria</Th>
              <Th>Estoque</Th>
              <Th>Preço</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>PROD001</Td>
              <Td>Produto A</Td>
              <Td>Categoria 1</Td>
              <Td>50</Td>
              <Td>R$ 99,90</Td>
              <Td>Ativo</Td>
            </Tr>
            <Tr>
              <Td>PROD002</Td>
              <Td>Produto B</Td>
              <Td>Categoria 2</Td>
              <Td>30</Td>
              <Td>R$ 149,90</Td>
              <Td>Ativo</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
