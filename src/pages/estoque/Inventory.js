import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Text, Table, Thead, Tbody, Tr, Th, Td, Button, HStack, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, ModalFooter, VStack, FormControl, FormLabel, Input, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Badge, IconButton, useToast, Select, } from '@chakra-ui/react';
import { FiPlus, FiEdit2, FiPackage, FiDownload } from 'react-icons/fi';
import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
const mockInventory = [
    {
        id: '1',
        product_name: 'Produto A',
        sku: 'SKU001',
        quantity: 50,
        min_quantity: 10,
        location: 'Prateleira A1',
        status: 'in_stock',
    },
    {
        id: '2',
        product_name: 'Produto B',
        sku: 'SKU002',
        quantity: 5,
        min_quantity: 15,
        location: 'Prateleira B2',
        status: 'low_stock',
    },
];
export function Inventory() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [inventory] = useState(mockInventory);
    const toast = useToast();
    const getStatusColor = (status) => {
        switch (status) {
            case 'in_stock':
                return 'green';
            case 'low_stock':
                return 'yellow';
            case 'out_of_stock':
                return 'red';
            default:
                return 'gray';
        }
    };
    const getStatusText = (status) => {
        switch (status) {
            case 'in_stock':
                return 'Em Estoque';
            case 'low_stock':
                return 'Estoque Baixo';
            case 'out_of_stock':
                return 'Sem Estoque';
            default:
                return status;
        }
    };
    const handleAdjustStock = () => {
        toast({
            title: 'Estoque ajustado',
            description: 'O estoque foi ajustado com sucesso.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
        onClose();
    };
    const handleExportInventory = () => {
        // Implement export functionality
    };
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Invent\u00E1rio", subtitle: "Gerencie seu estoque", breadcrumbs: [
                    { label: 'Operações', href: '/operacoes' },
                    { label: 'Inventário', href: '/operacoes/inventario' }
                ], rightContent: _jsxs(Box, { children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), colorScheme: "gray", variant: "ghost", mr: 2, onClick: handleExportInventory, children: "Exportar" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: onOpen, children: "Novo Item" })] }) }), _jsx(Box, { mt: "154px", px: 6, children: _jsxs(Box, { maxW: "1600px", mx: "auto", children: [_jsx(Box, { mb: 4, children: _jsx(HStack, { justify: "space-between", mb: 4, children: _jsx(Text, { fontSize: "2xl", fontWeight: "bold", children: "Controle de Estoque" }) }) }), _jsx(Box, { overflowX: "auto", children: _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "Produto" }), _jsx(Th, { children: "SKU" }), _jsx(Th, { isNumeric: true, children: "Quantidade" }), _jsx(Th, { isNumeric: true, children: "M\u00EDnimo" }), _jsx(Th, { children: "Localiza\u00E7\u00E3o" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "A\u00E7\u00F5es" })] }) }), _jsx(Tbody, { children: inventory.map((item) => (_jsxs(Tr, { children: [_jsx(Td, { children: item.product_name }), _jsx(Td, { children: item.sku }), _jsx(Td, { isNumeric: true, children: item.quantity }), _jsx(Td, { isNumeric: true, children: item.min_quantity }), _jsx(Td, { children: item.location }), _jsx(Td, { children: _jsx(Badge, { colorScheme: getStatusColor(item.status), children: getStatusText(item.status) }) }), _jsx(Td, { children: _jsxs(HStack, { spacing: 2, children: [_jsx(IconButton, { "aria-label": "Ajustar estoque", icon: _jsx(FiEdit2, {}), size: "sm", colorScheme: "blue", variant: "ghost", onClick: onOpen }), _jsx(IconButton, { "aria-label": "Ver movimenta\u00E7\u00F5es", icon: _jsx(FiPackage, {}), size: "sm", colorScheme: "green", variant: "ghost" })] }) })] }, item.id))) })] }) })] }) }), _jsxs(Modal, { isOpen: isOpen, onClose: onClose, size: "xl", children: [_jsx(ModalOverlay, {}), _jsxs(ModalContent, { children: [_jsx(ModalHeader, { children: "Ajuste de Estoque" }), _jsx(ModalCloseButton, {}), _jsx(ModalBody, { children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Produto" }), _jsxs(Select, { placeholder: "Selecione o produto", children: [_jsx("option", { value: "1", children: "Produto A" }), _jsx("option", { value: "2", children: "Produto B" })] })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Tipo de Movimenta\u00E7\u00E3o" }), _jsxs(Select, { placeholder: "Selecione o tipo", children: [_jsx("option", { value: "in", children: "Entrada" }), _jsx("option", { value: "out", children: "Sa\u00EDda" }), _jsx("option", { value: "adjustment", children: "Ajuste" })] })] }), _jsxs(FormControl, { isRequired: true, children: [_jsx(FormLabel, { children: "Quantidade" }), _jsxs(NumberInput, { min: 1, children: [_jsx(NumberInputField, {}), _jsxs(NumberInputStepper, { children: [_jsx(NumberIncrementStepper, {}), _jsx(NumberDecrementStepper, {})] })] })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Localiza\u00E7\u00E3o" }), _jsx(Input, { placeholder: "Localiza\u00E7\u00E3o do produto" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Observa\u00E7\u00F5es" }), _jsx(Input, { placeholder: "Observa\u00E7\u00F5es sobre o ajuste" })] })] }) }), _jsxs(ModalFooter, { children: [_jsx(Button, { variant: "ghost", mr: 3, onClick: onClose, children: "Cancelar" }), _jsx(Button, { colorScheme: "blue", onClick: handleAdjustStock, children: "Confirmar Ajuste" })] })] })] })] }));
}
