-- Criar função para buscar usuários de uma empresa
CREATE OR REPLACE FUNCTION get_company_users(p_company_id UUID)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    phone TEXT,
    is_active BOOLEAN,
    email TEXT,
    roles JSON
) 
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.id,
        p.full_name,
        p.phone,
        p.is_active,
        au.email,
        COALESCE(
            json_agg(
                json_build_object(
                    'id', r.id,
                    'name', r.name
                )
            ) FILTER (WHERE r.id IS NOT NULL),
            '[]'::json
        ) as roles
    FROM profiles p
    INNER JOIN auth.users au ON au.id = p.id
    INNER JOIN user_companies uc ON uc.user_id = p.id
    LEFT JOIN user_roles ur ON ur.user_id = p.id
    LEFT JOIN roles r ON r.id = ur.role_id
    WHERE uc.company_id = p_company_id
        AND p.is_active = true
        AND uc.is_active = true
    GROUP BY p.id, p.full_name, p.phone, p.is_active, au.email;
END;
$$;
