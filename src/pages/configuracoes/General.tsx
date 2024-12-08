import {
  Box,
  Card,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  useColorModeValue,
  Switch,
  Text,
  Divider,
  Icon,
} from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';
import { FiSettings } from 'react-icons/fi';

export function GeneralSettings() {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box>
      <PageHeader
        title="Configurações Gerais"
        subtitle="Gerencie as configurações básicas do sistema"
        icon={FiSettings}
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Geral', href: '/configuracoes/geral' }
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
            <VStack spacing={6} align="stretch">
              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Preferências do Sistema
                </Text>
                <VStack spacing={4} align="stretch">
                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">
                      Modo Escuro
                    </FormLabel>
                    <Switch id="dark-mode" />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">
                      Notificações do Sistema
                    </FormLabel>
                    <Switch id="notifications" defaultChecked />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Idioma do Sistema</FormLabel>
                    <Select defaultValue="pt-BR">
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es">Español</option>
                    </Select>
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Configurações de Exibição
                </Text>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Formato de Data</FormLabel>
                    <Select defaultValue="dd/MM/yyyy">
                      <option value="dd/MM/yyyy">DD/MM/AAAA</option>
                      <option value="MM/dd/yyyy">MM/DD/AAAA</option>
                      <option value="yyyy-MM-dd">AAAA-MM-DD</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Formato de Moeda</FormLabel>
                    <Select defaultValue="BRL">
                      <option value="BRL">Real (R$)</option>
                      <option value="USD">Dólar (US$)</option>
                      <option value="EUR">Euro (€)</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Fuso Horário</FormLabel>
                    <Select defaultValue="America/Sao_Paulo">
                      <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                      <option value="America/New_York">Nova York (GMT-4)</option>
                      <option value="Europe/London">Londres (GMT+1)</option>
                    </Select>
                  </FormControl>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Text fontSize="lg" fontWeight="semibold" mb={4}>
                  Configurações de Email
                </Text>
                <VStack spacing={4} align="stretch">
                  <FormControl>
                    <FormLabel>Email para Notificações</FormLabel>
                    <Input type="email" placeholder="seu@email.com" />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">
                      Receber Relatórios Diários
                    </FormLabel>
                    <Switch id="daily-reports" />
                  </FormControl>

                  <FormControl display="flex" alignItems="center">
                    <FormLabel mb="0">
                      Receber Alertas de Estoque
                    </FormLabel>
                    <Switch id="stock-alerts" defaultChecked />
                  </FormControl>
                </VStack>
              </Box>

              <Box pt={4}>
                <Button colorScheme="blue" size="lg" w={{ base: "full", md: "auto" }}>
                  Salvar Alterações
                </Button>
              </Box>
            </VStack>
          </Card>
        </VStack>
      </Box>
    </Box>
  );
}
