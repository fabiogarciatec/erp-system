import supabase from '@/lib/supabase'
import { Permission, Role, RolePermission, UserRole, PermissionModule } from '@/types/permissions'

class PermissionsService {
  // Roles
  async getRoles(companyId: string | null = null) {
    let query = supabase
      .from('roles')
      .select('*')
      
    if (companyId) {
      query = query.or('company_id.eq.' + companyId + ',is_system_role.eq.true')
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Role[]
  }

  async createRole(role: Partial<Role>) {
    const { data, error } = await supabase
      .from('roles')
      .insert(role)
      .select()
      .single()
    if (error) throw error
    return data as Role
  }

  async updateRole(id: string, role: Partial<Role>) {
    const { data, error } = await supabase
      .from('roles')
      .update(role)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Role
  }

  async deleteRole(id: string) {
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // Permissions
  async getPermissions(companyId: string | null = null) {
    let query = supabase
      .from('permissions')
      .select('*')
    
    if (companyId) {
      query = query.or('company_id.eq.' + companyId + ',company_id.is.null')
    }
    
    const { data, error } = await query
    if (error) throw error
    return data as Permission[]
  }

  async createPermission(permission: Partial<Permission>) {
    const { data, error } = await supabase
      .from('permissions')
      .insert(permission)
      .select()
      .single()
    if (error) throw error
    return data as Permission
  }

  async updatePermission(id: string, permission: Partial<Permission>) {
    const { data, error } = await supabase
      .from('permissions')
      .update(permission)
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return data as Permission
  }

  async deletePermission(id: string) {
    const { error } = await supabase
      .from('permissions')
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  // Role Permissions
  async getRolePermissions(roleId: string) {
    const { data, error } = await supabase
      .from('role_permissions')
      .select('permission_id')
      .eq('role_id', roleId)
    
    if (error) throw error
    return data?.map(rp => rp.permission_id) || []
  }

  async addPermissionToRole(roleId: string, permissionId: string) {
    const { error } = await supabase
      .from('role_permissions')
      .insert({ role_id: roleId, permission_id: permissionId })
    if (error) throw error
  }

  async removePermissionFromRole(roleId: string, permissionId: string) {
    const { error } = await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId)
    if (error) throw error
  }

  // User Roles
  async getUserRoles(userId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        *,
        role:roles(*)
      `)
      .eq('user_id', userId)
    if (error) throw error
    return data
  }

  async addRoleToUser(userId: string, roleId: string) {
    const { data, error } = await supabase
      .from('user_roles')
      .insert({
        user_id: userId,
        role_id: roleId
      })
      .select()
      .single()
    if (error) throw error
    return data
  }

  async removeRoleFromUser(userId: string, roleId: string) {
    const { error } = await supabase
      .from('user_roles')
      .delete()
      .eq('user_id', userId)
      .eq('role_id', roleId)
    if (error) throw error
  }

  // Permission Modules
  async getPermissionModules() {
    const { data, error } = await supabase
      .from('permission_modules')
      .select('*')
    if (error) throw error
    return data as PermissionModule[]
  }

  async createPermissionModule(module: Partial<PermissionModule>) {
    const { data, error } = await supabase
      .from('permission_modules')
      .insert(module)
      .select()
      .single()
    if (error) throw error
    return data as PermissionModule
  }
}

export const permissionsService = new PermissionsService()
