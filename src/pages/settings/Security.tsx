import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Switch,
  Text,
  Divider,
  useToast,
} from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';

export function Security() {
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: 'Configurações salvas',
      description: 'Suas configurações de segurança foram atualizadas.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Segurança"
        subtitle="Gerencie suas configurações de segurança"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configurações', href: '/settings' },
          { label: 'Segurança', href: '/settings/security' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <VStack spacing={6} align="stretch" maxW="600px" mx="auto">
          <Text fontSize="lg" fontWeight="bold">Alterar Senha</Text>
          
          <FormControl>
            <FormLabel>Senha Atual</FormLabel>
            <Input type="password" />
          </FormControl>

          <FormControl>
            <FormLabel>Nova Senha</FormLabel>
            <Input type="password" />
          </FormControl>

          <FormControl>
            <FormLabel>Confirmar Nova Senha</FormLabel>
            <Input type="password" />
          </FormControl>

          <Divider />

          <Text fontSize="lg" fontWeight="bold">Autenticação em Duas Etapas</Text>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">
              Ativar autenticação em duas etapas
            </FormLabel>
            <Switch colorScheme="blue" />
          </FormControl>

          <FormControl display="flex" alignItems="center">
            <FormLabel mb="0">
              Notificar sobre novos acessos
            </FormLabel>
            <Switch colorScheme="blue" defaultChecked />
          </FormControl>

          <Button colorScheme="blue" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
