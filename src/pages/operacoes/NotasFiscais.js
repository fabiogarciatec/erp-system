import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button } from '@chakra-ui/react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import { PageHeader } from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';
export default function NotasFiscais() {
    const navigate = useNavigate();
    const handleExportNotas = () => {
        // Implementar lógica de exportação
    };
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Notas Fiscais", subtitle: "Gerencie as notas fiscais da empresa", breadcrumbs: [
                    { label: 'Operações', href: '/operacoes' },
                    { label: 'Notas Fiscais', href: '/operacoes/notas-fiscais' }
                ], rightContent: _jsxs(Box, { children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), colorScheme: "gray", variant: "ghost", mr: 2, onClick: handleExportNotas, children: "Exportar" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: () => navigate('/operacoes/notas-fiscais/nova'), children: "Nova Nota Fiscal" })] }) }), _jsx(Box, { mt: "125px", px: 6, children: _jsx(Box, { maxW: "1600px", mx: "auto" }) })] }));
}
