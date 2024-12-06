import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, VStack, Text, useColorModeValue, SimpleGrid, Button, Image, Badge, HStack, Switch, FormControl, FormLabel, Input, IconButton, Divider, Card, CardBody, } from '@chakra-ui/react';
import { FiPlus, FiSettings, FiLink } from 'react-icons/fi';
import { PageHeader } from '../../components/PageHeader';
const IntegrationCard = ({ name, description, logo, status, isConfigured, }) => {
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    return (_jsx(Card, { bg: cardBg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: borderColor, p: 4, children: _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(HStack, { justify: "space-between", align: "start", children: [_jsx(Image, { src: logo, alt: name, boxSize: "40px", objectFit: "contain", fallbackSrc: "https://via.placeholder.com/40" }), _jsx(Badge, { colorScheme: status === 'active'
                                ? 'green'
                                : status === 'pending'
                                    ? 'yellow'
                                    : 'gray', children: status === 'active'
                                ? 'Ativo'
                                : status === 'pending'
                                    ? 'Pendente'
                                    : 'Inativo' })] }), _jsxs(VStack, { align: "stretch", spacing: 1, children: [_jsx(Text, { fontWeight: "semibold", children: name }), _jsx(Text, { fontSize: "sm", color: "gray.500", children: description })] }), _jsxs(HStack, { justify: "space-between", children: [_jsx(Switch, { isChecked: status === 'active', size: "sm" }), _jsx(IconButton, { "aria-label": "Configurar integra\u00E7\u00E3o", icon: _jsx(FiSettings, {}), size: "sm", variant: "ghost", isDisabled: !isConfigured })] })] }) }));
};
const integrations = [
    {
        name: 'Mercado Livre',
        description: 'Integração com marketplace',
        logo: 'https://http2.mlstatic.com/frontend-assets/ui-navigation/5.19.1/mercadolibre/logo__large_plus@2x.png',
        status: 'active',
        isConfigured: true,
    },
    {
        name: 'Shopee',
        description: 'Integração com marketplace',
        logo: 'https://cf.shopee.com.br/file/br-50009109-159ba5bf8f3e96a83f15871670b3cce2',
        status: 'inactive',
        isConfigured: false,
    },
    {
        name: 'Correios',
        description: 'Integração para envios',
        logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Correios_logo.svg/1200px-Correios_logo.svg.png',
        status: 'active',
        isConfigured: true,
    },
    {
        name: 'PagSeguro',
        description: 'Gateway de pagamento',
        logo: 'https://logodownload.org/wp-content/uploads/2019/09/pagseguro-logo-2.png',
        status: 'pending',
        isConfigured: true,
    },
];
export function IntegrationsSettings() {
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Integra\u00E7\u00F5es", subtitle: "Gerencie as integra\u00E7\u00F5es e conex\u00F5es do sistema", icon: FiLink, breadcrumbs: [
                    { label: 'Configurações', href: '/configuracoes' },
                    { label: 'Integrações', href: '/configuracoes/integracoes' }
                ] }), _jsx(Box, { display: "flex", mt: "-10px", px: 8, flexDirection: { base: "column", xl: "row" }, w: "86vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: _jsxs(VStack, { flex: "1", spacing: 6, align: "stretch", width: "100%", children: [_jsx(Card, { bg: cardBg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: borderColor, p: 6, children: _jsx(CardBody, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsxs(HStack, { justify: "space-between", children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", children: "Integra\u00E7\u00F5es Dispon\u00EDveis" }), _jsx(Button, { leftIcon: _jsx(FiPlus, {}), colorScheme: "blue", size: "sm", children: "Nova Integra\u00E7\u00E3o" })] }), _jsx(SimpleGrid, { columns: { base: 1, md: 2, lg: 3, xl: 4 }, spacing: 4, children: integrations.map((integration, index) => (_jsx(IntegrationCard, { ...integration }, index))) })] }) }) }), _jsx(Card, { bg: cardBg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: borderColor, p: 6, children: _jsx(CardBody, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", children: "Configura\u00E7\u00F5es Globais de Integra\u00E7\u00E3o" }), _jsx(Divider, {}), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Intervalo de Sincroniza\u00E7\u00E3o (minutos)" }), _jsx(Input, { type: "number", defaultValue: 15 })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Sincroniza\u00E7\u00E3o Autom\u00E1tica" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Notificar Erros de Sincroniza\u00E7\u00E3o" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsx(Box, { pt: 4, children: _jsx(Button, { colorScheme: "blue", size: "lg", w: { base: "full", md: "auto" }, children: "Salvar Configura\u00E7\u00F5es" }) })] }) }) })] }) })] }));
}
