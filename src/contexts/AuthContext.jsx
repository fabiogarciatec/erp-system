import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { supabase, signIn, signOut, getCurrentUser, onAuthStateChange } from '../services/supabase'
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

  useEffect(() => {
    let mounted = true
    let unsubscribe

    const initialize = async () => {
      try {
        // Verifica se há um token de redefinição de senha na URL
        const hash = window.location.hash;
        if (hash && hash.includes('type=recovery')) {
          setLoading(false);
          setInitialized(true);
          return;
        }

        const { data: { session } } = await supabase.auth.getSession()
        
        if (mounted) {
          if (session?.user) {
            await loadUserProfile(session.user.id, session.user)
            setUser(session.user)
          } else {
            setUser(null)
            setUserRole(null)
            setUserPermissions([])
          }
          setLoading(false)
          setInitialized(true)
        }

        // Subscribe to auth changes
        unsubscribe = supabase.auth.onAuthStateChange(async (event, session) => {
          console.log('Auth state changed:', event, session)
          if (mounted) {
            if (session?.user) {
              setUser(session.user)
              await loadUserProfile(session.user.id, session.user)
            } else {
              setUser(null)
              setUserRole(null)
              setUserPermissions([])
            }
          }
        })
      } catch (error) {
        console.error('Erro ao inicializar auth:', error)
        if (mounted) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    initialize()

    return () => {
      mounted = false
      unsubscribe?.()
    }
  }, [])

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
