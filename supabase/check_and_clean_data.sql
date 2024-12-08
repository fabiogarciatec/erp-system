-- Verificar registros existentes
SELECT 'profiles' as table_name, count(*) as count FROM public.profiles
UNION ALL
SELECT 'companies', count(*) FROM public.companies
UNION ALL
SELECT 'user_companies', count(*) FROM public.user_companies
UNION ALL
SELECT 'user_roles', count(*) FROM public.user_roles
UNION ALL
SELECT 'roles', count(*) FROM public.roles;

-- Verificar perfis existentes
SELECT p.*, 
       c.name as company_name,
       uc.is_owner,
       r.name as role_name
FROM public.profiles p
LEFT JOIN public.companies c ON p.company_id = c.id
LEFT JOIN public.user_companies uc ON p.id = uc.user_id
LEFT JOIN public.user_roles ur ON p.id = ur.user_id
LEFT JOIN public.roles r ON ur.role_id = r.id
ORDER BY p.created_at DESC
LIMIT 5;

-- Função para limpar dados de um usuário específico
CREATE OR REPLACE FUNCTION public.clean_user_data(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_company_id uuid;
BEGIN
    -- Obter company_id
    SELECT company_id INTO v_company_id
    FROM public.profiles
    WHERE id = p_user_id;

    -- Remover registros em ordem
    DELETE FROM public.user_roles WHERE user_id = p_user_id;
    DELETE FROM public.user_companies WHERE user_id = p_user_id;
    DELETE FROM public.profiles WHERE id = p_user_id;
    
    -- Se for o último usuário da empresa, remover a empresa também
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE company_id = v_company_id) THEN
        DELETE FROM public.companies WHERE id = v_company_id;
    END IF;
END;
$$;
