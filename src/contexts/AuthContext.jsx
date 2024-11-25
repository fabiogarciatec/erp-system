import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { supabase, signIn, signOut, getCurrentUser, onAuthStateChange } from '../services/supabase'

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

      console.log('Perfil carregado:', profile)
      setUserProfile(profile)
      setUserRole(profile.roles?.name || 'user')
      setUserPermissions(profile.roles?.role_permissions?.map(p => p.permission_key) || [])
    } catch (error) {
      console.error('Erro ao carregar perfil do usuário:', error)
      toast({
        title: 'Erro ao carregar perfil',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  // Inicializa o estado da autenticação
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true)
        console.log('Inicializando autenticação...')

        const currentUser = await getCurrentUser()
        console.log('Usuário atual:', currentUser)

        if (currentUser) {
          setUser(currentUser)
          await loadUserProfile(currentUser.id, currentUser)
        } else {
          setUser(null)
          setUserProfile(null)
          setUserRole(null)
          setUserPermissions([])
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error)
        setUser(null)
        setUserProfile(null)
        setUserRole(null)
        setUserPermissions([])
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    initializeAuth()

    // Configura o listener de mudanças na autenticação
    const { unsubscribe } = onAuthStateChange(async (event, session) => {
      console.log('Mudança no estado de autenticação:', event, session)

      if (event === 'SIGNED_IN') {
        setUser(session.user)
        await loadUserProfile(session.user.id, session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        setUserProfile(null)
        setUserRole(null)
        setUserPermissions([])
      }
    })

    return () => {
      console.log('Limpando listener de autenticação')
      unsubscribe()
    }
  }, [])

  // Função de login
  const handleSignIn = async (email, password) => {
    try {
      setLoading(true)
      const { data, error } = await signIn(email, password)

      if (error) throw error

      const user = data.user
      setUser(user)
      await loadUserProfile(user.id, user)

      toast({
        title: 'Login realizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      return { error: null }
    } catch (error) {
      console.error('Erro no login:', error)
      setUser(null)
      setUserProfile(null)
      setUserRole(null)
      setUserPermissions([])

      toast({
        title: 'Erro no login',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Função de logout
  const handleSignOut = async () => {
    try {
      setLoading(true)
      const { error } = await signOut()

      if (error) throw error

      setUser(null)
      setUserProfile(null)
      setUserRole(null)
      setUserPermissions([])

      toast({
        title: 'Logout realizado com sucesso',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      return { error: null }
    } catch (error) {
      console.error('Erro no logout:', error)

      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })

      return { error }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    userProfile,
    userRole,
    userPermissions,
    loading,
    initialized,
    signIn: handleSignIn,
    signOut: handleSignOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
