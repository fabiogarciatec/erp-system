// Definição das permissões do sistema
export const PERMISSIONS = {
  // Usuários
  'users.view': 'Visualizar usuários',
  'users.create': 'Criar usuários',
  'users.edit': 'Editar usuários',
  'users.delete': 'Excluir usuários',

  // Empresas
  'companies.view': 'Visualizar empresas',
  'companies.create': 'Criar empresas',
  'companies.edit': 'Editar empresas',
  'companies.delete': 'Excluir empresas',

  // Produtos
  'products.view': 'Visualizar produtos',
  'products.create': 'Criar produtos',
  'products.edit': 'Editar produtos',
  'products.delete': 'Excluir produtos',

  // Vendas
  'sales.view': 'Visualizar vendas',
  'sales.create': 'Criar vendas',
  'sales.edit': 'Editar vendas',
  'sales.delete': 'Excluir vendas',

  // Relatórios
  'reports.view': 'Visualizar relatórios',
  'reports.create': 'Criar relatórios',
  'reports.export': 'Exportar relatórios',
};

// Função para verificar se um usuário tem uma permissão específica
export const hasPermission = (userPermissions, permission) => {
  if (!userPermissions || !permission) return false;
  return userPermissions.includes(permission);
};

// Função para verificar se um usuário tem todas as permissões especificadas
export const hasAllPermissions = (userPermissions, permissions) => {
  if (!userPermissions || !permissions) return false;
  return permissions.every(permission => userPermissions.includes(permission));
};

// Função para verificar se um usuário tem pelo menos uma das permissões especificadas
export const hasAnyPermission = (userPermissions, permissions) => {
  if (!userPermissions || !permissions) return false;
  return permissions.some(permission => userPermissions.includes(permission));
};
