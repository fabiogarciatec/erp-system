import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button } from '@chakra-ui/react';
import { FiDownload, FiPlus } from 'react-icons/fi';
import { PageHeader } from '@/components/PageHeader';
import { useNavigate } from 'react-router-dom';
export default function Orcamentos() {
    const navigate = useNavigate();
    const handleExportOrcamentos = () => {
        // implementação do handleExportOrcamentos
    };
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Or\u00E7amentos", subtitle: "Gerencie os or\u00E7amentos da empresa", breadcrumbs: [
                    { label: 'Operações', href: '/operacoes' },
                    { label: 'Orçamentos', href: '/operacoes/orcamentos' }
                ], rightContent: _jsxs(Box, { children: [_jsx(Button, { leftIcon: _jsx(FiDownload, {}), colorScheme: "gray", variant: "ghost", mr: 2, onClick: handleExportOrcamentos, children: "Exportar" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", onClick: () => navigate('/operacoes/orcamentos/novo'), children: "Novo Or\u00E7amento" })] }) }), _jsx(Box, { mt: "125px", px: 6, children: _jsx(Box, { maxW: "1600px", mx: "auto" }) })] }));
}
