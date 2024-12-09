import { useState, useRef, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { useAuth } from '@/contexts/AuthContext';
import supabase from '@/lib/supabase';

interface UserProfile {
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url?: string | null;
  phone: string | null;
  created_at?: string;
  updated_at?: string;
  role?: string;
  role_id?: string;
}

interface RoleData {
  role_id: string;
  role: Array<{
    name: string;
  }>;
}

type EditableProfileFields = 'full_name' | 'phone';

export function useProfileLogic() {
  const { user } = useAuth();
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  console.log('useProfileLogic initialized with user:', user?.id);

  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      
      if (!user?.id) {
        console.log('No user ID found');
        return;
      }

      console.log('Starting to load profile for user:', user.id);

      // Buscar o perfil
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          user_roles (
            roles:role_id (
              name
            )
          )
        `)
        .eq('user_id', user.id)
        .single();

      if (profileError) throw profileError;

      console.log('Raw profile data:', profileData);
      console.log('Role:', profileData?.user_roles?.[0]?.roles);
      
      setProfile({
        ...profileData,
        role: profileData?.user_roles?.[0]?.roles?.name || 'Não definido'
      });
    } catch (error: any) {
      console.error('Error loading profile:', error);
      toast({
        title: 'Erro ao carregar perfil',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: EditableProfileFields, value: string) => {
    if (!profile) return;

    if (field === 'phone') {
      value = value.replace(/\D/g, '');
    }

    setProfile({ ...profile, [field]: value });
  };

  const formatPhoneForDisplay = (phone: string | null) => {
    if (!phone) return '';
    const numbers = phone.replace(/\D/g, '');
    if (numbers.length === 11) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
    return numbers;
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !user?.id) return;
    
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

      if (uploadError) throw uploadError;

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

      if (updateError) throw updateError;

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
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar foto',
        description: error.message || 'Ocorreu um erro ao atualizar sua foto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!profile?.avatar_url || !user?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: null })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, avatar_url: null } : null);
      toast({
        title: 'Foto removida com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao remover foto',
        description: error.message || 'Ocorreu um erro ao remover a foto',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile || !user?.id) return;

    setIsLoading(true);
    try {
      const updates = {
        user_id: user.id,
        full_name: profile.full_name,
        phone: profile.phone,
        email: profile.email,
        updated_at: new Date().toISOString()
      };
      
      console.log('Profile data:', profile);
      console.log('Updates being sent:', updates);
      console.log('User ID:', user.id);

      const { error } = await supabase
        .from('profiles')
        .upsert(updates, {
          onConflict: 'user_id',
          ignoreDuplicates: false
        });

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      toast({
        title: 'Perfil atualizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      toast({
        title: 'Senha alterada',
        description: 'Sua senha foi alterada com sucesso.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      return true;
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Erro ao alterar senha',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log('useEffect triggered, user:', user?.id);
    loadUserProfile();
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
