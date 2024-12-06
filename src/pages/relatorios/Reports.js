import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, SimpleGrid, Card, CardBody, Heading, Text, Icon, VStack, Button, useColorModeValue, } from '@chakra-ui/react';
import { FiDollarSign, FiShoppingBag, FiTruck, FiTool, FiBarChart, FiTrendingUp, FiDownload } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
export function Reports({ type }) {
    const cardBg = useColorModeValue('white', 'gray.800');
    const borderColor = useColorModeValue('gray.200', 'gray.700');
    // Se um tipo específico for passado, renderiza apenas aquele relatório
    if (type) {
        return (_jsxs(Box, { w: "full", children: [_jsx(PageHeader, { title: `Relatório de ${type === 'sales' ? 'Vendas' : type === 'financial' ? 'Financeiro' : 'Estoque'}`, subtitle: "Detalhes do relat\u00F3rio", breadcrumbs: [
                        { label: 'Relatórios', href: '/reports' },
                        { label: type, href: `/reports/${type}` }
                    ] }), _jsx(Box, { pt: 8, children: _jsxs(Text, { children: ["Relat\u00F3rio detalhado de ", type === 'sales' ? 'Vendas' : type === 'financial' ? 'Financeiro' : 'Estoque'] }) })] }));
    }
    // Se nenhum tipo for passado, renderiza a página principal de relatórios
    return (_jsxs(Box, { w: "100%", children: [_jsx(PageHeader, { title: "Relat\u00F3rios", subtitle: "Visualize e exporte relat\u00F3rios", breadcrumbs: [
                    { label: 'Relatórios', href: '/relatorios' }
                ], rightContent: _jsx(Button, { leftIcon: _jsx(Icon, { as: FiDownload }), colorScheme: "blue", children: "Exportar" }) }), _jsx(Box, { mt: "125px", px: 6, children: _jsx(Box, { maxW: "1600px", mx: "auto", children: _jsxs(SimpleGrid, { columns: { base: 1, md: 2, lg: 3 }, spacing: 6, children: [_jsx(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, children: _jsx(CardBody, { children: _jsxs(VStack, { align: "start", spacing: 4, children: [_jsx(Heading, { size: "md", children: "Vendas" }), _jsx(Text, { children: "Relat\u00F3rios de vendas e faturamento" }), _jsx(Button, { leftIcon: _jsx(Icon, { as: FiDollarSign }), colorScheme: "blue", variant: "outline", w: "full", children: "Ver relat\u00F3rio" }), _jsx(Button, { leftIcon: _jsx(Icon, { as: FiBarChart }), colorScheme: "blue", variant: "ghost", w: "full", children: "Ver m\u00E9tricas" })] }) }) }), _jsx(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, children: _jsx(CardBody, { children: _jsxs(VStack, { align: "start", spacing: 4, children: [_jsx(Heading, { size: "md", children: "Produtos" }), _jsx(Text, { children: "Relat\u00F3rios de estoque e movimenta\u00E7\u00E3o" }), _jsx(Button, { leftIcon: _jsx(Icon, { as: FiShoppingBag }), colorScheme: "blue", variant: "outline", w: "full", children: "Ver relat\u00F3rio" }), _jsx(Button, { leftIcon: _jsx(Icon, { as: FiTruck }), colorScheme: "blue", variant: "ghost", w: "full", children: "Ver movimenta\u00E7\u00F5es" })] }) }) }), _jsx(Card, { bg: cardBg, borderWidth: "1px", borderColor: borderColor, children: _jsx(CardBody, { children: _jsxs(VStack, { align: "start", spacing: 4, children: [_jsx(Heading, { size: "md", children: "Servi\u00E7os" }), _jsx(Text, { children: "Relat\u00F3rios de ordens de servi\u00E7o" }), _jsx(Button, { leftIcon: _jsx(Icon, { as: FiTool }), colorScheme: "blue", variant: "outline", w: "full", children: "Ver relat\u00F3rio" }), _jsx(Button, { leftIcon: _jsx(Icon, { as: FiTrendingUp }), colorScheme: "blue", variant: "ghost", w: "full", children: "Ver tend\u00EAncias" })] }) }) })] }) }) })] }));
}
