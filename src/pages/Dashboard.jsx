import { Box, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText, Card, CardBody } from '@chakra-ui/react'

export default function Dashboard() {
  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Vendas Hoje</StatLabel>
              <StatNumber>R$ 0,00</StatNumber>
              <StatHelpText>Atualizado agora</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Clientes</StatLabel>
              <StatNumber>0</StatNumber>
              <StatHelpText>Total de clientes</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card>
          <CardBody>
            <Stat>
              <StatLabel>Produtos</StatLabel>
              <StatNumber>0</StatNumber>
              <StatHelpText>Em estoque</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>
    </Box>
  )
}
