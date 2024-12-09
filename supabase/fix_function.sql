-- Primeiro, remover a função existente
DROP FUNCTION IF EXISTS create_user_complete(UUID, VARCHAR, VARCHAR, VARCHAR, VARCHAR, VARCHAR);
DROP FUNCTION IF EXISTS create_user_complete(UUID, VARCHAR, VARCHAR, VARCHAR);

-- Criar a nova função com parâmetros opcionais
CREATE OR REPLACE FUNCTION create_user_complete(
    p_user_id UUID,
    p_email VARCHAR,
    p_company_name VARCHAR DEFAULT 'Empresa Padrão',
    p_company_document VARCHAR DEFAULT '00000000000',
    p_company_email VARCHAR DEFAULT NULL,
    p_company_phone VARCHAR DEFAULT NULL,
    p_role_name VARCHAR DEFAULT 'Super Admin'
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_company_id UUID;
    v_role_id UUID;
    v_debug_info JSONB;
BEGIN
    -- Inicializa o objeto de debug
    v_debug_info := jsonb_build_object(
        'stage', 'start',
        'user_id', p_user_id,
        'email', p_email
    );

    -- Verifica se o usuário já existe
    IF EXISTS (SELECT 1 FROM profiles WHERE user_id = p_user_id) THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Usuário já existe',
            'error_detail', 'PROFILE_EXISTS',
            'debug_info', v_debug_info
        );
    END IF;

    -- Inicia uma transação
    BEGIN
        -- Cria a empresa
        INSERT INTO companies (
            name,
            document,
            email,
            phone
        ) VALUES (
            p_company_name,
            p_company_document,
            p_company_email,
            p_company_phone
        )
        RETURNING id INTO v_company_id;

        -- Busca ou cria o papel
        SELECT id INTO v_role_id
        FROM roles
        WHERE name = p_role_name;

        IF v_role_id IS NULL THEN
            INSERT INTO roles (name, description)
            VALUES (p_role_name, 'Papel criado automaticamente')
            RETURNING id INTO v_role_id;
        END IF;

        -- Cria o perfil do usuário
        INSERT INTO profiles (
            user_id,
            email,
            role_id,
            company_id
        ) VALUES (
            p_user_id,
            p_email,
            v_role_id,
            v_company_id
        );

        -- Retorna sucesso
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Usuário criado com sucesso',
            'data', jsonb_build_object(
                'user_id', p_user_id,
                'company_id', v_company_id,
                'role_id', v_role_id
            )
        );
    EXCEPTION
        WHEN OTHERS THEN
            RAISE LOG 'Error in create_user_complete: %', SQLERRM;
            RETURN jsonb_build_object(
                'success', false,
                'error', SQLERRM,
                'error_detail', SQLSTATE,
                'debug_info', v_debug_info
            );
    END;
END;
$$;
