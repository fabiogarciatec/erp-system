import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button } from '@chakra-ui/react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import { PageHeader } from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';
export default function Pedidos() {
    const navigate = useNavigate();
    const handleExportPedidos = () => {
        // implementação do handleExportPedidos
    };
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Pedidos", subtitle: "Gerencie os pedidos da empresa", breadcrumbs: [
                    { label: 'Operações', href: '/operacoes' },
                    { label: 'Pedidos', href: '/operacoes/pedidos' }
                ], rightContent: _jsxs(Box, { children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), colorScheme: "gray", variant: "ghost", mr: 2, onClick: handleExportPedidos, children: "Exportar" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: () => navigate('/operacoes/pedidos/novo'), children: "Novo Pedido" })] }) }), _jsx(Box, { mt: "125px", px: 6, children: _jsx(Box, { maxW: "1600px", mx: "auto" }) })] }));
}
