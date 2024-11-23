-- Primeiro, vamos verificar se precisamos adicionar a coluna
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 
                  FROM information_schema.columns 
                  WHERE table_name = 'user_profiles' 
                  AND column_name = 'active') THEN
        ALTER TABLE user_profiles ADD COLUMN active BOOLEAN NOT NULL DEFAULT true;
    END IF;
END $$;

-- Recriar a tabela se não existir
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    company_id UUID REFERENCES companies(id),
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('master', 'admin', 'manager', 'user')),
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Garantir que o trigger de updated_at existe
CREATE OR REPLACE FUNCTION update_updated_at_column()
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
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política para SELECT
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
CREATE POLICY "Users can view their own profile"
    ON user_profiles
    FOR SELECT
    TO authenticated
    USING (
        auth.uid() = id 
        OR EXISTS (
            SELECT 1 
            FROM user_profiles up 
            WHERE up.id = auth.uid() 
            AND (
                up.role = 'master' 
                OR (up.role IN ('admin', 'manager') AND up.company_id = user_profiles.company_id)
            )
        )
    );

-- Política para INSERT
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
CREATE POLICY "Users can insert their own profile"
    ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = id
    );

-- Política para UPDATE
DROP POLICY IF EXISTS "Users can update profiles" ON user_profiles;
CREATE POLICY "Users can update profiles"
    ON user_profiles
    FOR UPDATE
    TO authenticated
    USING (
        auth.uid() = id 
        OR EXISTS (
            SELECT 1 
            FROM user_profiles up 
            WHERE up.id = auth.uid() 
            AND (
                up.role = 'master' 
                OR (up.role = 'admin' AND up.company_id = user_profiles.company_id)
            )
        )
    )
    WITH CHECK (
        auth.uid() = id 
        OR EXISTS (
            SELECT 1 
            FROM user_profiles up 
            WHERE up.id = auth.uid() 
            AND (
                up.role = 'master' 
                OR (up.role = 'admin' AND up.company_id = user_profiles.company_id)
            )
        )
    );

-- Garantir que a tabela companies existe
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Trigger para companies
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS para companies
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Política para visualização de companies
DROP POLICY IF EXISTS "Users can view companies" ON companies;
CREATE POLICY "Users can view companies"
    ON companies
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM user_profiles up 
            WHERE up.id = auth.uid() 
            AND (
                up.role = 'master' 
                OR up.company_id = companies.id
            )
        )
    );

-- Política para atualização de companies
DROP POLICY IF EXISTS "Admins can update companies" ON companies;
CREATE POLICY "Admins can update companies"
    ON companies
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 
            FROM user_profiles up 
            WHERE up.id = auth.uid() 
            AND (
                up.role = 'master' 
                OR (up.role = 'admin' AND up.company_id = companies.id)
            )
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 
            FROM user_profiles up 
            WHERE up.id = auth.uid() 
            AND (
                up.role = 'master' 
                OR (up.role = 'admin' AND up.company_id = companies.id)
            )
        )
    );
