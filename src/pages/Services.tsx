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
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export function Services() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Serviços"
        subtitle="Gerencie seus serviços"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Serviços', href: '/services' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
        <Box p={4} borderBottomWidth="1px" display="flex" justifyContent="space-between">
          <InputGroup maxW="300px">
            <Input
              placeholder="Buscar serviço..."
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
            Novo Serviço
          </Button>
        </Box>

        <Box overflowX="auto">
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Nome</Th>
                <Th>Descrição</Th>
                <Th>Preço</Th>
                <Th>Duração</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Exemplo de Serviço</Td>
                <Td>Descrição do serviço</Td>
                <Td>R$ 150,00</Td>
                <Td>2 horas</Td>
                <Td>-</Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
