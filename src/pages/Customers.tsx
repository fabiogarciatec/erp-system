import { useState, useEffect } from 'react'
import {
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  Select,
  Flex,
  Button,
  useToast,
  Spinner,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  PageHeader,
} from '@chakra-ui/react'
import { omieService, type OmieCustomer } from '@/services/api/omie'
import { FiDownload, FiPlus } from 'react-icons/fi'

export default function Customers() {
  const [customers, setCustomers] = useState<OmieCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedState, setSelectedState] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [selectedCustomer, setSelectedCustomer] = useState<OmieCustomer | null>(null)
  const toast = useToast()

  const fetchCustomers = async (page: number) => {
    setLoading(true)
    try {
      const response = await omieService.listCustomers(page)
      if (response.success && response.data) {
        setCustomers(response.data.clientes_cadastro)
        setTotalPages(response.data.total_de_paginas)
      } else {
        throw new Error(response.error || 'Erro ao carregar clientes')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (!searchQuery) {
      fetchCustomers(1)
      return
    }

    setLoading(true)
    try {
      const response = await omieService.searchCustomers(searchQuery)
      if (response.success && response.data) {
        setCustomers(response.data.clientes_cadastro)
        setTotalPages(response.data.total_de_paginas)
        setCurrentPage(1)
      } else {
        throw new Error(response.error || 'Erro ao buscar clientes')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers(currentPage)
  }, [currentPage])

  const filteredCustomers = selectedState
    ? customers.filter(customer => customer.estado === selectedState)
    : customers

  const estados = [...new Set(customers.map(customer => customer.estado))].sort()

  const handleExportCustomers = () => {
    // Implement export customers logic here
  }

  const onOpen = () => {
    // Implement open modal logic here
  }

  return (
    <Box w="100%">
      <PageHeader 
        title="Clientes"
        subtitle="Gerencie sua base de clientes"
        breadcrumbs={[
          { label: 'Cadastros', href: '/cadastros' },
          { label: 'Clientes', href: '/cadastros/clientes' }
        ]}
        rightContent={
          <Box>
            <Button
              leftIcon={<FiDownload />}
              colorScheme="gray"
              variant="ghost"
              mr={2}
              onClick={handleExportCustomers}
            >
              Exportar
            </Button>
            <Button
              leftIcon={<FiPlus />}
              colorScheme="blue"
              onClick={onOpen}
            >
              Novo Cliente
            </Button>
          </Box>
        }
      />

      <Box 
        mt="125px"
        px={6}
      >
        <Box maxW="1600px" mx="auto">
          <Flex mb={4} gap={4}>
            <Input
              placeholder="Buscar por nome, CPF/CNPJ ou cidade"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Select
              placeholder="Filtrar por estado"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              {estados.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </Select>
            <Button colorScheme="blue" onClick={handleSearch}>
              Buscar
            </Button>
          </Flex>

          {loading ? (
            <Flex justify="center" align="center" h="200px">
              <Spinner />
            </Flex>
          ) : (
            <>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Razão Social</Th>
                    <Th>CPF/CNPJ</Th>
                    <Th>Cidade</Th>
                    <Th>Estado</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredCustomers.map((customer) => (
                    <Tr key={customer.codigo_cliente_omie}>
                      <Td>{customer.razao_social}</Td>
                      <Td>{customer.cnpj_cpf}</Td>
                      <Td>{customer.cidade}</Td>
                      <Td>{customer.estado}</Td>
                      <Td>
                        <Button
                          size="sm"
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          Detalhes
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>

              <Flex mt={4} justify="center" gap={2}>
                <Button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => p - 1)}
                >
                  Anterior
                </Button>
                <Text alignSelf="center">
                  Página {currentPage} de {totalPages}
                </Text>
                <Button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => p + 1)}
                >
                  Próxima
                </Button>
              </Flex>
            </>
          )}
        </Box>
      </Box>

      <Modal
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Detalhes do Cliente</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedCustomer && (
              <Box>
                <Text><strong>Razão Social:</strong> {selectedCustomer.razao_social}</Text>
                <Text><strong>CPF/CNPJ:</strong> {selectedCustomer.cnpj_cpf}</Text>
                <Text><strong>Email:</strong> {selectedCustomer.email}</Text>
                <Text><strong>Telefone:</strong> ({selectedCustomer.telefone1_ddd}) {selectedCustomer.telefone1_numero}</Text>
                <Text><strong>Cidade:</strong> {selectedCustomer.cidade}</Text>
                <Text><strong>Estado:</strong> {selectedCustomer.estado}</Text>
                <Text><strong>Código Omie:</strong> {selectedCustomer.codigo_cliente_omie}</Text>
                <Text><strong>Status:</strong> {selectedCustomer.status_cliente}</Text>
              </Box>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
