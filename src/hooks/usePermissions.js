import { useAuth } from '../contexts/AuthContext'
import { useMemo } from 'react'

export function usePermissions() {
  const { userRole, userPermissions } = useAuth()

  const hasPermission = (permissionKey) => {
    // Admin tem todas as permissões
    if (userRole === 'admin') return true

    // Para outros roles, verifica as permissões específicas
    if (!userPermissions) return false
    return userPermissions.includes(permissionKey)
  }

  // Usando useMemo para memorizar os valores das permissões
  const permissions = useMemo(() => ({
    hasPermission,
    // Helpers para verificações comuns
    canViewUsers: hasPermission('users.view'),
    canCreateUsers: hasPermission('users.create'),
    canEditUsers: hasPermission('users.edit'),
    canDeleteUsers: hasPermission('users.delete'),
    // Flag para indicar se é admin
    isAdmin: userRole === 'admin'
  }), [userRole, userPermissions]) // Recalcula quando userRole ou userPermissions mudam

  return permissions
}
