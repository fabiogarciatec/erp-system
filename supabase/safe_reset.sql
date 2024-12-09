-- Script de reset seguro que mantém dados essenciais
BEGIN;

-- Desabilita temporariamente as restrições de chave estrangeira
SET session_replication_role = 'replica';

-- Remove políticas de segurança existentes
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Super Admin can update any profile" ON public.profiles;

-- Remove triggers existentes
DROP TRIGGER IF EXISTS ensure_user_role_trigger ON public.profiles;
DROP TRIGGER IF EXISTS validate_user_role_trigger ON public.profiles;

-- Remove funções existentes
DROP FUNCTION IF EXISTS public.ensure_user_has_role() CASCADE;
DROP FUNCTION IF EXISTS public.validate_user_role() CASCADE;

-- Backup de dados importantes
CREATE TEMP TABLE temp_profiles AS
SELECT * FROM public.profiles;

-- Limpa dados das tabelas mantendo estrutura
TRUNCATE TABLE public.role_permissions CASCADE;
TRUNCATE TABLE public.permissions CASCADE;
TRUNCATE TABLE public.roles CASCADE;

-- Restaura estrutura básica
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

-- Restaura profiles com papel Super Admin
UPDATE public.profiles 
SET role_id = (SELECT id FROM public.roles WHERE name = 'Super Admin');

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
        SELECT user_id FROM public.profiles p
        INNER JOIN public.roles r ON p.role_id = r.id
        WHERE r.name = 'Super Admin'
    ) OR 
    auth.uid() = user_id
);

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

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

-- Verifica se tudo foi resetado corretamente
DO $$
DECLARE
    v_roles_count INTEGER;
    v_permissions_count INTEGER;
    v_role_permissions_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_roles_count FROM public.roles;
    SELECT COUNT(*) INTO v_permissions_count FROM public.permissions;
    SELECT COUNT(*) INTO v_role_permissions_count FROM public.role_permissions;
    
    RAISE NOTICE 'Roles após reset: %', v_roles_count;
    RAISE NOTICE 'Permissions após reset: %', v_permissions_count;
    RAISE NOTICE 'Role-Permissions após reset: %', v_role_permissions_count;
END $$;

COMMIT;
