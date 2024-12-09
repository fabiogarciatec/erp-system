-- Verificar se existe o usuário na tabela auth.users
SELECT id, email, role
FROM auth.users
WHERE id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Verificar se existe o perfil do usuário
SELECT p.*, r.name as role_name, c.name as company_name
FROM profiles p
LEFT JOIN roles r ON r.id = p.role_id
LEFT JOIN companies c ON c.id = p.company_id
WHERE p.user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Verificar roles disponíveis
SELECT * FROM roles;

-- Verificar companies disponíveis
SELECT * FROM companies;

-- Se necessário, inserir um perfil novo
INSERT INTO profiles (user_id, email, is_active)
SELECT 
    'd71e3d86-b97e-4062-8106-9b87f761a730',
    (SELECT email FROM auth.users WHERE id = 'd71e3d86-b97e-4062-8106-9b87f761a730'),
    true
WHERE NOT EXISTS (
    SELECT 1 
    FROM profiles 
    WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730'
);

-- Garantir que o usuário está ativo
UPDATE profiles 
SET is_active = true
WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Verificar se o usuário tem role
SELECT 
    p.id as profile_id,
    p.user_id,
    p.email,
    p.is_active,
    r.id as role_id,
    r.name as role_name
FROM profiles p
LEFT JOIN roles r ON r.id = p.role_id
WHERE p.user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Se não tiver role, vamos inserir como Super Admin
WITH super_admin_role AS (
    SELECT id FROM roles WHERE name = 'Super Admin'
    LIMIT 1
)
UPDATE profiles
SET role_id = (SELECT id FROM super_admin_role)
WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730'
AND role_id IS NULL
AND EXISTS (SELECT 1 FROM super_admin_role);

-- Criar ou atualizar a tabela profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT,
    document TEXT,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id)
);

-- Adicionar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at_trigger ON profiles;
CREATE TRIGGER update_profiles_updated_at_trigger
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- Criar política RLS para profiles
DROP POLICY IF EXISTS "Profiles are viewable by users who created them." ON profiles;
CREATE POLICY "Profiles are viewable by users who created them."
ON public.profiles FOR SELECT
TO authenticated
USING (
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can insert their own profile." ON profiles;
CREATE POLICY "Users can insert their own profile."
ON public.profiles FOR INSERT
TO authenticated
WITH CHECK (
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can update own profile." ON profiles;
CREATE POLICY "Users can update own profile."
ON public.profiles FOR UPDATE
TO authenticated
USING (
    auth.uid() = user_id
)
WITH CHECK (
    auth.uid() = user_id
);

-- Habilitar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Dropar a tabela user_companies se existir
DROP TABLE IF EXISTS public.user_companies CASCADE;

-- Criar tabela user_companies
CREATE TABLE public.user_companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    company_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT fk_company FOREIGN KEY (company_id) REFERENCES public.companies(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_company UNIQUE(user_id, company_id)
);

-- Adicionar comentários para o PostgREST
COMMENT ON CONSTRAINT fk_company ON public.user_companies IS 
'@foreignKey (company_id) REFERENCES public.companies(id)';

-- Adicionar trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_updated_at ON public.user_companies;
CREATE TRIGGER handle_updated_at
    BEFORE UPDATE ON public.user_companies
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Verificar estrutura atual da tabela companies
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'companies';

-- Adicionar coluna avatar_url se não existir
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'companies' 
        AND column_name = 'avatar_url'
    ) THEN
        ALTER TABLE public.companies 
        ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- Verificar estrutura da tabela companies
SELECT 
    c.relname as table_name,
    a.attname as column_name,
    pg_catalog.format_type(a.atttypid, a.atttypmod) as data_type
FROM pg_catalog.pg_class c
    LEFT JOIN pg_catalog.pg_namespace n ON n.oid = c.relnamespace
    LEFT JOIN pg_catalog.pg_attribute a ON c.oid = a.attrelid
WHERE c.relname = 'companies'
    AND a.attnum > 0
    AND NOT a.attisdropped
    AND n.nspname = 'public'
ORDER BY a.attnum;

-- Inserir relação para o usuário de teste
INSERT INTO public.user_companies (user_id, company_id)
SELECT 
    'd71e3d86-b97e-4062-8106-9b87f761a730',
    (SELECT id FROM public.companies LIMIT 1)
WHERE NOT EXISTS (
    SELECT 1 
    FROM public.user_companies 
    WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730'
);

-- Verificar se as relações foram criadas corretamente
SELECT 
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' AND tc.table_name='user_companies';

-- Verificar user_companies
SELECT uc.*, c.name as company_name
FROM user_companies uc
JOIN companies c ON c.id = uc.company_id
WHERE uc.user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Se não tiver company, vamos criar uma e associar
WITH new_company AS (
    INSERT INTO companies (name, document)
    SELECT 'Empresa Padrão', '00000000000'
    WHERE NOT EXISTS (
        SELECT 1 
        FROM user_companies 
        WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730'
    )
    RETURNING id
)
INSERT INTO user_companies (user_id, company_id)
SELECT 'd71e3d86-b97e-4062-8106-9b87f761a730', id
FROM new_company;

-- Verificar user_roles
SELECT ur.*, r.name as role_name
FROM user_roles ur
JOIN roles r ON r.id = ur.role_id
WHERE ur.user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Se não tiver role associada, vamos associar como Super Admin
WITH super_admin_role AS (
    SELECT id FROM roles WHERE name = 'Super Admin'
    LIMIT 1
)
INSERT INTO user_roles (user_id, role_id)
SELECT 'd71e3d86-b97e-4062-8106-9b87f761a730', id
FROM super_admin_role
WHERE NOT EXISTS (
    SELECT 1 
    FROM user_roles 
    WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730'
);

-- Verificar estado final
SELECT 
    u.email,
    p.is_active,
    r.name as role_name,
    c.name as company_name
FROM auth.users u
JOIN profiles p ON p.user_id = u.id
LEFT JOIN roles r ON r.id = p.role_id
LEFT JOIN user_companies uc ON uc.user_id = u.id
LEFT JOIN companies c ON c.id = uc.company_id
WHERE u.id = 'd71e3d86-b97e-4062-8106-9b87f761a730';

-- Criar tabelas de roles e permissões
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.role_permissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT rp_role_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
    CONSTRAINT rp_permission_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE,
    CONSTRAINT unique_role_permission UNIQUE(role_id, permission_id)
);

