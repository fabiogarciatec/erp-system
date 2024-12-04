import {
  Box,
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
  Card,
  CardBody,
  Icon,
} from '@chakra-ui/react';
import { FiPlus, FiSettings, FiLink } from 'react-icons/fi';
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
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Box>
      <PageHeader
        title="Integrações"
        subtitle="Gerencie as integrações e conexões do sistema"
        icon={FiLink}
        breadcrumbs={[
          { label: 'Configurações', href: '/configuracoes' },
          { label: 'Integrações', href: '/configuracoes/integracoes' }
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
                  <Switch colorScheme="blue" defaultChecked />
                </FormControl>

                <FormControl display="flex" alignItems="center">
                  <FormLabel mb="0">
                    Notificar Erros de Sincronização
                  </FormLabel>
                  <Switch colorScheme="blue" defaultChecked />
                </FormControl>

                <Box pt={4}>
                  <Button 
                    colorScheme="blue" 
                    size="lg" 
                    w={{ base: "full", md: "auto" }}
                  >
                    Salvar Configurações
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
