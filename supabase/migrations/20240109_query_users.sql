-- Query para buscar usuários de uma empresa específica
SELECT 
    p.id,
    p.full_name,
    p.phone,
    p.is_active,
    au.email,
    json_agg(
        json_build_object(
            'id', r.id,
            'name', r.name
        )
    ) as roles
FROM profiles p
INNER JOIN auth.users au ON au.id = p.id
INNER JOIN user_companies uc ON uc.user_id = p.id
LEFT JOIN user_roles ur ON ur.user_id = p.id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE uc.company_id = '123e4567-e89b-12d3-a456-426614174000' -- Exemplo de UUID de empresa
    AND p.is_active = true
    AND uc.is_active = true
GROUP BY p.id, p.full_name, p.phone, p.is_active, au.email;
