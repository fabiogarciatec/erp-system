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

  // Verifica uma permissão específica
  const hasPermission = (requiredPermission) => {
    if (!user || loading) return false
    
    // Admin tem todas as permissões
    if (userRole === 'admin' || userPermissions.includes('*')) {
      return true
    }

    // Verifica se o usuário tem a permissão específica
    return userPermissions.includes(requiredPermission)
  }

  // Verifica se tem todas as permissões da lista
  const checkAllPermissions = (permissions = []) => {
    if (!user || loading) return false
    
    // Admin tem todas as permissões
    if (userRole === 'admin' || userPermissions.includes('*')) {
      return true
    }

    // Verifica se tem todas as permissões
    return permissions.every(permission => userPermissions.includes(permission))
  }

  // Verifica se tem pelo menos uma das permissões da lista
  const checkAnyPermission = (permissions = []) => {
    if (!user || loading) return false
    
    // Admin tem todas as permissões
    if (userRole === 'admin' || userPermissions.includes('*')) {
      return true
    }

    // Verifica se tem pelo menos uma permissão
    return permissions.some(permission => userPermissions.includes(permission))
  }

  // Verifica permissão baseada na rota
  const checkRoutePermission = (pathname) => {
    if (!user || loading) return false
    
    // Admin tem todas as permissões
    if (userRole === 'admin' || userPermissions.includes('*')) {
      return true
    }

    // Mapeamento de rotas para permissões
    const routePermissions = {
      '/usuarios': 'view_users',
      '/permissoes': 'manage_permissions',
      // Adicione mais rotas conforme necessário
    }

    // Se a rota não requer permissão específica, permite acesso
    if (!routePermissions[pathname]) {
      return true
    }

    // Verifica se tem a permissão necessária para a rota
    return userPermissions.includes(routePermissions[pathname])
  }

  const value = {
    loading,
    hasPermission,
    checkAllPermissions,
    checkAnyPermission,
    checkRoutePermission,
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
