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
} from '@chakra-ui/react';
import { FiDownload, FiRotateCw } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';

export function Backup() {
  const toast = useToast();

  const handleBackup = () => {
    toast({
      title: 'Backup iniciado',
      description: 'O backup será realizado em segundo plano.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const mockBackups = [
    { id: 1, date: '2024-01-15 08:30', size: '256MB', status: 'Concluído' },
    { id: 2, date: '2024-01-14 08:30', size: '255MB', status: 'Concluído' },
    { id: 3, date: '2024-01-13 08:30', size: '254MB', status: 'Concluído' },
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
            >
              Iniciar Novo Backup
            </Button>
          </HStack>

          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Data</Th>
                <Th>Tamanho</Th>
                <Th>Status</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {mockBackups.map((backup) => (
                <Tr key={backup.id}>
                  <Td>{backup.date}</Td>
                  <Td>{backup.size}</Td>
                  <Td>
                    <Badge colorScheme="green">{backup.status}</Badge>
                  </Td>
                  <Td>
                    <IconButton
                      aria-label="Download backup"
                      icon={<FiDownload />}
                      size="sm"
                      colorScheme="blue"
                      variant="ghost"
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          <Text fontSize="sm" color="gray.600">
            Os backups são realizados automaticamente todos os dias às 08:30.
            Mantenha sempre uma cópia de segurança atualizada dos seus dados.
          </Text>
        </VStack>
      </Box>
    </Box>
  );
}
