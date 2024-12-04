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
  Card,
  CardBody,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';
import { FiBell } from 'react-icons/fi';

export function Notifications() {
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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
    <Box>
      <PageHeader
        title="Notificações"
        subtitle="Gerencie suas preferências de notificações e alertas"
        icon={FiBell}
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Notificações', href: '/configuracoes/notificacoes' }
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
                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Notificações por E-mail
                  </Text>
                  <VStack spacing={4} align="stretch">
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
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Notificações do Sistema
                  </Text>
                  <VStack spacing={4} align="stretch">
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
                </Box>

                <Box pt={4}>
                  <Button 
                    colorScheme="blue" 
                    size="lg" 
                    w={{ base: "full", md: "auto" }}
                    onClick={handleSave}
                  >
                    Salvar Preferências
                  </Button>
                </Box>
              </VStack>
            </CardBody>
          </Card>
        </VStack>
      </Box>
    </Box>
  );
}
