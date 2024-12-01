import supabase from '@/lib/supabase';

export interface UserPermission {
  id: number
  name: string
  description: string
}

export interface UserRole {
  id: number
  name: string
  description: string
  permissions: UserPermission[]
}

export interface Company {
  id: string
  name: string
  document: string
  email: string
  phone: string
  avatar_url?: string | null
}

export interface User {
  id: string
  email: string
  roles: UserRole[]
  permissions: UserPermission[]
  companies: Company[]
  currentCompany?: Company
  empresa_id?: string
  auth_id?: string
}

export interface RegisterData {
  email: string
  password: string
  companyName: string
  companyDocument: string
  companyEmail?: string
  companyPhone?: string
}

// Raw Supabase data types
interface RawSupabasePermission {
  id: number;
  name: string;
  description: string;
}

interface RawSupabaseRolePermission {
  permission: RawSupabasePermission;
}

interface RawSupabaseRole {
  id: number;
  name: string;
  description: string;
  permissions: RawSupabaseRolePermission[];
}

interface RawSupabaseRoleWrapper {
  role: {
    id: number;
    name: string;
    description: string;
    permissions: {
      permission: RawSupabasePermission;
    }[];
  };
}

interface RawSupabaseCompanyWrapper {
  company: {
    id: string;
    name: string;
    document: string;
    email: string;
    phone: string;
    avatar_url?: string | null;
  };
}

// Funções de transformação segura
function transformRoleData(rawData: any): UserRole {
  if (!rawData?.role) {
    throw new Error('Invalid role data structure');
  }

  const { role } = rawData;
  
  return {
    id: role.id,
    name: role.name,
    description: role.description,
    permissions: (role.permissions || []).map((p: any) => ({
      id: p.permission.id,
      name: p.permission.name,
      description: p.permission.description
    }))
  };
}

function transformCompanyData(rawData: any): Company {
  if (!rawData?.company) {
    throw new Error('Invalid company data structure');
  }

  const { company } = rawData;
  
  return {
    id: company.id,
    name: company.name,
    document: company.document,
    email: company.email,
    phone: company.phone,
    avatar_url: company.avatar_url
  };
}

export const authService = {
  async register({ email, password, companyName, companyDocument, companyEmail, companyPhone }: RegisterData) {
    try {
      // Step 1: Create the user
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        console.error('Signup error:', signUpError)
        throw signUpError
      }

      if (!authData.user) {
        throw new Error('No user data returned')
      }

      // Step 2: Create the company
      const { data: company, error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            name: companyName,
            document: companyDocument,
            email: companyEmail || null,
            phone: companyPhone || null,
          },
        ])
        .select()
        .single()

      if (companyError) {
        console.error('Company creation error:', companyError)
        throw companyError
      }

      // Step 3: Create user-company relationship
      const { error: userCompanyError } = await supabase
        .from('user_companies')
        .insert([
          {
            user_id: authData.user.id,
            company_id: company.id,
            is_owner: true,
          },
        ])

      if (userCompanyError) {
        console.error('User-company relationship error:', userCompanyError)
        throw userCompanyError
      }

      // Step 4: Assign default role
      const { data: defaultRole, error: roleError } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'user')
        .single()

      if (roleError) {
        console.error('Role fetch error:', roleError)
        throw roleError
      }

      const { error: userRoleError } = await supabase
        .from('user_roles')
        .insert([
          {
            user_id: authData.user.id,
            role_id: defaultRole.id,
          },
        ])

      if (userRoleError) {
        console.error('User role assignment error:', userRoleError)
        throw userRoleError
      }

      return authData
    } catch (error) {
      console.error('Registration error:', error)
      throw error
    }
  },

  async login(email: string, password: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Buscar empresas do usuário
      const { data: companies, error: companiesError } = await supabase
        .from('user_companies')
        .select('company:companies(*)')
        .eq('user_id', authData.user.id)

      if (companiesError) throw companiesError

      if (!companies.length) {
        throw new Error('Usuário não está associado a nenhuma empresa')
      }

      // Buscar roles e permissões
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select(`
          role:roles (
            id,
            name,
            description,
            permissions:role_permissions (
              permission:permissions (
                id,
                name,
                description
              )
            )
          )
        `)
        .eq('user_id', authData.user.id)

      if (rolesError) throw rolesError

      // Transform roles data safely
      const userRoles: UserRole[] = roles
        .map(data => {
          try {
            return transformRoleData(data);
          } catch (error) {
            console.error('Error transforming role:', error);
            return null;
          }
        })
        .filter((role): role is UserRole => role !== null);

      // Combine all permissions
      const userPermissions: UserPermission[] = userRoles.reduce((acc, role) => {
        role.permissions.forEach((permission) => {
          if (!acc.find(p => p.id === permission.id)) {
            acc.push(permission);
          }
        });
        return acc;
      }, [] as UserPermission[]);

      // Transform companies data safely
      const userCompanies: Company[] = companies
        .map(data => {
          try {
            return transformCompanyData(data);
          } catch (error) {
            console.error('Error transforming company:', error);
            return null;
          }
        })
        .filter((company): company is Company => company !== null);

      return {
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          roles: userRoles,
          permissions: userPermissions,
          companies: userCompanies,
          currentCompany: userCompanies[0] // Por padrão, usa a primeira empresa
        },
        session: authData.session
      }
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser(): Promise<User | null> {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) return null

    // Buscar empresas do usuário
    const { data: companies, error: companiesError } = await supabase
      .from('user_companies')
      .select('company:companies(*)')
      .eq('user_id', user.id)

    if (companiesError) throw companiesError

    // Buscar roles e permissões
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select(`
        role:roles (
          id,
          name,
          description,
          permissions:role_permissions (
            permission:permissions (
              id,
              name,
              description
            )
          )
        )
      `)
      .eq('user_id', user.id)

    if (rolesError) throw rolesError

    // Transform roles data safely
    const userRoles: UserRole[] = roles
      .map(data => {
        try {
          return transformRoleData(data);
        } catch (error) {
          console.error('Error transforming role:', error);
          return null;
        }
      })
      .filter((role): role is UserRole => role !== null);

    // Combine all permissions
    const userPermissions: UserPermission[] = userRoles.reduce((acc, role) => {
      role.permissions.forEach((permission) => {
        if (!acc.find(p => p.id === permission.id)) {
          acc.push(permission);
        }
      });
      return acc;
    }, [] as UserPermission[]);

    // Transform companies data safely
    const userCompanies: Company[] = companies
      .map(data => {
        try {
          return transformCompanyData(data);
        } catch (error) {
          console.error('Error transforming company:', error);
          return null;
        }
      })
      .filter((company): company is Company => company !== null);

    return {
      id: user.id,
      email: user.email!,
      roles: userRoles,
      permissions: userPermissions,
      companies: userCompanies,
      currentCompany: userCompanies[0] // Por padrão, usa a primeira empresa
    }
  },

  hasPermission(user: User | null, permission: string): boolean {
    if (!user) return false
    return user.permissions.some(p => p.name === permission)
  },

  hasRole(user: User | null, role: string): boolean {
    if (!user) return false
    return user.roles.some(r => r.name === role)
  }
}
