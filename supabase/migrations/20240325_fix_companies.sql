-- Verificar e criar a tabela companies se não existir
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

-- Criar novas políticas mais permissivas para registro
CREATE POLICY "Enable read access for users" ON companies
    FOR SELECT USING (
        auth.uid() IN (
            SELECT id FROM user_profiles WHERE company_id = companies.id
        )
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

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
CREATE TRIGGER update_companies_updated_at
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
