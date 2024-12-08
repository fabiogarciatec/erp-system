import supabase from '@/lib/supabase';
class PermissionsService {
    // Roles
    async getRoles(companyId = null) {
        let query = supabase
            .from('roles')
            .select('*');
        if (companyId) {
            query = query.or('company_id.eq.' + companyId + ',is_system_role.eq.true');
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async createRole(role) {
        const { data, error } = await supabase
            .from('roles')
            .insert(role)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async updateRole(id, role) {
        const { data, error } = await supabase
            .from('roles')
            .update(role)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async deleteRole(id) {
        const { error } = await supabase
            .from('roles')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
    // Permissions
    async getPermissions(companyId = null) {
        let query = supabase
            .from('permissions')
            .select('*');
        if (companyId) {
            query = query.or('company_id.eq.' + companyId + ',company_id.is.null');
        }
        const { data, error } = await query;
        if (error)
            throw error;
        return data;
    }
    async createPermission(permission) {
        const { data, error } = await supabase
            .from('permissions')
            .insert(permission)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async updatePermission(id, permission) {
        const { data, error } = await supabase
            .from('permissions')
            .update(permission)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async deletePermission(id) {
        const { error } = await supabase
            .from('permissions')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
    }
    // Role Permissions
    async getRolePermissions(roleId) {
        const { data, error } = await supabase
            .from('role_permissions')
            .select('permission_id')
            .eq('role_id', roleId);
        if (error)
            throw error;
        return data?.map(rp => rp.permission_id) || [];
    }
    async addPermissionToRole(roleId, permissionId) {
        const { error } = await supabase
            .from('role_permissions')
            .insert({ role_id: roleId, permission_id: permissionId });
        if (error)
            throw error;
    }
    async removePermissionFromRole(roleId, permissionId) {
        const { error } = await supabase
            .from('role_permissions')
            .delete()
            .eq('role_id', roleId)
            .eq('permission_id', permissionId);
        if (error)
            throw error;
    }
    // User Roles
    async getUserRoles(userId) {
        const { data, error } = await supabase
            .from('user_roles')
            .select(`
        *,
        role:roles(*)
      `)
            .eq('user_id', userId);
        if (error)
            throw error;
        return data;
    }
    async addRoleToUser(userId, roleId) {
        const { data, error } = await supabase
            .from('user_roles')
            .insert({
            user_id: userId,
            role_id: roleId
        })
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
    async removeRoleFromUser(userId, roleId) {
        const { error } = await supabase
            .from('user_roles')
            .delete()
            .eq('user_id', userId)
            .eq('role_id', roleId);
        if (error)
            throw error;
    }
    // Permission Modules
    async getPermissionModules() {
        const { data, error } = await supabase
            .from('permission_modules')
            .select('*');
        if (error)
            throw error;
        return data;
    }
    async createPermissionModule(module) {
        const { data, error } = await supabase
            .from('permission_modules')
            .insert(module)
            .select()
            .single();
        if (error)
            throw error;
        return data;
    }
}
export const permissionsService = new PermissionsService();
