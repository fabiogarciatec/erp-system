import supabase from '@/lib/supabase';

// Funções de transformação segura
function transformRoleData(rawData) {
    if (!rawData?.roles) {
        throw new Error('Invalid role data structure');
    }
    const role = rawData.roles;
    return {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: []  // As permissões serão carregadas em uma consulta separada
    };
}

function transformCompanyData(rawData) {
    if (!rawData) {
        throw new Error('Invalid company data structure');
    }
    return {
        id: rawData.id,
        name: rawData.name,
        document: rawData.document,
        email: rawData.email,
        phone: rawData.phone,
        address: rawData.address,
        address_number: rawData.address_number,
        address_complement: rawData.address_complement,
        neighborhood: rawData.neighborhood,
        city: rawData.city,
        state_id: rawData.state_id,
        postal_code: rawData.postal_code,
        latitude: rawData.latitude,
        longitude: rawData.longitude,
        created_at: rawData.created_at,
        updated_at: rawData.updated_at
    };
}

export const authService = {
    async register({ email, password, companyName, companyDocument, companyEmail, companyPhone }) {
        try {
            // Step 1: Create the user in Auth
            const { data: authData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
            });

            if (signUpError) throw signUpError;

            const userId = authData.user.id;

            // Step 2: Create the company
            const { data: companyData, error: companyError } = await supabase
                .from('companies')
                .insert([
                    {
                        name: companyName,
                        document: companyDocument,
                        email: companyEmail,
                        phone: companyPhone
                    }
                ])
                .select()
                .single();

            if (companyError) throw companyError;

            // Step 3: Create user profile
            const { error: profileError } = await supabase
                .from('profiles')
                .insert([
                    {
                        id: userId,
                        user_id: userId,
                        is_active: true
                    }
                ]);

            if (profileError) throw profileError;

            // Step 4: Associate user with company
            const { error: userCompanyError } = await supabase
                .from('user_companies')
                .insert([
                    {
                        user_id: userId,
                        company_id: companyData.id
                    }
                ]);

            if (userCompanyError) throw userCompanyError;

            // Step 5: Get default role (User)
            const { data: defaultRole, error: roleError } = await supabase
                .from('roles')
                .select('id')
                .eq('name', 'User')
                .single();

            if (roleError) throw roleError;

            // Step 6: Associate user with default role
            const { error: userRoleError } = await supabase
                .from('user_roles')
                .insert([
                    {
                        user_id: userId,
                        role_id: defaultRole.id
                    }
                ]);

            if (userRoleError) throw userRoleError;

            return authData;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async login(email, password) {
        try {
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (authError)
                throw authError;

            // Verificar se o usuário tem um perfil
            let { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('is_active')
                .eq('user_id', authData.user.id)
                .single();

            // Se não existir perfil, criar um
            if (profileError && profileError.code === 'PGRST116') {
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            user_id: authData.user.id,
                            email: authData.user.email,
                            is_active: true
                        }
                    ])
                    .select()
                    .single();

                if (createError) throw createError;
                profileData = newProfile;
            } else if (profileError) {
                throw profileError;
            }

            if (!profileData?.is_active) {
                throw new Error('Usuário inativo. Entre em contato com o administrador.');
            }

            // Buscar empresas do usuário
            const { data: userCompanies, error: companiesError } = await supabase
                .from('user_companies')
                .select(`
                    company_id,
                    companies (
                        id,
                        name,
                        document,
                        email,
                        phone,
                        address,
                        address_number,
                        address_complement,
                        neighborhood,
                        city,
                        state_id,
                        postal_code,
                        created_at,
                        updated_at,
                        latitude,
                        longitude
                    )
                `)
                .eq('user_id', authData.user.id);

            if (companiesError)
                throw companiesError;

            if (!userCompanies.length) {
                throw new Error('Usuário não está associado a nenhuma empresa');
            }

            // Buscar roles
            const { data: userRolesData, error: rolesError } = await supabase
                .from('user_roles')
                .select(`
                    role_id,
                    roles (
                        id,
                        name,
                        description
                    )
                `)
                .eq('user_id', authData.user.id);

            if (rolesError)
                throw rolesError;

            // Transform roles data safely
            const userRoles = userRolesData
                .map(data => {
                    try {
                        return transformRoleData(data);
                    } catch (error) {
                        console.error('Error transforming role:', error);
                        return null;
                    }
                })
                .filter((role) => role !== null);

            // Buscar permissões para cada role
            const permissions = [];
            for (const role of userRoles) {
                const { data: rolePermissions, error: permissionsError } = await supabase
                    .from('role_permissions')
                    .select(`
                        permissions (
                            id,
                            name,
                            description,
                            code
                        )
                    `)
                    .eq('role_id', role.id);

                if (permissionsError) throw permissionsError;

                role.permissions = rolePermissions
                    .map(rp => rp.permissions)
                    .filter(p => p !== null);

                permissions.push(...role.permissions);
            }

            // Transform companies data safely
            const userCompaniesTransformed = userCompanies
                .map(data => {
                    try {
                        return transformCompanyData(data.companies);
                    } catch (error) {
                        console.error('Error transforming company:', error);
                        return null;
                    }
                })
                .filter((company) => company !== null);

            return {
                user: {
                    id: authData.user.id,
                    email: authData.user.email,
                    roles: userRoles,
                    permissions: permissions,
                    companies: userCompaniesTransformed,
                    currentCompany: userCompaniesTransformed[0] // Por padrão, usa a primeira empresa
                },
                session: authData.session
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async logout() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getCurrentUser() {
        try {
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) throw sessionError;
            if (!session) return null;

            const { user: authUser } = session;
            if (!authUser) return null;

            // Verificar se o usuário tem um perfil
            let { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('is_active')
                .eq('user_id', authUser.id)
                .single();

            // Se não existir perfil, criar um
            if (profileError && profileError.code === 'PGRST116') {
                const { data: newProfile, error: createError } = await supabase
                    .from('profiles')
                    .insert([
                        {
                            user_id: authUser.id,
                            email: authUser.email,
                            is_active: true
                        }
                    ])
                    .select()
                    .single();

                if (createError) throw createError;
                profileData = newProfile;
            } else if (profileError) {
                throw profileError;
            }

            if (!profileData?.is_active) {
                throw new Error('Usuário inativo');
            }

            // Buscar empresas do usuário
            const { data: userCompanies, error: companiesError } = await supabase
                .from('user_companies')
                .select(`
                    company_id,
                    companies (
                        id,
                        name,
                        document,
                        email,
                        phone,
                        address,
                        address_number,
                        address_complement,
                        neighborhood,
                        city,
                        state_id,
                        postal_code,
                        created_at,
                        updated_at,
                        latitude,
                        longitude
                    )
                `)
                .eq('user_id', authUser.id);

            if (companiesError) throw companiesError;

            // Buscar roles
            const { data: userRolesData, error: rolesError } = await supabase
                .from('user_roles')
                .select(`
                    role_id,
                    roles (
                        id,
                        name,
                        description
                    )
                `)
                .eq('user_id', authUser.id);

            if (rolesError)
                throw rolesError;

            // Transform roles data safely
            const userRoles = userRolesData
                .map(data => {
                    try {
                        return transformRoleData(data);
                    } catch (error) {
                        console.error('Error transforming role:', error);
                        return null;
                    }
                })
                .filter((role) => role !== null);

            // Buscar permissões para cada role
            const permissions = [];
            for (const role of userRoles) {
                const { data: rolePermissions, error: permissionsError } = await supabase
                    .from('role_permissions')
                    .select(`
                        permissions (
                            id,
                            name,
                            description,
                            code
                        )
                    `)
                    .eq('role_id', role.id);

                if (permissionsError) throw permissionsError;

                role.permissions = rolePermissions
                    .map(rp => rp.permissions)
                    .filter(p => p !== null);

                permissions.push(...role.permissions);
            }

            // Transform companies data safely
            const userCompaniesTransformed = userCompanies
                .map(data => {
                    try {
                        return transformCompanyData(data.companies);
                    } catch (error) {
                        console.error('Error transforming company:', error);
                        return null;
                    }
                })
                .filter((company) => company !== null);

            return {
                id: authUser.id,
                email: authUser.email,
                roles: userRoles,
                permissions: permissions,
                companies: userCompaniesTransformed,
                currentCompany: userCompaniesTransformed[0] // Por padrão, usa a primeira empresa
            };
        } catch (error) {
            console.error('Error getting current user:', error);
            throw error;
        }
    },

    async updateUserRole(targetUserId, newRoleId) {
        try {
            // Primeiro, remove todos os papéis existentes do usuário
            const { error: deleteError } = await supabase
                .from('user_roles')
                .delete()
                .eq('user_id', targetUserId);

            if (deleteError) throw deleteError;

            // Depois, insere o novo papel
            const { error: insertError } = await supabase
                .from('user_roles')
                .insert([
                    {
                        user_id: targetUserId,
                        role_id: newRoleId
                    }
                ]);

            if (insertError) throw insertError;

            return true;
        } catch (error) {
            console.error('Error updating user role:', error);
            throw error;
        }
    },

    async isSuperAdmin() {
        try {
            const currentUser = await this.getCurrentUser();
            if (!currentUser) return false;

            const isSuperAdmin = currentUser.roles.some(role => role.name === 'Super Admin');
            return isSuperAdmin;
        } catch (error) {
            console.error('Error checking if user is super admin:', error);
            return false;
        }
    },

    hasPermission(user, permission) {
        return user?.permissions?.some(p => p.code === permission) || false;
    },

    hasRole(user, role) {
        return user?.roles?.some(r => r.name === role) || false;
    }
};
