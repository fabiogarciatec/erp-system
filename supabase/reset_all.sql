-- 1. Remover TODAS as funções existentes
DO $$ 
DECLARE 
    func_record RECORD;
BEGIN
    FOR func_record IN 
        SELECT ns.nspname as schema_name, p.proname as function_name, 
               pg_get_function_identity_arguments(p.oid) as args
        FROM pg_proc p 
        JOIN pg_namespace ns ON p.pronamespace = ns.oid 
        WHERE ns.nspname = 'public'
    LOOP
        EXECUTE format('DROP FUNCTION IF EXISTS %I.%I(%s) CASCADE', 
                      func_record.schema_name, 
                      func_record.function_name,
                      func_record.args);
    END LOOP;
END $$;

-- 2. Remover todas as tabelas e recriar do zero
DROP TABLE IF EXISTS role_permissions CASCADE;
DROP TABLE IF EXISTS permissions CASCADE;
DROP TABLE IF EXISTS permission_modules CASCADE;
DROP TABLE IF EXISTS user_roles CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS audit_logs CASCADE;

-- 3. Criar tabelas básicas
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    document VARCHAR(14) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE REFERENCES auth.users ON DELETE CASCADE,
    email VARCHAR(255),
    company_id UUID REFERENCES companies(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, role_id)
);

-- Criar tabela de módulos de permissão
CREATE TABLE permission_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de permissões
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID REFERENCES permission_modules(id),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de permissões de papéis
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

-- 4. Desabilitar RLS em todas as tabelas
ALTER TABLE companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles DISABLE ROW LEVEL SECURITY;
ALTER TABLE permission_modules DISABLE ROW LEVEL SECURITY;
ALTER TABLE permissions DISABLE ROW LEVEL SECURITY;
ALTER TABLE role_permissions DISABLE ROW LEVEL SECURITY;

-- 5. Inserir módulos básicos
INSERT INTO permission_modules (name, description) VALUES
('Users', 'Gerenciamento de usuários'),
('Roles', 'Gerenciamento de papéis e permissões');

-- 6. Inserir permissões básicas
INSERT INTO permissions (module_id, code, name, description) VALUES
((SELECT id FROM permission_modules WHERE name = 'Users'), 'USERS_VIEW', 'Visualizar Usuários', 'Permite visualizar a lista de usuários'),
((SELECT id FROM permission_modules WHERE name = 'Users'), 'USERS_CREATE', 'Criar Usuários', 'Permite criar novos usuários'),
((SELECT id FROM permission_modules WHERE name = 'Users'), 'USERS_EDIT', 'Editar Usuários', 'Permite editar usuários existentes'),
((SELECT id FROM permission_modules WHERE name = 'Users'), 'USERS_DELETE', 'Excluir Usuários', 'Permite excluir usuários'),
((SELECT id FROM permission_modules WHERE name = 'Roles'), 'ROLES_VIEW', 'Visualizar Papéis', 'Permite visualizar a lista de papéis'),
((SELECT id FROM permission_modules WHERE name = 'Roles'), 'ROLES_CREATE', 'Criar Papéis', 'Permite criar novos papéis'),
((SELECT id FROM permission_modules WHERE name = 'Roles'), 'ROLES_EDIT', 'Editar Papéis', 'Permite editar papéis existentes'),
((SELECT id FROM permission_modules WHERE name = 'Roles'), 'ROLES_DELETE', 'Excluir Papéis', 'Permite excluir papéis');

