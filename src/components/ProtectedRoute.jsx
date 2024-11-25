import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { usePermissions } from '../contexts/PermissionsContext';

export const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = true 
}) => {
  const location = useLocation();
  const { checkAllPermissions, checkAnyPermission } = usePermissions();

  const hasAccess = requireAll 
    ? checkAllPermissions(requiredPermissions)
    : checkAnyPermission(requiredPermissions);

  if (!hasAccess) {
    // Redireciona para a página de acesso negado, mantendo a URL original
    return <Navigate to="/acesso-negado" state={{ from: location }} replace />;
  }

  return children;
};
