-- Função para confirmar email diretamente
CREATE OR REPLACE FUNCTION confirm_user_email(target_email TEXT)
RETURNS TEXT AS $$
DECLARE
    target_user_id UUID;
    email_verified BOOLEAN;
BEGIN
    -- Verificar se o usuário existe
    SELECT id, email_confirmed_at IS NOT NULL
    INTO target_user_id, email_verified
    FROM auth.users
    WHERE email = target_email;

    IF target_user_id IS NULL THEN
        RETURN 'Usuário não encontrado com o email: ' || target_email;
    END IF;

    IF email_verified THEN
        RETURN 'Email já está confirmado para: ' || target_email;
    END IF;

    -- Confirmar email
    UPDATE auth.users
    SET 
        email_confirmed_at = NOW(),
        updated_at = NOW()
    WHERE id = target_user_id;

    -- Verificar se a atualização foi bem sucedida
    IF FOUND THEN
        RETURN 'Email confirmado com sucesso para: ' || target_email;
    ELSE
        RETURN 'Erro ao confirmar email para: ' || target_email;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar a função para o email específico
SELECT confirm_user_email('fatec@fatec.info');
