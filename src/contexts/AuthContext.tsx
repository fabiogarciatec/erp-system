import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService, User } from '@/services/auth'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string, password: string, companyName: string, companyDocument: string, companyEmail?: string, companyPhone?: string }) => Promise<void>
  logout: () => Promise<void>
  hasPermission: (permission: string) => boolean
  hasRole: (role: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const user = await authService.getCurrentUser()
      setUser(user)
    } catch (error) {
      console.error('Error checking user:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { user } = await authService.login(email, password)
      setUser(user)
      navigate('/dashboard')
    } catch (error: any) {
      if (error.message === 'Invalid login credentials') {
        throw new Error('Email ou senha inválidos. Se você acabou de criar sua conta, confirme seu email antes de fazer login.');
      }
      console.error('Login error:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (data: { 
    email: string, 
    password: string, 
    companyName: string, 
    companyDocument: string, 
    companyEmail?: string, 
    companyPhone?: string 
  }) => {
    try {
      await authService.register(data)
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
      setUser(null)
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const hasPermission = (permission: string): boolean => {
    return authService.hasPermission(user, permission)
  }

  const hasRole = (role: string): boolean => {
    return authService.hasRole(user, role)
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    hasPermission,
    hasRole,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
