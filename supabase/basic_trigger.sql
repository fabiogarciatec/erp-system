-- Primeiro, vamos remover o trigger existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Criar uma função mais simples para o trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_company_id UUID;
    v_role_id UUID;
BEGIN
    -- 1. Criar empresa com dados básicos
    INSERT INTO companies (name, document)
    VALUES ('Empresa Padrão', '00000000000')
    RETURNING id INTO v_company_id;

    -- 2. Obter o ID do papel Super Admin (ou criar se não existir)
    SELECT id INTO v_role_id FROM roles WHERE name = 'Super Admin';
    IF v_role_id IS NULL THEN
        INSERT INTO roles (name, description)
        VALUES ('Super Admin', 'Administrador com acesso total ao sistema')
        RETURNING id INTO v_role_id;
    END IF;

    -- 3. Criar perfil do usuário
    INSERT INTO profiles (user_id, email, role_id, company_id)
    VALUES (NEW.id, NEW.email, v_role_id, v_company_id);

    RETURN NEW;
EXCEPTION
    WHEN OTHERS THEN
        -- Log do erro (você pode ver isso no painel do Supabase)
        RAISE LOG 'Error in handle_new_user: %', SQLERRM;
        RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar o trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
