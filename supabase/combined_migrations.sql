-- Desabilita temporariamente as restrições de chave estrangeira
SET session_replication_role = 'replica';

-- Limpa dados existentes
TRUNCATE TABLE public.role_permissions CASCADE;
TRUNCATE TABLE public.permissions CASCADE;
TRUNCATE TABLE public.roles CASCADE;

-- Recria tabela de papéis
DROP TABLE IF EXISTS public.roles CASCADE;
CREATE TABLE public.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Recria tabela de permissões
DROP TABLE IF EXISTS public.permissions CASCADE;
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    module TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL
);

-- Recria tabela de relacionamento papel-permissão
DROP TABLE IF EXISTS public.role_permissions CASCADE;
CREATE TABLE public.role_permissions (
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    PRIMARY KEY (role_id, permission_id)
);

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

-- Insere papéis básicos
INSERT INTO public.roles (name, description)
VALUES 
    ('Super Admin', 'Administrador com acesso total ao sistema'),
    ('Admin', 'Administrador com acesso limitado'),
    ('User', 'Usuário comum do sistema');

-- Insere permissões básicas
INSERT INTO public.permissions (code, name, description, module)
VALUES
    ('USERS_VIEW', 'Visualizar Usuários', 'Visualizar usuários', 'users'),
    ('USERS_CREATE', 'Criar Usuários', 'Criar usuários', 'users'),
    ('USERS_EDIT', 'Editar Usuários', 'Editar usuários', 'users'),
    ('USERS_DELETE', 'Deletar Usuários', 'Deletar usuários', 'users'),
    ('ROLES_VIEW', 'Visualizar Papéis', 'Visualizar papéis', 'roles'),
    ('ROLES_CREATE', 'Criar Papéis', 'Criar papéis', 'roles'),
    ('ROLES_EDIT', 'Editar Papéis', 'Editar papéis', 'roles'),
    ('ROLES_DELETE', 'Deletar Papéis', 'Deletar papéis', 'roles');

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

-- Remove triggers antigos
DROP TRIGGER IF EXISTS ensure_user_role_trigger ON public.profiles;
DROP TRIGGER IF EXISTS validate_user_role_trigger ON public.profiles;

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

DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (
    auth.uid() IN (
        SELECT user_id FROM public.profiles p
        INNER JOIN public.roles r ON p.role_id = r.id
        WHERE r.name = 'Super Admin'
    ) OR 
    auth.uid() = user_id
);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Super Admin can update any profile" ON public.profiles;
CREATE POLICY "Super Admin can update any profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (
    auth.uid() IN (
        SELECT user_id FROM public.profiles p
        INNER JOIN public.roles r ON p.role_id = r.id
        WHERE r.name = 'Super Admin'
    )
);

-- Reabilita restrições de chave estrangeira
SET session_replication_role = 'origin';

-- Verifica se tudo foi criado corretamente
DO $$
DECLARE
    v_roles_count INTEGER;
    v_permissions_count INTEGER;
    v_role_permissions_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_roles_count FROM public.roles;
    SELECT COUNT(*) INTO v_permissions_count FROM public.permissions;
    SELECT COUNT(*) INTO v_role_permissions_count FROM public.role_permissions;
    
    RAISE NOTICE 'Roles criados: %', v_roles_count;
    RAISE NOTICE 'Permissions criadas: %', v_permissions_count;
    RAISE NOTICE 'Role-Permissions criados: %', v_role_permissions_count;
END $$;
