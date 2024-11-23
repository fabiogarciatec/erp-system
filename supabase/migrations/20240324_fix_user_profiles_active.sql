-- Primeiro, vamos dropar todas as políticas e triggers existentes
DO $$ 
BEGIN
    -- Drop policies
    DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
    DROP POLICY IF EXISTS "Users can update profiles" ON user_profiles;
    
    -- Drop trigger
    DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
    
    -- Drop function
    DROP FUNCTION IF EXISTS update_updated_at_column();
END $$;

-- Recriar a tabela do zero
DROP TABLE IF EXISTS user_profiles;
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    company_id UUID REFERENCES companies(id),
    role TEXT NOT NULL DEFAULT 'user',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT role_check CHECK (role IN ('master', 'admin', 'manager', 'user'))
);

-- Criar função para atualizar o updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Criar trigger para atualizar o updated_at
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Criar políticas de RLS
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

CREATE POLICY "Users can insert their own profile"
    ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = id
    );

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

-- Garantir que existe pelo menos uma empresa
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM companies LIMIT 1) THEN
        INSERT INTO companies (name) VALUES ('Empresa Padrão');
    END IF;
END
$$;
