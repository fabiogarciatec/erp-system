import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Icon } from '@chakra-ui/react'
import { MdPeople, MdShoppingCart, MdAttachMoney } from 'react-icons/md'

const StatCard = ({ title, value, icon, helpText }) => (
  <Box p={6} bg="white" borderRadius="lg" shadow="sm">
    <Stat>
      <StatLabel fontSize="lg" display="flex" alignItems="center">
        <Icon as={icon} mr={2} /> {title}
      </StatLabel>
      <StatNumber fontSize="3xl">{value}</StatNumber>
      {helpText && <StatHelpText>{helpText}</StatHelpText>}
    </Stat>
  </Box>
)

const Dashboard = () => {
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <StatCard
          title="Clientes"
          value="120"
          icon={MdPeople}
          helpText="Total de clientes ativos"
        />
        <StatCard
          title="Vendas"
          value="R$ 45.678"
          icon={MdShoppingCart}
          helpText="Vendas este mês"
        />
        <StatCard
          title="Faturamento"
          value="R$ 123.456"
          icon={MdAttachMoney}
          helpText="Faturamento total"
        />
      </SimpleGrid>
    </Box>
  )
}

export default Dashboard
