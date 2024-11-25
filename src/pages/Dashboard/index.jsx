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
    <Box w="full">
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <StatCard
          title="Clientes"
          value="150"
          icon={MdPeople}
          helpText="Total de clientes ativos"
        />
        <StatCard
          title="Vendas"
          value="28"
          icon={MdShoppingCart}
          helpText="Vendas este mês"
        />
        <StatCard
          title="Receita"
          value="R$ 45.850"
          icon={MdAttachMoney}
          helpText="Receita mensal"
        />
      </SimpleGrid>
    </Box>
  )
}

export default Dashboard
