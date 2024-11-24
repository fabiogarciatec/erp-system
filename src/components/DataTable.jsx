import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Text,
  Spinner,
  Center,
  TableContainer,
} from '@chakra-ui/react'

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    )
  }

  if (!data.length) {
    return (
      <Center py={8}>
        <Text color="gray.500" fontSize="lg">
          Nenhum registro encontrado
        </Text>
      </Center>
    )
  }

  return (
    <TableContainer>
      <Table variant="simple">
        <Thead>
          <Tr>
            {columns.map((column, index) => (
              <Th key={index}>{column.header}</Th>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, rowIndex) => (
            <Tr key={rowIndex}>
              {columns.map((column, colIndex) => {
                const value = row[column.accessorKey]
                return (
                  <Td key={`${rowIndex}-${colIndex}`}>
                    {column.cell ? column.cell({ row: { original: row }, value }) : value}
                  </Td>
                )
              })}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  )
}
