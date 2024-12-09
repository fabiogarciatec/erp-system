-- Script para restaurar a estrutura original
BEGIN;

-- 1. Remover coluna role_id de profiles se foi adicionada
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role_id'
    ) THEN
        ALTER TABLE public.profiles DROP COLUMN role_id;
    END IF;
END $$;

-- 2. Garantir que a tabela user_roles existe e tem a estrutura correta
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES public.roles(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
    PRIMARY KEY (user_id, role_id)
);

-- 3. Recriar as políticas de segurança corretamente
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
CREATE POLICY "Profiles are viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        INNER JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'Super Admin'
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
    EXISTS (
        SELECT 1 FROM public.user_roles ur
        INNER JOIN public.roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid() AND r.name = 'Super Admin'
    )
);

-- 4. Garantir que os Super Admins existentes mantenham seus papéis
INSERT INTO public.user_roles (user_id, role_id)
SELECT p.user_id, r.id
FROM public.profiles p
CROSS JOIN public.roles r
WHERE r.name = 'Super Admin'
AND NOT EXISTS (
    SELECT 1 FROM public.user_roles ur
    WHERE ur.user_id = p.user_id
)
ON CONFLICT (user_id, role_id) DO NOTHING;

-- 5. Remover triggers antigos se existirem
DROP TRIGGER IF EXISTS ensure_user_role_trigger ON public.profiles;
DROP TRIGGER IF EXISTS validate_user_role_trigger ON public.profiles;

-- 6. Remover funções antigas se existirem
DROP FUNCTION IF EXISTS public.ensure_user_has_role() CASCADE;
DROP FUNCTION IF EXISTS public.validate_user_role() CASCADE;

COMMIT;
