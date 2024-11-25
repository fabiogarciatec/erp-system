import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, signIn, signOut, getCurrentUser, onAuthStateChange, connectionManager } from '../services/supabase';
import { useToast } from '@chakra-ui/react';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  // Função para limpar o estado de autenticação
  const clearAuthState = () => {
    setUser(null);
    setUserProfile(null);
    setLoading(false);
  };

  // Função para carregar o perfil do usuário
  const loadUserProfile = async (userId, userData) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      const profile = {
        ...data,
        email: userData.email,
        role: data.role || 'user',
      };

      setUserProfile(profile);
      return profile;
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
      return null;
    }
  };

  // Função de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await signIn(email, password);
      
      if (error) throw error;
      
      const { user: userData } = data;
      if (!userData) throw new Error('Usuário não encontrado');

      setUser(userData);
      const profile = await loadUserProfile(userData.id, userData);
      
      if (!profile) throw new Error('Perfil não encontrado');

      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro no login',
        description: error.message || 'Verifique suas credenciais',
        status: 'error',
        duration: 5000,
      });
      clearAuthState();
    } finally {
      setLoading(false);
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      setLoading(true);
      await signOut();
      clearAuthState();
      navigate('/login');
      
      toast({
        title: 'Logout realizado com sucesso!',
        status: 'success',
        duration: 3000,
      });
    } catch (error) {
      console.error('Erro no logout:', error);
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        status: 'error',
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Monitora mudanças no estado de conexão
  useEffect(() => {
    const handleConnectionChange = (event) => {
      switch (event) {
        case 'offline':
          toast({
            title: 'Conexão perdida',
            description: 'Tentando reconectar...',
            status: 'warning',
            duration: null,
            isClosable: true,
          });
          break;
        case 'online':
          toast({
            title: 'Conexão restabelecida',
            status: 'success',
            duration: 3000,
          });
          break;
        case 'max_attempts':
          toast({
            title: 'Erro de conexão',
            description: 'Máximo de tentativas alcançado. Por favor, faça login novamente.',
            status: 'error',
            duration: 5000,
          });
          logout();
          break;
      }
    };

    connectionManager.addListener(handleConnectionChange);
    return () => connectionManager.removeListener(handleConnectionChange);
  }, []);

  // Inicializa o estado de autenticação
  useEffect(() => {
    const initAuth = async () => {
      try {
        // Verifica se há uma sessão ativa
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          console.log('Nenhuma sessão ativa');
          clearAuthState();
          return;
        }

        // Se há sessão, tenta obter o usuário
        const currentUser = await getCurrentUser();
        if (currentUser) {
          setUser(currentUser);
          await loadUserProfile(currentUser.id, currentUser);
        } else {
          clearAuthState();
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        clearAuthState();
      } finally {
        setLoading(false);
      }
    };

    // Configura o listener de mudanças de autenticação
    const { unsubscribe } = onAuthStateChange(async (event, session) => {
      console.log('Evento de autenticação:', event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id, session.user);
      } else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        clearAuthState();
      }
    });

    initAuth();
    return () => {
      unsubscribe?.();
      connectionManager.cleanup();
    };
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    login,
    logout,
    clearAuthState,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
