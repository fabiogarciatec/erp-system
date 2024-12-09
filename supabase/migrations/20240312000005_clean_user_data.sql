-- Drop da função existente se ela existir
DROP FUNCTION IF EXISTS clean_user_data(UUID);

-- Função para limpar dados de um usuário
CREATE OR REPLACE FUNCTION clean_user_data(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
AS $$
DECLARE
    v_company_id UUID;
BEGIN
    -- Busca o ID da empresa do usuário
    SELECT company_id INTO v_company_id
    FROM profiles
    WHERE user_id = p_user_id;

    -- Se encontrou uma empresa, remove todos os dados relacionados
    IF v_company_id IS NOT NULL THEN
        -- Remove registros da empresa
        DELETE FROM companies WHERE id = v_company_id;
    END IF;

    -- Remove o perfil do usuário
    DELETE FROM profiles WHERE user_id = p_user_id;

    RETURN jsonb_build_object(
        'success', true,
        'message', 'Dados do usuário limpos com sucesso'
    );
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', SQLERRM,
            'error_detail', SQLSTATE
        );
END;
$$;
