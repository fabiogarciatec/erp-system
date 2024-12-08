export interface Permission {
  id: string;
  name: string;
  description: string;
  code: string;
  module: string;
  created_at: string;
  company_id: string | null;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  is_system_role: boolean;
  company_id: string | null;
  created_at: string;
}

export interface RolePermission {
  id: string;
  role_id: string;
  permission_id: string;
  created_at: string;
}

export interface UserRole {
  id: string;
  user_id: string;
  role_id: string;
  created_at: string;
}

export interface PermissionModule {
  id: string;
  name: string;
  code: string;
  description: string;
  created_at: string;
}
