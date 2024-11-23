-- Primeiro, remover todas as dependências e a tabela antiga
DROP POLICY IF EXISTS "Users can view their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON user_profiles;
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
DROP TABLE IF EXISTS user_profiles;

-- Recriar a tabela do zero
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    full_name TEXT NOT NULL,
    company_id UUID REFERENCES companies(id),
    role TEXT NOT NULL DEFAULT 'user',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT role_check CHECK (role IN ('master', 'admin', 'manager', 'user'))
);

-- Criar o trigger de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Política para SELECT
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
CREATE POLICY "Users can insert their own profile"
    ON user_profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (
        auth.uid() = id
    );

-- Política para UPDATE
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
