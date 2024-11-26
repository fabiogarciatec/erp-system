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

export function Services() {
  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Serviços"
        subtitle="Gerencie seu catálogo de serviços"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Serviços', href: '/services' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <Box mb={4} display="flex" justifyContent="space-between">
          <InputGroup maxW="300px">
            <Input placeholder="Buscar serviço..." />
            <InputRightElement>
              <FiSearch />
            </InputRightElement>
          </InputGroup>
          <Button leftIcon={<FiPlus />} colorScheme="blue">
            Novo Serviço
          </Button>
        </Box>

        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Código</Th>
              <Th>Nome</Th>
              <Th>Categoria</Th>
              <Th>Duração</Th>
              <Th>Preço</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>SRV001</Td>
              <Td>Serviço A</Td>
              <Td>Categoria 1</Td>
              <Td>2h</Td>
              <Td>R$ 199,90</Td>
              <Td>Ativo</Td>
            </Tr>
            <Tr>
              <Td>SRV002</Td>
              <Td>Serviço B</Td>
              <Td>Categoria 2</Td>
              <Td>1h30</Td>
              <Td>R$ 149,90</Td>
              <Td>Ativo</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
    </Box>
  );
}
