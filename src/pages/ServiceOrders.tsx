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
  Badge,
} from '@chakra-ui/react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export function ServiceOrders() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Ordem de Serviços"
        subtitle="Gerencie suas ordens de serviço"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Vendas', href: '/sales' },
          { label: 'Ordem de Serviços', href: '/sales/services' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
        <Box p={4} borderBottomWidth="1px" display="flex" justifyContent="space-between">
          <InputGroup maxW="300px">
            <Input
              placeholder="Buscar ordem de serviço..."
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
            Nova O.S.
          </Button>
        </Box>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Número O.S.</Th>
                <Th>Cliente</Th>
                <Th>Serviço</Th>
                <Th>Data Abertura</Th>
                <Th>Previsão</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>OS001</Td>
                <Td>Cliente Exemplo</Td>
                <Td>Manutenção</Td>
                <Td>01/01/2024</Td>
                <Td>03/01/2024</Td>
                <Td>
                  <Badge colorScheme="yellow">Em Andamento</Badge>
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
