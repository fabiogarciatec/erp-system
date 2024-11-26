import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Flex,
  Heading,
} from '@chakra-ui/react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { supabase } from '../services/supabase';
import { PageHeader } from '../components/PageHeader';

export function ShippingOrders() {
  const [orders, setOrders] = useState<ShippingOrder[]>([]);
  const toast = useToast();

  useEffect(() => {
  }, []);

  return (
    <Box w="full" p={8}>
      <Box w="full">
        <PageHeader
          title="Pedidos de Frete"
          subtitle="Gerencie seus pedidos de frete"
          breadcrumbs={[
            { label: 'Dashboard', href: '/' },
            { label: 'Vendas', href: '/sales' },
            { label: 'Fretes', href: '/sales/shipping' }
          ]}
        />

        <Box bg="white" rounded="lg" shadow="sm" overflow="hidden">
          <Box p={4} borderBottomWidth="1px" display="flex" justifyContent="space-between">
            <InputGroup maxW="300px">
              <Input
                placeholder="Buscar pedido de frete..."
              />
              <InputRightElement>
                <Button
                  size="sm"
                  variant="ghost"
                  aria-label="Search"
                >
                  <FiSearch />
                </Button>
              </InputRightElement>
            </InputGroup>
            <Button 
              colorScheme="blue" 
              leftIcon={<FiPlus />}
            >
              Novo Pedido
            </Button>
          </Box>

          <Box overflowX="auto">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Pedido</Th>
                  <Th>Cliente</Th>
                  <Th>Origem</Th>
                  <Th>Destino</Th>
                  <Th>Data Entrega</Th>
                  <Th>Status</Th>
                  <Th>Valor</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>PF001</Td>
                  <Td>Cliente Exemplo</Td>
                  <Td>São Paulo, SP</Td>
                  <Td>Rio de Janeiro, RJ</Td>
                  <Td>05/01/2024</Td>
                  <Td>
                    <Badge colorScheme="blue">Em Rota</Badge>
                  </Td>
                  <Td>R$ 350,00</Td>
                  <Td>-</Td>
                </Tr>
              </Tbody>
            </Table>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
