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
  FiTrendingUp,
} from 'react-icons/fi';
import { PageHeader } from '../components/PageHeader';

export function Reports() {
  const cardBg = 'white';
  const borderColor = 'gray.200';

  return (
    <Box w="full">
      <PageHeader
        title="Relatórios"
        subtitle="Visualize os relatórios do sistema"
        breadcrumbs={[
          { label: 'Relatórios', href: '/reports' }
        ]}
      />

      <Box pt={8}>
        <SimpleGrid 
          columns={{ base: 1, md: 2, lg: 3 }} 
          spacing={6} 
          mb={8}
          w="full"
        >
          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Vendas</Heading>
                <Text color="gray.600">
                  Relatórios detalhados de vendas por período
                </Text>
                <Button colorScheme="blue" size="sm">
                  Gerar Relatório
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Estoque</Heading>
                <Text color="gray.600">
                  Controle de estoque e movimentações
                </Text>
                <Button colorScheme="blue" size="sm">
                  Gerar Relatório
                </Button>
              </VStack>
            </CardBody>
          </Card>

          <Card
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            shadow="sm"
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Heading size="md">Financeiro</Heading>
                <Text color="gray.600">
                  Relatórios financeiros e fluxo de caixa
                </Text>
                <Button colorScheme="blue" size="sm">
                  Gerar Relatório
                </Button>
              </VStack>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    </Box>
  );
}
