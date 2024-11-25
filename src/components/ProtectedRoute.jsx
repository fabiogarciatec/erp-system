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
  const { checkAllPermissions, checkAnyPermission, checkRoutePermission } = usePermissions();
  const { userRole } = useAuth();

  // Verifica se a rota é apenas para admin
  if (adminOnly && userRole !== 'admin') {
    return <Navigate to="/acesso-negado" state={{ from: location }} replace />;
  }

  // Primeiro verifica se o usuário tem permissão para a rota atual
  const hasRoutePermission = checkRoutePermission(location.pathname);
  if (!hasRoutePermission) {
    return <Navigate to="/acesso-negado" state={{ from: location }} replace />;
  }

  // Depois verifica as permissões específicas do componente
  if (requiredPermissions.length > 0) {
    const hasComponentPermission = requireAll 
      ? checkAllPermissions(requiredPermissions)
      : checkAnyPermission(requiredPermissions);

    if (!hasComponentPermission) {
      return <Navigate to="/acesso-negado" state={{ from: location }} replace />;
    }
  }

  return children;
};
