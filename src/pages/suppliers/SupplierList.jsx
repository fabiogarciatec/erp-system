import React from 'react'
import { Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Button, HStack } from '@chakra-ui/react'
import { FiEdit2, FiTrash2 } from 'react-icons/fi'

const SupplierList = () => {
  const suppliers = [
    { id: 1, name: 'Fornecedor A', cnpj: '12.345.678/0001-90', phone: '(11) 1234-5678' },
    { id: 2, name: 'Fornecedor B', cnpj: '98.765.432/0001-10', phone: '(11) 8765-4321' },
  ]

  return (
    <Box p={8}>
      <Heading mb={6}>Fornecedores</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Nome</Th>
            <Th>CNPJ</Th>
            <Th>Telefone</Th>
            <Th>Ações</Th>
          </Tr>
        </Thead>
        <Tbody>
          {suppliers.map((supplier) => (
            <Tr key={supplier.id}>
              <Td>{supplier.name}</Td>
              <Td>{supplier.cnpj}</Td>
              <Td>{supplier.phone}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button size="sm" leftIcon={<FiEdit2 />} colorScheme="blue">
                    Editar
                  </Button>
                  <Button size="sm" leftIcon={<FiTrash2 />} colorScheme="red">
                    Excluir
                  </Button>
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  )
}

export default SupplierList
