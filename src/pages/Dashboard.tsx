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
      p={{ base: 3, md: 4 }}
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
      p={{ base: 4, md: 5 }}
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
        <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
          {value}
        </Text>
        <Text fontSize="sm" color={textColor}>
          {label}
        </Text>
      </VStack>
    </Card>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const textColor = useColorModeValue('gray.600', 'gray.400');

  // Stats cards data
  const stats: StatCardProps[] = [
    {
      label: 'Clientes',
      value: '1,254',
      icon: FiUsers,
      percentage: '12.5%',
      isIncrease: true
    },
    {
      label: 'Vendas',
      value: 'R$ 86,420',
      icon: FiShoppingBag,
      percentage: '8.2%',
      isIncrease: true
    },
    {
      label: 'Pedidos',
      value: '324',
      icon: FiTruck,
      percentage: '3.1%',
      isIncrease: false
    }
  ];

  return (
    <Box w="100%">
      <Box 
        pt={{ base: "10px", md: "15px" }}
        position="relative"
        w="100%"
      >
        <PageHeader 
          title="Dashboard"
          subtitle="Visão geral do seu negócio"
          breadcrumbs={[
            { label: 'Dashboard', href: '/dashboard' }
          ]}
        />

        {/* Content */}
        <Box 
          px={{ base: 2, sm: 4, md: 6 }}
          pb={{ base: 6, md: 8 }}
          w="100%"
          overflowX="hidden"
        >
          <Box maxW="1600px" mx="auto">
            {/* Stats Grid */}
            <SimpleGrid 
              columns={{ base: 1, sm: 2, md: 3 }} 
              spacing={{ base: 2, sm: 3, md: 4 }} 
              mb={{ base: 4, md: 6 }}
              w="100%"
            >
              {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
              ))}
            </SimpleGrid>

            {/* Sales Grid */}
            <Box mb={{ base: 4, md: 6 }}>
              <Heading size="md" mb={{ base: 2, md: 3 }}>
                Vendas Mensais
              </Heading>
              <SimpleGrid 
                columns={{ base: 1, sm: 2, md: 3, lg: 6 }} 
                spacing={{ base: 2, sm: 3, md: 4 }}
                w="100%"
              >
                {salesData.map((data, index) => (
                  <SalesCard key={index} {...data} />
                ))}
              </SimpleGrid>
            </Box>

            {/* Recent Activities */}
            <Card>
              <CardHeader>
                <Heading size="md">Atividades Recentes</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Ação</Th>
                      <Th>Usuário</Th>
                      <Th>Status</Th>
                      <Th>Data</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Novo cliente cadastrado</Td>
                      <Td>{user?.email}</Td>
                      <Td><Badge colorScheme="green">Concluído</Badge></Td>
                      <Td>{new Date().toLocaleDateString()}</Td>
                    </Tr>
                    <Tr>
                      <Td>Pedido atualizado</Td>
                      <Td>{user?.email}</Td>
                      <Td><Badge colorScheme="blue">Em andamento</Badge></Td>
                      <Td>{new Date().toLocaleDateString()}</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
