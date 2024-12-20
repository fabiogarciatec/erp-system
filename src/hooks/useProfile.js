import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

export function useProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const toast = useToast();
    const navigate = useNavigate();

    const fetchProfile = async () => {
        try {
            setLoading(true);
            setError(null);
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login');
                return;
            }

            // Primeiro, tenta buscar o perfil existente
            const { data: existingProfile, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (profileError && profileError.code !== 'PGRST116') {
                throw profileError;
            }

            // Se o perfil não existir, cria um novo
            if (!existingProfile) {
                const { data: newProfile, error: insertError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            user_id: user.id,
                            email: user.email,
                            name: user.user_metadata?.name || '',
                        }
                    ])
                    .select()
                    .single();

                if (insertError) {
                    throw insertError;
                }

                setProfile(newProfile);
            } else {
                setProfile(existingProfile);
            }
        }
        catch (err) {
            const error = err;
            setError(error);
            console.error('Error fetching profile:', error);
            if (error.message.includes('Auth session missing')) {
                navigate('/login');
                toast({
                    title: 'Sessão expirada',
                    description: 'Por favor, faça login novamente.',
                    status: 'warning',
                    duration: 5000,
                    isClosable: true,
                });
            }
            else {
                toast({
                    title: 'Erro ao carregar perfil',
                    description: error.message,
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                });
            }
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const updateProfile = async (updates) => {
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('Não autorizado');
            }
            const { error } = await supabase
                .from('profiles')
                .update(updates)
                .eq('user_id', user.id);
            if (error) {
                throw error;
            }
            setProfile(prev => prev ? { ...prev, ...updates } : null);
            toast({
                title: 'Perfil atualizado',
                description: 'Suas informações foram atualizadas com sucesso.',
                status: 'success',
                duration: 3000,
                isClosable: true,
            });
        }
        catch (err) {
            const error = err;
            console.error('Error updating profile:', error);
            toast({
                title: 'Erro ao atualizar perfil',
                description: error.message,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    return {
        profile,
        loading,
        error,
        updateProfile,
        refreshProfile: fetchProfile,
    };
}
