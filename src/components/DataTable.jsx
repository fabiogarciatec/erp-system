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
} from '@chakra-ui/react'

export default function DataTable({
  columns = [],
  data = [],
  isLoading = false,
}) {
  if (isLoading) {
    return (
      <Center py={8}>
        <Spinner size="xl" color="blue.500" />
      </Center>
    )
  }

  if (!data.length) {
    return (
      <Center py={8}>
        <Text color="gray.500">Nenhum registro encontrado</Text>
      </Center>
    )
  }

  return (
    <Box overflowX="auto">
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
              {columns.map((column, colIndex) => (
                <Td key={colIndex}>
                  {column.cell
                    ? column.cell(row[column.accessor], row)
                    : row[column.accessor]}
                </Td>
              ))}
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}
