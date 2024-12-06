import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button } from '@chakra-ui/react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import { PageHeader } from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';
export default function Vendas() {
    const navigate = useNavigate();
    const handleExportVendas = () => {
        // implementação da lógica de exportação
    };
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Vendas", subtitle: "Gerencie as vendas da empresa", breadcrumbs: [
                    { label: 'Operações', href: '/operacoes' },
                    { label: 'Vendas', href: '/operacoes/vendas' }
                ], rightContent: _jsxs(Box, { children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), colorScheme: "gray", variant: "ghost", mr: 2, onClick: handleExportVendas, children: "Exportar" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: () => navigate('/operacoes/vendas/nova'), children: "Nova Venda" })] }) }), _jsx(Box, { mt: "125px", px: 6, children: _jsx(Box, { maxW: "1600px", mx: "auto" }) })] }));
}
