import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useColorModeValue,
  Container,
  Flex,
  Icon,
  Grid,
  GridItem,
  Progress,
  HStack,
  VStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Divider,
} from '@chakra-ui/react';
import { FiUsers, FiShoppingBag, FiTruck, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { IconType } from 'react-icons';
import { PageHeader } from '../components/PageHeader';
import { useAuth } from '../contexts/AuthContext';

interface SalesCardProps {
  month: string;
  value: number;
  growth: number;
}

interface StatCardProps {
  label: string;
  value: string;
  icon: IconType;
  percentage: string;
  isIncrease: boolean;
}

// Dados de vendas mensais
const salesData: SalesCardProps[] = [
  { month: 'Jan', value: 45670, growth: 23.36 },
  { month: 'Fev', value: 52450, growth: 14.85 },
  { month: 'Mar', value: 48320, growth: -7.87 },
  { month: 'Abr', value: 51280, growth: 6.13 },
  { month: 'Mai', value: 53420, growth: 4.17 },
  { month: 'Jun', value: 56800, growth: 6.33 }
];

const SalesCard: React.FC<SalesCardProps> = ({ month, value, growth }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
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
      <VStack spacing={1} align="stretch">
        <Text fontSize="sm" color={textColor}>
          {month}
        </Text>
        <Text fontSize="lg" fontWeight="bold">
          R$ {value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
        </Text>
        <HStack spacing={1}>
          <Icon
            as={growth >= 0 ? FiTrendingUp : FiTrendingDown}
            color={growth >= 0 ? 'green.500' : 'red.500'}
          />
          <Text
            fontSize="sm"
            color={growth >= 0 ? 'green.500' : 'red.500'}
          >
            {Math.abs(growth).toFixed(2)}%
          </Text>
        </HStack>
      </VStack>
    </Card>
  );
};

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, percentage, isIncrease }) => {
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Card
      bg={cardBg}
      shadow="sm"
      rounded="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={6}
    >
      <VStack spacing={2} align="stretch">
        <HStack justify="space-between">
          <Icon as={icon} boxSize={6} color="blue.500" />
          <Badge
            colorScheme={isIncrease ? 'green' : 'red'}
            variant="subtle"
            rounded="full"
            px={2}
          >
            {isIncrease ? '+' : '-'}{percentage}
          </Badge>
        </HStack>
        <Text fontSize="2xl" fontWeight="bold">
          {value}
        </Text>
        <Text fontSize="sm" color={textColor}>
          {label}
        </Text>
      </VStack>
    </Card>
  );
};

export function Dashboard() {
  const { usuario } = useAuth();
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.100', 'gray.700');
  const bgColor = useColorModeValue('gray.50', 'gray.900');

  return (
    <Box w="full" minH="100vh" bg={bgColor}>
      <Container maxW="full" p={{ base: 4, lg: 8 }}>
        <PageHeader
          title="Dashboard"
          subtitle={`Bem-vindo, ${usuario?.nome || 'Usuário'}!`}
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' }
          ]}
        />

        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={{ base: 4, lg: 8 }} 
          mt={8}
        >
          <StatCard
            label="Vendas (mês)"
            value="R$ 45.670,00"
            icon={FiShoppingBag}
            percentage="23.36%"
            isIncrease={true}
          />
          <StatCard
            label="Clientes Ativos"
            value="345"
            icon={FiUsers}
            percentage="12%"
            isIncrease={true}
          />
          <StatCard
            label="Pedidos Pendentes"
            value="23"
            icon={FiTruck}
            percentage="5%"
            isIncrease={false}
          />
        </SimpleGrid>

        <Grid 
          templateColumns={{ 
            base: '1fr', 
            lg: '2fr 1fr' 
          }} 
          gap={{ base: 4, lg: 8 }} 
          mt={8}
        >
          <GridItem>
            <Card
              bg={cardBg}
              shadow="xl"
              rounded="xl"
              borderWidth="1px"
              borderColor={borderColor}
              p={{ base: 4, lg: 6 }}
              h="full"
            >
              <Heading size="md" mb={6}>Análise de Vendas</Heading>
              <SimpleGrid 
                columns={{ base: 1, sm: 2, md: 3, xl: 6 }} 
                spacing={4}
              >
                {salesData.map((data, index) => (
                  <SalesCard
                    key={index}
                    month={data.month}
                    value={data.value}
                    growth={data.growth}
                  />
                ))}
              </SimpleGrid>
            </Card>
          </GridItem>

          <GridItem>
            <VStack spacing={{ base: 4, lg: 8 }}>
              <Card
                bg={cardBg}
                shadow="xl"
                rounded="xl"
                borderWidth="1px"
                borderColor={borderColor}
                p={{ base: 4, lg: 6 }}
                w="full"
              >
                <Heading size="md" mb={6}>Metas do Mês</Heading>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Flex justify="space-between" mb={2}>
                      <Text>Vendas</Text>
                      <Text>85%</Text>
                    </Flex>
                    <Progress 
                      value={85} 
                      colorScheme="green" 
                      rounded="full" 
                      size="lg"
                    />
                  </Box>
                  <Box>
                    <Flex justify="space-between" mb={2}>
                      <Text>Novos Clientes</Text>
                      <Text>62%</Text>
                    </Flex>
                    <Progress 
                      value={62} 
                      colorScheme="blue" 
                      rounded="full" 
                      size="lg"
                    />
                  </Box>
                  <Box>
                    <Flex justify="space-between" mb={2}>
                      <Text>Satisfação</Text>
                      <Text>93%</Text>
                    </Flex>
                    <Progress 
                      value={93} 
                      colorScheme="purple" 
                      rounded="full" 
                      size="lg"
                    />
                  </Box>
                </VStack>
              </Card>

              <Card
                bg={cardBg}
                shadow="xl"
                rounded="xl"
                borderWidth="1px"
                borderColor={borderColor}
                p={{ base: 4, lg: 6 }}
                w="full"
              >
                <Heading size="md" mb={6}>Últimos Pedidos</Heading>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Pedido</Th>
                      <Th>Cliente</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td fontWeight="medium">#1234</Td>
                      <Td>João Silva</Td>
                      <Td><Badge colorScheme="green" rounded="full" px={2}>Concluído</Badge></Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="medium">#1233</Td>
                      <Td>Maria Santos</Td>
                      <Td><Badge colorScheme="yellow" rounded="full" px={2}>Em Processo</Badge></Td>
                    </Tr>
                    <Tr>
                      <Td fontWeight="medium">#1232</Td>
                      <Td>Pedro Oliveira</Td>
                      <Td><Badge colorScheme="blue" rounded="full" px={2}>Em Entrega</Badge></Td>
                    </Tr>
                  </Tbody>
                </Table>
              </Card>
            </VStack>
          </GridItem>
        </Grid>
      </Container>
    </Box>
  );
}
