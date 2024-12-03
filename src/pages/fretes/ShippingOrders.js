import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputRightElement, } from '@chakra-ui/react';
import { FiSearch, FiPlus } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
export function ShippingOrders() {
    return (_jsxs(Box, { w: "full", p: 8, children: [_jsx(PageHeader, { title: "Ordens de Frete", subtitle: "Gerencie suas ordens de frete", breadcrumbs: [
                    { label: 'Dashboard', href: '/' },
                    { label: 'Expedição', href: '/shipping' },
                    { label: 'Ordens de Frete', href: '/shipping/orders' }
                ] }), _jsxs(Box, { bg: "white", rounded: "lg", shadow: "sm", p: 6, children: [_jsxs(Box, { mb: 4, display: "flex", justifyContent: "space-between", children: [_jsxs(InputGroup, { maxW: "300px", children: [_jsx(Input, { placeholder: "Buscar ordem..." }), _jsx(InputRightElement, { children: _jsx(FiSearch, {}) })] }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", children: "Nova Ordem" })] }), _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "N\u00FAmero" }), _jsx(Th, { children: "Cliente" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "Data de Cria\u00E7\u00E3o" }), _jsx(Th, { children: "Data de Entrega" })] }) }), _jsxs(Tbody, { children: [_jsxs(Tr, { children: [_jsx(Td, { children: "ORD001" }), _jsx(Td, { children: "Cliente A" }), _jsx(Td, { children: "Em Processamento" }), _jsx(Td, { children: "2024-01-15" }), _jsx(Td, { children: "2024-01-20" })] }), _jsxs(Tr, { children: [_jsx(Td, { children: "ORD002" }), _jsx(Td, { children: "Cliente B" }), _jsx(Td, { children: "Em Tr\u00E2nsito" }), _jsx(Td, { children: "2024-01-14" }), _jsx(Td, { children: "2024-01-19" })] })] })] })] })] }));
}
