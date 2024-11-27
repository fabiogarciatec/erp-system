import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  Grid,
  GridItem,
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
} from '@chakra-ui/react';
import { PageHeader } from '../components/PageHeader';

export function Dashboard() {
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box w="full">
      <PageHeader
        title="Dashboard"
        subtitle="Bem-vindo ao seu painel de controle"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' }
        ]}
      />

      <Box pt={8}>
        <SimpleGrid 
          columns={{ base: 1, md: 3 }} 
          spacing={6} 
          mb={8}
          w="full"
        >
          <Stat
            px={3}
            py={3}
            shadow="sm"
            rounded="lg"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <StatLabel fontSize="sm" fontWeight="medium" color="gray.500">Vendas (mês)</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold">R$ 45.670,00</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36% em relação ao mês anterior
            </StatHelpText>
          </Stat>

          <Stat
            px={3}
            py={3}
            shadow="sm"
            rounded="lg"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <StatLabel fontSize="sm" fontWeight="medium" color="gray.500">Clientes Ativos</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold">345</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              12% em relação ao mês anterior
            </StatHelpText>
          </Stat>

          <Stat
            px={3}
            py={3}
            shadow="sm"
            rounded="lg"
            bg={cardBg}
            borderWidth="1px"
            borderColor={borderColor}
            _hover={{ shadow: 'md', transform: 'translateY(-2px)' }}
            transition="all 0.2s"
          >
            <StatLabel fontSize="sm" fontWeight="medium" color="gray.500">Pedidos Pendentes</StatLabel>
            <StatNumber fontSize="3xl" fontWeight="bold">23</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              5% em relação ao mês anterior
            </StatHelpText>
          </Stat>
        </SimpleGrid>

        <Grid 
          templateColumns={{ base: '1fr', lg: '2fr 1fr' }} 
          gap={6}
          w="full"
        >
          <GridItem>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm" h="full">
              <CardHeader pb={0}>
                <Heading size="md">Últimos Pedidos</Heading>
              </CardHeader>
              <CardBody>
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Pedido</Th>
                      <Th>Cliente</Th>
                      <Th>Valor</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>#1234</Td>
                      <Td>João Silva</Td>
                      <Td>R$ 1.200,00</Td>
                      <Td><Badge colorScheme="green">Concluído</Badge></Td>
                    </Tr>
                    <Tr>
                      <Td>#1233</Td>
                      <Td>Maria Santos</Td>
                      <Td>R$ 850,00</Td>
                      <Td><Badge colorScheme="yellow">Em Processo</Badge></Td>
                    </Tr>
                    <Tr>
                      <Td>#1232</Td>
                      <Td>Pedro Oliveira</Td>
                      <Td>R$ 2.300,00</Td>
                      <Td><Badge colorScheme="blue">Em Entrega</Badge></Td>
                    </Tr>
                  </Tbody>
                </Table>
              </CardBody>
            </Card>
          </GridItem>

          <GridItem>
            <Card bg={cardBg} borderWidth="1px" borderColor={borderColor} shadow="sm" h="full">
              <CardHeader pb={0}>
                <Heading size="md">Resumo do Sistema</Heading>
              </CardHeader>
              <CardBody>
                <Stack spacing={4}>
                  <Box>
                    <Text fontWeight="medium" color="gray.500">Produtos Cadastrados</Text>
                    <Text fontSize="2xl">1.234</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500">Serviços Ativos</Text>
                    <Text fontSize="2xl">56</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="medium" color="gray.500">Entregas Hoje</Text>
                    <Text fontSize="2xl">12</Text>
                  </Box>
                </Stack>
              </CardBody>
            </Card>
          </GridItem>
        </Grid>
      </Box>
    </Box>
  );
}
