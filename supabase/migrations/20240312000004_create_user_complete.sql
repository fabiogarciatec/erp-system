-- Função para criar um usuário completo com empresa e permissões
CREATE OR REPLACE FUNCTION create_user_complete(
    p_user_id UUID,
    p_email VARCHAR,
    p_company_name VARCHAR,
    p_company_document VARCHAR,
    p_company_email VARCHAR DEFAULT NULL,
    p_company_phone VARCHAR DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_company_id UUID;
    v_super_admin_role_id UUID;
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

        v_debug_info := v_debug_info || jsonb_build_object(
            'stage', 'company_created',
            'company_id', v_company_id
        );

        -- Busca o papel Super Admin
        SELECT id INTO v_super_admin_role_id
        FROM roles
        WHERE name = 'Super Admin';

        IF v_super_admin_role_id IS NULL THEN
            -- Se não existir, cria o papel Super Admin
            INSERT INTO roles (name, description)
            VALUES ('Super Admin', 'Administrador com acesso total ao sistema')
            RETURNING id INTO v_super_admin_role_id;
        END IF;

        v_debug_info := v_debug_info || jsonb_build_object(
            'stage', 'role_found',
            'role_id', v_super_admin_role_id
        );

        -- Cria o perfil do usuário
        INSERT INTO profiles (
            user_id,
            email,
            role_id,
            company_id
        ) VALUES (
            p_user_id,
            p_email,
            v_super_admin_role_id,
            v_company_id
        );

        v_debug_info := v_debug_info || jsonb_build_object(
            'stage', 'profile_created'
        );

        -- Garante que o Super Admin tenha todas as permissões
        INSERT INTO role_permissions (role_id, permission_id)
        SELECT v_super_admin_role_id, id
        FROM permissions
        ON CONFLICT (role_id, permission_id) DO NOTHING;

        v_debug_info := v_debug_info || jsonb_build_object(
            'stage', 'permissions_assigned'
        );

        -- Retorna sucesso
        RETURN jsonb_build_object(
            'success', true,
            'message', 'Usuário criado com sucesso',
            'debug_info', v_debug_info,
            'data', jsonb_build_object(
                'user_id', p_user_id,
                'company_id', v_company_id,
                'role_id', v_super_admin_role_id
            )
        );
    EXCEPTION
        WHEN OTHERS THEN
            -- Em caso de erro, retorna informações detalhadas
            RETURN jsonb_build_object(
                'success', false,
                'error', SQLERRM,
                'error_detail', SQLSTATE,
                'debug_info', v_debug_info || jsonb_build_object(
                    'stage', 'error',
                    'error_message', SQLERRM,
                    'error_state', SQLSTATE
                )
            );
    END;
END;
$$;
