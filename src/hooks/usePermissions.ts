import { useState, useEffect } from 'react';
import supabase from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

// Interfaces para os dados após processamento
interface Permission {
    id: string;
    code: string;
    name: string;
    module: string;
}

interface RolePermission {
    role_id: string;
    permission_id: string;
    permissions: Permission;
}

// Interfaces para os dados brutos do Supabase
interface SupabaseRole {
    name: string;
}

// Interface para o retorno bruto do Supabase
interface RawRolePermission {
    role_id: string;
    permission_id: string;
    permissions: Permission;
}

interface RawProfile {
    id: string;
    role_id: string;
    roles: SupabaseRole;
}

interface DatabaseProfile {
    role_id: string | null;
    roles: SupabaseRole | null;
}

type SupabaseResponse<T> = {
    data: T | null;
    error: Error | null;
};

export const usePermissions = () => {
    const { user } = useAuth();
    const [userRole, setUserRole] = useState<DatabaseProfile | null>(null);
    const [userPermissions, setUserPermissions] = useState<RolePermission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserPermissions = async () => {
            if (!user) {
                setUserRole(null);
                setUserPermissions([]);
                setLoading(false);
                return;
            }

            try {
                // Busca o perfil do usuário com suas roles
                const { data: rawProfile, error: profileError }: SupabaseResponse<RawProfile> = await supabase
                    .from('profiles')
                    .select(`
                        role_id,
                        roles (
                            name
                        )
                    `)
                    .eq('id', user.id)
                    .single();

                if (profileError) throw profileError;

                if (!rawProfile || !rawProfile.roles) {
                    setUserRole(null);
                    setUserPermissions([]);
                    setLoading(false);
                    return;
                }

                const profile: DatabaseProfile = {
                    role_id: rawProfile.role_id,
                    roles: rawProfile.roles
                };

                setUserRole(profile);

                if (!profile.role_id) {
                    setUserPermissions([]);
                    setLoading(false);
                    return;
                }

                // Busca as permissões da role do usuário
                const { data: rawPermissions, error: permissionsError }: SupabaseResponse<RawRolePermission[]> = await supabase
                    .from('role_permissions')
                    .select(`
                        role_id,
                        permission_id,
                        permissions (
                            id,
                            code,
                            name,
                            module
                        )
                    `)
                    .eq('role_id', profile.role_id);

                if (permissionsError) throw permissionsError;

                if (!rawPermissions) {
                    setUserPermissions([]);
                    setLoading(false);
                    return;
                }

                // Type guard para validar a estrutura dos dados
                const isValidPermission = (rp: any): rp is RawRolePermission => {
                    return (
                        rp !== null &&
                        typeof rp === 'object' &&
                        'permissions' in rp &&
                        rp.permissions !== null &&
                        typeof rp.permissions === 'object' &&
                        'id' in rp.permissions &&
                        'code' in rp.permissions &&
                        'name' in rp.permissions &&
                        'module' in rp.permissions
                    );
                };

                // Transforma os dados brutos em RolePermission[]
                const permissions = rawPermissions
                    .filter(isValidPermission)
                    .map(rp => ({
                        role_id: rp.role_id,
                        permission_id: rp.permission_id,
                        permissions: rp.permissions
                    }));

                setUserPermissions(permissions);
            } catch (error) {
                console.error('Error loading user permissions:', error);
                setUserPermissions([]);
            } finally {
                setLoading(false);
            }
        };

        loadUserPermissions();
    }, [user]);

    const checkPermission = async (permissionCode: string): Promise<boolean> => {
        if (!user || !userRole?.role_id) return false;

        // Super Admin tem todas as permissões
        if (userRole?.roles?.name === 'Super Admin') return true;

        return userPermissions.some(rp => rp.permissions?.code === permissionCode);
    };

    const PermissionGuard: React.FC<{
        permissionCode: string;
        children: React.ReactNode;
        fallback?: React.ReactNode;
    }> = ({ permissionCode, children, fallback = null }) => {
        const [hasPermission, setHasPermission] = useState(false);

        useEffect(() => {
            const checkAccess = async () => {
                const access = await checkPermission(permissionCode);
                setHasPermission(access);
            };
            checkAccess();
        }, [permissionCode, userPermissions]);

        if (!hasPermission) {
            return fallback;
        }

        return children;
    };

    return {
        checkPermission,
        PermissionGuard,
        hasPermission: (code: string) => userPermissions.some(rp => rp.permissions?.code === code),
        loading,
        userRole: userRole?.roles?.name
    };
};
