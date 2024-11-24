import React from 'react'
import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody } from '@chakra-ui/react'

function Dashboard() {
  return (
    <Box>
      <Heading mb={6}>Dashboard</Heading>
      
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Vendas Hoje</StatLabel>
              <StatNumber>R$ 5.670</StatNumber>
              <StatHelpText>↗︎ 23.36%</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Clientes Ativos</StatLabel>
              <StatNumber>245</StatNumber>
              <StatHelpText>↗︎ 14.2%</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Produtos em Estoque</StatLabel>
              <StatNumber>1.234</StatNumber>
              <StatHelpText>↘︎ 9.05%</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Pedidos Pendentes</StatLabel>
              <StatNumber>23</StatNumber>
              <StatHelpText>↗︎ 7.58%</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  )
}

export default Dashboard
