import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputRightElement, IconButton, } from '@chakra-ui/react';
import { FiMoreVertical, FiPlus } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
export function Shipping() {
    return (_jsx(Box, { w: "full", p: 8, children: _jsxs(Box, { w: "full", children: [_jsx(PageHeader, { title: "Fretes", subtitle: "Gerencie seus fretes", breadcrumbs: [
                        { label: 'Dashboard', href: '/' },
                        { label: 'Fretes', href: '/shipping' }
                    ] }), _jsxs(Box, { bg: "white", rounded: "lg", shadow: "sm", overflow: "hidden", children: [_jsxs(Box, { p: 4, borderBottomWidth: "1px", display: "flex", justifyContent: "space-between", children: [_jsxs(InputGroup, { maxW: "300px", children: [_jsx(Input, { placeholder: "Buscar frete..." }), _jsx(InputRightElement, { children: _jsx(IconButton, { size: "sm", variant: "ghost", "aria-label": "Search", icon: _jsx(FiMoreVertical, {}) }) })] }), _jsx(Button, { colorScheme: "blue", leftIcon: _jsx(FiPlus, {}), children: "Novo Frete" })] }), _jsx(Box, { overflowX: "auto", children: _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "C\u00F3digo" }), _jsx(Th, { children: "Origem" }), _jsx(Th, { children: "Destino" }), _jsx(Th, { children: "Status" }), _jsx(Th, { children: "Valor" }), _jsx(Th, { children: "A\u00E7\u00F5es" })] }) }), _jsx(Tbody, { children: _jsxs(Tr, { children: [_jsx(Td, { children: "FRT001" }), _jsx(Td, { children: "S\u00E3o Paulo, SP" }), _jsx(Td, { children: "Rio de Janeiro, RJ" }), _jsx(Td, { children: _jsx(Box, { children: "Em Tr\u00E2nsito" }) }), _jsx(Td, { children: "R$ 250,00" }), _jsx(Td, { children: "-" })] }) })] }) })] })] }) }));
}
