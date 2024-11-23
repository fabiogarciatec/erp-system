-- Adicionar coluna document à tabela companies
ALTER TABLE companies ADD COLUMN IF NOT EXISTS document TEXT;

-- Recriar a tabela companies se não existir
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    document TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Habilitar RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes para evitar conflitos
DROP POLICY IF EXISTS "Companies are viewable by their users" ON companies;
DROP POLICY IF EXISTS "Companies are insertable by system" ON companies;
DROP POLICY IF EXISTS "Companies are updatable by admins" ON companies;
DROP POLICY IF EXISTS "Enable read access for users" ON companies;
DROP POLICY IF EXISTS "Enable insert access for all users" ON companies;
DROP POLICY IF EXISTS "Enable update for company admins" ON companies;

-- Criar novas políticas
CREATE POLICY "Enable read access for users" ON companies
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE company_id = companies.id
        ) OR
        NOT EXISTS (SELECT 1 FROM user_profiles) -- Permite leitura se não houver usuários (primeiro acesso)
    );

CREATE POLICY "Enable insert access for all users" ON companies
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for company admins" ON companies
    FOR UPDATE USING (
        auth.uid() IN (
            SELECT id FROM user_profiles 
            WHERE company_id = companies.id 
            AND role IN ('admin', 'master')
        )
    );
