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
import { useProfile } from '../../hooks/useProfile';
import { createBackup, restoreBackup } from '../../services/backupService';
import { formatFileSize } from '../../utils/formatters';

interface BackupRecord {
  id: number;
  date: string;
  size: string;
  status: 'Em andamento' | 'Concluído' | 'Erro';
  type: string;
  filename?: string;
}

function Backup() {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useProfile();
  const [isBackupInProgress, setIsBackupInProgress] = useState(false);
  const [isRestoreInProgress, setIsRestoreInProgress] = useState(false);
  const [backupProgress, setBackupProgress] = useState(0);
  const [backups, setBackups] = useState<BackupRecord[]>([]);

  const handleBackup = async () => {
    if (!profile?.company_id) {
      toast({
        title: 'Erro',
        description: 'Você precisa estar vinculado a uma empresa para realizar backup.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsBackupInProgress(true);
      setBackupProgress(0);
      
      // Simular progresso
      const progressInterval = setInterval(() => {
        setBackupProgress(prev => Math.min(prev + 10, 90));
      }, 500);

      const { fileName, size } = await createBackup(profile.company_id);
      
      clearInterval(progressInterval);
      setBackupProgress(100);

      const newBackup: BackupRecord = {
        id: Date.now(),
        date: new Date().toLocaleString(),
        size: formatFileSize(size),
        status: 'Concluído',
        type: 'Completo',
        filename: fileName,
      };

      setBackups([newBackup, ...backups]);

      toast({
        title: 'Backup concluído',
        description: 'O backup foi realizado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao criar backup:', error);
      toast({
        title: 'Erro ao criar backup',
        description: 'Ocorreu um erro ao criar o backup. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsBackupInProgress(false);
      setBackupProgress(0);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.company_id) return;

    setIsRestoreInProgress(true);
    try {
      await restoreBackup(file, profile.company_id);
      toast({
        title: 'Backup restaurado',
        description: 'O backup foi restaurado com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Erro ao restaurar backup:', error);
      toast({
        title: 'Erro ao restaurar backup',
        description: error instanceof Error ? error.message : 'Ocorreu um erro ao restaurar o backup. Tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsRestoreInProgress(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDeleteBackup = (id: number) => {
    setBackups(backups.filter(backup => backup.id !== id));
    toast({
      title: 'Backup removido',
      description: 'O backup foi removido da lista.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const downloadBackup = async (filename: string | undefined) => {
    if (!filename) return;
    const link = document.createElement('a');
    link.href = `data:application/zip;base64,${filename}`;
    link.download = filename;
    link.click();
  };

  return (
    <Container maxW="container.xl" py={8}>
      <PageHeader title="Backup" />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <VStack spacing={6} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="lg" fontWeight="bold">Backups Realizados</Text>
            <HStack>
              <Button
                leftIcon={<FiRotateCw />}
                colorScheme="blue"
                onClick={handleBackup}
                isLoading={isBackupInProgress}
                loadingText="Realizando backup..."
              >
                Realizar Backup
              </Button>
              <Input
                type="file"
                accept=".zip,.json"
                onChange={handleFileChange}
                ref={fileInputRef}
                display="none"
              />
              <Button
                leftIcon={<FiUpload />}
                colorScheme="green"
                onClick={() => fileInputRef.current?.click()}
                isLoading={isRestoreInProgress}
                loadingText="Restaurando..."
              >
                Restaurar Backup
              </Button>
            </HStack>
          </HStack>

          {isBackupInProgress && (
            <Box>
              <Text mb={2}>Progresso do backup: {backupProgress}%</Text>
              <Progress value={backupProgress} size="sm" colorScheme="blue" rounded="md" />
            </Box>
          )}

          <Divider />

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Data</Th>
                <Th>Tamanho</Th>
                <Th>Status</Th>
                <Th>Tipo</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {backups.map((backup) => (
                <Tr key={backup.id}>
                  <Td>{backup.date}</Td>
                  <Td>{backup.size}</Td>
                  <Td>{backup.status}</Td>
                  <Td>{backup.type}</Td>
                  <Td>
                    <HStack spacing={2}>
                      {backup.filename && (
                        <Button
                          size="sm"
                          leftIcon={<FiDownload />}
                          variant="ghost"
                          colorScheme="blue"
                          onClick={() => downloadBackup(backup.filename)}
                        >
                          Download
                        </Button>
                      )}
                      <Button
                        size="sm"
                        leftIcon={<FiTrash2 />}
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => handleDeleteBackup(backup.id)}
                      >
                        Excluir
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </VStack>
      </Box>
    </Container>
  );
}

export { Backup };
