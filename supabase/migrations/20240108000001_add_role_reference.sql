-- Adicionar referência de role_id na tabela profiles
DO $$ 
BEGIN
    -- Verificar se a coluna role_id existe
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role_id') THEN
        ALTER TABLE profiles ADD COLUMN role_id UUID;
    END IF;

    -- Adicionar a foreign key se não existir
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'profiles' 
        AND constraint_name = 'profiles_role_id_fkey'
    ) THEN
        ALTER TABLE profiles 
        ADD CONSTRAINT profiles_role_id_fkey 
        FOREIGN KEY (role_id) 
        REFERENCES roles(id);
    END IF;

    -- Atualizar todos os perfis sem role_id para usar o Super Admin
    UPDATE profiles 
    SET role_id = (SELECT id FROM roles WHERE name = 'Super Admin')
    WHERE role_id IS NULL;
END $$;

-- Criação de funções auxiliares e triggers para gerenciamento de usuários e papéis
BEGIN;

-- Função para garantir que todo usuário tenha um papel
CREATE OR REPLACE FUNCTION public.ensure_user_has_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Se não tem role_id, atribui o papel de Super Admin
    IF NEW.role_id IS NULL THEN
        NEW.role_id := (SELECT id FROM public.roles WHERE name = 'Super Admin');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Função para validar papel do usuário
CREATE OR REPLACE FUNCTION public.validate_user_role()
RETURNS TRIGGER AS $$
BEGIN
    -- Verifica se o role_id existe na tabela roles
    IF NOT EXISTS (SELECT 1 FROM public.roles WHERE id = NEW.role_id) THEN
        RAISE EXCEPTION 'Role ID % não existe', NEW.role_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Adiciona coluna role_id se não existir
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

        -- Atualiza registros existentes
        UPDATE public.profiles 
        SET role_id = (SELECT id FROM public.roles WHERE name = 'Super Admin')
        WHERE role_id IS NULL;
    END IF;
END $$;

-- Remove triggers antigos se existirem
DROP TRIGGER IF EXISTS ensure_user_role_trigger ON public.profiles;
DROP TRIGGER IF EXISTS validate_user_role_trigger ON public.profiles;

-- Cria triggers
CREATE TRIGGER ensure_user_role_trigger
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.ensure_user_has_role();

CREATE TRIGGER validate_user_role_trigger
    BEFORE INSERT OR UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_user_role();

-- Adiciona comentários nas colunas
COMMENT ON COLUMN public.profiles.role_id IS 'ID do papel do usuário';

-- Adiciona políticas de segurança RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Política para visualizar perfis
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;
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

-- Política para atualizar perfis
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Super Admin pode atualizar qualquer perfil
DROP POLICY IF EXISTS "Super Admin can update any profile" ON public.profiles;
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

COMMIT;
