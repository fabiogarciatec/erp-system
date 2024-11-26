import {
  Box,
  VStack,
  Button,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  useToast,
  IconButton,
  Flex,
  Progress,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Select,
} from '@chakra-ui/react';
import { FiDownload, FiRotateCw, FiTrash2, FiUpload } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
import { useState } from 'react';

export function Backup() {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [selectedBackupType, setSelectedBackupType] = useState('full');

  const handleBackup = () => {
    onOpen();
  };

  const startBackup = () => {
    onClose();
    setIsBackupInProgress(true);
    setBackupProgress(0);

    // Simulação do progresso do backup
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackupInProgress(false);
          toast({
            title: 'Backup concluído',
            description: 'O backup foi realizado com sucesso.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
          return 100;
        }
        return prev + 10;
      });
    }, 500);

    toast({
      title: 'Backup iniciado',
      description: `Iniciando backup ${selectedBackupType === 'full' ? 'completo' : 'incremental'}...`,
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleDelete = () => {
    toast({
      title: 'Backup excluído',
      description: 'O backup foi excluído com sucesso.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const mockBackups = [
    { id: 1, date: '2024-01-15 08:30', size: '256MB', status: 'Concluído', type: 'Completo' },
    { id: 2, date: '2024-01-14 08:30', size: '50MB', status: 'Concluído', type: 'Incremental' },
    { id: 3, date: '2024-01-13 08:30', size: '254MB', status: 'Concluído', type: 'Completo' },
  ];

  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Backup"
        subtitle="Gerencie os backups do sistema"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configurações', href: '/settings' },
          { label: 'Backup', href: '/settings/backup' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">Backups Realizados</Text>
            <Button
              leftIcon={<FiRotateCw />}
              colorScheme="blue"
              onClick={handleBackup}
              isLoading={isBackupInProgress}
              loadingText="Realizando backup..."
            >
              Iniciar Novo Backup
            </Button>
          </HStack>

          {isBackupInProgress && (
            <Box>
              <Text mb={2}>Progresso do backup: {backupProgress}%</Text>
              <Progress value={backupProgress} size="sm" colorScheme="blue" rounded="md" />
            </Box>
          )}

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Data</Th>
                <Th>Tipo</Th>
                <Th>Tamanho</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockBackups.map((backup) => (
                <Tr key={backup.id}>
                  <Td>{backup.date}</Td>
                  <Td>{backup.type}</Td>
                  <Td>{backup.size}</Td>
                  <Td>
                    <Badge colorScheme="green">{backup.status}</Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <IconButton
                        aria-label="Download backup"
                        icon={<FiDownload />}
                        size="sm"
                        colorScheme="blue"
                        variant="ghost"
                      />
                      <IconButton
                        aria-label="Excluir backup"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={handleDelete}
                      />
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Flex direction="column" gap={4}>
            <Text fontSize="sm" color="gray.600">
              Os backups são realizados automaticamente todos os dias às 08:30.
              Mantenha sempre uma cópia de segurança atualizada dos seus dados.
            </Text>
            <HStack>
              <Button leftIcon={<FiUpload />} size="sm" variant="outline">
                Importar Backup
              </Button>
              <Button leftIcon={<FiDownload />} size="sm" variant="outline">
                Exportar Todos
              </Button>
            </HStack>
          </Flex>
        </VStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Configurar Backup</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <Text>Selecione o tipo de backup que deseja realizar:</Text>
              <Select
                value={selectedBackupType}
                onChange={(e) => setSelectedBackupType(e.target.value)}
              >
                <option value="full">Backup Completo</option>
                <option value="incremental">Backup Incremental</option>
              </Select>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancelar
            </Button>
            <Button colorScheme="blue" onClick={startBackup}>
              Iniciar Backup
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
