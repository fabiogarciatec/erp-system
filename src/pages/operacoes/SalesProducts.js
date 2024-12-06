import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Badge, } from '@chakra-ui/react';
import { FiPlus } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
export function SalesProducts() {
    return (_jsxs(Box, { w: "full", p: 8, children: [_jsx(PageHeader, { title: "Vendas de Produtos", subtitle: "Gerencie suas vendas de produtos", breadcrumbs: [
                    { label: 'Dashboard', href: '/' },
                    { label: 'Vendas', href: '/sales' },
                    { label: 'Produtos', href: '/sales/products' }
                ] }), _jsxs(Box, { bg: "white", rounded: "lg", shadow: "sm", overflow: "hidden", children: [_jsx(Box, { p: 4, borderBottomWidth: "1px", display: "flex", justifyContent: "space-between", children: _jsx(Button, { colorScheme: "blue", leftIcon: _jsx(FiPlus, {}), children: "Nova Venda" }) }), _jsx(Box, { overflowX: "auto", children: _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "C\u00F3digo" }), _jsx(Th, { children: "Cliente" }), _jsx(Th, { children: "Data" }), _jsx(Th, { children: "Valor Total" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "A\u00E7\u00F5es" })] }) }), _jsx(Tbody, { children: _jsxs(Tr, { children: [_jsx(Td, { children: "VD001" }), _jsx(Td, { children: "Cliente Exemplo" }), _jsx(Td, { children: "01/01/2024" }), _jsx(Td, { children: "R$ 1.500,00" }), _jsx(Td, { children: _jsx(Badge, { colorScheme: "green", children: "Conclu\u00EDda" }) }), _jsx(Td, { children: "-" })] }) })] }) })] })] }));
}
