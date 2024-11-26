import {
  Box,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Icon,
  VStack,
  Button,
} from '@chakra-ui/react';
import {
  FiDollarSign,
  FiShoppingBag,
  FiTruck,
  FiTool,
  FiBarChart,
  FiPieChart,
  FiTrendingUp,
} from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';

export function Reports() {
  const reports = [
    {
      title: 'Relatório de Vendas',
      description: 'Análise detalhada das vendas por período',
      icon: FiDollarSign,
    },
    {
      title: 'Produtos Mais Vendidos',
      description: 'Ranking dos produtos com maior saída',
      icon: FiShoppingBag,
    },
    {
      title: 'Desempenho de Fretes',
      description: 'Análise de entregas e custos logísticos',
      icon: FiTruck,
    },
    {
      title: 'Serviços Prestados',
      description: 'Relatório de ordens de serviço concluídas',
      icon: FiTool,
    },
    {
      title: 'Análise Financeira',
      description: 'Visão geral do desempenho financeiro',
      icon: FiBarChart,
    },
    {
      title: 'Indicadores de Performance',
      description: 'KPIs e métricas principais do negócio',
      icon: FiTrendingUp,
    },
  ];

  return (
    <Box w="full" p={8}>
      <PageHeader
        title="Relatórios"
        subtitle="Visualize e exporte relatórios"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' },
          { label: 'Relatórios', href: '/reports' }
        ]}
      />

      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {reports.map((report, index) => (
          <Card key={index}>
            <CardHeader>
              <VStack spacing={4} align="flex-start">
                <Icon as={report.icon} boxSize={8} color="blue.500" />
                <Heading size="md">{report.title}</Heading>
              </VStack>
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>{report.description}</Text>
                <Button colorScheme="blue" variant="outline" size="sm">
                  Gerar Relatório
                </Button>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
}