-- 7. Criar uma única função simples
CREATE OR REPLACE FUNCTION create_user_complete(
    p_user_id UUID,
    p_email TEXT,
    p_company_name TEXT,
    p_company_document TEXT,
    p_company_email TEXT DEFAULT NULL,
    p_company_phone TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company_id UUID;
    v_role_id UUID;
BEGIN
    -- Criar empresa
    INSERT INTO companies (name, document, email, phone)
    VALUES (p_company_name, p_company_document, p_company_email, p_company_phone)
    RETURNING id INTO v_company_id;

    -- Criar ou obter papel Super Admin
    INSERT INTO roles (name, description)
    VALUES ('Super Admin', 'Administrador com acesso total ao sistema')
    ON CONFLICT (name) DO UPDATE SET name = 'Super Admin'
    RETURNING id INTO v_role_id;

    -- Criar perfil
    INSERT INTO profiles (user_id, email, company_id)
    VALUES (p_user_id, p_email, v_company_id);

    -- Criar perfil de usuário
    INSERT INTO user_roles (user_id, role_id)
    VALUES (p_user_id, v_role_id);

    -- Atribuir todas as permissões ao Super Admin
    PERFORM assign_all_permissions_to_super_admin();

    RETURN jsonb_build_object(
        'success', true,
        'data', jsonb_build_object(
            'user_id', p_user_id,
            'company_id', v_company_id,
            'role_id', v_role_id
        )
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- Função para atribuir todas as permissões ao Super Admin
CREATE OR REPLACE FUNCTION assign_all_permissions_to_super_admin()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_super_admin_id UUID;
BEGIN
    -- Obter o ID do papel Super Admin
    SELECT id INTO v_super_admin_id FROM roles WHERE name = 'Super Admin';
    
    -- Atribuir todas as permissões ao Super Admin
    INSERT INTO role_permissions (role_id, permission_id)
    SELECT v_super_admin_id, id
    FROM permissions
    ON CONFLICT (role_id, permission_id) DO NOTHING;
END;
$$;

-- Reset completo do banco de dados
BEGIN;

-- Desabilita triggers temporariamente
SET session_replication_role = 'replica';

-- Remove políticas de segurança
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super Admin can update any profile" ON public.profiles;

-- Remove triggers
DROP TRIGGER IF EXISTS ensure_user_role_trigger ON public.profiles;
DROP TRIGGER IF EXISTS validate_user_role_trigger ON public.profiles;

-- Remove funções customizadas (não remove funções do sistema)
DROP FUNCTION IF EXISTS public.ensure_user_has_role();
DROP FUNCTION IF EXISTS public.validate_user_role();

-- Limpa dados das tabelas (mantém estrutura)
TRUNCATE TABLE public.role_permissions CASCADE;
TRUNCATE TABLE public.permissions CASCADE;
TRUNCATE TABLE public.roles CASCADE;

-- Garante que profiles tem role_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role_id'
    ) THEN
        ALTER TABLE public.profiles 
        ADD COLUMN role_id UUID REFERENCES public.roles(id);
    END IF;
END $$;

-- Insere papéis padrão
INSERT INTO public.roles (name, description) VALUES
    ('Super Admin', 'Administrador com acesso total ao sistema'),
    ('Admin', 'Administrador com acesso limitado'),
    ('User', 'Usuário comum do sistema');

-- Insere permissões padrão
INSERT INTO public.permissions (code, description, module) VALUES
    ('USERS_VIEW', 'Visualizar usuários', 'users'),
    ('USERS_CREATE', 'Criar usuários', 'users'),
    ('USERS_EDIT', 'Editar usuários', 'users'),
    ('USERS_DELETE', 'Deletar usuários', 'users'),
    ('ROLES_VIEW', 'Visualizar papéis', 'roles'),
    ('ROLES_CREATE', 'Criar papéis', 'roles'),
    ('ROLES_EDIT', 'Editar papéis', 'roles'),
    ('ROLES_DELETE', 'Deletar papéis', 'roles');

-- Atribui todas as permissões ao Super Admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'Super Admin';

-- Atribui permissões básicas ao Admin
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'Admin'
AND p.code IN ('USERS_VIEW', 'USERS_EDIT', 'ROLES_VIEW');

-- Atribui permissões mínimas ao User
INSERT INTO public.role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM public.roles r
CROSS JOIN public.permissions p
WHERE r.name = 'User'
AND p.code IN ('USERS_VIEW');

-- Atualiza todos os profiles para terem Super Admin como papel padrão
UPDATE public.profiles 
SET role_id = (SELECT id FROM public.roles WHERE name = 'Super Admin')
WHERE role_id IS NULL;

-- Recria funções auxiliares
CREATE OR REPLACE FUNCTION public.ensure_user_has_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.role_id IS NULL THEN
        NEW.role_id := (SELECT id FROM public.roles WHERE name = 'Super Admin');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.validate_user_role()
RETURNS TRIGGER AS $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE id = NEW.role_id) THEN
        RAISE EXCEPTION 'Role ID % não existe', NEW.role_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recria triggers
CREATE TRIGGER ensure_user_role_trigger
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_user_has_role();

CREATE TRIGGER validate_user_role_trigger
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_user_role();

-- Recria políticas de segurança
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles p
        INNER JOIN public.roles r ON p.role_id = r.id
        WHERE r.name = 'Super Admin'
    ) OR 
    auth.uid() = id
);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "Super Admin can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (
        SELECT id FROM public.profiles p
        INNER JOIN public.roles r ON p.role_id = r.id
        WHERE r.name = 'Super Admin'
    )
);

-- Reabilita triggers
SET session_replication_role = 'origin';

COMMIT;
