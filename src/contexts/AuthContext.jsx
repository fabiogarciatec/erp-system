import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { signIn, signOut, getCurrentUser, onAuthStateChange } from '../services/supabase'
import { useNavigate, useLocation } from 'react-router-dom'

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
  const navigate = useNavigate()
  const location = useLocation()

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

    return () => {
      mounted = false
    }
  }, [])

  // Efeito para gerenciar redirecionamentos baseados em autenticação
  useEffect(() => {
    if (!initialized) return

    const isLoginPage = location.pathname === '/login'
    const isProtectedRoute = !isLoginPage

    if (user && isLoginPage) {
      console.log('Usuário autenticado tentando acessar login, redirecionando para home...')
      navigate('/')
    } else if (!user && isProtectedRoute) {
      console.log('Usuário não autenticado tentando acessar rota protegida, redirecionando para login...')
      navigate('/login')
    }
  }, [user, initialized, location.pathname, navigate])

  // Efeito para monitorar mudanças no estado de autenticação
  useEffect(() => {
    if (!initialized) return

    const { data: { subscription } } = onAuthStateChange((event, session) => {
      console.log('Mudança no estado de autenticação:', { event, session })
      
      if (session?.user) {
        setUser(session.user)
      } else {
        setUser(null)
      }
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [initialized])

  const login = async (email, password) => {
    try {
      setLoading(true)
      console.log('Iniciando processo de login...')
      
      const { data, error } = await signIn(email, password)
      
      if (error) throw error
      
      if (!data?.user) {
        throw new Error('Login bem sucedido mas usuário não encontrado')
      }

      console.log('Login bem sucedido:', data.user)
      setUser(data.user)
      
      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      navigate('/')
    } catch (error) {
      console.error('Erro no login:', error)
      
      const errorMessage = error.message === 'Invalid login credentials'
        ? 'Email ou senha inválidos'
        : 'Erro ao fazer login. Tente novamente.'

      toast({
        title: 'Erro no login',
        description: errorMessage,
        status: 'error',
        duration: 5000,
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
      console.log('Iniciando processo de logout...')
      
      await signOut()
      setUser(null)
      
      console.log('Logout realizado com sucesso')
      navigate('/login')
      
      toast({
        title: 'Logout realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Erro no logout:', error)
      
      toast({
        title: 'Erro ao fazer logout',
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
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    initialized
  }

  if (!initialized) {
    return null
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
