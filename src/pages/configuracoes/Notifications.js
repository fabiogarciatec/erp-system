import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, VStack, FormControl, FormLabel, Switch, Text, Divider, Button, useToast, Card, CardBody, useColorModeValue, } from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';
import { FiBell } from 'react-icons/fi';
export function Notifications() {
    const toast = useToast();
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const handleSave = () => {
        toast({
            title: 'Configurações salvas',
            description: 'Suas configurações de notificações foram atualizadas.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Notifica\u00E7\u00F5es", subtitle: "Gerencie suas prefer\u00EAncias de notifica\u00E7\u00F5es e alertas", icon: FiBell, breadcrumbs: [
                    { label: 'Configurações', href: '/configuracoes' },
                    { label: 'Notificações', href: '/configuracoes/notificacoes' }
                ] }), _jsx(Box, { display: "flex", mt: "-10px", px: 8, flexDirection: { base: "column", xl: "row" }, w: "86vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: _jsx(VStack, { flex: "1", spacing: 6, align: "stretch", width: "100%", children: _jsx(Card, { bg: cardBg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: borderColor, p: 6, children: _jsx(CardBody, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", mb: 4, children: "Notifica\u00E7\u00F5es por E-mail" }), _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Novas vendas" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Novos pedidos" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Atualiza\u00E7\u00F5es de estoque" }), _jsx(Switch, { colorScheme: "blue" })] })] })] }), _jsx(Divider, {}), _jsxs(Box, { children: [_jsx(Text, { fontSize: "lg", fontWeight: "semibold", mb: 4, children: "Notifica\u00E7\u00F5es do Sistema" }), _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Alertas de sistema" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Relat\u00F3rios semanais" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Lembretes de tarefas" }), _jsx(Switch, { colorScheme: "blue" })] })] })] }), _jsx(Box, { pt: 4, children: _jsx(Button, { colorScheme: "blue", size: "lg", w: { base: "full", md: "auto" }, onClick: handleSave, children: "Salvar Prefer\u00EAncias" }) })] }) }) }) }) })] }));
}
