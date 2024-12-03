import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, VStack, FormControl, FormLabel, Input, Button, Switch, Text, Divider, useToast, } from '@chakra-ui/react';
import { PageHeader } from '../../components/PageHeader';
export function Security() {
    const toast = useToast();
    const handleSave = () => {
        toast({
            title: 'Configurações salvas',
            description: 'Suas configurações de segurança foram atualizadas.',
            status: 'success',
            duration: 3000,
            isClosable: true,
        });
    };
    return (_jsxs(Box, { w: "full", p: 8, children: [_jsx(PageHeader, { title: "Seguran\u00E7a", subtitle: "Gerencie suas configura\u00E7\u00F5es de seguran\u00E7a", breadcrumbs: [
                    { label: 'Dashboard', href: '/' },
                    { label: 'Configurações', href: '/settings' },
                    { label: 'Segurança', href: '/settings/security' }
                ] }), _jsx(Box, { bg: "white", rounded: "lg", shadow: "sm", p: 6, children: _jsxs(VStack, { spacing: 6, align: "stretch", maxW: "600px", mx: "auto", children: [_jsx(Text, { fontSize: "lg", fontWeight: "bold", children: "Alterar Senha" }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Senha Atual" }), _jsx(Input, { type: "password" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Nova Senha" }), _jsx(Input, { type: "password" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Confirmar Nova Senha" }), _jsx(Input, { type: "password" })] }), _jsx(Divider, {}), _jsx(Text, { fontSize: "lg", fontWeight: "bold", children: "Autentica\u00E7\u00E3o em Duas Etapas" }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Ativar autentica\u00E7\u00E3o em duas etapas" }), _jsx(Switch, { colorScheme: "blue" })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Notificar sobre novos acessos" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsx(Button, { colorScheme: "blue", onClick: handleSave, children: "Salvar Altera\u00E7\u00F5es" })] }) })] }));
}
