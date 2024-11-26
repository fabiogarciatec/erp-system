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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';

export function Products() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Produtos"
        subtitle="Gerencie seus produtos"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Produtos', href: '/products' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
        <Box p={4} borderBottomWidth="1px" display="flex" justifyContent="space-between">
          <InputGroup maxW="300px">
            <Input
              placeholder="Buscar produto..."
            />
            <InputRightElement>
              <Button
                size="sm"
                variant="ghost"
                aria-label="Search"
              >
                <FiSearch />
              </Button>
            </InputRightElement>
          </InputGroup>
          <Button 
            colorScheme="blue" 
            leftIcon={<FiPlus />}
          >
            Novo Produto
          </Button>
        </Box>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Código</Th>
                <Th>Categoria</Th>
                <Th>Preço</Th>
                <Th>Estoque</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Produto Exemplo</Td>
                <Td>PRD001</Td>
                <Td>Categoria</Td>
                <Td>R$ 99,90</Td>
                <Td>50</Td>
                <Td>-</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
