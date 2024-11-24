import React, { createContext, useContext, useState, useEffect } from 'react'
import { useToast } from '@chakra-ui/react'
import { signIn, signOut, getCurrentUser, onAuthStateChange } from '../config/supabase'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  useEffect(() => {
    // Carrega o usuário atual
    const loadUser = async () => {
      try {
        const currentUser = await getCurrentUser()
        setUser(currentUser)
      } catch (error) {
        console.error('Erro ao carregar usuário:', error)
      } finally {
        setLoading(false)
      }
    }

    loadUser()

    // Inscreve-se para mudanças na autenticação
    const { data: { subscription } } = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const login = async (email, password) => {
    try {
      setLoading(true)
      const { user } = await signIn(email, password)
      setUser(user)
      
      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      return user
    } catch (error) {
      toast({
        title: 'Erro ao fazer login',
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
        title: 'Logout realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      toast({
        title: 'Erro ao fazer logout',
        description: error.message,
        status: 'error',
        duration: 3000,
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
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}
