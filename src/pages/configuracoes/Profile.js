import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Divider, FormControl, FormLabel, Heading, Input, Text, useColorModeValue, useToast, Avatar, IconButton, VStack, HStack, Icon, Tooltip, SimpleGrid, Flex, } from '@chakra-ui/react';
import { FiUser, FiMail, FiPhone, FiBriefcase, FiCamera, FiTrash2, FiSave } from 'react-icons/fi';
import { useEffect, useState, useRef } from 'react';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { PageHeader } from '@/components/PageHeader';
export default function Perfil() {
    // Hooks do contexto
    const { user } = useAuth();
    const toast = useToast();
    // Hooks de tema
    const bgColor = useColorModeValue('gray.50', 'gray.800');
    const cardBg = useColorModeValue('white', 'gray.700');
    const borderColor = useColorModeValue('gray.200', 'gray.600');
    const hoverBorderColor = useColorModeValue('gray.300', 'gray.500');
    const avatarBorderColor = useColorModeValue('white', 'gray.600');
    const badgeBg = useColorModeValue('gray.100', 'gray.700');
    const avatarBg = useColorModeValue('gray.100', 'gray.700');
    const inputBg = useColorModeValue('white', 'gray.700');
    const readOnlyBg = useColorModeValue('gray.50', 'gray.600');
    // Estados
    const [isLoading, setIsLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    // Funções auxiliares
    const loadUserProfile = async () => {
        try {
            if (!user?.id)
                return;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error)
                throw error;
            setProfile(data);
        }
        catch (error) {
            toast({
                title: 'Erro ao carregar perfil',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
    };
    // Efeitos
    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user]);
    const handleInputChange = (field, value) => {
        if (!profile)
            return;
        // Remove a máscara do telefone antes de salvar
        if (field === 'phone') {
            value = value.replace(/\D/g, ''); // Remove tudo que não é número
        }
        setProfile({ ...profile, [field]: value });
    };
    const formatPhoneForDisplay = (phone) => {
        if (!phone)
            return '';
        // Garante que temos apenas números
        const numbers = phone.replace(/\D/g, '');
        // Aplica a formatação manualmente
        if (numbers.length === 11) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        }
        return numbers;
    };
    const phoneInputRef = useRef(null);
    const handleAvatarChange = async (e) => {
        if (!e.target.files || !e.target.files[0])
            return;
        const file = e.target.files[0];
        // Validação do tipo de arquivo
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            toast({
                title: 'Tipo de arquivo inválido',
                description: 'Por favor, selecione uma imagem no formato JPG, PNG ou GIF',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        // Validação do tamanho do arquivo (2MB)
        const fileSize = file.size / 1024 / 1024;
        if (fileSize > 2) {
            toast({
                title: 'Arquivo muito grande',
                description: 'O tamanho máximo permitido é 2MB',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setIsLoading(true);
        try {
            // Gera um nome único para o arquivo
            const timestamp = new Date().getTime();
            const fileExt = file.name.split('.').pop()?.toLowerCase();
            const fileName = `${user?.id}-${timestamp}.${fileExt}`;
            const filePath = `avatars/${fileName}`;
            // Se existe um avatar anterior, tenta removê-lo
            if (profile?.avatar_url) {
                try {
                    const oldAvatarPath = profile.avatar_url.split('/').pop();
                    if (oldAvatarPath) {
                        await supabase.storage
                            .from('avatars')
                            .remove([`avatars/${oldAvatarPath}`]);
                    }
                }
                catch (error) {
                    console.warn('Erro ao remover avatar antigo:', error);
                    // Continua com o upload mesmo se falhar ao remover o antigo
                }
            }
            // Upload do novo avatar
            const { error: uploadError, data: uploadData } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type // Garante que o tipo do arquivo seja preservado
            });
            if (uploadError) {
                throw new Error(uploadError.message);
            }
            if (!uploadData) {
                throw new Error('Erro ao fazer upload da imagem');
            }
            // Obtém a URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);
            if (!publicUrl) {
                throw new Error('Erro ao gerar URL pública da imagem');
            }
            // Atualiza o perfil com a nova URL
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                avatar_url: publicUrl,
                updated_at: new Date().toISOString()
            })
                .eq('id', user?.id);
            if (updateError) {
                throw new Error(updateError.message);
            }
            // Atualiza o estado local
            setProfile(prev => prev ? {
                ...prev,
                avatar_url: publicUrl,
                updated_at: new Date().toISOString()
            } : null);
            toast({
                title: 'Foto atualizada com sucesso',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error('Erro ao atualizar foto:', error);
            toast({
                title: 'Erro ao atualizar foto',
                description: error.message || 'Ocorreu um erro ao atualizar sua foto',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleRemoveAvatar = async () => {
        if (!profile)
            return;
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('id', user?.id);
            if (error)
                throw error;
            setProfile({ ...profile, avatar_url: null });
            toast({
                title: 'Foto removida com sucesso',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (error) {
            toast({
                title: 'Erro ao remover foto',
                description: error?.message || 'Ocorreu um erro ao remover a foto',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleSave = async () => {
        if (!profile || !user?.id)
            return;
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({
                full_name: profile.full_name,
                phone: profile.phone,
                role: profile.role,
                updated_at: new Date().toISOString()
            })
                .eq('id', user.id);
            if (error)
                throw error;
            toast({
                title: 'Perfil atualizado com sucesso',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (error) {
            toast({
                title: 'Erro ao atualizar perfil',
                description: error.message,
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    if (!profile) {
        return null;
    }
    return (_jsxs(Box, { children: [_jsx(PageHeader, { title: "Perfil", subtitle: "Gerencie suas informa\u00E7\u00F5es pessoais", breadcrumbs: [
                    { label: 'Configurações', href: '/configuracoes' },
                    { label: 'Perfil', href: '/configuracoes/perfil' }
                ] }), _jsx(Box, { display: "flex", mt: "-10px", px: 8, flexDirection: { base: "column", xl: "row" }, w: "86vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: _jsxs(VStack, { flex: "1", spacing: 6, align: "stretch", width: "100%", children: [_jsx(Box, { borderWidth: "2px", borderRadius: "lg", p: 6, bg: cardBg, borderColor: borderColor, width: "70vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: _jsxs(VStack, { spacing: 6, align: "center", children: [_jsxs(Box, { position: "relative", children: [_jsx(Avatar, { size: "2xl", name: profile.full_name || profile.email, src: profile.avatar_url || undefined, bg: avatarBg, borderWidth: 2, borderColor: avatarBorderColor, boxShadow: "lg" }), _jsxs(HStack, { position: "absolute", bottom: "-3", right: "-8", spacing: 1, zIndex: 2, transform: "translateX(-12px)", children: [_jsx("label", { htmlFor: "avatar-input", children: _jsx(Tooltip, { label: "Alterar foto", placement: "top", children: _jsx(IconButton, { as: "div", size: "xs", rounded: "full", colorScheme: "blue", "aria-label": "Alterar foto", icon: _jsx(Icon, { as: FiCamera, fontSize: "0.9rem" }), boxShadow: "base", _hover: {
                                                                    transform: 'scale(1.1)',
                                                                    boxShadow: 'md',
                                                                }, transition: "all 0.2s", cursor: "pointer", onClick: (e) => {
                                                                    e.preventDefault();
                                                                    document.getElementById('avatar-input')?.click();
                                                                }, isLoading: isLoading }) }) }), profile.avatar_url && (_jsx(Tooltip, { label: "Remover foto", placement: "right", children: _jsx(IconButton, { "aria-label": "Remover foto", icon: _jsx(Icon, { as: FiTrash2, fontSize: "0.9rem" }), size: "xs", colorScheme: "red", variant: "solid", rounded: "full", onClick: handleRemoveAvatar, isLoading: isLoading, boxShadow: "base", _hover: {
                                                                transform: 'scale(1.1)',
                                                                boxShadow: 'md',
                                                            }, transition: "all 0.2s" }) }))] }), _jsx(Input, { type: "file", id: "avatar-input", accept: "image/jpeg,image/png,image/gif", display: "none", onChange: handleAvatarChange, onClick: (e) => {
                                                    // Reset o valor para permitir selecionar o mesmo arquivo novamente
                                                    e.target.value = '';
                                                } })] }), _jsxs(VStack, { spacing: 1, children: [_jsx(Heading, { size: "md", children: profile.full_name || 'Nome não definido' }), _jsx(Text, { color: "gray.500", children: profile.email }), profile.role && (_jsxs(HStack, { spacing: 2, bg: badgeBg, px: 3, py: 1, rounded: "full", children: [_jsx(Icon, { as: FiUser, color: "gray.500" }), _jsx(Text, { fontSize: "sm", color: "gray.500", children: profile.role })] }))] })] }) }), _jsxs(Box, { borderWidth: "2px", borderRadius: "lg", p: 6, bg: cardBg, borderColor: borderColor, width: "70vw", position: "relative", left: "50%", transform: "translateX(-50%)", children: [_jsx(Heading, { size: "md", mb: 4, children: "Informa\u00E7\u00F5es Pessoais" }), _jsx(Divider, { mb: 6 }), _jsxs(SimpleGrid, { columns: { base: 1, md: 2 }, spacing: 6, children: [_jsxs(FormControl, { children: [_jsx(FormLabel, { children: _jsxs(HStack, { spacing: 2, children: [_jsx(Icon, { as: FiUser, color: "gray.500" }), _jsx(Text, { children: "Nome Completo" })] }) }), _jsx(Input, { placeholder: "Seu nome completo", value: profile.full_name || '', onChange: (e) => handleInputChange('full_name', e.target.value), bg: inputBg, borderColor: borderColor, _hover: {
                                                        borderColor: hoverBorderColor
                                                    } })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: _jsxs(HStack, { spacing: 2, children: [_jsx(Icon, { as: FiMail, color: "gray.500" }), _jsx(Text, { children: "E-mail" })] }) }), _jsx(Input, { value: profile.email, isReadOnly: true, bg: readOnlyBg, opacity: 0.8, cursor: "not-allowed" })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: _jsxs(HStack, { spacing: 2, children: [_jsx(Icon, { as: FiBriefcase, color: "gray.500" }), _jsx(Text, { children: "Cargo" })] }) }), _jsx(Input, { placeholder: "Seu cargo na empresa", value: profile.role || '', onChange: (e) => handleInputChange('role', e.target.value), bg: inputBg, borderColor: borderColor, _hover: {
                                                        borderColor: hoverBorderColor
                                                    } })] }), _jsxs(FormControl, { children: [_jsx(FormLabel, { children: _jsxs(HStack, { spacing: 2, children: [_jsx(Icon, { as: FiPhone, color: "gray.500" }), _jsx(Text, { children: "Telefone" })] }) }), _jsx(Input, { ref: phoneInputRef, type: "tel", value: formatPhoneForDisplay(profile.phone), onChange: (e) => handleInputChange('phone', e.target.value), placeholder: "(00) 00000-0000", bg: inputBg, borderColor: borderColor, _hover: {
                                                        borderColor: hoverBorderColor
                                                    } })] })] }), _jsx(Divider, { my: 8 }), _jsx(Flex, { justify: "center", children: _jsx(Button, { colorScheme: "blue", size: "lg", leftIcon: _jsx(Icon, { as: FiSave }), onClick: handleSave, isLoading: isLoading, loadingText: "Salvando...", boxShadow: "base", px: 12, _hover: {
                                            transform: 'translateY(-1px)',
                                            boxShadow: 'md',
                                        }, transition: "all 0.2s", children: "Salvar Altera\u00E7\u00F5es" }) })] })] }) })] }));
}
