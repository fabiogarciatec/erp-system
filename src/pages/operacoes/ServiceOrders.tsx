import {
  Box,
  Button,
  Input,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  useDisclosure,
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { FiMoreVertical, FiPlus } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';

export function ServiceOrders() {
  const { onOpen, isOpen, onClose } = useDisclosure();

  const handleNewOrder = () => {
    onOpen();
  };

  const cardBg = 'white';
  const borderColor = 'gray.200';

  return (
    <Box w="full">
      <PageHeader
        title="Ordens de Serviço"
        subtitle="Gerencie suas ordens de serviço"
        breadcrumbs={[
          { label: 'Ordens de Serviço', href: '/service-orders' }
        ]}
      />

      <Box pt={8}>
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={6} 
          mb={8}
          w="full"
        >
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={handleNewOrder}
          >
            Nova Ordem de Serviço
          </Button>
        </SimpleGrid>

        <Box 
          bg={cardBg} 
          rounded="lg" 
          shadow="sm"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Box p={4} borderBottomWidth="1px" display="flex" justifyContent="space-between">
            <Input
              placeholder="Buscar ordem de serviço..."
            />
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
                        <MenuItem icon={<FiMoreVertical />}>Visualizar</MenuItem>
                        <MenuItem icon={<FiMoreVertical />}>Editar</MenuItem>
                        <MenuItem icon={<FiMoreVertical />} color="red.500">Excluir</MenuItem>
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
                        <MenuItem icon={<FiMoreVertical />}>Visualizar</MenuItem>
                        <MenuItem icon={<FiMoreVertical />}>Editar</MenuItem>
                        <MenuItem icon={<FiMoreVertical />} color="red.500">Excluir</MenuItem>
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
                        <MenuItem icon={<FiMoreVertical />}>Visualizar</MenuItem>
                        <MenuItem icon={<FiMoreVertical />}>Editar</MenuItem>
                        <MenuItem icon={<FiMoreVertical />} color="red.500">Excluir</MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Nova Ordem de Serviço</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Add your form fields here */}
            <Input placeholder="Nome do cliente" mb={4} />
            <Input placeholder="Descrição do serviço" mb={4} />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Salvar
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
