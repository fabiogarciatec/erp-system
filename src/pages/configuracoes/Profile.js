import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Card, CardBody, CardHeader, FormControl, FormLabel, Grid, GridItem, Input, useToast, Avatar, AvatarBadge, IconButton, VStack, HStack, Text, Heading, Divider, Flex, Switch } from '@chakra-ui/react';
import { SmallCloseIcon } from '@chakra-ui/icons';
import { useProfileStyles } from '@/hooks/useProfileStyles';
import { useProfileLogic } from '@/hooks/useProfileLogic';
import { PageHeader } from '@/components/PageHeader';
import { useState } from 'react';
export default function Profile() {
    const styles = useProfileStyles();
    const { profile, isLoading, isUploading, fileInputRef, handleInputChange, formatPhoneForDisplay, handleAvatarChange, handleRemoveAvatar, handleSave, handlePasswordChange } = useProfileLogic();
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const handlePasswordFormChange = (e) => {
        setPasswordForm(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };
    const handlePasswordSubmit = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            useToast({
                title: 'Erro',
                description: 'As senhas não coincidem',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        await handlePasswordChange(passwordForm.currentPassword, passwordForm.newPassword);
        setPasswordForm({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
    };
    if (!profile) {
        return (_jsx(Box, { px: 4, children: _jsx(Text, { children: "Carregando..." }) }));
    }
    return (_jsxs(Box, { bg: "inherit", minH: "100vh", children: [_jsx(PageHeader, { title: "Perfil", subtitle: "Gerencie suas informa\u00E7\u00F5es pessoais", icon: SmallCloseIcon, breadcrumbs: [
                    { label: 'Dashboard', href: '/' },
                    { label: 'Configurações', href: '/configuracoes' },
                    { label: 'Perfil', href: '/configuracoes/profile' },
                ] }), _jsx(Box, { px: { base: 4, xl: 8 }, pb: 12, children: _jsxs(VStack, { spacing: 6, w: "full", align: "stretch", children: [_jsx(Box, { borderWidth: "2px", borderRadius: "lg", p: 6, bg: styles.colors.bg, borderColor: styles.colors.border, w: "full", children: _jsxs(VStack, { spacing: 4, align: "center", w: "full", children: [_jsxs(Box, { position: "relative", children: [_jsx(Avatar, { size: "2xl", name: profile.full_name || undefined, src: profile.avatar_url || undefined, cursor: "pointer", onClick: () => fileInputRef.current?.click(), children: isUploading && _jsx(AvatarBadge, { boxSize: "1.25em", bg: "blue.500" }) }), _jsxs(HStack, { position: "absolute", bottom: "-3", right: "-8", spacing: 2, zIndex: 2, children: [_jsx("input", { type: "file", ref: fileInputRef, onChange: handleAvatarChange, style: { display: 'none' }, accept: "image/*" }), _jsx(IconButton, { isLoading: isUploading, size: "xs", rounded: "full", colorScheme: "blue", "aria-label": "Alterar foto", icon: _jsx(SmallCloseIcon, { fontSize: "0.9rem" }), boxShadow: "base", _hover: {
                                                            transform: 'scale(1.1)',
                                                            boxShadow: 'md',
                                                        }, transition: "all 0.2s", onClick: () => fileInputRef.current?.click() }), profile.avatar_url && (_jsx(IconButton, { "aria-label": "Remover foto", icon: _jsx(SmallCloseIcon, { fontSize: "0.9rem" }), size: "xs", colorScheme: "red", variant: "solid", rounded: "full", onClick: handleRemoveAvatar, isLoading: isLoading, boxShadow: "base", _hover: {
                                                            transform: 'scale(1.1)',
                                                            boxShadow: 'md',
                                                        }, transition: "all 0.2s" }))] })] }), _jsxs(VStack, { spacing: 1, children: [_jsx(Heading, { size: "md", children: profile.full_name || 'Nome não definido' }), _jsx(Text, { fontSize: "sm", color: "gray.500", children: profile.email }), profile.role && (_jsxs(HStack, { spacing: 2, bg: styles.colors.roleTag, px: 3, py: 1, rounded: "full", children: [_jsx(SmallCloseIcon, { color: styles.colors.icon }), _jsx(Text, { fontSize: "sm", color: styles.colors.text, children: profile.role })] }))] })] }) }), _jsxs(Grid, { templateColumns: { base: "1fr", lg: "1fr 1fr" }, gap: 6, w: "full", mt: 6, children: [_jsx(GridItem, { children: _jsxs(Card, { bg: styles.colors.bg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: styles.colors.border, children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Informa\u00E7\u00F5es Pessoais" }) }), _jsx(Divider, {}), _jsx(CardBody, { children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Nome Completo" }), _jsx(Input, { name: "full_name", value: profile.full_name || '', onChange: (e) => handleInputChange(e.target.name, e.target.value), placeholder: "Seu nome completo" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "E-mail" }), _jsx(Input, { name: "email", value: profile.email || '', onChange: (e) => handleInputChange(e.target.name, e.target.value), placeholder: "seu.email@exemplo.com" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Telefone" }), _jsx(Input, { name: "phone", value: formatPhoneForDisplay(profile.phone) || '', onChange: (e) => handleInputChange(e.target.name, e.target.value), placeholder: "(00) 00000-0000" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Cargo" }), _jsx(Input, { name: "role", value: profile.role || '', onChange: (e) => handleInputChange(e.target.name, e.target.value), placeholder: "Seu cargo" })] })] }) })] }) }), _jsxs(GridItem, { children: [_jsxs(Card, { bg: styles.colors.bg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: styles.colors.border, mb: 6, children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Alterar Senha" }) }), _jsx(Divider, {}), _jsx(CardBody, { children: _jsxs(VStack, { spacing: 4, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Senha Atual" }), _jsx(Input, { type: "password", name: "currentPassword", value: passwordForm.currentPassword, onChange: handlePasswordFormChange, placeholder: "Digite sua senha atual" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Nova Senha" }), _jsx(Input, { type: "password", name: "newPassword", value: passwordForm.newPassword, onChange: handlePasswordFormChange, placeholder: "Digite a nova senha" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: "Confirmar Nova Senha" }), _jsx(Input, { type: "password", name: "confirmPassword", value: passwordForm.confirmPassword, onChange: handlePasswordFormChange, placeholder: "Confirme a nova senha" })] }), _jsx(Button, { mt: 2, colorScheme: "blue", onClick: handlePasswordSubmit, isLoading: isLoading, w: "full", children: "Alterar Senha" })] }) })] }), _jsxs(Card, { bg: styles.colors.bg, shadow: "sm", rounded: "lg", borderWidth: "1px", borderColor: styles.colors.border, children: [_jsx(CardHeader, { children: _jsx(Heading, { size: "md", children: "Configura\u00E7\u00F5es de Seguran\u00E7a" }) }), _jsx(Divider, {}), _jsx(CardBody, { children: _jsxs(VStack, { spacing: 6, align: "stretch", children: [_jsxs(Box, { children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 4, children: "Autentica\u00E7\u00E3o em Duas Etapas" }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Ativar autentica\u00E7\u00E3o em duas etapas" }), _jsx(Switch, { colorScheme: "blue" })] })] }), _jsxs(Box, { children: [_jsx(Text, { fontSize: "md", fontWeight: "semibold", mb: 4, children: "Notifica\u00E7\u00F5es de Seguran\u00E7a" }), _jsxs(VStack, { spacing: 4, align: "stretch", children: [_jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Notificar sobre novos acessos \u00E0 conta" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] }), _jsxs(FormControl, { display: "flex", alignItems: "center", children: [_jsx(FormLabel, { mb: "0", children: "Notificar sobre altera\u00E7\u00F5es de senha" }), _jsx(Switch, { colorScheme: "blue", defaultChecked: true })] })] })] })] }) })] })] })] }), _jsx(Flex, { justify: "flex-end", mt: 6, children: _jsx(Button, { colorScheme: "blue", leftIcon: _jsx(SmallCloseIcon, {}), onClick: handleSave, isLoading: isLoading, children: "Salvar Altera\u00E7\u00F5es" }) })] }) })] }));
}
