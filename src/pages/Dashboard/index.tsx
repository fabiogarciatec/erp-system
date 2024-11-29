import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import { FiShoppingBag, FiDollarSign, FiPackage, FiUsers } from 'react-icons/fi';

// Dados mockados para o dashboard
const dashboardData = {
  vendas: {
    total: 'R$ 45.678,90',
    percentual: '+23%',
    periodo: 'Desde o último mês',
  },
  clientes: {
    total: '1.234',
    percentual: '+12%',
    periodo: 'Desde o último mês',
  },
  produtos: {
    total: '567',
    percentual: '+8%',
    periodo: 'Desde o último mês',
  },
  estoque: {
    total: '8.901',
    percentual: '-5%',
    periodo: 'Desde o último mês',
  },
};

export function Dashboard() {
  return (
    <Box p={4}>
      <Stack spacing={4}>
        <Box>
          <Heading size="lg">Dashboard</Heading>
          <Text color="gray.600">Visão geral do seu negócio</Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
          {/* Card de Vendas */}
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="lg" display="flex" alignItems="center" gap={2}>
                  <FiDollarSign /> Vendas
                </StatLabel>
                <StatNumber>{dashboardData.vendas.total}</StatNumber>
                <StatHelpText color={dashboardData.vendas.percentual.includes('+') ? 'green.500' : 'red.500'}>
                  {dashboardData.vendas.percentual}
                  <br />
                  {dashboardData.vendas.periodo}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          {/* Card de Clientes */}
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="lg" display="flex" alignItems="center" gap={2}>
                  <FiUsers /> Clientes
                </StatLabel>
                <StatNumber>{dashboardData.clientes.total}</StatNumber>
                <StatHelpText color={dashboardData.clientes.percentual.includes('+') ? 'green.500' : 'red.500'}>
                  {dashboardData.clientes.percentual}
                  <br />
                  {dashboardData.clientes.periodo}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          {/* Card de Produtos */}
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="lg" display="flex" alignItems="center" gap={2}>
                  <FiShoppingBag /> Produtos
                </StatLabel>
                <StatNumber>{dashboardData.produtos.total}</StatNumber>
                <StatHelpText color={dashboardData.produtos.percentual.includes('+') ? 'green.500' : 'red.500'}>
                  {dashboardData.produtos.percentual}
                  <br />
                  {dashboardData.produtos.periodo}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>

          {/* Card de Estoque */}
          <Card>
            <CardBody>
              <Stat>
                <StatLabel fontSize="lg" display="flex" alignItems="center" gap={2}>
                  <FiPackage /> Estoque
                </StatLabel>
                <StatNumber>{dashboardData.estoque.total}</StatNumber>
                <StatHelpText color={dashboardData.estoque.percentual.includes('+') ? 'green.500' : 'red.500'}>
                  {dashboardData.estoque.percentual}
                  <br />
                  {dashboardData.estoque.periodo}
                </StatHelpText>
              </Stat>
            </CardBody>
          </Card>
        </SimpleGrid>

        {/* Área para gráficos e mais informações */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={4}>
          <Card>
            <CardBody minH="300px">
              <Heading size="md" mb={4}>Vendas por Período</Heading>
              <Text color="gray.500">Gráfico será implementado aqui</Text>
            </CardBody>
          </Card>

          <Card>
            <CardBody minH="300px">
              <Heading size="md" mb={4}>Produtos Mais Vendidos</Heading>
              <Text color="gray.500">Gráfico será implementado aqui</Text>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Stack>
    </Box>
  );
}
