import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../contexts/PermissionsContext';
import { useAuth } from '../contexts/AuthContext';

export const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = true,
  adminOnly = false
}) => {
  const location = useLocation();
  const { hasPermission, userRole, loading } = usePermissions();
  const { user } = useAuth();

  // Se ainda está carregando, mostra nada ou um loader
  if (loading) {
    return null;
  }

  // Se não estiver autenticado, redireciona para o login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verifica se a rota é apenas para admin
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/acesso-negado" state={{ from: location }} replace />;
  }

  // Verifica as permissões específicas do componente
  if (requiredPermissions.length > 0) {
    const hasAccess = requireAll 
      ? requiredPermissions.every(permission => hasPermission(permission))
      : requiredPermissions.some(permission => hasPermission(permission));

    if (!hasAccess) {
      return <Navigate to="/acesso-negado" state={{ from: location }} replace />;
    }
  }

  return children;
};
