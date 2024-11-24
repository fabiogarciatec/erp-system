import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('Environment Check:', {
  mode: import.meta.env.MODE,
  supabaseUrl: supabaseUrl ? 'Defined' : 'Undefined',
  supabaseKey: supabaseAnonKey ? 'Defined' : 'Undefined'
})

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Erro: Variáveis de ambiente do Supabase não configuradas:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder-url.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false
    }
  }
)

export const signIn = async (email, password) => {
  console.log('Tentando fazer login com email:', email)
  
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error('Erro no signIn:', error)
      throw error
    }

    console.log('Login bem sucedido:', data)
    return { data, error: null }
  } catch (error) {
    console.error('Erro ao fazer login:', error)
    return { data: null, error }
  }
}

export const signOut = async () => {
  console.log('Tentando fazer logout')
  
  try {
    // Tenta fazer o logout
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Erro no signOut:', error)
      throw error
    }

    // Limpa dados locais
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key)
        }
      })
    }

    console.log('Logout realizado com sucesso')
    return { error: null }
  } catch (error) {
    console.error('Erro ao fazer logout:', error)
    // Mesmo com erro, tenta limpar o localStorage
    if (typeof window !== 'undefined') {
      const keys = Object.keys(localStorage)
      keys.forEach(key => {
        if (key.includes('supabase') || key.includes('auth')) {
          localStorage.removeItem(key)
        }
      })
    }
    throw error
  }
}

export const getCurrentUser = async () => {
  console.log('Obtendo usuário atual')
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Erro ao obter sessão:', error)
      throw error
    }

    if (!session) {
      console.log('Nenhuma sessão encontrada')
      return null
    }

    console.log('Sessão encontrada:', session)
    return session.user
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error)
    throw error
  }
}

export const onAuthStateChange = (callback) => {
  console.log('Configurando listener de mudança de autenticação')
  
  try {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Mudança de estado de autenticação:', { event, session })
      callback(event, session)
    })

    return { data, error: null }
  } catch (error) {
    console.error('Erro ao configurar listener de autenticação:', error)
    return { data: null, error }
  }
}

// Função para criar a estrutura inicial do banco de dados
export const initializeDatabase = async () => {
  try {
    // Criar a tabela de empresas se não existir
    const { error: companyError } = await supabase.rpc('create_companies_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS companies (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL,
          document TEXT UNIQUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Trigger para atualizar updated_at
        CREATE OR REPLACE FUNCTION update_companies_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
        CREATE TRIGGER update_companies_updated_at
          BEFORE UPDATE ON companies
          FOR EACH ROW
          EXECUTE FUNCTION update_companies_updated_at();
      `
    });

    if (companyError) {
      throw companyError;
    }

    // Criar a tabela de perfis de usuário se não existir
    const { error: profileError } = await supabase.rpc('create_user_profiles_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS user_profiles (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          company_id UUID REFERENCES companies(id),
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT,
          role TEXT NOT NULL DEFAULT 'user',
          status TEXT NOT NULL DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'suspended', 'blocked')),
          CONSTRAINT valid_role CHECK (role IN ('admin', 'manager', 'sales', 'support', 'user'))
        );

        -- Trigger para atualizar updated_at
        CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
        CREATE TRIGGER update_user_profiles_updated_at
          BEFORE UPDATE ON user_profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_user_profiles_updated_at();
      `
    });

    if (profileError) {
      throw profileError;
    }

    console.log('Database structure initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

// Função para obter o perfil do usuário com dados da empresa
export const getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select(`
        *,
        companies:company_id (
          id,
          name,
          document
        )
      `)
      .eq('id', userId)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Função para atualizar o status de uma empresa
export const updateCompanyStatus = async (companyId, status) => {
  try {
    const { error } = await supabase
      .from('companies')
      .update({ status })
      .eq('id', companyId);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating company status:', error);
    throw error;
  }
};
