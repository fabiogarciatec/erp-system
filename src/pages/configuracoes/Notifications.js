import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, VStack, FormControl, FormLabel, Switch, Text, Divider, Button, useToast, } from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';
export function Notifications() {
    const toast = useToast();
    const handleSave = () => {
        toast({
            title: 'Configurações salvas',
            description: 'Suas configurações de notificações foram atualizadas.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };
    return (_jsxs(Box, { w: "full", p: 8, children: [_jsx(PageHeader, { title: "Notifica\u00E7\u00F5es", subtitle: "Gerencie suas prefer\u00EAncias de notifica\u00E7\u00E3o", breadcrumbs: [
                    { label: 'Dashboard', href: '/' },
                    { label: 'Configurações', href: '/settings' },
                    { label: 'Notificações', href: '/settings/notifications' }
                ] }), _jsx(Box, { bg: "white", rounded: "lg", shadow: "sm", p: 6, children: _jsxs(VStack, { spacing: 6, align: "stretch", maxW: "600px", mx: "auto", children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", children: "Notifica\u00E7\u00F5es por E-mail" }), _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Novas vendas" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Novos pedidos" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Atualiza\u00E7\u00F5es de estoque" }), _jsx(Switch, { colorScheme: "blue" })] })] }), _jsx(Divider, {}), _jsx(Text, { fontSize: "lg", fontWeight: "bold", children: "Notifica\u00E7\u00F5es do Sistema" }), _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Alertas de sistema" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Relat\u00F3rios semanais" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Lembretes de tarefas" }), _jsx(Switch, { colorScheme: "blue" })] })] }), _jsx(Button, { colorScheme: "blue", onClick: handleSave, children: "Salvar Prefer\u00EAncias" })] }) })] }));
}
