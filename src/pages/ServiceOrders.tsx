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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
} from '@chakra-ui/react';
import { FiSearch, FiPlus, FiMoreVertical, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';

export function ServiceOrders() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Ordens de Serviço"
        subtitle="Gerencie suas ordens de serviço"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Vendas', href: '/sales' },
          { label: 'Ordens de Serviço', href: '/sales/service-orders' }
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
            onClick={onOpen}
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
                <Th>Valor</Th>
                <Th width="50px">Ações</Th>
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
                <Td>R$ 150,00</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                      aria-label="Ações"
                    />
                    <MenuList>
                      <MenuItem icon={<FiEye />}>Visualizar</MenuItem>
                      <MenuItem icon={<FiEdit2 />}>Editar</MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red.500">Excluir</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
              <Tr>
                <Td>OS002</Td>
                <Td>João Silva</Td>
                <Td>Instalação</Td>
                <Td>02/01/2024</Td>
                <Td>05/01/2024</Td>
                <Td>
                  <Badge colorScheme="green">Concluído</Badge>
                </Td>
                <Td>R$ 280,00</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                      aria-label="Ações"
                    />
                    <MenuList>
                      <MenuItem icon={<FiEye />}>Visualizar</MenuItem>
                      <MenuItem icon={<FiEdit2 />}>Editar</MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red.500">Excluir</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
              <Tr>
                <Td>OS003</Td>
                <Td>Maria Oliveira</Td>
                <Td>Reparo</Td>
                <Td>03/01/2024</Td>
                <Td>04/01/2024</Td>
                <Td>
                  <Badge colorScheme="red">Atrasado</Badge>
                </Td>
                <Td>R$ 200,00</Td>
                <Td>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                      aria-label="Ações"
                    />
                    <MenuList>
                      <MenuItem icon={<FiEye />}>Visualizar</MenuItem>
                      <MenuItem icon={<FiEdit2 />}>Editar</MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red.500">Excluir</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>
    </Box>
  );
}
