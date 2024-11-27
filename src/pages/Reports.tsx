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
} from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';

export function Reports() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box w="full">
      <PageHeader
        title="Relatórios"
        subtitle="Visualize seus relatórios e métricas"
        breadcrumbs={[
          { label: 'Relatórios', href: '/reports' }
        ]}
      />

      <Box pt={8}>
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
  );
}
