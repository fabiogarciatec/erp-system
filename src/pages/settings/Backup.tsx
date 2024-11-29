import {
  Box,
  Button,
  Container,
  Divider,
  HStack,
  Input,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
  Progress,
} from '@chakra-ui/react';
import { FiDownload, FiRotateCw, FiTrash2, FiUpload } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
import { useState, useRef, ChangeEvent } from 'react';

interface BackupRecord {
  id: number;
  date: string;
  size: string;
  status: 'Em andamento' | 'Concluído' | 'Erro';
  type: string;
  filename?: string;
}

const mockBackups: BackupRecord[] = [
  {
    id: 1,
    date: '2024-01-15 10:30',
    size: '2.5 MB',
    status: 'Concluído',
    type: 'Manual',
    filename: 'backup_20240115_103000.zip'
  },
  {
    id: 2,
    date: '2024-01-14 15:45',
    size: '2.3 MB',
    status: 'Concluído',
    type: 'Automático',
    filename: 'backup_20240114_154500.zip'
  },
  {
    id: 3,
    date: '2024-01-13 20:15',
    size: '2.4 MB',
    status: 'Concluído',
    type: 'Manual',
    filename: 'backup_20240113_201500.zip'
  }
];

export function Backup() {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [isRestoreInProgress, setIsRestoreInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backups, setBackups] = useState<BackupRecord[]>(mockBackups);

  const handleBackup = async () => {
    setIsBackupInProgress(true);
    setBackupProgress(0);

    // Simulando progresso
    const interval = setInterval(() => {
      setBackupProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBackupInProgress(false);
          
          // Adicionar novo backup à lista
          const newBackup: BackupRecord = {
            id: Math.max(...backups.map(b => b.id)) + 1,
            date: new Date().toLocaleString(),
            size: '2.5 MB',
            status: 'Concluído',
            type: 'Manual',
            filename: `backup_${new Date().toISOString().replace(/[:.]/g, '')}.zip`
          };
          
          setBackups([newBackup, ...backups]);
          
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
  };

  const handleRestore = (file: File) => {
    setIsRestoreInProgress(true);
    
    // Simulando restauração
    setTimeout(() => {
      setIsRestoreInProgress(false);
      toast({
        title: 'Restauração concluída',
        description: 'O sistema foi restaurado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    }, 3000);
  };

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleRestore(file);
    }
  };

  const handleDelete = (id: number) => {
    setBackups(backups.filter(backup => backup.id !== id));
    toast({
      title: 'Backup excluído',
      description: 'O backup foi excluído com sucesso.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Container maxW="container.xl">
      <PageHeader title="Backup do Sistema" />

      <Box bg="white" p={6} rounded="lg" shadow="sm" mb={6}>
        <VStack spacing={4} align="stretch">
          <Text fontSize="lg" fontWeight="medium">
            Gerenciamento de Backup
          </Text>
          <Divider />
          <HStack spacing={4}>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="blue"
              onClick={handleBackup}
              isLoading={isBackupInProgress}
              loadingText="Realizando backup..."
            >
              Realizar Backup
            </Button>
            <Button
              leftIcon={<FiUpload />}
              colorScheme="green"
              onClick={() => fileInputRef.current?.click()}
              isLoading={isRestoreInProgress}
              loadingText="Restaurando..."
            >
              Restaurar Backup
            </Button>
            <Input
              type="file"
              ref={fileInputRef}
              display="none"
              onChange={handleFileSelect}
              accept=".zip"
            />
          </HStack>
          {isBackupInProgress && (
            <Box>
              <Text mb={2}>Progresso do backup:</Text>
              <Progress value={backupProgress} size="sm" colorScheme="blue" />
            </Box>
          )}
        </VStack>
      </Box>

      <Box bg="white" p={6} rounded="lg" shadow="sm">
        <Text fontSize="lg" fontWeight="medium" mb={4}>
          Histórico de Backups
        </Text>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Data</Th>
              <Th>Tamanho</Th>
              <Th>Tipo</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {backups.map((backup) => (
              <Tr key={backup.id}>
                <Td>{backup.date}</Td>
                <Td>{backup.size}</Td>
                <Td>{backup.type}</Td>
                <Td>{backup.status}</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      leftIcon={<FiDownload />}
                      colorScheme="blue"
                      variant="ghost"
                    >
                      Download
                    </Button>
                    <Button
                      size="sm"
                      leftIcon={<FiTrash2 />}
                      colorScheme="red"
                      variant="ghost"
                      onClick={() => handleDelete(backup.id)}
                    >
                      Excluir
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    </Container>
  );
}
