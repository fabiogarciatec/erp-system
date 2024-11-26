import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Switch,
  Text,
  Divider,
  Button,
  useToast,
} from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';

export default function Notifications() {
  const toast = useToast();

  const handleSave = () => {
    toast({
      title: 'Configurações salvas',
      description: 'Suas configurações de notificações foram atualizadas.',
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Notificações"
        subtitle="Gerencie suas preferências de notificação"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Configurações', href: '/settings' },
          { label: 'Notificações', href: '/settings/notifications' }
        ]}
      />

      <Box bg="white" rounded="lg" shadow="sm" p={6}>
        <VStack spacing={6} align="stretch" maxW="600px" mx="auto">
          <Text fontSize="lg" fontWeight="bold">Notificações por E-mail</Text>
          
          <VStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Novas vendas
              </FormLabel>
              <Switch colorScheme="blue" defaultChecked />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Novos pedidos
              </FormLabel>
              <Switch colorScheme="blue" defaultChecked />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Atualizações de estoque
              </FormLabel>
              <Switch colorScheme="blue" />
            </FormControl>
          </VStack>

          <Divider />

          <Text fontSize="lg" fontWeight="bold">Notificações do Sistema</Text>

          <VStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Alertas de sistema
              </FormLabel>
              <Switch colorScheme="blue" defaultChecked />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Relatórios semanais
              </FormLabel>
              <Switch colorScheme="blue" defaultChecked />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel mb="0">
                Lembretes de tarefas
              </FormLabel>
              <Switch colorScheme="blue" />
            </FormControl>
          </VStack>

          <Button colorScheme="blue" onClick={handleSave}>
            Salvar Preferências
          </Button>
        </VStack>
      </Box>
    </Box>
  );
}
