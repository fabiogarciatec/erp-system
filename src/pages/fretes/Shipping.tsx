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
  IconButton,
} from '@chakra-ui/react';
import { FiMoreVertical, FiPlus } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';

export function Shipping() {
  return (
    <Box w="full" p={8}>
      <Box w="full">
        <PageHeader
          title="Fretes"
          subtitle="Gerencie seus fretes"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Fretes', href: '/shipping' }
          ]}
        />

        <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
          <Box p={4} borderBottomWidth="1px" display="flex" justifyContent="space-between">
            <InputGroup maxW="300px">
              <Input
                placeholder="Buscar frete..."
              />
              <InputRightElement>
                <IconButton
                  size="sm"
                  variant="ghost"
                  aria-label="Search"
                  icon={<FiMoreVertical />}
                />
              </InputRightElement>
            </InputGroup>
            <Button 
              colorScheme="blue" 
              leftIcon={<FiPlus />}
            >
              Novo Frete
            </Button>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Origem</Th>
                  <Th>Destino</Th>
                  <Th>Status</Th>
                  <Th>Valor</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>FRT001</Td>
                  <Td>São Paulo, SP</Td>
                  <Td>Rio de Janeiro, RJ</Td>
                  <Td>
                    <Box>
                      Em Trânsito
                    </Box>
                  </Td>
                  <Td>R$ 250,00</Td>
                  <Td>-</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
