import { Box, Container, Heading, Text, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'

export function Dashboard() {
  return (
    <DashboardLayout>
      <Container maxW="container.xl">
        <Box mb={8}>
          <Heading size="lg">Visão Geral</Heading>
          <Text mt={2} color="gray.600">
            Bem-vindo ao seu painel de controle
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
          <Stat p={4} bg="white" borderRadius="lg" shadow="sm">
            <StatLabel>Total de Clientes</StatLabel>
            <StatNumber>345</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat p={4} bg="white" borderRadius="lg" shadow="sm">
            <StatLabel>Vendas do Mês</StatLabel>
            <StatNumber>R$ 45.670</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              12.5%
            </StatHelpText>
          </Stat>

          <Stat p={4} bg="white" borderRadius="lg" shadow="sm">
            <StatLabel>Produtos Ativos</StatLabel>
            <StatNumber>89</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              9.05%
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </Container>
    </DashboardLayout>
  )
}
