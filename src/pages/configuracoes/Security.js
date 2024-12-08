import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, VStack, FormControl, FormLabel, Switch, Text, useToast, Card, CardBody, useColorModeValue, Button, } from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';
import { FiLock } from 'react-icons/fi';
export function Security() {
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const handleSave = () => {
        toast({
            title: 'Configurações salvas',
            description: 'Suas configurações de segurança foram atualizadas.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Seguran\u00E7a", subtitle: "Gerencie suas configura\u00E7\u00F5es de seguran\u00E7a e privacidade", icon: FiLock, breadcrumbs: [
                    { label: 'Configurações', href: '/configuracoes' },
                    { label: 'Segurança', href: '/configuracoes/seguranca' }
                ] }), _jsx(Box, { display: "flex", mt: "-10px", px: 8, flexDirection: { base: "column", xl: "row" }, w: "86vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: _jsx(VStack, { flex: "1", spacing: 6, align: "stretch", width: "100%", children: _jsx(Card, { bg: cardBg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: borderColor, p: 6, children: _jsx(CardBody, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", mb: 4, children: "Autentica\u00E7\u00E3o em Duas Etapas" }), _jsx(VStack, { spacing: 4, align: "stretch", children: _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Ativar autentica\u00E7\u00E3o em duas etapas" }), _jsx(Switch, { colorScheme: "blue" })] }) })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", mb: 4, children: "Notifica\u00E7\u00F5es de Seguran\u00E7a" }), _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Notificar sobre novos acessos \u00E0 conta" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Notificar sobre altera\u00E7\u00F5es de senha" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] })] })] }), _jsx(Box, { pt: 4, children: _jsx(Button, { colorScheme: "blue", size: "lg", w: { base: "full", md: "auto" }, onClick: handleSave, children: "Salvar Altera\u00E7\u00F5es" }) })] }) }) }) }) })] }));
}
