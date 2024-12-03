import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Table, Thead, Tbody, Tr, Th, Td, Input, InputGroup, InputRightElement, } from '@chakra-ui/react';
import { FiSearch, FiPlus, FiDownload } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
export function Services() {
    const handleExportServices = () => {
        // implementação da função de exportação
    };
    const onOpen = () => {
        // implementação da função de abrir modal
    };
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Servi\u00E7os", subtitle: "Gerencie os servi\u00E7os oferecidos", breadcrumbs: [
                    { label: 'Cadastros', href: '/cadastros' },
                    { label: 'Serviços', href: '/cadastros/servicos' }
                ], rightContent: _jsxs(Box, { children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), colorScheme: "gray", variant: "ghost", mr: 2, onClick: handleExportServices, children: "Exportar" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: onOpen, children: "Novo Servi\u00E7o" })] }) }), _jsx(Box, { mt: "125px", px: 6, children: _jsx(Box, { maxW: "1600px", mx: "auto", children: _jsxs(Box, { bg: "white", rounded: "lg", shadow: "sm", p: 6, children: [_jsx(Box, { mb: 4, display: "flex", justifyContent: "space-between", children: _jsxs(InputGroup, { maxW: "300px", children: [_jsx(Input, { placeholder: "Buscar servi\u00E7o..." }), _jsx(InputRightElement, { children: _jsx(FiSearch, {}) })] }) }), _jsxs(Table, { variant: "simple", children: [_jsx(Thead, { children: _jsxs(Tr, { children: [_jsx(Th, { children: "C\u00F3digo" }), _jsx(Th, { children: "Nome" }), _jsx(Th, { children: "Categoria" }), _jsx(Th, { children: "Dura\u00E7\u00E3o" }), _jsx(Th, { children: "Pre\u00E7o" }), _jsx(Th, { children: "Status" })] }) }), _jsxs(Tbody, { children: [_jsxs(Tr, { children: [_jsx(Td, { children: "SRV001" }), _jsx(Td, { children: "Servi\u00E7o A" }), _jsx(Td, { children: "Categoria 1" }), _jsx(Td, { children: "2h" }), _jsx(Td, { children: "R$ 199,90" }), _jsx(Td, { children: "Ativo" })] }), _jsxs(Tr, { children: [_jsx(Td, { children: "SRV002" }), _jsx(Td, { children: "Servi\u00E7o B" }), _jsx(Td, { children: "Categoria 2" }), _jsx(Td, { children: "1h30" }), _jsx(Td, { children: "R$ 149,90" }), _jsx(Td, { children: "Ativo" })] })] })] })] }) }) })] }));
}
