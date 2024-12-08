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
  useColorModeValue,
} from '@chakra-ui/react';
import {
  FiDollarSign,
  FiShoppingBag,
  FiTruck,
  FiTool,
  FiBarChart,
  FiTrendingUp,
  FiDownload
} from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';

interface ReportsProps {
  type?: 'sales' | 'financial' | 'inventory';
}

export function Reports({ type }: ReportsProps) {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Se um tipo específico for passado, renderiza apenas aquele relatório
  if (type) {
    return (
      <Box w="full">
        <PageHeader
          title={`Relatório de ${type === 'sales' ? 'Vendas' : type === 'financial' ? 'Financeiro' : 'Estoque'}`}
          subtitle="Detalhes do relatório"
          breadcrumbs={[
            { label: 'Relatórios', href: '/reports' },
            { label: type, href: `/reports/${type}` }
          ]}
        />
        <Box pt={8}>
          <Text>Relatório detalhado de {type === 'sales' ? 'Vendas' : type === 'financial' ? 'Financeiro' : 'Estoque'}</Text>
          {/* Aqui você pode adicionar o conteúdo específico de cada tipo de relatório */}
        </Box>
      </Box>
    );
  }

  // Se nenhum tipo for passado, renderiza a página principal de relatórios
  return (
    <Box w="100%">
      <PageHeader
        title="Relatórios"
        subtitle="Visualize e exporte relatórios"
        breadcrumbs={[
          { label: 'Relatórios', href: '/relatorios' }
        ]}
        rightContent={
          <Button
            leftIcon={<Icon as={FiDownload} />}
            colorScheme="blue"
            // onClick={handleExportReport}
          >
            Exportar
          </Button>
        }
      />

      <Box mt="125px" px={6}>
        <Box maxW="1600px" mx="auto">
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md">Vendas</Heading>
                  <Text>Relatórios de vendas e faturamento</Text>
                  <Button
                    leftIcon={<Icon as={FiDollarSign} />}
                    colorScheme="blue"
                    variant="outline"
                    w="full"
                  >
                    Ver relatório
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiBarChart} />}
                    colorScheme="blue"
                    variant="ghost"
                    w="full"
                  >
                    Ver métricas
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md">Produtos</Heading>
                  <Text>Relatórios de estoque e movimentação</Text>
                  <Button
                    leftIcon={<Icon as={FiShoppingBag} />}
                    colorScheme="blue"
                    variant="outline"
                    w="full"
                  >
                    Ver relatório
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiTruck} />}
                    colorScheme="blue"
                    variant="ghost"
                    w="full"
                  >
                    Ver movimentações
                  </Button>
                </VStack>
              </CardBody>
            </Card>

            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor}>
              <CardBody>
                <VStack align="start" spacing={4}>
                  <Heading size="md">Serviços</Heading>
                  <Text>Relatórios de ordens de serviço</Text>
                  <Button
                    leftIcon={<Icon as={FiTool} />}
                    colorScheme="blue"
                    variant="outline"
                    w="full"
                  >
                    Ver relatório
                  </Button>
                  <Button
                    leftIcon={<Icon as={FiTrendingUp} />}
                    colorScheme="blue"
                    variant="ghost"
                    w="full"
                  >
                    Ver tendências
                  </Button>
                </VStack>
              </CardBody>
            </Card>
          </SimpleGrid>
        </Box>
      </Box>
    </Box>
  );
}
