import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../contexts/PermissionsContext';

export const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = true 
}) => {
  const location = useLocation();
  const { checkAllPermissions, checkAnyPermission, checkRoutePermission } = usePermissions();

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
