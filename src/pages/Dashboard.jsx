import React from 'react'
import {
  Box,
  Heading,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'

const Dashboard = () => {
  return (
    <Box p={8}>
      <Heading mb={6}>Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Vendas Hoje</StatLabel>
          <StatNumber>R$ 5.670</StatNumber>
          <StatHelpText>23% maior que ontem</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Clientes Ativos</StatLabel>
          <StatNumber>45</StatNumber>
          <StatHelpText>5 novos esta semana</StatHelpText>
        </Stat>
        <Stat p={4} shadow="md" border="1px" borderColor="gray.200" borderRadius="md">
          <StatLabel>Produtos em Estoque</StatLabel>
          <StatNumber>234</StatNumber>
          <StatHelpText>12 abaixo do mínimo</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  )
}

export default Dashboard
