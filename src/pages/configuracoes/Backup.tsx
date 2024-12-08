import {
  Box,
  Button,
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
  Card,
  CardBody,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FiDownload, FiRotateCw, FiTrash2, FiUpload, FiDatabase } from 'react-icons/fi';
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

  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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
    <Box>
      <PageHeader
        title="Backup do Sistema"
        subtitle="Gerencie os backups e restaurações do sistema"
        icon={FiDatabase}
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Backup', href: '/configuracoes/backup' }
        ]}
      />

      <Box
        display="flex"
        mt="-10px"
        px={8}
        flexDirection={{ base: "column", xl: "row" }}
        w="86vw"
        position="relative"
        left="50%"
        transform="translateX(-50%)"
      >
        <VStack flex="1" spacing={6} align="stretch" width="100%">
          <Card
            bg={cardBg}
            shadow="sm"
            rounded="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={6}
          >
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Text fontSize="lg" fontWeight="semibold">
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
                    size="lg"
                  >
                    Realizar Backup
                  </Button>
                  <Button
                    leftIcon={<FiUpload />}
                    colorScheme="green"
                    onClick={() => fileInputRef.current?.click()}
                    isLoading={isRestoreInProgress}
                    loadingText="Restaurando..."
                    size="lg"
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
                    <Progress value={backupProgress} size="sm" colorScheme="blue" rounded="md" />
                  </Box>
                )}
              </VStack>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            shadow="sm"
            rounded="lg"
            borderWidth="1px"
            borderColor={borderColor}
            p={6}
          >
            <CardBody>
              <VStack spacing={6} align="stretch">
                <Text fontSize="lg" fontWeight="semibold">
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
                              leftIcon={<FiDownload />}
                              size="sm"
                              colorScheme="blue"
                              variant="ghost"
                            >
                              Download
                            </Button>
                            <Button
                              leftIcon={<FiTrash2 />}
                              size="sm"
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
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </Box>
  );
}
