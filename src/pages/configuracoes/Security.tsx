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
  Card,
  CardBody,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';
import { FiLock } from 'react-icons/fi';

export function Security() {
  const toast = useToast();
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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
    <Box>
      <PageHeader
        title="Segurança"
        subtitle="Gerencie suas configurações de segurança e privacidade"
        icon={FiLock}
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Segurança', href: '/configuracoes/seguranca' }
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
                    Alterar Senha
                  </Text>
                  <VStack spacing={4} align="stretch">
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
                  </VStack>
                </Box>

                <Divider />

                <Box>
                  <Text fontSize="lg" fontWeight="semibold" mb={4}>
                    Autenticação em Duas Etapas
                  </Text>
                  <VStack spacing={4} align="stretch">
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
                  </VStack>
                </Box>

                <Box pt={4}>
                  <Button 
                    colorScheme="blue" 
                    size="lg" 
                    w={{ base: "full", md: "auto" }}
                    onClick={handleSave}
                  >
                    Salvar Alterações
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
