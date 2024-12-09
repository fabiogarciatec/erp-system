-- Criar papel Super Admin se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM roles WHERE name = 'Super Admin') THEN
        INSERT INTO roles (name, description)
        VALUES ('Super Admin', 'Administrador com acesso total ao sistema');
    END IF;
END $$;

-- Adicionar coluna role_id à tabela profiles se não existir
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'profiles' AND column_name = 'role_id') THEN
        ALTER TABLE profiles ADD COLUMN role_id UUID REFERENCES roles(id);
        
        -- Buscar o papel Super Admin
        WITH super_admin_role AS (
            SELECT id FROM roles WHERE name = 'Super Admin' LIMIT 1
        )
        -- Atualizar o primeiro usuário como Super Admin
        UPDATE profiles 
        SET role_id = (SELECT id FROM super_admin_role)
        WHERE id = (SELECT id FROM profiles LIMIT 1);
    END IF;
END $$;

-- Função para atualizar função do usuário com validações apropriadas
CREATE OR REPLACE FUNCTION update_user_role(
    p_target_user_id UUID,
    p_new_role_id UUID,
    p_admin_user_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_admin_role_name VARCHAR;
    v_target_role_name VARCHAR;
    v_result JSONB;
BEGIN
    -- Verifica se o usuário admin é Super Admin
    SELECT r.name INTO v_admin_role_name
    FROM profiles p
    JOIN roles r ON r.id = p.role_id
    WHERE p.user_id = p_admin_user_id;

    -- Se não for Super Admin, bloqueia a operação
    IF v_admin_role_name IS NULL OR v_admin_role_name != 'Super Admin' THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Apenas Super Admin pode alterar funções de usuários'
        );
    END IF;

    -- Verifica se o usuário está tentando alterar seu próprio papel
    IF p_target_user_id = p_admin_user_id THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Super Admin não pode alterar sua própria função'
        );
    END IF;

    -- Verifica se o papel de destino existe
    SELECT name INTO v_target_role_name
    FROM roles
    WHERE id = p_new_role_id;

    IF v_target_role_name IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Função de usuário inválida'
        );
    END IF;

    -- Atualiza a função do usuário
    UPDATE profiles
    SET role_id = p_new_role_id,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_target_user_id;

    -- Cria log de auditoria
    INSERT INTO audit_logs (
        user_id,
        action,
        table_name,
        record_id,
        old_data,
        new_data,
        created_at
    )
    VALUES (
        p_admin_user_id,
        'update_role',
        'profiles',
        p_target_user_id,
        (SELECT jsonb_build_object(
            'role_id', role_id,
            'role_name', (SELECT name FROM roles WHERE id = role_id)
        ) FROM profiles WHERE user_id = p_target_user_id),
        jsonb_build_object(
            'role_id', p_new_role_id,
            'role_name', v_target_role_name
        ),
        CURRENT_TIMESTAMP
    );

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Função do usuário atualizada com sucesso'
    );
END;
$$;
