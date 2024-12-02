import {
  Box,
  Container,
  Card,
  VStack,
  Text,
  useColorModeValue,
  SimpleGrid,
  Button,
  Image,
  Badge,
  HStack,
  Switch,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Divider,
} from '@chakra-ui/react';
import { FiPlus, FiSettings } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';

interface IntegrationCardProps {
  name: string;
  description: string;
  logo: string;
  status: 'active' | 'inactive' | 'pending';
  isConfigured: boolean;
}

const IntegrationCard: React.FC<IntegrationCardProps> = ({
  name,
  description,
  logo,
  status,
  isConfigured,
}) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card
      bg={cardBg}
      shadow="sm"
      rounded="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={4}
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="start">
          <Image
            src={logo}
            alt={name}
            boxSize="40px"
            objectFit="contain"
            fallbackSrc="https://via.placeholder.com/40"
          />
          <Badge
            colorScheme={
              status === 'active'
                ? 'green'
                : status === 'pending'
                ? 'yellow'
                : 'gray'
            }
          >
            {status === 'active'
              ? 'Ativo'
              : status === 'pending'
              ? 'Pendente'
              : 'Inativo'}
          </Badge>
        </HStack>

        <VStack align="stretch" spacing={1}>
          <Text fontWeight="semibold">{name}</Text>
          <Text fontSize="sm" color="gray.500">
            {description}
          </Text>
        </VStack>

        <HStack justify="space-between">
          <Switch
            isChecked={status === 'active'}
            size="sm"
          />
          <IconButton
            aria-label="Configurar integração"
            icon={<FiSettings />}
            size="sm"
            variant="ghost"
            isDisabled={!isConfigured}
          />
        </HStack>
      </VStack>
    </Card>
  );
};

const integrations: IntegrationCardProps[] = [
  {
    name: 'Mercado Livre',
    description: 'Integração com marketplace',
    logo: 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus@2x.png',
    status: 'active',
    isConfigured: true,
  },
  {
    name: 'Shopee',
    description: 'Integração com marketplace',
    logo: 'https://cf.shopee.com.br/file/br-50009109-159ba5bf8f3e96a83f15871670b3cce2',
    status: 'inactive',
    isConfigured: false,
  },
  {
    name: 'Correios',
    description: 'Integração para envios',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Correios_logo.svg/1200px-Correios_logo.svg.png',
    status: 'active',
    isConfigured: true,
  },
  {
    name: 'PagSeguro',
    description: 'Gateway de pagamento',
    logo: 'https://logodownload.org/wp-content/uploads/2019/09/pagseguro-logo-2.png',
    status: 'pending',
    isConfigured: true,
  },
];

export function IntegrationsSettings() {
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box w="full" minH="100vh" bg={bgColor}>
      <Container maxW="full" p={{ base: 4, lg: 8 }}>
        <PageHeader
          title="Integrações"
          subtitle="Gerencie as integrações do sistema"
          breadcrumbs={[
            { label: 'Configurações', href: '/settings' },
            { label: 'Integrações', href: '/settings/integrations' }
          ]}
        />

        <VStack spacing={8} align="stretch">
          <Card
            bg={useColorModeValue('white', 'gray.700')}
            shadow="xl"
            rounded="xl"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            p={{ base: 4, lg: 6 }}
          >
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontSize="lg" fontWeight="semibold">
                  Integrações Disponíveis
                </Text>
                <Button
                  leftIcon={<FiPlus />}
                  colorScheme="blue"
                  size="sm"
                >
                  Nova Integração
                </Button>
              </HStack>

              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={4}
              >
                {integrations.map((integration, index) => (
                  <IntegrationCard key={index} {...integration} />
                ))}
              </SimpleGrid>
            </VStack>
          </Card>

          <Card
            bg={useColorModeValue('white', 'gray.700')}
            shadow="xl"
            rounded="xl"
            borderWidth="1px"
            borderColor={useColorModeValue('gray.200', 'gray.600')}
            p={{ base: 4, lg: 6 }}
          >
            <VStack spacing={4} align="stretch">
              <Text fontSize="lg" fontWeight="semibold">
                Configurações Globais de Integração
              </Text>

              <Divider />

              <FormControl>
                <FormLabel>Intervalo de Sincronização (minutos)</FormLabel>
                <Input type="number" defaultValue={15} />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Sincronização Automática
                </FormLabel>
                <Switch defaultChecked />
              </FormControl>

              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Notificações de Erro
                </FormLabel>
                <Switch defaultChecked />
              </FormControl>

              <Button colorScheme="blue" alignSelf="flex-start">
                Salvar Configurações
              </Button>
            </VStack>
          </Card>
        </VStack>
      </Container>
    </Box>
  );
}
