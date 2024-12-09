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
  company_id?: string
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
      // Step 1: Create the user in Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (signUpError) {
        console.error('Signup error:', signUpError)
        if (signUpError.message.includes('User already registered')) {
          throw new Error('Este e-mail já está registrado. Por favor, faça login.')
        }
        throw signUpError
      }

      if (!authData.user) {
        throw new Error('Erro ao criar usuário. Por favor, tente novamente.')
      }

      // Step 2: Tentar limpar dados existentes
      try {
        const { error: cleanError } = await supabase.rpc('clean_user_data', {
          p_user_id: authData.user.id
        })
        
        if (cleanError) {
          console.warn('Error cleaning user data:', cleanError)
          // Continuar mesmo se falhar a limpeza
        }
      } catch (cleanError) {
        console.warn('Error cleaning user data:', cleanError)
        // Continuar mesmo se falhar a limpeza
      }

      // Step 3: Create user profile and related records
      const { data: result, error: transactionError } = await supabase.rpc('create_user_complete', {
        p_user_id: authData.user.id,
        p_email: email,
        p_company_name: companyName,
        p_company_document: companyDocument,
        p_company_email: companyEmail || null,
        p_company_phone: companyPhone || null
      })

      if (transactionError) {
        console.error('Transaction error:', transactionError)
        // Tentar remover o usuário do auth se falhar a criação do perfil
        await supabase.auth.signOut()
        throw new Error('Erro ao criar perfil de usuário. Por favor, tente novamente.')
      }

      if (!result?.success) {
        console.error('Database operation failed:', result)
        if (result?.debug_info) {
          console.log('Debug info:', result.debug_info)
        }
        
        // Tentar remover o usuário do auth se falhar a criação do perfil
        await supabase.auth.signOut()
        
        if (result?.error_detail === 'PROFILE_EXISTS') {
          throw new Error('Este usuário já está registrado. Por favor, faça login.')
        } else if (result?.error_detail === 'ROLE_NOT_FOUND') {
          throw new Error('Erro de configuração: Papel de usuário não encontrado. Entre em contato com o suporte.')
        }
        
        throw new Error(result?.error || 'Erro ao criar perfil de usuário. Por favor, tente novamente.')
      }

      return { user: authData.user }
    } catch (error: any) {
      console.error('Registration error:', error)
      
      // Se o erro já tiver uma mensagem formatada, repassar
      if (error.message.includes('já está registrado') || 
          error.message.includes('Erro ao criar') ||
          error.message.includes('Erro de configuração')) {
        throw error
      }
      
      // Erro genérico
      throw new Error('Ocorreu um erro durante o registro. Por favor, tente novamente.')
    }
  },

  async login(email: string, password: string) {
    try {
      const { data: { user, session }, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      if (!user || !session) throw new Error('No user or session returned from login');

      const userData = await this.getCurrentUser();
      return { user: userData, session };
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    }
  },

  async logout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      console.log('Getting current user from Supabase...');
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        console.log('No authenticated user found');
        throw new Error('No authenticated user');
      }

      console.log('Found authenticated user:', authUser);

      // Buscar dados do usuário na tabela de usuários
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select(`
          *,
          user_roles!inner (
            role: roles!inner (
              id,
              name,
              description,
              role_permissions!inner (
                permission: permissions!inner (
                  id,
                  name,
                  description
                )
              )
            )
          ),
          user_companies!inner (
            company: companies!inner (
              id,
              name,
              document,
              email,
              phone,
              avatar_url
            )
          )
        `)
        .eq('auth_id', authUser.id)
        .single();

      if (userError) {
        console.error('Error fetching user data:', userError);
        throw userError;
      }

      if (!userData) {
        console.error('No user data found for auth_id:', authUser.id);
        throw new Error('User data not found');
      }

      console.log('Raw user data:', userData);

      // Transform roles data
      const roles = userData.user_roles.map((roleWrapper: RawSupabaseRoleWrapper) => 
        transformRoleData(roleWrapper.role)
      );

      // Transform companies data
      const companies = userData.user_companies.map((companyWrapper: RawSupabaseCompanyWrapper) => 
        transformCompanyData(companyWrapper.company)
      );

      // Get all unique permissions from roles
      const permissions = roles.reduce((acc: UserPermission[], role: UserRole) => {
        role.permissions.forEach(permission => {
          if (!acc.find(p => p.id === permission.id)) {
            acc.push(permission);
          }
        });
        return acc;
      }, []);

      const user: User = {
        id: userData.id,
        email: userData.email,
        roles,
        permissions,
        companies,
        currentCompany: companies[0], // Default to first company
        company_id: companies[0]?.id,
        empresa_id: companies[0]?.id,
        auth_id: authUser.id
      };

      console.log('Transformed user data:', user);
      return user;
    } catch (error) {
      console.error('Error in getCurrentUser:', error);
      throw error;
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
