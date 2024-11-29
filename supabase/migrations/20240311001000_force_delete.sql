-- Função para forçar a exclusão de um registro específico
CREATE OR REPLACE FUNCTION force_delete_record(target_id UUID)
RETURNS TEXT AS $$
DECLARE
    result TEXT;
BEGIN
    -- Tentar deletar da tabela profiles
    DELETE FROM profiles WHERE id = target_id;
    GET DIAGNOSTICS result = ROW_COUNT;
    IF result::INT > 0 THEN
        RETURN 'Deleted from profiles: ' || result || ' row(s)';
    END IF;

    -- Tentar deletar da tabela companies
    DELETE FROM companies WHERE id = target_id;
    GET DIAGNOSTICS result = ROW_COUNT;
    IF result::INT > 0 THEN
        RETURN 'Deleted from companies: ' || result || ' row(s)';
    END IF;

    -- Tentar deletar da tabela customers
    DELETE FROM customers WHERE id = target_id;
    GET DIAGNOSTICS result = ROW_COUNT;
    IF result::INT > 0 THEN
        RETURN 'Deleted from customers: ' || result || ' row(s)';
    END IF;

    -- Tentar deletar da tabela auth.users
    DELETE FROM auth.users WHERE id = target_id;
    GET DIAGNOSTICS result = ROW_COUNT;
    IF result::INT > 0 THEN
        RETURN 'Deleted from auth.users: ' || result || ' row(s)';
    END IF;

    RETURN 'No records found with ID: ' || target_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar a função para o ID específico
SELECT force_delete_record('b5852aae-8991-4600-8a3a-0cbae98e6931'::UUID);
