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
import { FiSearch, FiPlus, FiDownload } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';

export function Services() {
  const handleExportServices = () => {
    // implementação da função de exportação
  };

  const onOpen = () => {
    // implementação da função de abrir modal
  };

  return (
    <Box w="100%">
      <PageHeader
        title="Serviços"
        subtitle="Gerencie os serviços oferecidos"
        breadcrumbs={[
          { label: 'Cadastros', href: '/cadastros' },
          { label: 'Serviços', href: '/cadastros/servicos' }
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportServices}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Novo Serviço
            </Button>
          </Box>
        }
      />

      {/* Content */}
      <Box mt="125px" px={6}>
        <Box maxW="1600px" mx="auto">
          <Box bg="white" rounded="lg" shadow="sm" p={6}>
            <Box mb={4} display="flex" justifyContent="space-between">
              <InputGroup maxW="300px">
                <Input placeholder="Buscar serviço..." />
                <InputRightElement>
                  <FiSearch />
                </InputRightElement>
              </InputGroup>
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
      </Box>
    </Box>
  );
}
