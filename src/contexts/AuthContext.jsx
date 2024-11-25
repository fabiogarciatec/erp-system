import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { supabase, signIn, signOut, getCurrentUser, onAuthStateChange, checkSession } from '../services/supabase'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [userProfile, setUserProfile] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [userPermissions, setUserPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const toast = useToast()
  const navigate = useNavigate()

  // Carrega o perfil e permissões do usuário
  const loadUserProfile = async (userId, userData) => {
    try {
      console.log('Carregando perfil e permissões do usuário...')
      
      if (!userData || !userId) {
        console.log('Dados do usuário não fornecidos para carregar perfil')
        return
      }
      
      // Primeiro, busca o perfil do usuário com a role
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select(`
          *,
          roles:role_id (
            name,
            role_permissions (
              permission_key
            )
          )
        `)
        .eq('id', userId)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log('Perfil não encontrado, criando...')
          
          // Busca o ID da role 'user' (role padrão)
          const { data: userRole, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'user')
            .single()

          if (roleError) {
            console.error('Erro ao buscar role padrão:', roleError)
            throw roleError
          }

          // Se o perfil não existe, cria um novo com a role padrão
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert([
              {
                id: userId,
                email: userData.email,
                full_name: userData.user_metadata?.full_name || userData.email,
                role_id: userRole.id,
              }
            ])
            .select(`
              *,
              roles:role_id (
                name,
                role_permissions (
                  permission_key
                )
              )
            `)
            .single()

          if (createError) {
            console.error('Erro ao criar perfil:', createError)
            throw createError
          }
          
          setUserProfile(newProfile)
          setUserRole(newProfile.roles?.name || 'user')
          setUserPermissions(newProfile.roles?.role_permissions?.map(p => p.permission_key) || [])
          return
        } else {
          console.error('Erro ao carregar perfil:', profileError)
          throw profileError
        }
      }

      setUserProfile(profile)
      setUserRole(profile.roles?.name || 'user')

      // Se for admin, define todas as permissões
      if (profile.roles?.name === 'admin') {
        console.log('Usuário é admin, concedendo todas as permissões')
        setUserPermissions(['*']) // Wildcard para acesso total
      } else {
        // Para outros roles, usa as permissões específicas
        const permissions = profile.roles?.role_permissions?.map(p => p.permission_key) || []
        console.log('Permissões carregadas:', permissions)
        setUserPermissions(permissions)
      }
    } catch (error) {
      console.error('Erro ao carregar perfil e permissões:', error)
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar seu perfil. Por favor, tente novamente mais tarde.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      setUserProfile(null)
      setUserRole(null)
      setUserPermissions([])
    }
  }

  // Limpa o estado da autenticação
  const clearAuthState = () => {
    setUser(null);
    setUserProfile(null);
    setUserRole(null);
    setUserPermissions([]);
    setInitialized(false);
  };

  // Função para reconectar e recarregar dados
  const reconnect = async () => {
    try {
      setLoading(true);
      
      // Primeiro verifica a sessão
      const session = await checkSession();
      if (!session) {
        console.log('Sem sessão ativa, limpando estado...');
        clearAuthState();
        navigate('/login');
        return;
      }

      // Tenta obter o usuário atual
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        console.log('Usuário não encontrado, limpando estado...');
        clearAuthState();
        navigate('/login');
        return;
      }

      // Atualiza o estado com os dados do usuário
      setUser(currentUser);
      await loadUserProfile(currentUser.id, currentUser);
      
    } catch (error) {
      console.error('Erro ao reconectar:', error);
      clearAuthState();
      navigate('/login');
    } finally {
      setLoading(false);
    }
  };

  // Monitora quando a aba volta a ter foco
  useEffect(() => {
    let timeoutId;

    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log('Aba voltou a ter foco, aguardando para reconectar...');
        
        // Limpa o timeout anterior se existir
        if (timeoutId) {
          clearTimeout(timeoutId);
        }

        // Aguarda um momento antes de tentar reconectar
        timeoutId = setTimeout(() => {
          console.log('Tentando reconectar...');
          reconnect();
        }, 1000);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Tenta reconectar quando o componente monta
    reconnect();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Monitora mudanças na sessão do Supabase
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id, session.user);
      } 
      else if (event === 'SIGNED_OUT' || event === 'USER_DELETED') {
        clearAuthState();
        navigate('/login');
      }
      else if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
        await loadUserProfile(session.user.id, session.user);
      }
      
      setInitialized(true);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await signIn(email, password)
      if (error) throw error
      
      // Após o login bem-sucedido, carrega o perfil e permissões
      if (data?.user) {
        await loadUserProfile(data.user.id, data.user)
      }
      
      return { data, error: null }
    } catch (error) {
      console.error('Erro no login:', error)
      toast({
        title: 'Erro no login',
        description: error.message || 'Ocorreu um erro ao tentar fazer login. Por favor, tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await signOut()
      if (error) throw error
      setUser(null)
      setUserProfile(null)
      setUserRole(null)
      setUserPermissions([])
    } catch (error) {
      console.error('Erro no logout:', error)
      toast({
        title: 'Erro no logout',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  // Função de logout
  const logout = async () => {
    try {
      setLoading(true)
      const { error } = await signOut()
      if (error) throw error
      
      // Limpar o estado do usuário
      setUser(null)
      setUserProfile(null)
      setUserRole(null)
      setUserPermissions([])
    } catch (error) {
      console.error('Erro no logout:', error)
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Função para recarregar as permissões do usuário
  const reloadUserPermissions = async () => {
    if (!user?.id) return;
    
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select(`
          *,
          roles:role_id (
            name,
            role_permissions (
              permission_key
            )
          )
        `)
        .eq('id', user.id)
        .single();

      if (error) throw error;

      setUserProfile(profile);
      setUserRole(profile.roles?.name || 'user');
      setUserPermissions(profile.roles?.role_permissions?.map(p => p.permission_key) || []);
    } catch (error) {
      console.error('Erro ao recarregar permissões:', error);
    }
  };

  const value = {
    user,
    userProfile,
    userRole,
    userPermissions,
    loading,
    initialized,
    signIn: handleSignIn,
    signOut: handleSignOut,
    logout,
    reloadUserPermissions
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useLogout = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useLogout deve ser usado dentro de um AuthProvider')
  }
  return context.logout
}
