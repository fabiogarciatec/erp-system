import { createClient } from '@supabase/supabase-js'

// Get environment variables from command line arguments
const supabaseUrl = process.argv[2]
const supabaseKey = process.argv[3]

if (!supabaseUrl || !supabaseKey) {
  console.error('Please provide Supabase URL and key as command line arguments')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false
  }
})

// Função para criar a estrutura inicial do banco de dados
const initializeDatabase = async () => {
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
        CREATE TABLE IF NOT EXISTS profiles (
          id UUID REFERENCES auth.users(id) PRIMARY KEY,
          company_id UUID REFERENCES companies(id),
          full_name TEXT NOT NULL,
          email TEXT NOT NULL UNIQUE,
          phone TEXT,
          role_id UUID REFERENCES roles(id),
          status TEXT NOT NULL DEFAULT 'active',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          CONSTRAINT valid_status CHECK (status IN ('active', 'inactive', 'suspended', 'blocked'))
        );

        -- Trigger para atualizar updated_at
        CREATE OR REPLACE FUNCTION update_profiles_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
        CREATE TRIGGER update_profiles_updated_at
          BEFORE UPDATE ON profiles
          FOR EACH ROW
          EXECUTE FUNCTION update_profiles_updated_at();
      `
    });

    if (profileError) {
      throw profileError;
    }

    // Criar a tabela de roles se não existir
    const { error: rolesError } = await supabase.rpc('create_roles_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS roles (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          description TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
        );

        -- Trigger para atualizar updated_at
        CREATE OR REPLACE FUNCTION update_roles_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_roles_updated_at ON roles;
        CREATE TRIGGER update_roles_updated_at
          BEFORE UPDATE ON roles
          FOR EACH ROW
          EXECUTE FUNCTION update_roles_updated_at();

        -- Inserir roles padrão se não existirem
        INSERT INTO roles (name, description)
        VALUES 
          ('admin', 'Administrador do sistema'),
          ('manager', 'Gerente'),
          ('user', 'Usuário padrão')
        ON CONFLICT (name) DO NOTHING;
      `
    });

    if (rolesError) {
      throw rolesError;
    }

    // Criar a tabela de role_permissions se não existir
    const { error: permissionsError } = await supabase.rpc('create_role_permissions_if_not_exists', {
      sql: `
        CREATE TABLE IF NOT EXISTS role_permissions (
          id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
          role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
          permission_key TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
          UNIQUE(role_id, permission_key)
        );

        -- Trigger para atualizar updated_at
        CREATE OR REPLACE FUNCTION update_role_permissions_updated_at()
        RETURNS TRIGGER AS $$
        BEGIN
          NEW.updated_at = timezone('utc'::text, now());
          RETURN NEW;
        END;
        $$ language 'plpgsql';

        DROP TRIGGER IF EXISTS update_role_permissions_updated_at ON role_permissions;
        CREATE TRIGGER update_role_permissions_updated_at
          BEFORE UPDATE ON role_permissions
          FOR EACH ROW
          EXECUTE FUNCTION update_role_permissions_updated_at();

        -- Inserir permissões padrão para o admin
        WITH admin_role AS (
          SELECT id FROM roles WHERE name = 'admin'
        )
        INSERT INTO role_permissions (role_id, permission_key)
        SELECT 
          admin_role.id,
          permission_key
        FROM 
          admin_role,
          (VALUES 
            ('users.view'),
            ('users.create'),
            ('users.edit'),
            ('users.delete'),
            ('companies.view'),
            ('companies.create'),
            ('companies.edit'),
            ('companies.delete'),
            ('products.view'),
            ('products.create'),
            ('products.edit'),
            ('products.delete'),
            ('sales.view'),
            ('sales.create'),
            ('sales.edit'),
            ('sales.delete'),
            ('reports.view'),
            ('reports.create'),
            ('reports.export')
          ) AS p(permission_key)
        ON CONFLICT (role_id, permission_key) DO NOTHING;
      `
    });

    if (permissionsError) {
      throw permissionsError;
    }

    console.log('Database structure initialized successfully');
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

console.log('Initializing database...')
initializeDatabase()
  .then(() => {
    console.log('Database initialized successfully')
    process.exit(0)
  })
  .catch(error => {
    console.error('Error initializing database:', error)
    process.exit(1)
  })
