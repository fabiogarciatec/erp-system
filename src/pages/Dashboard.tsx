import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';
import { PageHeader } from '../components/PageHeader';

export function Dashboard() {
  return (
    <Box w="full" p={2}>
      <PageHeader
        title="Dashboard"
        subtitle="Bem-vindo ao seu painel de controle"
        breadcrumbs={[
          { label: 'Dashboard', href: '/' }
        ]}
      />

      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={{ base: 5, lg: 8 }}>
        <Stat
          px={{ base: 2, md: 4 }}
          py="5"
          shadow="base"
          rounded="lg"
          bg="white"
        >
          <StatLabel>Vendas (mês)</StatLabel>
          <StatNumber>R$ 45.670,00</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            23.36%
          </StatHelpText>
        </Stat>

        <Stat
          px={{ base: 2, md: 4 }}
          py="5"
          shadow="base"
          rounded="lg"
          bg="white"
        >
          <StatLabel>Clientes Ativos</StatLabel>
          <StatNumber>345</StatNumber>
          <StatHelpText>
            <StatArrow type="increase" />
            12%
          </StatHelpText>
        </Stat>

        <Stat
          px={{ base: 2, md: 4 }}
          py="5"
          shadow="base"
          rounded="lg"
          bg="white"
        >
          <StatLabel>Pedidos Pendentes</StatLabel>
          <StatNumber>23</StatNumber>
          <StatHelpText>
            <StatArrow type="decrease" />
            5%
          </StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  );
}
