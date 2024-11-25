import React from 'react';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { ROLES, PERMISSIONS } from '../constants/roles';

// Componente interno que será protegido
const UserManagementContent = () => {
  return (
    <div>
      <h1>Gerenciamento de Usuários</h1>
      {/* Conteúdo da página */}
    </div>
  );
};

// Wrapper com proteção de rota
export const UserManagement = () => {
  return (
    <ProtectedRoute
      requiredRole={ROLES.MANAGER} // Requer role de manager
      requiredPermissions={[
        PERMISSIONS.USER_VIEW,
        PERMISSIONS.USER_EDIT
      ]} // Requer ambas as permissões
      requireAllPermissions={true} // Deve ter TODAS as permissões listadas
    >
      <UserManagementContent />
    </ProtectedRoute>
  );
};
