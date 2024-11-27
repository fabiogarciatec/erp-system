import { useState, useEffect } from 'react';
import { useToast } from '@chakra-ui/react';
import { supabase } from '../services/supabase';

export interface ProfileData {
  id: string;
  full_name: string;
  email: string;
  position: string;
  phone: string;
  avatar_url?: string;
  company_id?: string;
  created_at?: string;
  updated_at?: string;
}

export function useProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const toast = useToast();

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      console.log('Buscando usuário autenticado...');
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) {
        console.error('Erro ao buscar usuário:', authError);
        throw authError;
      }

      console.log('Usuário encontrado:', user);
      
      if (!user) throw new Error('User not found');

      // Primeiro, tenta buscar o perfil existente
      console.log('Buscando perfil do usuário...');
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('Resultado da busca do perfil:', { data, error });

      if (error) {
        console.error('Erro ao buscar perfil:', error);
        // Se o erro for de estrutura da tabela, vamos tentar recriar o perfil
        if (error.message.includes('does not exist') || error.message.includes('duplicate key')) {
          console.log('Criando novo perfil...');
          const newProfile: Omit<ProfileData, 'created_at' | 'updated_at'> = {
            id: user.id,
            full_name: user.user_metadata?.full_name || '',
            email: user.email || '',
            position: '',
            phone: '',
            avatar_url: '',
            company_id: undefined,
          };

          // Tenta inserir um novo perfil
          const { data: insertedProfile, error: insertError } = await supabase
            .from('profiles')
            .upsert([newProfile])
            .select()
            .single();

          console.log('Resultado da criação do perfil:', { insertedProfile, insertError });

          if (insertError) {
            console.error('Erro ao criar perfil:', insertError);
            throw insertError;
          }
          data = insertedProfile;
        } else {
          throw error;
        }
      }

      if (!data) {
        console.error('Perfil não encontrado após tentativas');
        throw new Error('Profile not found');
      }

      console.log('Perfil final:', data);
      setProfile(data);
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Erro ao carregar perfil',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Carregar perfil automaticamente
  useEffect(() => {
    fetchProfile();
  }, []);

  const updateProfile = async (updates: Partial<ProfileData>) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not found');

      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: 'Perfil atualizado',
        description: 'Suas informações foram atualizadas com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erro ao atualizar perfil',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const uploadAvatar = async (file: File) => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not found');

      // Criar um nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload do arquivo para o bucket 'avatars'
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Obter a URL pública do avatar
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Atualizar o perfil com a nova URL do avatar
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      // Atualizar o estado local
      setProfile(prev => prev ? { ...prev, avatar_url: publicUrl } : null);

      toast({
        title: 'Avatar atualizado',
        description: 'Sua foto de perfil foi atualizada com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast({
        title: 'Erro ao atualizar avatar',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    profile,
    isLoading,
    fetchProfile,
    updateProfile,
    uploadAvatar,
  };
}
