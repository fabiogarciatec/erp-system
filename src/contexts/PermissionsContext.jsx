import React, { createContext, useContext } from 'react';
import { useAuth } from './AuthContext';

const PermissionsContext = createContext(null);

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions deve ser usado dentro de um PermissionsProvider');
  }
  return context;
};

export const PermissionsProvider = ({ children }) => {
  const { userPermissions, userRole } = useAuth();

  const isAdmin = userRole === 'admin';

  // Verifica se o usuário tem uma permissão específica
  const checkPermission = (permission) => {
    if (isAdmin) return true;
    if (!userPermissions || !permission) return false;
    return userPermissions.includes(permission);
  };

  // Verifica se o usuário tem todas as permissões especificadas
  const checkAllPermissions = (permissions) => {
    if (isAdmin) return true;
    if (!userPermissions || !permissions || permissions.length === 0) return false;
    return permissions.every(permission => userPermissions.includes(permission));
  };

  // Verifica se o usuário tem pelo menos uma das permissões especificadas
  const checkAnyPermission = (permissions) => {
    if (isAdmin) return true;
    if (!userPermissions || !permissions || permissions.length === 0) return false;
    return permissions.some(permission => userPermissions.includes(permission));
  };

  // Verifica se o usuário tem permissão para acessar uma rota
  const checkRoutePermission = (routePath) => {
    if (isAdmin) return true;
    
    // Normaliza o caminho removendo a barra final se existir
    const normalizedPath = routePath.replace(/\/$/, '');
    
    const routePermissions = {
      '/': [], // Dashboard - todos podem acessar
      '/cadastros/clientes': ['companies.view'],
      '/cadastros/produtos': ['products.view'],
      '/cadastros/servicos': ['products.view'],
      '/cadastros/fornecedores': ['companies.view'],
      '/vendas/produtos': ['sales.view'],
      '/vendas/ordem-servico': ['sales.view'],
      '/vendas/fretes': ['sales.view'],
      '/vendas/orcamentos': ['sales.view'],
      '/marketing/campanhas': ['marketing.view'],
      '/marketing/contatos': ['marketing.view'],
      '/marketing/disparos': ['marketing.view'],
      '/configuracoes/empresa': ['companies.view'],
      '/configuracoes/usuarios': ['users.view'],
      '/configuracoes/permissoes': ['users.view', 'users.edit']
    };

    const requiredPermissions = routePermissions[normalizedPath];
    if (!requiredPermissions) return true; // Se a rota não está mapeada, permite acesso
    return checkAllPermissions(requiredPermissions);
  };

  return (
    <PermissionsContext.Provider
      value={{
        checkPermission,
        checkAllPermissions,
        checkAnyPermission,
        checkRoutePermission,
        userPermissions,
        isAdmin
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};
