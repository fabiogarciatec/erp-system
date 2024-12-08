import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Container, VStack, Text, Input, FormControl, FormLabel, Select, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, useDisclosure, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Flex, TableContainer, ButtonGroup, Stack, Table, Thead, Tbody, Tr, Th, Td, Badge, } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { useState } from 'react';
const mockSales = [
    {
        id: '1',
        customer_name: 'João Silva',
        date: '2024-03-10',
        total: 1500.00,
        status: 'completed',
        payment_method: 'credit_card',
    },
    {
        id: '2',
        customer_name: 'Empresa XYZ',
        date: '2024-03-09',
        total: 3200.50,
        status: 'pending',
        payment_method: 'bank_transfer',
    },
];
export function Sales() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [sales] = useState(mockSales);
    const [searchTerm, setSearchTerm] = useState('');
    const [pageSize, setPageSize] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const filteredSales = sales.filter((sale) => sale.customer_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return (_jsx(Box, { w: "full", minH: "100vh", bg: "gray.100", children: _jsxs(Container, { maxW: "full", p: { base: 4, lg: 8 }, children: [_jsxs(Flex, { justify: "space-between", align: "center", wrap: "wrap", gap: 4, mb: 4, children: [_jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: "Vendas" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: onOpen, children: "Nova Venda" })] }), _jsx(TableContainer, { children: _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Cliente" }), _jsx(Th, { children: "Data" }), _jsx(Th, { isNumeric: true, children: "Total" }), _jsx(Th, { children: "Forma de Pagamento" }), _jsx(Th, { children: "Status" })] }) }), _jsx(Tbody, { children: filteredSales
                                    .slice((currentPage - 1) * pageSize, currentPage * pageSize)
                                    .map((sale) => (_jsxs(Tr, { children: [_jsx(Td, { children: sale.customer_name }), _jsx(Td, { children: new Date(sale.date).toLocaleDateString() }), _jsxs(Td, { isNumeric: true, children: ["R$ ", sale.total.toFixed(2)] }), _jsx(Td, { children: sale.payment_method === 'credit_card'
                                                ? 'Cartão de Crédito'
                                                : 'Transferência' }), _jsx(Td, { children: _jsx(Badge, { colorScheme: sale.status === 'completed'
                                                    ? 'green'
                                                    : sale.status === 'pending'
                                                        ? 'yellow'
                                                        : 'red', children: sale.status === 'completed'
                                                    ? 'Concluída'
                                                    : sale.status === 'pending'
                                                        ? 'Pendente'
                                                        : 'Cancelada' }) })] }, sale.id))) })] }) }), _jsx(Flex, { justify: "flex-end", mt: 4, children: _jsxs(Stack, { direction: { base: 'column', sm: 'row' }, spacing: 4, children: [_jsxs(Select, { value: pageSize, onChange: (e) => setPageSize(Number(e.target.value)), w: { base: 'full', sm: 'auto' }, children: [_jsx("option", { value: 5, children: "5 por p\u00E1gina" }), _jsx("option", { value: 10, children: "10 por p\u00E1gina" }), _jsx("option", { value: 20, children: "20 por p\u00E1gina" })] }), _jsxs(ButtonGroup, { children: [_jsx(Button, { onClick: () => setCurrentPage(currentPage - 1), isDisabled: currentPage === 1, children: "Anterior" }), _jsx(Button, { onClick: () => setCurrentPage(currentPage + 1), isDisabled: currentPage * pageSize >= filteredSales.length, children: "Pr\u00F3ximo" })] })] }) }), _jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "xl", children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: "Nova Venda" }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Cliente" }), _jsxs(Select, { placeholder: "Selecione o cliente", children: [_jsx("option", { value: "1", children: "Jo\u00E3o Silva" }), _jsx("option", { value: "2", children: "Empresa XYZ" })] })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Produto" }), _jsxs(Select, { placeholder: "Selecione o produto", children: [_jsx("option", { value: "1", children: "Produto A" }), _jsx("option", { value: "2", children: "Produto B" })] })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Quantidade" }), _jsxs(NumberInput, { min: 1, children: [_jsx(NumberInputField, {}), _jsxs(NumberInputStepper, { children: [_jsx(NumberIncrementStepper, {}), _jsx(NumberDecrementStepper, {})] })] })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Forma de Pagamento" }), _jsxs(Select, { placeholder: "Selecione a forma de pagamento", children: [_jsx("option", { value: "credit_card", children: "Cart\u00E3o de Cr\u00E9dito" }), _jsx("option", { value: "bank_transfer", children: "Transfer\u00EAncia Banc\u00E1ria" }), _jsx("option", { value: "cash", children: "Dinheiro" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Observa\u00E7\u00F5es" }), _jsx(Input, { placeholder: "Observa\u00E7\u00F5es sobre a venda" })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Cancelar" }), _jsx(Button, { colorScheme: "blue", children: "Finalizar Venda" })] })] })] })] }) }));
}
