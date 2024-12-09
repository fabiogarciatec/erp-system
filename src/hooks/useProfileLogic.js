import { useState, useRef, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

export function useProfileLogic() {
    const { user } = useAuth();
    const toast = useToast();
    const fileInputRef = useRef(null);
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    const loadUserProfile = async () => {
        try {
            if (!user?.id)
                return;
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
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

    const handleInputChange = (field, value) => {
        if (!profile)
            return;
        setProfile(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const formatPhoneForDisplay = (phone) => {
        if (!phone)
            return '';
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length === 11) {
            return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
        }
        return numbers;
    };

    const handleAvatarChange = async (e) => {
        if (!e.target.files || !e.target.files[0] || !user?.id)
            return;
        const file = e.target.files[0];
        // Validações
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
        if (file.size / 1024 / 1024 > 2) {
            toast({
                title: 'Arquivo muito grande',
                description: 'O tamanho máximo permitido é 2MB',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
            return;
        }
        setIsUploading(true);
        try {
            const timestamp = new Date().getTime();
            const fileExt = file.name.split('.').pop()?.toLowerCase();
            const fileName = `${user.id}-${timestamp}.${fileExt}`;
            const filePath = `avatars/${fileName}`;
            // Remove avatar anterior se existir
            if (profile?.avatar_url) {
                const oldAvatarPath = profile.avatar_url.split('/').pop();
                if (oldAvatarPath) {
                    await supabase.storage
                        .from('avatars')
                        .remove([`avatars/${oldAvatarPath}`]);
                }
            }
            // Upload do novo avatar
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false,
                contentType: file.type
            });
            if (uploadError)
                throw uploadError;
            // Obtém URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(filePath);
            // Atualiza perfil
            const { error: updateError } = await supabase
                .from('profiles')
                .update({
                avatar_url: publicUrl,
                updated_at: new Date().toISOString()
            })
                .eq('user_id', user.id);
            if (updateError)
                throw updateError;
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
            toast({
                title: 'Erro ao atualizar foto',
                description: error.message || 'Ocorreu um erro ao atualizar sua foto',
                status: 'error',
                duration: 3000,
                isClosable: true,
            });
        }
        finally {
            setIsUploading(false);
        }
    };

    const handleRemoveAvatar = async () => {
        if (!profile?.avatar_url || !user?.id)
            return;
        setIsLoading(true);
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ avatar_url: null })
                .eq('user_id', user.id);
            if (error)
                throw error;
            setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
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
                description: error.message || 'Ocorreu um erro ao remover a foto',
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
                .eq('user_id', user.id);
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

    const handlePasswordChange = async (currentPassword, newPassword) => {
        try {
            setIsLoading(true);
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            });
            if (error)
                throw error;
            toast({
                title: 'Senha alterada',
                description: 'Sua senha foi atualizada com sucesso.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (error) {
            toast({
                title: 'Erro ao alterar senha',
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

    useEffect(() => {
        if (user) {
            loadUserProfile();
        }
    }, [user]);

    return {
        profile,
        isLoading,
        isUploading,
        fileInputRef,
        handleInputChange,
        formatPhoneForDisplay,
        handleAvatarChange,
        handleRemoveAvatar,
        handleSave,
        handlePasswordChange
    };
}
