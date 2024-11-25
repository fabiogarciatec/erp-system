// Roles disponíveis no sistema
export const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MANAGER: 'manager'
};

// Permissões disponíveis no sistema
export const PERMISSIONS = {
  // Permissões de usuário
  USER_VIEW: 'user:view',
  USER_CREATE: 'user:create',
  USER_EDIT: 'user:edit',
  USER_DELETE: 'user:delete',
  USER_PERMISSIONS: 'user:permissions',

  // Permissões de produtos
  PRODUCT_VIEW: 'product:view',
  PRODUCT_CREATE: 'product:create',
  PRODUCT_EDIT: 'product:edit',
  PRODUCT_DELETE: 'product:delete',

  // Permissões de vendas
  SALE_VIEW: 'sale:view',
  SALE_CREATE: 'sale:create',
  SALE_EDIT: 'sale:edit',
  SALE_DELETE: 'sale:delete',

  // Permissões de relatórios
  REPORT_VIEW: 'report:view',
  REPORT_CREATE: 'report:create',
  REPORT_EXPORT: 'report:export',

  // Permissões de configurações
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit'
};

// Permissões padrão para cada role
export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS), // Admin tem todas as permissões
  [ROLES.USER]: [
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.SALE_VIEW,
    PERMISSIONS.SALE_CREATE,
    PERMISSIONS.REPORT_VIEW
  ],
  [ROLES.MANAGER]: [
    // Permissões de usuário
    PERMISSIONS.USER_VIEW,
    PERMISSIONS.USER_CREATE,
    PERMISSIONS.USER_EDIT,
    
    // Permissões de produtos
    PERMISSIONS.PRODUCT_VIEW,
    PERMISSIONS.PRODUCT_CREATE,
    PERMISSIONS.PRODUCT_EDIT,
    
    // Permissões de vendas
    PERMISSIONS.SALE_VIEW,
    PERMISSIONS.SALE_CREATE,
    PERMISSIONS.SALE_EDIT,
    
    // Permissões de relatórios
    PERMISSIONS.REPORT_VIEW,
    PERMISSIONS.REPORT_CREATE,
    PERMISSIONS.REPORT_EXPORT,
    
    // Permissões de configurações
    PERMISSIONS.SETTINGS_VIEW
  ]
};

// Função para verificar se um role tem uma permissão específica
export const roleHasPermission = (role, permission) => {
  if (role === ROLES.ADMIN) return true;
  return ROLE_PERMISSIONS[role]?.includes(permission) || false;
};

// Função para verificar se um role tem todas as permissões especificadas
export const roleHasAllPermissions = (role, permissions) => {
  if (role === ROLES.ADMIN) return true;
  return permissions.every(permission => ROLE_PERMISSIONS[role]?.includes(permission));
};

// Função para verificar se um role tem alguma das permissões especificadas
export const roleHasAnyPermission = (role, permissions) => {
  if (role === ROLES.ADMIN) return true;
  return permissions.some(permission => ROLE_PERMISSIONS[role]?.includes(permission));
};
