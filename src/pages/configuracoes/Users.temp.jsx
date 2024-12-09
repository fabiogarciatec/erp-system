import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import {
  Box,
  Button,
  Card,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tooltip,
  Tr,
  VStack,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  useToast,
  Radio,
  RadioGroup,
  Checkbox,
  CheckboxGroup,
  Flex,
  Center,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tag,
  Icon,
  Heading,
} from '@chakra-ui/react';
import { FiMoreVertical } from 'react-icons/fi';
import supabase from '@/lib/supabase';

function Users() {
    const { checkPermission, PermissionGuard } = usePermissions();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const cancelRef = useRef();
    const toast = useToast();

    // ... outros estados e funções existentes ...

    // Função para verificar permissão antes de executar ações
    const handleEditUser = async (user) => {
        const canEdit = await checkPermission('users_edit', 'edit');
        if (canEdit) {
            setSelectedUser(user);
            onOpen();
        } else {
            toast({
                title: 'Sem permissão',
                description: 'Você não tem permissão para editar usuários',
                status: 'error',
                duration: 3000,
            });
        }
    };

    const handleDeleteUser = async (user) => {
        const canDelete = await checkPermission('users_delete', 'delete');
        if (canDelete) {
            setSelectedUser(user);
            setIsDeleteDialogOpen(true);
        } else {
            toast({
                title: 'Sem permissão',
                description: 'Você não tem permissão para excluir usuários',
                status: 'error',
                duration: 3000,
            });
        }
    };

    return (
        <PermissionGuard
            permissionName="users_view"
            action="view"
            fallback={
                <Center p={8}>
                    <Text>Você não tem permissão para visualizar usuários</Text>
                </Center>
            }
        >
            <Card>
                <CardHeader>
                    <Heading size="md">Gerenciamento de Usuários</Heading>
                </CardHeader>
                <Box p={4}>
                    <HStack spacing={4} mb={4}>
                        <PermissionGuard
                            permissionName="users_create"
                            action="create"
                        >
                            <Button
                                colorScheme="blue"
                                onClick={() => {
                                    setSelectedUser(null);
                                    onOpen();
                                }}
                            >
                                Novo Usuário
                            </Button>
                        </PermissionGuard>
                    </HStack>

                    {loading ? (
                        <Center p={8}>
                            <Spinner />
                        </Center>
                    ) : (
                        <TableContainer>
                            <Table variant="simple">
                                <Thead>
                                    <Tr>
                                        <Th>Nome</Th>
                                        <Th>Email</Th>
                                        <Th>Função</Th>
                                        <Th>Status</Th>
                                        <Th>Ações</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {users.map((user) => (
                                        <Tr key={user.id}>
                                            <Td>{user.name}</Td>
                                            <Td>{user.email}</Td>
                                            <Td>{user.role}</Td>
                                            <Td>
                                                <Tag
                                                    colorScheme={user.is_active ? 'green' : 'red'}
                                                >
                                                    {user.is_active ? 'Ativo' : 'Inativo'}
                                                </Tag>
                                            </Td>
                                            <Td>
                                                <PermissionGuard
                                                    permissionName="users_edit"
                                                    action="edit"
                                                >
                                                    <Menu>
                                                        <MenuButton
                                                            as={IconButton}
                                                            aria-label="Opções"
                                                            icon={<Icon as={FiMoreVertical} />}
                                                            variant="ghost"
                                                        />
                                                        <MenuList>
                                                            <MenuItem
                                                                onClick={() => handleEditUser(user)}
                                                            >
                                                                Editar
                                                            </MenuItem>
                                                            <PermissionGuard
                                                                permissionName="users_delete"
                                                                action="delete"
                                                            >
                                                                <MenuItem
                                                                    color="red.500"
                                                                    onClick={() => handleDeleteUser(user)}
                                                                >
                                                                    Excluir
                                                                </MenuItem>
                                                            </PermissionGuard>
                                                        </MenuList>
                                                    </Menu>
                                                </PermissionGuard>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    )}
                </Box>
            </Card>

            {/* Modal de Edição/Criação */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <PermissionGuard
                        permissionName={selectedUser ? 'users_edit' : 'users_create'}
                        action={selectedUser ? 'edit' : 'create'}
                        fallback={
                            <Center p={8}>
                                <Text>
                                    Você não tem permissão para {selectedUser ? 'editar' : 'criar'} usuários
                                </Text>
                            </Center>
                        }
                    >
                        <ModalHeader>
                            {selectedUser ? 'Editar Usuário' : 'Novo Usuário'}
                        </ModalHeader>
                        <ModalCloseButton />
                        <ModalBody>
                            {/* Seu formulário existente aqui */}
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="ghost" mr={3} onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button colorScheme="blue">
                                {selectedUser ? 'Salvar' : 'Criar'}
                            </Button>
                        </ModalFooter>
                    </PermissionGuard>
                </ModalContent>
            </Modal>

            {/* Diálogo de Confirmação de Exclusão */}
            <AlertDialog
                isOpen={isDeleteDialogOpen}
                leastDestructiveRef={cancelRef}
                onClose={() => setIsDeleteDialogOpen(false)}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <PermissionGuard
                            permissionName="users_delete"
                            action="delete"
                            fallback={
                                <Center p={8}>
                                    <Text>Você não tem permissão para excluir usuários</Text>
                                </Center>
                            }
                        >
                            <AlertDialogHeader>
                                Confirmar Exclusão
                            </AlertDialogHeader>
                            <AlertDialogBody>
                                Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.
                            </AlertDialogBody>
                            <AlertDialogFooter>
                                <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button colorScheme="red" ml={3}>
                                    Excluir
                                </Button>
                            </AlertDialogFooter>
                        </PermissionGuard>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </PermissionGuard>
    );
}

export default Users;
