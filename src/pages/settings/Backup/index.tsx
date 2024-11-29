import {
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  useToast,
} from '@chakra-ui/react';
import { FiDownload, FiUpload } from 'react-icons/fi';

export function Backup() {
  const toast = useToast();

  const handleBackup = () => {
    toast({
      title: 'Backup iniciado',
      description: 'O backup está sendo gerado e será baixado automaticamente.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRestore = () => {
    toast({
      title: 'Restauração',
      description: 'Funcionalidade será implementada em breve.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <Stack spacing={4}>
        <Box>
          <Heading size="lg">Backup e Restauração</Heading>
          <Text color="gray.600">Gerencie os backups do seu sistema</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          <Card>
            <CardHeader>
              <Heading size="md">Realizar Backup</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Text>
                  Faça o backup completo dos dados do seu sistema. O arquivo será gerado
                  e baixado automaticamente.
                </Text>
                <Button
                  leftIcon={<FiDownload />}
                  colorScheme="blue"
                  onClick={handleBackup}
                >
                  Gerar Backup
                </Button>
              </Stack>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <Heading size="md">Restaurar Backup</Heading>
            </CardHeader>
            <CardBody>
              <Stack spacing={4}>
                <Text>
                  Restaure um backup anterior do sistema. Certifique-se de selecionar
                  um arquivo de backup válido.
                </Text>
                <Button
                  leftIcon={<FiUpload />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={handleRestore}
                >
                  Restaurar Backup
                </Button>
              </Stack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
