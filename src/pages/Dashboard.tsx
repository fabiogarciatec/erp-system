import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, StatArrow } from '@chakra-ui/react'
import DashboardLayout from '../components/DashboardLayout'
import { PageHeader } from '../components/PageHeader'

export function Dashboard() {
  return (
    <DashboardLayout>
      <Box w="full" p={2}>
        <PageHeader
          title="Dashboard"
          subtitle="Bem-vindo ao seu painel de controle"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' }
          ]}
        />

        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={2}>
          <Stat p={3} bg="white" borderRadius="lg" shadow="sm">
            <StatLabel>Total de Clientes</StatLabel>
            <StatNumber>345</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              23.36%
            </StatHelpText>
          </Stat>

          <Stat p={3} bg="white" borderRadius="lg" shadow="sm">
            <StatLabel>Vendas do Mês</StatLabel>
            <StatNumber>R$ 45.670</StatNumber>
            <StatHelpText>
              <StatArrow type="increase" />
              12.5%
            </StatHelpText>
          </Stat>

          <Stat p={3} bg="white" borderRadius="lg" shadow="sm">
            <StatLabel>Produtos Ativos</StatLabel>
            <StatNumber>89</StatNumber>
            <StatHelpText>
              <StatArrow type="decrease" />
              9.05%
            </StatHelpText>
          </Stat>
        </SimpleGrid>
      </Box>
    </DashboardLayout>
  )
}
