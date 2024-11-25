import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'

const PermissionsContext = createContext(null)

export const usePermissions = () => {
  const context = useContext(PermissionsContext)
  if (!context) {
    throw new Error('usePermissions deve ser usado dentro de um PermissionsProvider')
  }
  return context
}

export const PermissionsProvider = ({ children }) => {
  const { user, userRole, userPermissions } = useAuth()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [user, userRole, userPermissions])

  const hasPermission = (requiredPermission) => {
    if (!user || loading) return false
    
    // Admin tem todas as permissões
    if (userRole === 'admin' || userPermissions.includes('*')) {
      return true
    }

    // Verifica se o usuário tem a permissão específica
    return userPermissions.includes(requiredPermission)
  }

  const value = {
    loading,
    hasPermission,
    userRole,
    userPermissions,
  }

  return (
    <PermissionsContext.Provider value={value}>
      {children}
    </PermissionsContext.Provider>
  )
}

export default PermissionsProvider
