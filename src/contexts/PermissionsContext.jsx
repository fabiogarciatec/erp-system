import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';
import { hasPermission, hasAllPermissions, hasAnyPermission } from '../config/permissions';

const PermissionsContext = createContext(null);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions deve ser usado dentro de um PermissionsProvider');
  }
  return context;
};

export const PermissionsProvider = ({ children }) => {
  const { user } = useAuth();

  const checkPermission = (permission) => {
    return hasPermission(user?.role, permission);
  };

  const checkAllPermissions = (permissions) => {
    return hasAllPermissions(user?.role, permissions);
  };

  const checkAnyPermission = (permissions) => {
    return hasAnyPermission(user?.role, permissions);
  };

  return (
    <PermissionsContext.Provider
      value={{
        checkPermission,
        checkAllPermissions,
        checkAnyPermission,
        userRole: user?.role,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};
