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
      
      // Primeiro, busca o perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (profileError) {
        if (profileError.code === 'PGRST116') {
          console.log('Perfil não encontrado, criando...')
          // Se o perfil não existe, cria um novo
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .upsert([
              {
                id: userId,
                email: userData.email,
                full_name: userData.user_metadata?.full_name || userData.email,
              }
            ])
            .select()
            .single()

          if (createError) {
            console.error('Erro ao criar perfil:', createError)
            throw createError
          }
          
          setUserProfile(newProfile)
          setUserRole(null)
          setUserPermissions([])
          return
        } else {
          console.error('Erro ao carregar perfil:', profileError)
          throw profileError
        }
      }

      setUserProfile(profile)

      // Se tem role_id, busca as informações do role
      if (profile.role_id) {
        const { data: role, error: roleError } = await supabase
          .from('roles')
          .select(`
            id,
            name,
            role_permissions (
              permission_key
            )
          `)
          .eq('id', profile.role_id)
          .single()

        if (roleError) {
          console.error('Erro ao carregar role:', roleError)
          setUserRole(null)
          setUserPermissions([])
        } else if (role) {
          console.log('Role carregada:', role)
          setUserRole(role.name)

          // Se for admin, concede todas as permissões
          if (role.name === 'admin') {
            console.log('Usuário é admin, concedendo todas as permissões')
            setUserPermissions(['*']) // Wildcard para acesso total
            return
          }

          // Para outros roles, usa as permissões da role
          const permissionKeys = role.role_permissions?.map(p => p.permission_key) || []
          console.log('Permissões carregadas:', permissionKeys)
          setUserPermissions(permissionKeys)
        }
      } else {
        setUserRole(null)
        setUserPermissions([])
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

  // Efeito para carregar o usuário inicial
  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        
        if (!mounted) return

        if (!currentUser) {
          console.log('Nenhum usuário autenticado')
          setUser(null)
          setUserProfile(null)
          setUserRole(null)
          setUserPermissions([])
          setInitialized(true)
          setLoading(false)
          return
        }

        console.log('Usuário inicial carregado:', currentUser)
        setUser(currentUser)
        await loadUserProfile(currentUser.id, currentUser)
        setInitialized(true)
        setLoading(false)
      } catch (error) {
        console.error('Erro ao carregar usuário inicial:', error)
        if (mounted) {
          setUser(null)
          setUserProfile(null)
          setUserRole(null)
          setUserPermissions([])
          setInitialized(true)
          setLoading(false)
        }
      }
    }

    loadUser()

    // Configurar listener de mudanças de autenticação
    const { unsubscribe } = onAuthStateChange(async (event, session) => {
      console.log('Evento de autenticação:', event, session)
      if (!mounted) return

      const newUser = session?.user ?? null
      setUser(newUser)

      if (newUser) {
        await loadUserProfile(newUser.id, newUser)
      } else {
        setUserProfile(null)
        setUserRole(null)
        setUserPermissions([])
      }
    })

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

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