-- Dropar e recriar a tabela user_roles
DROP TABLE IF EXISTS public.user_roles CASCADE;

CREATE TABLE public.user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    CONSTRAINT ur_user_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
    CONSTRAINT ur_role_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_role UNIQUE(user_id, role_id)
);

-- Adicionar comentários para o PostgREST
COMMENT ON CONSTRAINT ur_role_fkey ON public.user_roles IS 
'@foreignKey (role_id) REFERENCES public.roles(id)';

COMMENT ON CONSTRAINT rp_role_fkey ON public.role_permissions IS 
'@foreignKey (role_id) REFERENCES public.roles(id)';

COMMENT ON CONSTRAINT rp_permission_fkey ON public.role_permissions IS 
'@foreignKey (permission_id) REFERENCES public.permissions(id)';

-- Inserir permissões básicas
INSERT INTO public.permissions (name, description) VALUES
    ('create:any', 'Criar qualquer recurso'),
    ('read:any', 'Ler qualquer recurso'),
    ('update:any', 'Atualizar qualquer recurso'),
    ('delete:any', 'Deletar qualquer recurso')
ON CONFLICT (name) DO NOTHING;

-- Inserir role Super Admin
INSERT INTO public.roles (name, description) VALUES
    ('Super Admin', 'Administrador com acesso total ao sistema')
ON CONFLICT (name) DO NOTHING;

-- Associar todas as permissões ao Super Admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM public.roles WHERE name = 'Super Admin'),
    p.id
FROM public.permissions p
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Associar usuário de teste ao papel Super Admin
INSERT INTO public.user_roles (user_id, role_id)
SELECT 
    'd71e3d86-b97e-4062-8106-9b87f761a730',
    (SELECT id FROM public.roles WHERE name = 'Super Admin')
WHERE NOT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = 'd71e3d86-b97e-4062-8106-9b87f761a730'
);

-- Verificar estrutura final
SELECT 
    tc.table_schema, 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_schema AS foreign_table_schema,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_name IN ('user_roles', 'role_permissions');

-- Adicionar colunas de endereço à tabela companies
DO $$
BEGIN
    -- Verificar e adicionar cada coluna se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'address') THEN
        ALTER TABLE public.companies ADD COLUMN address TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'address_number') THEN
        ALTER TABLE public.companies ADD COLUMN address_number TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'address_complement') THEN
        ALTER TABLE public.companies ADD COLUMN address_complement TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'neighborhood') THEN
        ALTER TABLE public.companies ADD COLUMN neighborhood TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'city') THEN
        ALTER TABLE public.companies ADD COLUMN city TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'state_id') THEN
        ALTER TABLE public.companies ADD COLUMN state_id TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'postal_code') THEN
        ALTER TABLE public.companies ADD COLUMN postal_code TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'latitude') THEN
        ALTER TABLE public.companies ADD COLUMN latitude DECIMAL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'companies' AND column_name = 'longitude') THEN
        ALTER TABLE public.companies ADD COLUMN longitude DECIMAL;
    END IF;
END $$;

-- Verificar estrutura final da tabela companies
SELECT 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'companies'
ORDER BY ordinal_position;

-- Adicionar colunas de timestamp à tabela companies
DO $$
BEGIN
    -- Adicionar created_at se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'companies' 
                  AND column_name = 'created_at') THEN
        ALTER TABLE public.companies 
        ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;

    -- Adicionar updated_at se não existir
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                  WHERE table_schema = 'public' 
                  AND table_name = 'companies' 
                  AND column_name = 'updated_at') THEN
        ALTER TABLE public.companies 
        ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Adicionar trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_companies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_companies_updated_at_trigger ON companies;
CREATE TRIGGER update_companies_updated_at_trigger
    BEFORE UPDATE ON companies
    FOR EACH ROW
    EXECUTE FUNCTION update_companies_updated_at();
