-- Primeiro, limpar tudo
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS create_user_complete(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS create_user_complete(UUID, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS create_new_user_profile(UUID, VARCHAR);

-- Criar uma função simplificada
CREATE OR REPLACE FUNCTION create_new_user_profile(
    user_id UUID,
    user_email VARCHAR
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_company_id UUID;
    v_role_id UUID;
BEGIN
    -- Criar empresa
    INSERT INTO companies (
        name,
        document
    ) VALUES (
        'Empresa Padrão',
        '00000000000'
    )
    RETURNING id INTO v_company_id;

    -- Buscar ou criar papel Super Admin
    SELECT id INTO v_role_id
    FROM roles
    WHERE name = 'Super Admin';

    IF v_role_id IS NULL THEN
        INSERT INTO roles (name, description)
        VALUES ('Super Admin', 'Administrador com acesso total ao sistema')
        RETURNING id INTO v_role_id;
    END IF;

    -- Criar perfil
    INSERT INTO profiles (
        user_id,
        email,
        role_id,
        company_id
    ) VALUES (
        user_id,
        user_email,
        v_role_id,
        v_company_id
    );

    RETURN jsonb_build_object(
        'success', true,
        'user_id', user_id,
        'company_id', v_company_id,
        'role_id', v_role_id
    );
EXCEPTION
    WHEN OTHERS THEN
        RAISE LOG 'Error in create_new_user_profile: %', SQLERRM;
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM
        );
END;
$$;

-- Criar trigger simplificado
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM create_new_user_profile(NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Criar o trigger
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
