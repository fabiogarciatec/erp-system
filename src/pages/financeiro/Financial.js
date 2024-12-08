import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Table, Thead, Tbody, Tr, Th, Td, Badge, HStack, Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, VStack, FormControl, FormLabel, Input, Select, NumberInput, NumberInputField, SimpleGrid, Stack, TableContainer, } from '@chakra-ui/react';
import { FiPlus, FiDownload } from 'react-icons/fi';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { PageHeader } from '../../components/PageHeader';
const mockTransactions = [
    {
        id: '1',
        description: 'Venda #1234',
        amount: 1500.00,
        due_date: '2024-03-15',
        status: 'pending',
        type: 'receivable',
    },
    {
        id: '2',
        description: 'Fornecedor ABC',
        amount: 2300.00,
        due_date: '2024-03-10',
        status: 'paid',
        type: 'payable',
    },
];
export function Financial({ type }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [transactions] = useState(mockTransactions);
    const params = useParams();
    const currentType = type || params.type || 'receivables';
    const filteredTransactions = transactions.filter((transaction) => {
        if (currentType === 'receivables')
            return transaction.type === 'receivable';
        if (currentType === 'payables')
            return transaction.type === 'payable';
        return true;
    });
    const getStatusColor = (status) => {
        switch (status) {
            case 'paid':
                return 'green';
            case 'pending':
                return 'yellow';
            case 'overdue':
                return 'red';
            default:
                return 'gray';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'paid':
                return 'Pago';
            case 'pending':
                return 'Pendente';
            case 'overdue':
                return 'Atrasado';
            default:
                return status;
        }
    };
    const handleExportData = () => {
        // Implement export data logic here
    };
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Financeiro", subtitle: "Gerencie as finan\u00E7as da sua empresa", breadcrumbs: [
                    { label: 'Financeiro', href: '/financeiro' },
                ], rightContent: _jsxs(Box, { children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), colorScheme: "gray", variant: "ghost", mr: 2, onClick: handleExportData, children: "Exportar" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: onOpen, children: "Nova Transa\u00E7\u00E3o" })] }) }), _jsx(Box, { mt: "154px", px: 6, children: _jsx(Box, { maxW: "1600px", mx: "auto", children: _jsxs(Stack, { spacing: 6, children: [_jsx(SimpleGrid, { columns: { base: 1, md: 2, lg: 4 }, spacing: 6 }), _jsx(HStack, { spacing: 4 }), _jsx(TableContainer, { children: _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Descri\u00E7\u00E3o" }), _jsx(Th, { children: "Vencimento" }), _jsx(Th, { isNumeric: true, children: "Valor" }), _jsx(Th, { children: "Status" })] }) }), _jsx(Tbody, { children: filteredTransactions.map((transaction) => (_jsxs(Tr, { children: [_jsx(Td, { children: transaction.description }), _jsx(Td, { children: new Date(transaction.due_date).toLocaleDateString() }), _jsxs(Td, { isNumeric: true, children: ["R$ ", transaction.amount.toFixed(2)] }), _jsx(Td, { children: _jsx(Badge, { colorScheme: getStatusColor(transaction.status), children: getStatusText(transaction.status) }) })] }, transaction.id))) })] }) })] }) }) }), _jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "xl", children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: currentType === 'receivables' ? 'Novo Recebimento' : 'Novo Pagamento' }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Descri\u00E7\u00E3o" }), _jsx(Input, { placeholder: "Descri\u00E7\u00E3o da transa\u00E7\u00E3o" })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Valor" }), _jsx(NumberInput, { min: 0, precision: 2, children: _jsx(NumberInputField, { placeholder: "Valor" }) })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Data de Vencimento" }), _jsx(Input, { type: "date" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Categoria" }), _jsxs(Select, { placeholder: "Selecione a categoria", children: [_jsx("option", { value: "sale", children: "Venda" }), _jsx("option", { value: "service", children: "Servi\u00E7o" }), _jsx("option", { value: "other", children: "Outro" })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Observa\u00E7\u00F5es" }), _jsx(Input, { placeholder: "Observa\u00E7\u00F5es" })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Cancelar" }), _jsx(Button, { colorScheme: "blue", children: "Salvar" })] })] })] })] }));
}
