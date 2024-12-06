import {
  Box,
  Button,
  Card,
  CardBody,
  Checkbox,
  Divider,
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
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  VStack,
  useColorModeValue,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { FiShield, FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
import { useEffect, useState } from 'react';
import { Permission, Role, PermissionModule } from '@/types/permissions';
import { permissionsService } from '@/services/permissions';
import { useAuth } from '@/contexts/AuthContext';

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  role?: Role;
  onSave: (role: Partial<Role>) => Promise<void>;
}

const RoleModal = ({ isOpen, onClose, role, onSave }: RoleModalProps) => {
  const [name, setName] = useState(role?.name || '');
  const [description, setDescription] = useState(role?.description || '');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (role) {
      setName(role.name);
      setDescription(role.description);
    } else {
      setName('');
      setDescription('');
    }
  }, [role]);

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      await onSave({ name, description });
      onClose();
    } catch (error) {
      console.error('Error saving role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{role ? 'Editar Cargo' : 'Novo Cargo'}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Nome</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nome do cargo"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Descrição</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descrição do cargo"
              />
            </FormControl>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isLoading}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default function Permissions() {
  const { user } = useAuth();
  const toast = useToast();
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [modules, setModules] = useState<PermissionModule[]>([]);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const {
    isOpen: isRoleModalOpen,
    onOpen: onRoleModalOpen,
    onClose: onRoleModalClose,
  } = useDisclosure();

  const [editingRole, setEditingRole] = useState<Role | null>(null);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [rolesData, permissionsData, modulesData] = await Promise.all([
        permissionsService.getRoles(user?.company_id ?? null),
        permissionsService.getPermissions(user?.company_id ?? null),
        permissionsService.getPermissionModules(),
      ]);

      setRoles(rolesData);
      setPermissions(permissionsData);
      setModules(modulesData);

      if (selectedRole) {
        const rolePerms = await permissionsService.getRolePermissions(selectedRole.id);
        setRolePermissions(rolePerms || []); // Garantir que sempre temos um array
      }
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Erro ao carregar dados',
        description: 'Ocorreu um erro ao carregar as permissões e cargos.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = async (roleId: string) => {
    const role = roles.find((r) => r.id === roleId);
    setSelectedRole(role || null);

    if (role) {
      try {
        const rolePerms = await permissionsService.getRolePermissions(role.id);
        setRolePermissions(rolePerms || []); // Garantir que sempre temos um array
      } catch (error) {
        console.error('Error loading role permissions:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar as permissões do cargo.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        setRolePermissions([]); // Em caso de erro, limpar as permissões
      }
    } else {
      setRolePermissions([]);
    }
  };

  const handlePermissionToggle = async (permissionId: string) => {
    if (!selectedRole) return;

    try {
      if (rolePermissions.includes(permissionId)) {
        await permissionsService.removePermissionFromRole(selectedRole.id, permissionId);
        setRolePermissions(rolePermissions.filter((id) => id !== permissionId));
      } else {
        await permissionsService.addPermissionToRole(selectedRole.id, permissionId);
        setRolePermissions([...rolePermissions, permissionId]);
      }
    } catch (error) {
      console.error('Error toggling permission:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as permissões do cargo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCreateRole = async (roleData: Partial<Role>) => {
    try {
      const newRole = await permissionsService.createRole({
        ...roleData,
        company_id: user?.company_id ?? null,
        is_system_role: false,
      });
      setRoles([...roles, newRole]);
      toast({
        title: 'Sucesso',
        description: 'Cargo criado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o cargo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleUpdateRole = async (roleData: Partial<Role>) => {
    if (!editingRole) return;

    try {
      const updatedRole = await permissionsService.updateRole(editingRole.id, roleData);
      setRoles(roles.map((role) => (role.id === updatedRole.id ? updatedRole : role)));
      toast({
        title: 'Sucesso',
        description: 'Cargo atualizado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o cargo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este cargo?')) return;

    try {
      await permissionsService.deleteRole(roleId);
      setRoles(roles.filter((role) => role.id !== roleId));
      if (selectedRole?.id === roleId) {
        setSelectedRole(null);
        setRolePermissions([]);
      }
      toast({
        title: 'Sucesso',
        description: 'Cargo excluído com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error deleting role:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível excluir o cargo.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleEditRole = (role: Role) => {
    setEditingRole(role);
    onRoleModalOpen();
  };

  const handleRoleModalClose = () => {
    setEditingRole(null);
    onRoleModalClose();
  };

  return (
    <Box>
      <PageHeader
        title="Permissões"
        icon={FiShield}
        description="Gerencie os cargos e permissões do sistema"
      />

      <Box px={8}>
        <Card>
          <CardBody>
            <HStack spacing={4} mb={4}>
              <FormControl flex={1}>
                <FormLabel>Cargo</FormLabel>
                <Select
                  value={selectedRole?.id || ''}
                  onChange={(e) => handleRoleSelect(e.target.value)}
                  placeholder="Selecione um cargo"
                >
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <Button
                leftIcon={<FiPlus />}
                colorScheme="blue"
                onClick={() => {
                  setEditingRole(null);
                  onRoleModalOpen();
                }}
                alignSelf="flex-end"
              >
                Novo Cargo
              </Button>
            </HStack>

            {selectedRole && (
              <HStack spacing={2} mb={4}>
                <IconButton
                  aria-label="Editar cargo"
                  icon={<FiEdit2 />}
                  size="sm"
                  onClick={() => handleEditRole(selectedRole)}
                />
                <IconButton
                  aria-label="Excluir cargo"
                  icon={<FiTrash2 />}
                  size="sm"
                  colorScheme="red"
                  onClick={() => handleDeleteRole(selectedRole.id)}
                  isDisabled={selectedRole.is_system_role}
                />
              </HStack>
            )}

            <Divider my={4} />

            {modules.map((module) => {
              const modulePermissions = permissions.filter(
                (p) => p.module === module.code
              );

              if (modulePermissions.length === 0) return null;

              return (
                <Box key={module.id} mb={6}>
                  <Text fontSize="lg" fontWeight="bold" mb={2}>
                    {module.name}
                  </Text>
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Permissão</Th>
                        <Th>Descrição</Th>
                        <Th width="100px">Conceder</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {modulePermissions.map((permission) => (
                        <Tr key={permission.id}>
                          <Td>{permission.name}</Td>
                          <Td>{permission.description}</Td>
                          <Td>
                            <Checkbox
                              isChecked={rolePermissions.includes(permission.id)}
                              onChange={() => handlePermissionToggle(permission.id)}
                              isDisabled={!selectedRole || selectedRole.is_system_role}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              );
            })}
          </CardBody>
        </Card>
      </Box>

      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={handleRoleModalClose}
        role={editingRole ?? undefined}
        onSave={editingRole ? handleUpdateRole : handleCreateRole}
      />
    </Box>
  );
}
