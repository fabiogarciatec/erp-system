import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { signIn, signOut, getCurrentUser, onAuthStateChange } from '../services/supabase'

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
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)
  const toast = useToast()

  // Efeito para carregar o usuário inicial
  useEffect(() => {
    let mounted = true

    const loadUser = async () => {
      try {
        console.log('Carregando usuário inicial...')
        const currentUser = await getCurrentUser()
        
        if (mounted) {
          console.log('Usuário inicial carregado:', currentUser)
          setUser(currentUser)
          setInitialized(true)
          setLoading(false)
        }
      } catch (error) {
        console.error('Erro ao carregar usuário inicial:', error)
        if (mounted) {
          setUser(null)
          setInitialized(true)
          setLoading(false)
        }
      }
    }

    loadUser()

    // Configurar listener de mudanças de autenticação
    const { data: authListener } = onAuthStateChange((event, session) => {
      console.log('Evento de autenticação:', event, session)
      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      if (authListener) {
        authListener.subscription.unsubscribe()
      }
    }
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const { error } = await signIn(email, password)
      
      if (error) throw error

      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Erro no login:', error)
      toast({
        title: 'Erro no login',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await signOut()
      setUser(null)
      
      toast({
        title: 'Logout realizado com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })

      // Redireciona após um pequeno delay para o toast aparecer
      setTimeout(() => {
        window.location.href = '/login'
      }, 500)
    } catch (error) {
      console.error('Erro no logout:', error)
      // Mesmo com erro, vamos tentar limpar o estado e redirecionar
      setUser(null)
      
      toast({
        title: 'Aviso',
        description: 'Sua sessão foi encerrada',
        status: 'info',
        duration: 2000,
        isClosable: true,
      })

      setTimeout(() => {
        window.location.href = '/login'
      }, 500)
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    initialized,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
