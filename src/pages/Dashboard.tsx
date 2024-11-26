import { Box, Container, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/DashboardLayout';

export function Dashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <Container maxW="container.xl">
        <Box mb={8}>
          <Heading size="lg">Visão Geral</Heading>
          <Text mt={2} color="gray.600">
            Resumo das principais métricas do seu negócio
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mb={8}>
          <Box bg="white" p={6} rounded="lg" shadow="md">
            <Stat>
              <StatLabel>Vendas Hoje</StatLabel>
              <StatNumber>R$ 2.347</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                23.36%
              </StatHelpText>
            </Stat>
          </Box>

          <Box bg="white" p={6} rounded="lg" shadow="md">
            <Stat>
              <StatLabel>Clientes Ativos</StatLabel>
              <StatNumber>45</StatNumber>
              <StatHelpText>
                <StatArrow type="increase" />
                9.05%
              </StatHelpText>
            </Stat>
          </Box>

          <Box bg="white" p={6} rounded="lg" shadow="md">
            <Stat>
              <StatLabel>Produtos em Estoque</StatLabel>
              <StatNumber>234</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                12.50%
              </StatHelpText>
            </Stat>
          </Box>

          <Box bg="white" p={6} rounded="lg" shadow="md">
            <Stat>
              <StatLabel>Pedidos Pendentes</StatLabel>
              <StatNumber>7</StatNumber>
              <StatHelpText>
                <StatArrow type="decrease" />
                3.38%
              </StatHelpText>
            </Stat>
          </Box>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
          <Box bg="white" p={6} rounded="lg" shadow="md">
            <Heading size="md" mb={4}>
              Últimas Vendas
            </Heading>
            <Text color="gray.600">
              Em breve você verá aqui suas últimas vendas...
            </Text>
          </Box>

          <Box bg="white" p={6} rounded="lg" shadow="md">
            <Heading size="md" mb={4}>
              Produtos Mais Vendidos
            </Heading>
            <Text color="gray.600">
              Em breve você verá aqui seus produtos mais vendidos...
            </Text>
          </Box>
        </SimpleGrid>
      </Container>
    </DashboardLayout>
  );
}
